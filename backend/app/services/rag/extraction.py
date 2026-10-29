from dataclasses import dataclass
from pathlib import Path
from pypdf import PdfReader


@dataclass
class Page:
    number: int # 1-based
    text: str



def extract_pages(path: Path, file_type: str) -> list[Page]:
    if file_type == "pdf":
        reader = PdfReader(str(path))
        return [Page(i + 1, page.extract_text() or "") for i, page in enumerate(reader.pages)]

    # text / md have no real pages, so treat the file as page 1

    return [Page(1, path.read_text(encoding="utf-8", errors="replace"))]