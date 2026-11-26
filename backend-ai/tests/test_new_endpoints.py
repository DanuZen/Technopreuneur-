import json
import pytest
from docx import Document
from fastapi.testclient import TestClient

from app.ingestion.docx_extractor import extract_docx
from app.jobs.normalizer import normalize_jooble, normalize_many
from app.main import app
from app.pipeline import analyze_document

TEST_TOKEN = "token-uji-fitur-baru"
HEADERS = {"X-Internal-Token": TEST_TOKEN}
client = TestClient(app)


@pytest.fixture(autouse=True)
def _set_token(monkeypatch):
    import app.api.security as sec
    monkeypatch.setattr(sec, "INTERNAL_TOKEN", TEST_TOKEN)


def test_embed_endpoint_returns_1536_vectors(monkeypatch):
    from app.embedding import gemini_embedder

    monkeypatch.setattr(
        gemini_embedder.GeminiEmbedder,
        "embed",
        lambda self, texts: [[0.05] * 1536 for _ in texts],
    )
    r = client.post(
        "/internal/v1/embed",
        json={"texts": ["Lowongan Backend Developer FastAPI Docker", "UI/UX Designer Figma"]},
        headers=HEADERS,
    )
    assert r.status_code == 200
    body = r.json()
    assert body["dimensions"] == 1536
    assert len(body["embeddings"]) == 2
    assert len(body["embeddings"][0]) == 1536


def test_analyze_text_returns_profile_and_strengths(monkeypatch):
    from app.embedding import gemini_embedder
    import app.api.analyze_routes as ar

    monkeypatch.setattr(
        gemini_embedder.GeminiEmbedder,
        "embed",
        lambda self, texts: [[0.01] * 1536 for _ in texts],
    )

    class DummyProvider:
        name = "dummy"

        def generate_json(self, system_prompt: str, user_prompt: str) -> str:
            return json.dumps({
                "summary": "CV kandidat rapi dan terstruktur.",
                "suggestions": [
                    {
                        "dimension": "content",
                        "priority": "medium",
                        "text": "Pertahankan pencapaian kuantitatif pada setiap proyek.",
                        "evidence": None,
                    }
                ],
            })

    monkeypatch.setattr(ar, "get_provider", lambda: DummyProvider())

    sample_cv = "\n".join([
        "Rizki Pratama",
        "rizki.pratama@example.com | +62 812-3456-7890",
        "Tanggal Lahir: 12 Januari 2002",
        "Ringkasan Profil",
        "Lulusan S1 Teknik Informatika yang berfokus pada pengembangan layanan web modern dengan Next.js dan FastAPI.",
        "Pendidikan",
        "S1 Teknik Informatika - Universitas Negeri Padang (2025)",
        "Pengalaman Kerja",
        "- Mengembangkan layanan REST API menggunakan FastAPI dan PostgreSQL yang meningkatkan efisiensi query 40%.",
        "- Membangun antarmuka dashboard React dan TypeScript untuk 1.200 pengguna aktif.",
        "Keahlian",
        "Python, FastAPI, React, Next.js, TypeScript, PostgreSQL, Docker, Figma, Komunikasi, Problem Solving",
    ])

    r = client.post(
        "/internal/v1/cv/analyze-text",
        json={"text": sample_cv, "jd_keywords": ["FastAPI", "Next.js", "C#"]},
        headers=HEADERS,
    )
    assert r.status_code == 200
    data = r.json()
    assert "Tanggal Lahir" not in data["sanitized_text"]
    assert data["profile"] is not None
    assert data["profile"]["fullName"] == "Rizki Pratama"
    assert data["profile"]["contactEmail"] == "rizki.pratama@example.com"
    assert "FastAPI" in data["profile"]["skills"]["technical"]
    assert len(data["strengths"]) >= 1
    assert data["ats"]["general_skill_score"] >= 70


def test_cv_chat_llm_and_fallback(monkeypatch):
    import app.api.chat_routes as cr

    class GoodChatProvider:
        name = "good"

        def generate_json(self, system_prompt: str, user_prompt: str) -> str:
            return json.dumps({
                "answer": "Tambahkan metrik persentase pada poin pengalaman kerja Anda agar skor Dampak Terukur meningkat."
            })

    monkeypatch.setattr(cr, "get_provider", lambda: GoodChatProvider())
    r_ok = client.post(
        "/internal/v1/cv/chat",
        json={
            "question": "Bagaimana menaikkan skor dampak terukur?",
            "sanitized_text": "Pengalaman membangun aplikasi web.",
            "overall_score": 78,
            "dimensions": {"structure": 90, "measurableImpact": 65},
        },
        headers=HEADERS,
    )
    assert r_ok.status_code == 200
    assert r_ok.json()["status"] == "ok"
    assert "metrik" in r_ok.json()["answer"].lower()

    class QuotaProvider:
        name = "quota"

        def generate_json(self, system_prompt: str, user_prompt: str) -> str:
            raise RuntimeError("Kuota habis")

    monkeypatch.setattr(cr, "get_provider", lambda: QuotaProvider())
    r_fb = client.post(
        "/internal/v1/cv/chat",
        json={
            "question": "Contoh kalimat dampak terukur?",
            "overall_score": 78,
            "dimensions": {"measurableImpact": 65},
        },
        headers=HEADERS,
    )
    assert r_fb.status_code == 200
    assert r_fb.json()["status"] == "fallback"
    assert "65/100" in r_fb.json()["answer"]


def test_csharp_keyword_and_docx_list_bullet_detection(tmp_path):
    doc_file = tmp_path / "sample_bullet.docx"
    d = Document()
    d.add_paragraph("Budi Santoso")
    d.add_paragraph("budi@example.com | +628123456789")
    d.add_paragraph("Pengalaman Kerja")
    d.add_paragraph("Mengembangkan layanan backend C# dan PostgreSQL dengan peningkatan throughput 35%.", style="List Bullet")
    d.add_paragraph("Pendidikan")
    d.add_paragraph("S1 Ilmu Komputer Universitas Indonesia 2024")
    d.add_paragraph("Keahlian")
    d.add_paragraph("C#, PostgreSQL, Docker, Git")
    d.save(str(doc_file))

    extracted = extract_docx(doc_file)
    assert any(b.text.startswith(("• ", "- ")) for b in extracted.blocks)

    ats = analyze_document(extracted, jd_keywords=["C#", "Docker"]).ats
    kw_dim = next(dim for dim in ats.dimensions if dim.name == "keywords")
    content_dim = next(dim for dim in ats.dimensions if dim.name == "content")
    assert kw_dim.score == 100
    assert content_dim.score == 100


def test_jooble_normalizer():
    payload = {
        "jobs": [
            {
                "id": 987654,
                "title": "Frontend Engineer (React)",
                "company": "PT Nusantara Digital",
                "location": "Jakarta (Remote)",
                "snippet": "<b>Dicari</b> pengembang React &amp; TypeScript berpengalaman.",
                "link": "https://id.jooble.org/desc/987654",
                "updated": "2026-11-26T00:00:00Z",
            }
        ]
    }
    records = normalize_many(payload)
    assert len(records) == 1
    rec = records[0]
    assert rec.source == "jooble"
    assert rec.external_id == "987654"
    assert rec.remote is True
    assert "<b>" not in rec.description
    assert normalize_jooble({"title": "X"}) is None
