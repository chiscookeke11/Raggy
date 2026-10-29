from fastapi import APIRouter, Query
from app.core.database import get_db
from app.models.schemas import ChunkOut

router = APIRouter(prefix="/chunks", tags=["chunks"])


@router.get("/{document_id}", response_model=list[ChunkOut])
def list_chunks(
    document_id: str,
    search: str | None = None,
    page: int | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    sql = "SELECT * FROM chunks WHERE document_id = ?"
    params: list = [document_id]
    if search:
        sql += " AND text LIKE ?"
        params.append(f"%{search}%")
    if page is not None:
        sql += " AND page = ?"
        params.append(page)
    sql += " ORDER BY chunk_index LIMIT ? OFFSET ?"
    params += [limit, offset]

    with get_db() as conn:
        rows = conn.execute(sql, params).fetchall()
    return [ChunkOut(**dict(r)) for r in rows]