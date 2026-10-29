import json
import time
from contextlib import contextmanager

from app.core.config import settings
from app.core.database import get_db
from app.services.embeddings.client import embed_documents
from app.services.rag.chunking import chunk_pages
from app.services.rag.cleaning import clean_text, strip_repeated_lines
from app.services.rag.extraction import extract_pages
from app.services.vectorstore import chroma


def _set_stage(doc_id: str, stage: str) -> None:
    with get_db() as conn:
        conn.execute("UPDATE documents SET current_stage = ? WHERE id = ?", (stage, doc_id))


def _save_progress(doc_id: str, **fields) -> None:
    assignments = ", ".join(f"{name} = ?" for name in fields)
    with get_db() as conn:
        conn.execute(
            f"UPDATE documents SET {assignments} WHERE id = ?",
            (*fields.values(), doc_id),
        )


@contextmanager
def _timed(doc_id: str, stage: str, timings: dict[str, float]):
    """Mark the stage as current, run the block, record how long it took (ms)."""
    _set_stage(doc_id, stage)
    start = time.perf_counter()
    try:
        yield
    finally:
        timings[stage] = round((time.perf_counter() - start) * 1000, 1)


def run_ingestion(doc_id: str) -> None:
    with get_db() as conn:
        doc = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    file_type = doc["file_type"]
    path = settings.upload_dir / f"{doc_id}.{file_type}"
    timings: dict[str, float] = {}

    try:
        with _timed(doc_id, "extracting", timings):
            pages = extract_pages(path, file_type)

        with _timed(doc_id, "cleaning", timings):
            if file_type == "pdf":
                pages = strip_repeated_lines(pages)
            for page in pages:
                page.text = clean_text(page.text, reflow=(file_type == "pdf"))

        with _timed(doc_id, "chunking", timings):
            chunks = chunk_pages(pages, settings.chunk_size, settings.chunk_overlap)
            if not chunks:
                raise ValueError("No extractable text found (scanned PDF? OCR is on the backlog).")
            for c in chunks:
                c.text.encode("utf-8")   # fail early on bad characters, before the slow stage
            _save_progress(doc_id, page_count=len(pages), chunk_count=len(chunks))

        with _timed(doc_id, "embedding", timings):
            vectors = embed_documents(
                [c.text for c in chunks],
                on_progress=lambda done: _save_progress(doc_id, embedded_count=done),
            )
        with _timed(doc_id, "storing", timings):
            ids = [f"{doc_id}:{c.index}" for c in chunks]
            chroma.add_chunks(
                ids=ids,
                embeddings=vectors,
                documents=[c.text for c in chunks],
                metadatas=[
                    {"document_id": doc_id, "filename": doc["filename"],
                     "page": c.page, "chunk_index": c.index}
                    for c in chunks
                ],
            )
            dim = len(vectors[0])
            with get_db() as conn:
                conn.executemany(
                    "INSERT INTO chunks (id, document_id, chunk_index, page, text, "
                    "char_count, token_count, embedding_dim) VALUES (?,?,?,?,?,?,?,?)",
                    [(cid, doc_id, c.index, c.page, c.text, c.char_count, c.token_count, dim)
                     for cid, c in zip(ids, chunks)],
                )

        with get_db() as conn:
            conn.execute(
                "UPDATE documents SET status='ready', current_stage='done', "
                "chunk_count=?, page_count=?, stage_timings=? WHERE id=?",
                (len(chunks), len(pages), json.dumps(timings), doc_id),
            )

    except Exception as exc:
        chroma.delete_document(doc_id)  # don't leave orphan vectors behind
        with get_db() as conn:
            conn.execute(
                "UPDATE documents SET status='failed', error=?, stage_timings=? WHERE id=?",
                (str(exc), json.dumps(timings), doc_id),
            )