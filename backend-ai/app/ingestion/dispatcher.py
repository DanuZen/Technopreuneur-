from pathlib import Path

from app.config import MAX_FILE_SIZE_BYTES, SUPPORTED_EXTENSIONS
from app.ingestion.docx_extractor import extract_docx
from app.ingestion.models import ExtractedDocument
from app.ingestion.pdf_extractor import extract_pdf


class UnsupportedFileError(ValueError):
    pass


def extract(path: Path) -> ExtractedDocument:
    suffix = path.suffix.lower()

    if suffix not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileError(f"Format tidak didukung: {suffix}")

    if path.stat().st_size > MAX_FILE_SIZE_BYTES:
        raise UnsupportedFileError("Ukuran file melebihi batas 5 MB")

    if suffix == ".pdf":
        return extract_pdf(path)
    return extract_docx(path)