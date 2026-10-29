import re
import unicodedata
from collections import Counter

from app.services.rag.extraction import Page

# Look-alike characters -> plain ASCII, so search and matching behave.
_CHAR_MAP = str.maketrans({
    "\u2010": "-", "\u2011": "-",                    # fancy hyphens
    "\u02b9": "'", "\u02bc": "'", "\u2018": "'", "\u2019": "'",   # apostrophe lookalikes
})


def clean_text(text: str, reflow: bool = False) -> str:
    text = text.encode("utf-8", errors="ignore").decode("utf-8")   # drop lone surrogates
    text = unicodedata.normalize("NFKC", text).translate(_CHAR_MAP)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)       # control characters
    if reflow:
        text = re.sub(r"-\n(\w)", r"\1", text)           # "retriev-\nal" -> "retrieval"
        text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)     # hard line wraps -> spaces
    text = re.sub(r"[^\S\n]+", " ", text)                # ANY whitespace except newline -> one space
    text = re.sub(r" ?\n ?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _normalize(line: str) -> str:
    return re.sub(r"\d+", "#", line.strip().lower())     # "Page 3" and "Page 4" look the same


def _edge_indexes(lines: list[str], edge: int) -> set[int]:
    filled = [i for i, line in enumerate(lines) if line.strip()]
    return set(filled[:edge] + filled[-edge:])


def strip_repeated_lines(pages: list[Page], edge: int = 3, min_share: float = 0.4) -> list[Page]:
    """Remove running headers/footers and page numbers from PDF pages.

    A line counts as boilerplate if, near the top or bottom of a page, the same
    text (ignoring digits) shows up on many pages.
    """
    if len(pages) < 3:
        return pages

    seen: Counter[str] = Counter()
    for page in pages:
        lines = page.text.split("\n")
        seen.update({_normalize(lines[i]) for i in _edge_indexes(lines, edge)})

    threshold = max(3, int(len(pages) * min_share))
    boilerplate = {key for key, count in seen.items() if key and count >= threshold}

    for page in pages:
        lines = page.text.split("\n")
        drop = {
            i for i in _edge_indexes(lines, edge)
            if _normalize(lines[i]) in boilerplate
            or re.fullmatch(r"\W*\d{1,4}\W*", lines[i].strip())   # a bare page number
        }
        page.text = "\n".join(line for i, line in enumerate(lines) if i not in drop)
    return pages