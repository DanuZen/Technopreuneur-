from app.ats.schema import DimensionName
from app.ats.scorer import evaluate_cv
from app.ingestion.models import ExtractedDocument, TextBlock

FILLER = "Mengelola sistem backend untuk layanan internal perusahaan dengan performa tinggi."

def _good_cv() -> ExtractedDocument:
    lines = [
        ("Budi Santoso", "body"),
        ("budi@example.com | 0812-3456-7890", "body"),
        ("Pengalaman Kerja", "body"),
        ("• Meningkatkan throughput API sebesar 40% dengan Python dan Docker", "body"),
        ("• Mengurangi waktu deploy dari 2 jam menjadi 15 menit", "body"),
        ("• Membangun 12 layanan mikro untuk tim pembayaran", "body"),
        ("Pendidikan", "body"),
        ("S1 Informatika, Universitas Negeri Padang", "body"),
        ("Keterampilan", "body"),
        ("Python, Docker, PostgreSQL", "body"),
        (FILLER, "body"),
        (FILLER, "body"),
        (FILLER, "body"),
    ]
    return ExtractedDocument(
        blocks=[TextBlock(text=t, page=1, region=r) for t, r in lines],
        page_count=1,
    )

def _scanned_cv() -> ExtractedDocument:
    return ExtractedDocument(page_count=1, is_scanned=True, has_images=True)


def test_good_cv_scores_high():
    result = evaluate_cv(_good_cv())
    assert result.overall_score >= 90
    assert result.detected_sections == ["education", "experience", "skills"]


def test_scanned_cv_low_readability():
    result = evaluate_cv(_scanned_cv())
    readability = next(d for d in result.dimensions if d.name == DimensionName.READABILITY)
    assert readability.score == 45   # 100 - 40 (scan) - 15 (gambar)
    codes = [i.code for i in result.issues]
    assert "SCANNED_PDF" in codes
    assert "IMAGE_DETECTED" in codes


def test_missing_sections_reported():
    doc = ExtractedDocument(
        blocks=[TextBlock(text="Budi budi@example.com", page=1, region="body")],
        page_count=1,
    )
    result = evaluate_cv(doc)
    codes = {i.code for i in result.issues}
    assert "MISSING_SECTION_EXPERIENCE" in codes
    assert "MISSING_SECTION_SKILLS" in codes


def test_keyword_dimension_none_without_jd():
    result = evaluate_cv(_good_cv())
    keywords = next(d for d in result.dimensions if d.name == DimensionName.KEYWORDS)
    assert keywords.score is None


def test_keyword_overlap_with_jd():
    result = evaluate_cv(_good_cv(), jd_keywords=["python", "docker", "kubernetes"])
    keywords = next(d for d in result.dimensions if d.name == DimensionName.KEYWORDS)
    assert keywords.score == 67


def test_result_is_marked_as_estimate():
    result = evaluate_cv(_good_cv())
    assert result.is_estimate is True
    assert len(result.dimensions) == 5

def test_heading_variants_detected():
    from app.ats.scorer import _detect_sections

    assert "experience" in _detect_sections(["Pengalaman Proyek"])
    assert "skills" in _detect_sections(["Keahlian (SKILLS)"])
    assert "education" in _detect_sections(["Pendidikan"])
    # Bullet yang diawali kata kunci tidak boleh dianggap heading
    assert "experience" not in _detect_sections(["• Pengalaman 2 tahun dengan Python"])   