from dataclasses import dataclass, field
from typing import Literal

Region = Literal["body", "table", "header", "footer"]


@dataclass
class TextBlock:
    text: str
    page: int                     # nomor halaman, mulai dari 1 (DOCX selalu 1)
    x0: float = 0.0
    y0: float = 0.0
    x1: float = 0.0
    y1: float = 0.0
    region: Region = "body"


@dataclass
class ExtractedDocument:
    blocks: list[TextBlock] = field(default_factory=list)
    page_count: int = 0
    has_images: bool = False
    has_tables: bool = False
    font_count: int = 0
    is_scanned: bool = False
    is_empty: bool = False
    has_multi_column: bool = False

    @property
    def char_count(self) -> int:
        return sum(len(b.text) for b in self.blocks)

    @property
    def plain_text(self) -> str:
        return "\n".join(b.text for b in self.blocks)