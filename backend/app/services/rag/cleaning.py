import re


def clean_text(text: str, reflow: bool = False) -> str:
    # Drop lone surrogates (illegal in UTF-8) that some PDF fonts produce.
    text = text.encode("utf-8", errors="ignore").decode("utf-8")
    # Drop control characters except tab (\x09), newline (\x0a), carriage return (\x0d).
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    if reflow:
        text = re.sub(r"-\n(\w)", r"\1", text)            # "retriev-\nal" -> "retrieval"
        text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)      # hard line wraps -> spaces
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()