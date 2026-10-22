import ollama
from fastapi import APIRouter, HTTPException

from app.models.schemas import ChatRequest, ChatResponse, PromptMessage, RetrievalTrace
from app.services.chat import answer_question, load_trace
from app.services.vectorstore import chroma

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if chroma.count() == 0:
        raise HTTPException(409, "No documents are indexed yet. Upload one first.")
    try:
        return answer_question(req.question, req.top_k, req.document_ids)
    except (ConnectionError, ollama.ResponseError) as exc:
        raise HTTPException(503, f"Ollama problem: {exc}")


@router.get("/retrieval/{chat_id}", response_model=RetrievalTrace)
def get_retrieval(chat_id: str):
    trace = load_trace(chat_id)
    if not trace:
        raise HTTPException(404, "Chat not found")
    return trace


@router.get("/prompt/{chat_id}", response_model=list[PromptMessage])
def get_prompt(chat_id: str):
    trace = load_trace(chat_id)
    if not trace:
        raise HTTPException(404, "Chat not found")
    return trace.prompt