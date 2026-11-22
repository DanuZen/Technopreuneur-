from docx import Document

from app.ingestion.docx_extractor import extract_docx


def test_list_paragraph_gets_bullet_prefix(tmp_path):
    doc = Document()
    doc.add_paragraph("Pengalaman Kerja")
    doc.add_paragraph("Membangun API pembayaran", style="List Bullet")
    path = tmp_path / "cv.docx"
    doc.save(path)

    result = extract_docx(path)
    texts = [b.text for b in result.blocks]
    assert "• Membangun API pembayaran" in texts


def test_plain_paragraph_has_no_bullet(tmp_path):
    doc = Document()
    doc.add_paragraph("Pengalaman Kerja")
    path = tmp_path / "cv.docx"
    doc.save(path)

    result = extract_docx(path)
    assert result.blocks[0].text == "Pengalaman Kerja"


def test_bullet_counts_for_content_check(tmp_path):
    from app.ats.scorer import evaluate_cv

    doc = Document()
    doc.add_paragraph("Pengalaman Kerja")
    doc.add_paragraph("Menaikkan throughput sebesar 40%", style="List Bullet")
    path = tmp_path / "cv.docx"
    doc.save(path)

    result = evaluate_cv(extract_docx(path))
    codes = {i.code for i in result.issues}
    assert "NO_BULLET_POINTS" not in codes