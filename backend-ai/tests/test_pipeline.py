from app.ingestion.models import ExtractedDocument, TextBlock
from app.pipeline import analyze_document


def _doc() -> ExtractedDocument:
    lines = [
        "Budi Santoso",
        "Tanggal Lahir: 12 Maret 1999",
        "budi@example.com",
        "Pengalaman Kerja",
        "• Menaikkan throughput API sebesar 40%",
        "Keterampilan",
        "Python",
        "Pendidikan",
        "S1 Informatika",
    ]
    return ExtractedDocument(
        blocks=[TextBlock(text=t, page=1) for t in lines],
        page_count=1,
    )


def test_sanitization_summary_recorded():
    out = analyze_document(_doc())
    assert "DATE_OF_BIRTH" in out.ats.sanitization.removed_categories
    assert out.ats.sanitization.removed_lines == 1


def test_sanitized_text_excludes_sensitive_value_but_keeps_contact():
    out = analyze_document(_doc())
    assert "12 Maret 1999" not in out.sanitized_text
    assert "budi@example.com" in out.sanitized_text