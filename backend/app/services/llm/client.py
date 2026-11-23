from dataclasses import dataclass

import ollama
import re

from app.core.config import settings
from app.models.schemas import PromptMessage


_client = ollama.Client(host=settings.ollama_host)


def clean_answer(text: str) -> str:
    if "</think>" in text:
        text = text.split("</think>", 1)[1]

    # Remove source citations like [1], [2], [1][2]
    text = re.sub(r"\s*\[\d+\]", "", text)

    return text.strip()


@dataclass
class Generation:
    text: str
    prompt_tokens: int
    completion_tokens: int


def generate(messages: list[PromptMessage]) -> Generation:
    response = _client.chat(
        model=settings.llm_model,
        messages=[m.model_dump() for m in messages],
        think=False,
        options={
            "temperature": settings.temperature,
            "num_ctx": settings.num_ctx,
        },
    )

    answer = clean_answer(response.message.content or "")

    return Generation(
        text=answer,
        prompt_tokens=response.prompt_eval_count or 0,
        completion_tokens=response.eval_count or 0,
    )