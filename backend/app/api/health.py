from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthOut
from app.services.embeddings.client import client
from app.services.vectorstore import chroma

router = APIRouter(tags=["health"])


def _has(model: str, installed: list[str]) -> bool:
    return (model if ":" in model else f"{model}:latest") in installed


@router.get("/health", response_model=HealthOut)
def health():
    try:
        installed = [m.model for m in client.list().models if m.model]
        reachable = True
    except Exception:
        installed, reachable = [], False

    embed_ok = _has(settings.embedding_model, installed)
    return HealthOut(
        status="ok" if reachable and embed_ok else "degraded",
        ollama_reachable=reachable,
        embedding_model_ready=embed_ok,
        llm_model_ready=_has(settings.llm_model, installed),
        vector_count=chroma.count(),
    )