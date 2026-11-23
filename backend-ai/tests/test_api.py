import pytest
from fastapi.testclient import TestClient

from app.main import app

TEST_TOKEN = "token-uji-untuk-pytest"
ENDPOINT = "/internal/v1/cv/ats-check"
DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
HEADERS = {"X-Internal-Token": TEST_TOKEN}


@pytest.fixture(autouse=True)
def _set_test_token(monkeypatch):
    import app.api.security as sec
    monkeypatch.setattr(sec, "INTERNAL_TOKEN", TEST_TOKEN)


client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_rejects_unsupported_extension():
    r = client.post(ENDPOINT, files={"file": ("cv.txt", b"halo", "text/plain")}, headers=HEADERS)
    assert r.status_code == 415


def test_rejects_empty_file():
    r = client.post(ENDPOINT, files={"file": ("cv.docx", b"", DOCX_TYPE)}, headers=HEADERS)
    assert r.status_code == 400


def test_internal_route_rejects_missing_token(tmp_path):
    from docx import Document

    d = Document()
    d.add_paragraph("Budi")
    path = tmp_path / "cv.docx"
    d.save(path)

    with open(path, "rb") as f:
        r = client.post(ENDPOINT, files={"file": ("cv.docx", f, DOCX_TYPE)})
    assert r.status_code == 401


def test_internal_route_rejects_wrong_token(tmp_path):
    from docx import Document

    d = Document()
    d.add_paragraph("Budi")
    path = tmp_path / "cv.docx"
    d.save(path)

    with open(path, "rb") as f:
        r = client.post(
            ENDPOINT,
            files={"file": ("cv.docx", f, DOCX_TYPE)},
            headers={"X-Internal-Token": "salah"},
        )
    assert r.status_code == 401


def test_docx_upload_returns_ats_result(tmp_path):
    from docx import Document

    d = Document()
    d.add_paragraph("Budi Santoso")
    d.add_paragraph("budi@example.com | 0812-3456-7890")
    d.add_paragraph("Pengalaman Kerja")
    d.add_paragraph("• Meningkatkan throughput API sebesar 40% dengan Python")
    d.add_paragraph("Pendidikan")
    d.add_paragraph("S1 Informatika")
    d.add_paragraph("Keterampilan")
    d.add_paragraph("Python, Docker")
    path = tmp_path / "cv.docx"
    d.save(path)

    with open(path, "rb") as f:
        r = client.post(
            ENDPOINT,
            files={"file": ("cv.docx", f, DOCX_TYPE)},
            data={"jd_keywords": "python,docker,kubernetes"},
            headers=HEADERS,
        )

    assert r.status_code == 200
    body = r.json()
    assert body["is_estimate"] is True
    assert len(body["dimensions"]) == 5
    assert 0 <= body["overall_score"] <= 100
    assert set(body["detected_sections"]) == {"experience", "education", "skills"}


def test_response_does_not_echo_sensitive_values(tmp_path):
    from docx import Document

    d = Document()
    d.add_paragraph("Budi Santoso")
    d.add_paragraph("Tanggal Lahir: 12 Maret 1999")
    d.add_paragraph("budi@example.com")
    path = tmp_path / "cv.docx"
    d.save(path)

    with open(path, "rb") as f:
        r = client.post(ENDPOINT, files={"file": ("cv.docx", f, DOCX_TYPE)}, headers=HEADERS)

    assert r.status_code == 200
    assert "12 Maret 1999" not in r.text
    assert "DATE_OF_BIRTH" in r.json()["sanitization"]["removed_categories"]