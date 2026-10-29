from functools import lru_cache
from typing import cast

import chromadb
from chromadb.api.types import Where

from app.core.config import settings


@lru_cache
def get_collection():
    client = chromadb.PersistentClient(path=str(settings.chroma_dir))
    return client.get_or_create_collection(
        name="chunks",
        metadata={"hnsw:space": "cosine"},   # use cosine distance, not the default L2
        embedding_function=None,             # WE supply vectors; Chroma must never embed
    )


def add_chunks(ids, embeddings, documents, metadatas) -> None:
    get_collection().add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)


def delete_document(document_id: str) -> None:
    get_collection().delete(where={"document_id": document_id})


def count() -> int:
    return get_collection().count()



def query(embedding: list[float], top_k: int, document_ids: list[str] | None = None) -> list[dict]:
    collection = get_collection()
    total = collection.count()
    if total == 0:
        return []

    where: Where | None = None
    if document_ids:
        where = cast(Where, {"document_id": {"$in": document_ids}})

    res = collection.query(
        query_embeddings=[embedding],
        n_results=min(top_k, total),
        where=where,
        include=["documents", "metadatas", "distances"],
    )
    ids = res["ids"][0]
    docs = (res["documents"] or [[]])[0]
    metas = (res["metadatas"] or [[]])[0]
    dists = (res["distances"] or [[]])[0]
    return [
        {"id": i, "text": d, "metadata": dict(m), "distance": float(x)}
        for i, d, m, x in zip(ids, docs, metas, dists)
    ]