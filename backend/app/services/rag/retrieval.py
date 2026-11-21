from app.models.schemas import RetrievedChunk
from app.services.vectorstore import chroma


def search(query_vector: list[float], top_k: int, document_ids: list[str] | None = None) -> list[RetrievedChunk]:
    rows = chroma.query(query_vector, top_k, document_ids)
    return [
        RetrievedChunk(
            rank=rank,
            chunk_id=row["id"],
            document_id=row["metadata"]["document_id"],
            filename=row["metadata"]["filename"],
            page=row["metadata"]["page"],
            chunk_index=row["metadata"]["chunk_index"],
            text=row["text"],
            distance=round(row["distance"], 4),
            similarity=round(1 - row["distance"], 4),
        )
        for rank, row in enumerate(rows, start=1)
    ]