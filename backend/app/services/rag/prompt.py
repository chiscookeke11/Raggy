from app.models.schemas import PromptMessage, RetrievedChunk

SYSTEM_PROMPT = """You answer questions using ONLY the context provided by the user.

Rules:
- If the context does not contain the answer, say you could not find it in the documents. Do not guess.
- Cite the sources you used with their numbers, like [1] or [2][3].
- Be concise."""


def build_messages(question: str, chunks: list[RetrievedChunk]) -> list[PromptMessage]:
    if chunks:
        context = "\n\n".join(
            f"[{c.rank}] (source: {c.filename}, page {c.page})\n{c.text}" for c in chunks
        )
    else:
        context = "(no relevant context found)"
    user = f"Context:\n{context}\n\nQuestion: {question}"
    return [
        PromptMessage(role="system", content=SYSTEM_PROMPT),
        PromptMessage(role="user", content=user),
    ]