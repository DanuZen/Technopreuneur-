from pathlib import Path

from docx import Document

from app.ingestion.models import ExtractedDocument, TextBlock


def _has_numbering(p) -> bool:
    """Paragraf berformat daftar: numbering langsung di paragraf, atau lewat style."""
    ppr = p._p.pPr
    if ppr is not None and ppr.numPr is not None:
        num_id = ppr.numPr.numId
        # numId val=0 berarti numbering dimatikan secara eksplisit
        if num_id is not None and num_id.val == 0:
            return False
        return True

    style = p.style
    while style is not None:
        s_ppr = style.element.pPr
        if s_ppr is not None and s_ppr.numPr is not None:
            return True
        style = style.base_style

    # Cadangan: nama style daftar standar
    name = (p.style.name if p.style is not None else "") or ""
    return "list" in name.lower()


def _paragraph_text(p) -> str:
    text = p.text.strip()
    if not text:
        return ""
    if _has_numbering(p):
        return f"• {text}"
    return text


def _paragraph_blocks(paragraphs, region: str) -> list[TextBlock]:
    blocks = []
    for p in paragraphs:
        text = _paragraph_text(p)
        if text:
            blocks.append(TextBlock(text=text, page=1, region=region))
    return blocks


def extract_docx(path: Path) -> ExtractedDocument:
    doc = Document(path)
    result = ExtractedDocument(page_count=1)

    # Isi utama
    result.blocks.extend(_paragraph_blocks(doc.paragraphs, "body"))

    # Tabel: teks di dalam sel sering terlewat
    if doc.tables:
        result.has_tables = True
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    text = cell.text.strip()
                    if text:
                        result.blocks.append(TextBlock(text=text, page=1, region="table"))

    # Header dan footer: informasi kontak sering ada di sini
    for section in doc.sections:
        result.blocks.extend(_paragraph_blocks(section.header.paragraphs, "header"))
        result.blocks.extend(_paragraph_blocks(section.footer.paragraphs, "footer"))

    # Gambar inline
    result.has_images = len(doc.inline_shapes) > 0

    result.is_empty = result.char_count == 0
    result.is_scanned = False  # DOCX tidak bisa menjadi scan

    return result