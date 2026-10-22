import ollama
from app.core.config import settings

client = ollama.Client(host=settings.ollama_host)


def _prefix(kind: str) -> str:
    # nomic-embed-text was trained with task prefixes; skipping them hurts quality.
    if settings.embedding_model.startswith("nomic"):
        return "search_document: " if kind == "document" else "search_query: "
    return ""


def _embed(texts: list[str], batch_size: int = 16) -> list[list[float]]:
    vectors: list[list[float]] = []
    for i in range(0, len(texts), batch_size):
        response = client.embed(model=settings.embedding_model, input=texts[i:i + batch_size])
        vectors.extend(response["embeddings"])
    return vectors


def embed_documents(texts: list[str]) -> list[list[float]]:
    return _embed([_prefix("document") + t for t in texts])


def embed_query(text: str) -> list[float]:
    return _embed([_prefix("query") + text])[0]