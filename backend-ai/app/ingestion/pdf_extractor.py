from pathlib import Path

import pdfplumber

import re

from app.config import MAX_PAGES, MIN_CHARS_TOTAL
from app.ingestion.layout import detect_column_split, group_lines
from app.ingestion.models import ExtractedDocument, TextBlock

CID_BULLET_RE = re.compile(r"\(cid:\d+\)")

def _normalize_text(text: str) -> str:
    text = CID_BULLET_RE.sub("•", text)
    return " ".join(text.split())

def _line_to_block(line: list[dict], page_no: int) -> TextBlock:
    ordered = sorted(line, key=lambda w: w["x0"])
    return TextBlock(
        text=" ".join(w["text"] for w in ordered).strip(),
        page=page_no,
        x0=min(w["x0"] for w in ordered),
        y0=min(w["top"] for w in ordered),
        x1=max(w["x1"] for w in ordered),
        y1=max(w["bottom"] for w in ordered),
    )


def extract_pdf(path: Path) -> ExtractedDocument:
    result = ExtractedDocument()

    with pdfplumber.open(path) as pdf:
        if len(pdf.pages) > MAX_PAGES:
            raise ValueError(
                f"CV terlalu panjang: {len(pdf.pages)} halaman (maksimum {MAX_PAGES})"
            )

        result.page_count = len(pdf.pages)

        for page_no, page in enumerate(pdf.pages, start=1):
            fonts = {c["fontname"] for c in page.chars if c.get("fontname")}
            result.font_count += len(fonts)

            if page.images:
                result.has_images = True

            words = page.extract_words()
            split = detect_column_split(words, page.width)

            if split is None:
                columns = [words]
            else:
                result.has_multi_column = True
                # Kolom kiri dibaca dari atas ke bawah lebih dulu, lalu kolom kanan
                columns = [
                    [w for w in words if w["x0"] < split],
                    [w for w in words if w["x0"] >= split],
                ]

            for column in columns:
                for line in group_lines(column):
                    block = _line_to_block(line, page_no)
                    if block.text:
                        result.blocks.append(block)

    total = result.char_count
    result.is_empty = total == 0
    result.is_scanned = total < MIN_CHARS_TOTAL or (
        result.font_count == 0 and result.has_images
    )

    return result