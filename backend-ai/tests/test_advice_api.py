import pytest
from fastapi.testclient import TestClient

from app.llm.mock_provider import MockLLMProvider
from app.main import app

TEST_TOKEN = "token-uji-untuk-pytest"
ADVICE_ENDPOINT = "/internal/v1/cv/advice"
DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
HEADERS = {"X-Internal-Token": TEST_TOKEN}


@pytest.fixture(autouse=True)
def _set_test_token(monkeypatch):
    import app.api.security as sec
    monkeypatch.setattr(sec, "INTERNAL_TOKEN", TEST_TOKEN)


client = TestClient(app)


def _docx_bytes(tmp_path, lines):
    from docx import Document

    d = Document()
    for line in lines:
        d.add_paragraph(line)
    path = tmp_path / "cv.docx"
    d.save(path)
    return path.read_bytes()


def test_advice_endpoint_returns_ats_and_advice(tmp_path, monkeypatch):
    monkeypatch.setattr("app.api.ats_routes.get_provider", lambda: MockLLMProvider())
    content = _docx_bytes(tmp_path, ["Budi Santoso", "budi@example.com", "Pengalaman Kerja",
                                     "• Menaikkan throughput sebesar 40%"])

    r = client.post(ADVICE_ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)

    assert r.status_code == 200
    body = r.json()
    assert "overall_score" in body["ats"]
    assert body["advice"]["is_mock"] is True
    assert body["advice_error"] is None


def test_advice_failure_keeps_ats_result(tmp_path, monkeypatch):
    class BrokenProvider:
        name = "broken"

        def generate_json(self, system_prompt, user_prompt):
            raise RuntimeError("koneksi gagal")

    monkeypatch.setattr("app.api.ats_routes.get_provider", lambda: BrokenProvider())
    content = _docx_bytes(tmp_path, ["Budi Santoso", "budi@example.com"])

    r = client.post(ADVICE_ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)

    assert r.status_code == 200
    body = r.json()
    assert body["ats"]["overall_score"] is not None
    assert body["advice"] is None
    assert body["advice_error"]


def test_advice_response_hides_raw_text(tmp_path, monkeypatch):
    monkeypatch.setattr("app.api.ats_routes.get_provider", lambda: MockLLMProvider())
    content = _docx_bytes(tmp_path, ["Budi Santoso", "Tanggal Lahir: 12 Maret 1999", "budi@example.com"])

    r = client.post(ADVICE_ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)

    assert "12 Maret 1999" not in r.text


def test_advice_rejects_missing_token(tmp_path):
    content = _docx_bytes(tmp_path, ["Budi Santoso"])
    r = client.post(ADVICE_ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)})
    assert r.status_code == 401