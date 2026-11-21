from dataclasses import dataclass
from app.services.rag.extraction import Page

# Try to split on the biggest natural boundary first, then fall back.
SEPARATORS = ["\n\n", "\n", ". ", " "]


@dataclass
class Chunk:
    index: int
    page: int
    text: str
    char_count: int
    token_count: int


def estimate_tokens(text: str) -> int:
    # Rough rule of thumb for English: ~4 characters per token.
    return max(1, round(len(text) / 4))


def _split(text: str, size: int, seps: list[str]) -> list[str]:
    """Recursively break text into pieces no longer than `size`."""
    if len(text) <= size:
        return [text]
    if not seps:                                   # last resort: hard cut
        return [text[i:i + size] for i in range(0, len(text), size)]
    sep, rest = seps[0], seps[1:]
    parts = text.split(sep)
    pieces: list[str] = []
    for i, part in enumerate(parts):
        piece = part + (sep if i < len(parts) - 1 else "")   # keep the separator
        if not piece:
            continue
        if len(piece) <= size:
            pieces.append(piece)
        else:
            pieces.extend(_split(piece, size, rest))          # too big: use a finer separator
    return pieces


def _merge(pieces: list[str], size: int, overlap: int) -> list[str]:
    """Pack small pieces into chunks of up to `size`, carrying `overlap` chars forward."""
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for piece in pieces:
        if current and current_len + len(piece) > size:
            chunks.append("".join(current))
            # Start the next chunk with the tail of this one (the overlap).
            keep: list[str] = []
            kept_len = 0
            for prev in reversed(current):
                if kept_len + len(prev) > overlap:
                    break
                keep.insert(0, prev)
                kept_len += len(prev)
            while keep and kept_len + len(piece) > size:
                kept_len -= len(keep.pop(0))
            current, current_len = keep, kept_len
        current.append(piece)
        current_len += len(piece)
    if current:
        chunks.append("".join(current))
    return chunks


def chunk_pages(pages: list[Page], chunk_size: int, overlap: int) -> list[Chunk]:
    if overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size")
    chunks: list[Chunk] = []
    index = 0
    for page in pages:
        if not page.text.strip():
            continue
        for text in _merge(_split(page.text, chunk_size, SEPARATORS), chunk_size, overlap):
            text = text.strip()
            if text:
                chunks.append(Chunk(index, page.number, text, len(text), estimate_tokens(text)))
                index += 1
    return chunks