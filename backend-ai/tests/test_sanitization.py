from app.sanitization.sanitizer import sanitize_text


def test_removes_date_of_birth_line():
    result = sanitize_text("Budi Santoso\nTanggal Lahir: 12 Maret 1999\nPengalaman Kerja")
    assert "12 Maret 1999" not in result.text
    assert "DATE_OF_BIRTH" in result.report.removed_categories


def test_removes_gender_and_religion():
    text = "Jenis Kelamin: Laki-laki\nAgama: Islam\nbudi@example.com"
    result = sanitize_text(text)
    assert "Laki-laki" not in result.text
    assert "Islam" not in result.text
    assert {"GENDER", "RELIGION"} <= set(result.report.removed_categories)


def test_keeps_contact_information():
    text = "budi@example.com | 0812-3456-7890"
    result = sanitize_text(text)
    assert result.text == text
    assert result.report.removed_lines == 0


def test_keeps_professional_content():
    text = "Pengalaman Kerja\n• Meningkatkan throughput API sebesar 40%"
    result = sanitize_text(text)
    assert result.text == text


def test_report_never_contains_values():
    result = sanitize_text("Tanggal Lahir: 12 Maret 1999\nUsia: 25 tahun")
    report_repr = repr(result.report)
    assert "12 Maret" not in report_repr
    assert "25" not in report_repr
    assert result.report.removed_lines == 2


def test_marital_status_removed():
    result = sanitize_text("Status Pernikahan: Menikah\nPendidikan")
    assert "Menikah" not in result.text
    assert "MARITAL_STATUS" in result.report.removed_categories