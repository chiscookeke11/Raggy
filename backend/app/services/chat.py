import time
import uuid

from app.core.config import settings
from app.core.database import get_db
from app.models.schemas import ChatResponse, RetrievalTrace, Timings, Usage
from app.services.embeddings.client import embed_query
from app.services.llm.client import generate
from app.services.rag.prompt import build_messages
from app.services.rag.retrieval import search
from app.services.llm.client import Generation, generate



NO_CONTEXT_ANSWER = "I couldn't find anything relevant in the uploaded documents."


def _ms(start: float) -> float:
    return round((time.perf_counter() - start) * 1000, 1)


def answer_question(question: str, top_k: int | None, document_ids: list[str] | None) -> ChatResponse:
    k = top_k or settings.top_k
    t_total = time.perf_counter()

    t = time.perf_counter()
    query_vector = embed_query(question)
    embedding_ms = _ms(t)

    t = time.perf_counter()
    chunks = search(query_vector, k, document_ids)
    retrieval_ms = _ms(t)

    messages = build_messages(question, chunks)

    t = time.perf_counter()
    if chunks:
        generation = generate(messages)
    else:
        generation = Generation(text=NO_CONTEXT_ANSWER, prompt_tokens=0, completion_tokens=0)
    generation_ms = _ms(t)

    trace = RetrievalTrace(
        question=question,
        llm_model=settings.llm_model,
        embedding_model=settings.embedding_model,
        embedding_dim=len(query_vector),
        top_k=k,
        chunks=chunks,
        prompt=messages,
        timings=Timings(
            embedding_ms=embedding_ms,
            retrieval_ms=retrieval_ms,
            generation_ms=generation_ms,
            total_ms=_ms(t_total),
        ),
        usage=Usage(prompt_tokens=generation.prompt_tokens, completion_tokens=generation.completion_tokens),
    )

    chat_id = uuid.uuid4().hex
    with get_db() as conn:
        conn.execute(
            "INSERT INTO chats (id, question, answer, trace) VALUES (?,?,?,?)",
            (chat_id, question, generation.text, trace.model_dump_json()),
        )
        created_at = conn.execute("SELECT created_at FROM chats WHERE id = ?", (chat_id,)).fetchone()[0]

    return ChatResponse(chat_id=chat_id, question=question, answer=generation.text,
                        trace=trace, created_at=created_at)


def load_trace(chat_id: str) -> RetrievalTrace | None:
    with get_db() as conn:
        row = conn.execute("SELECT trace FROM chats WHERE id = ?", (chat_id,)).fetchone()
    return RetrievalTrace.model_validate_json(row["trace"]) if row else None