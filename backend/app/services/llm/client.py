from dataclasses import dataclass

import ollama

from app.core.config import settings
from app.models.schemas import PromptMessage

_client = ollama.Client(host=settings.ollama_host)


@dataclass
class Generation:
    text: str
    prompt_tokens: int
    completion_tokens: int


def generate(messages: list[PromptMessage]) -> Generation:
    response = _client.chat(
        model=settings.llm_model,
        messages=[m.model_dump() for m in messages],
        think=False,   # Qwen 3 "thinks" by default, which is slow; we want a direct answer
        options={"temperature": settings.temperature, "num_ctx": settings.num_ctx},
    )
    return Generation(
        text=response.message.content or "",
        prompt_tokens=response.prompt_eval_count or 0,
        completion_tokens=response.eval_count or 0,
    )