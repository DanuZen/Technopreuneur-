import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.contract.schemas import AnalyzeResponse
from app.llm.mock_provider import MockLLMProvider
from app.main import app

TEST_TOKEN = "token-uji-untuk-pytest"
ENDPOINT = "/internal/v1/cv/analyze"
HEADERS = {"X-Internal-Token": TEST_TOKEN}
DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
EXAMPLES = Path(__file__).resolve().parents[1] / "docs" / "contract" / "examples"


@pytest.fixture
def client(monkeypatch):
    import app.api.security as sec
    monkeypatch.setattr(sec, "INTERNAL_TOKEN", TEST_TOKEN)

    # Tidak memanggil API sungguhan dalam tes
    monkeypatch.setattr("app.api.analyze_routes.get_provider", lambda: MockLLMProvider())

    class FakeEmbedder:
        def embed(self, texts):
            return [[0.0] * 1536 for _ in texts]

    monkeypatch.setattr("app.api.analyze_routes.GeminiEmbedder", FakeEmbedder)
    return TestClient(app)


def _docx(tmp_path, lines):
    from docx import Document
    d = Document()
    for line in lines:
        d.add_paragraph(line)
    path = tmp_path / "cv.docx"
    d.save(path)
    return path.read_bytes()


def test_requires_internal_token(tmp_path):
    content = _docx(tmp_path, ["Budi"])
    r = TestClient(app).post(ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)})
    assert r.status_code == 401


def test_response_matches_contract(client, tmp_path):
    content = _docx(tmp_path, ["Budi Santoso", "budi@example.com", "Pengalaman Kerja",
                               "• Menaikkan throughput sebesar 40%"])
    r = client.post(ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)
    assert r.status_code == 200
    AnalyzeResponse.model_validate(r.json())


def test_embedding_has_1536_dimensions(client, tmp_path):
    content = _docx(tmp_path, ["Budi Santoso", "budi@example.com"])
    r = client.post(ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)
    assert len(r.json()["cv_embedding"]) == 1536


def test_sanitized_text_excludes_sensitive_value(client, tmp_path):
    content = _docx(tmp_path, ["Budi Santoso", "Tanggal Lahir: 12 Maret 1999", "budi@example.com"])
    r = client.post(ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)
    body = r.json()
    assert "12 Maret 1999" not in body["sanitized_text"]
    assert "budi@example.com" in body["sanitized_text"]


def test_advice_failure_still_returns_ats_and_embedding(client, tmp_path, monkeypatch):
    class Broken:
        name = "broken"
        def generate_json(self, s, u):
            raise RuntimeError("gagal")
    monkeypatch.setattr("app.api.analyze_routes.get_provider", lambda: Broken())
    content = _docx(tmp_path, ["Budi Santoso", "budi@example.com"])
    r = client.post(ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)
    assert r.status_code == 200
    body = r.json()
    assert body["advice_status"] == "unavailable"
    assert body["advice"] is None
    assert len(body["cv_embedding"]) == 1536


def test_embedding_failure_returns_503(client, tmp_path, monkeypatch):
    class BrokenEmbedder:
        def embed(self, texts):
            raise RuntimeError("kuota")
    monkeypatch.setattr("app.api.analyze_routes.GeminiEmbedder", BrokenEmbedder)
    content = _docx(tmp_path, ["Budi Santoso"])
    r = client.post(ENDPOINT, files={"file": ("cv.docx", content, DOCX_TYPE)}, headers=HEADERS)
    assert r.status_code == 503


def test_example_response_validates():
    data = json.loads((EXAMPLES / "analyze_response.json").read_text(encoding="utf-8"))
    # Contoh memakai embedding pendek untuk keterbacaan; bentuk lainnya harus valid
    data["cv_embedding"] = [0.0] * 1536
    AnalyzeResponse.model_validate(data)


def test_wrong_embedding_dimension_rejected():
    data = json.loads((EXAMPLES / "analyze_response.json").read_text(encoding="utf-8"))
    data["cv_embedding"] = [0.0] * 100
    with pytest.raises(ValidationError):
        AnalyzeResponse.model_validate(data)