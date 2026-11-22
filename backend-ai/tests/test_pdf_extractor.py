import pytest

from app.ingestion.dispatcher import extract
from app.ingestion.pdf_extractor import extract_pdf


def test_text_pdf_is_extracted(text_pdf):
    doc = extract_pdf(text_pdf)
    assert doc.page_count == 1
    assert doc.is_scanned is False
    assert doc.is_empty is False
    assert doc.font_count >= 1
    assert doc.has_images is False
    assert "budi@example.com" in doc.plain_text


def test_words_on_same_line_are_grouped(text_pdf):
    doc = extract_pdf(text_pdf)
    assert any(b.text == "Budi Santoso" for b in doc.blocks)


def test_scan_pdf_is_detected(scan_pdf):
    doc = extract_pdf(scan_pdf)
    assert doc.is_scanned is True
    assert doc.has_images is True
    assert doc.is_empty is True


def test_too_many_pages_rejected(long_pdf):
    with pytest.raises(ValueError):
        extract_pdf(long_pdf)


def test_dispatcher_routes_pdf(text_pdf):
    doc = extract(text_pdf)
    assert "Budi Santoso" in doc.plain_text