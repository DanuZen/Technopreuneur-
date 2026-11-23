from app.matching.keywords import extract_skills


def test_accounting_and_tax():
    skills = extract_skills("Pengalaman akuntansi dan perpajakan untuk PT Contoh")
    assert {"akuntansi", "perpajakan"} <= skills


def test_nursing_detected():
    assert "keperawatan" in extract_skills("Perawat di unit gawat darurat selama 3 tahun")


def test_office_tools_detected():
    skills = extract_skills("Mahir Microsoft Office dan Powerpoint")
    assert "microsoft_office" in skills
    assert "powerpoint" in skills


def test_english_detected():
    assert "bahasa_inggris" in extract_skills("English (Technical Proficiency)")