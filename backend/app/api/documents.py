import json
import uuid

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile

from app.core.config import settings
from app.core.database import get_db
from app.models.schemas import DocumentOut
from app.services.ingestion import run_ingestion
from app.services.vectorstore import chroma

router = APIRouter(prefix="/documents", tags=["documents"])
ALLOWED = {"pdf", "txt", "md"}


def _to_out(row) -> DocumentOut:
    data = dict(row)
    data["stage_timings"] = json.loads(data["stage_timings"] or "{}")
    return DocumentOut(**data)


@router.post("/upload", response_model=DocumentOut, status_code=202)
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    filename = file.filename or "untitled"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED:
        raise HTTPException(415, f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED))}")

    data = await file.read()
    if not data:
        raise HTTPException(400, "File is empty")
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"File exceeds {settings.max_upload_mb} MB")

    doc_id = uuid.uuid4().hex
    (settings.upload_dir / f"{doc_id}.{ext}").write_bytes(data)  # never trust the client's filename on disk

    with get_db() as conn:
        conn.execute(
            "INSERT INTO documents (id, filename, file_type, size_bytes) VALUES (?,?,?,?)",
            (doc_id, filename, ext, len(data)),
        )
        row = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()

    background_tasks.add_task(run_ingestion, doc_id)   # runs AFTER the response is sent
    return _to_out(row)


@router.get("", response_model=list[DocumentOut])
def list_documents():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM documents ORDER BY created_at DESC").fetchall()
    return [_to_out(r) for r in rows]


@router.get("/{doc_id}", response_model=DocumentOut)
def get_document(doc_id: str):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    if not row:
        raise HTTPException(404, "Document not found")
    return _to_out(row)


@router.delete("/{doc_id}", status_code=204)
def delete_document(doc_id: str):
    with get_db() as conn:
        if not conn.execute("SELECT 1 FROM documents WHERE id = ?", (doc_id,)).fetchone():
            raise HTTPException(404, "Document not found")
    chroma.delete_document(doc_id)
    with get_db() as conn:
        conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))  # chunks cascade
    for f in settings.upload_dir.glob(f"{doc_id}.*"):
        f.unlink(missing_ok=True)