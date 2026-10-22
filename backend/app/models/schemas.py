from pydantic import BaseModel, Field


class DocumentOut(BaseModel):
    id: str
    filename: str
    file_type: str
    size_bytes: int
    page_count: int
    chunk_count: int
    status: str
    current_stage: str
    error: str | None = None
    stage_timings: dict[str, float] = {}
    created_at: str


class ChunkOut(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    page: int
    text: str
    char_count: int
    token_count: int
    embedding_dim: int


class HealthOut(BaseModel):
    status: str
    ollama_reachable: bool
    embedding_model_ready: bool
    llm_model_ready: bool
    vector_count: int


class RetrievedChunk(BaseModel):
    rank: int                # 1 = best match
    chunk_id: str
    document_id: str
    filename: str
    page: int
    chunk_index: int
    text: str
    distance: float          # what Chroma returns: 0 = identical
    similarity: float        # 1 - distance, the number the UI shows


class PromptMessage(BaseModel):
    role: str                # "system" or "user"
    content: str


class Timings(BaseModel):
    embedding_ms: float
    retrieval_ms: float
    generation_ms: float
    total_ms: float


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int


class RetrievalTrace(BaseModel):
    question: str
    llm_model: str
    embedding_model: str
    embedding_dim: int
    top_k: int
    chunks: list[RetrievedChunk]
    reranked: bool = False   # reserved slot: reranking is a later improvement
    prompt: list[PromptMessage]
    timings: Timings
    usage: Usage


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    top_k: int | None = Field(default=None, ge=1, le=20)
    document_ids: list[str] | None = None   # optionally search only these documents


class ChatResponse(BaseModel):
    chat_id: str
    question: str
    answer: str
    trace: RetrievalTrace
    created_at: str