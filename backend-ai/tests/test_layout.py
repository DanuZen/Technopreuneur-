from app.ingestion.layout import detect_column_split
from app.ingestion.pdf_extractor import extract_pdf


def _w(text, x0, top, width=40):
    return {"text": text, "x0": x0, "x1": x0 + width, "top": top, "bottom": top + 10}


def test_two_columns_detected():
    words = []
    for i in range(6):
        top = 100 + i * 15
        words += [_w("kiri", 72, top), _w("satu", 80, top),
                  _w("kanan", 380, top), _w("dua", 390, top)]
    assert detect_column_split(words, 595) is not None


def test_single_column_not_detected():
    words = []
    for i in range(8):
        top = 100 + i * 15
        for j in range(6):
            words.append(_w(f"k{j}", 72 + j * 45, top))
    assert detect_column_split(words, 595) is None


def test_two_column_pdf_read_column_by_column(two_col_pdf):
    doc = extract_pdf(two_col_pdf)
    assert doc.has_multi_column is True
    texts = [b.text for b in doc.blocks]
    assert texts.index("Keterampilan") < texts.index("Pengalaman Kerja")
    assert not any("Keterampilan" in t and "Pengalaman" in t for t in texts)


def test_single_column_pdf_not_flagged(text_pdf):
    doc = extract_pdf(text_pdf)
    assert doc.has_multi_column is False

def test_cid_bullet_normalized():
    from app.ingestion.pdf_extractor import _normalize_text
    assert _normalize_text("(cid:127)  Membangun   API") == "• Membangun API"