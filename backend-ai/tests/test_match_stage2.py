import pytest
from fastapi.testclient import TestClient

from app.api.match_routes import verdict_for
from app.contract.verify import evidence_in_text
from app.main import app

TEST_TOKEN = "token-uji-untuk-pytest"
ENDPOINT = "/internal/v1/match/stage2"
HEADERS = {"X-Internal-Token": TEST_TOKEN}
CV = "Membangun REST API dengan FastAPI dan PostgreSQL. Menggunakan Docker untuk deployment."

client = TestClient(app)


@pytest.fixture(autouse=True)
def _set_token(monkeypatch):
    import app.api.security as sec
    monkeypatch.setattr(sec, "INTERNAL_TOKEN", TEST_TOKEN)


def _cand(job_id, title="", description="", skills=None):
    return {"job_id": job_id, "title": title, "description": description, "skills": skills or []}


def test_requires_internal_token():
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": [_cand("1", "Backend")]})
    assert r.status_code == 401


def test_response_has_contract_fields():
    body = {"sanitized_text": CV, "candidates": [_cand("42", "Backend Developer", "FastAPI, Docker")]}
    r = client.post(ENDPOINT, json=body, headers=HEADERS)
    assert r.status_code == 200
    result = r.json()["results"][0]
    assert set(result) == {"job_id", "match_score", "verdict", "reasons", "missing_skills", "verified"}
    assert result["job_id"] == "42"
    assert 0 <= result["match_score"] <= 100


def test_score_counts_only_skills_present_in_cv():
    job = _cand("1", "Backend", "Dibutuhkan Python, FastAPI, Docker, dan Kubernetes.")
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": [job]}, headers=HEADERS)
    result = r.json()["results"][0]
    assert result["match_score"] == 50  # fastapi dan docker dari 4 skill lowongan
    assert "kubernetes" in result["missing_skills"]
    assert "python" in result["missing_skills"]  # tidak ada di CV, jadi tidak boleh dianggap cocok
    assert result["verdict"] == "kurang_cocok"


def test_every_reason_evidence_is_in_cv():
    job = _cand("1", "Backend", "FastAPI dan Docker")
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": [job]}, headers=HEADERS)
    for reason in r.json()["results"][0]["reasons"]:
        assert evidence_in_text(reason["evidence"], CV)


def test_verified_true_when_all_matched_skills_have_evidence():
    job = _cand("1", "Backend", "FastAPI dan Docker")
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": [job]}, headers=HEADERS)
    assert r.json()["results"][0]["verified"] is True


def test_skills_field_is_used_for_matching():
    job = _cand("1", skills=["Docker"])
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": [job]}, headers=HEADERS)
    assert r.json()["results"][0]["match_score"] == 100


def test_job_without_known_skills_scores_zero_with_no_reasons():
    job = _cand("1", "Lowongan", "Tidak ada keterangan teknis.")
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": [job]}, headers=HEADERS)
    result = r.json()["results"][0]
    assert result["match_score"] == 0
    assert result["reasons"] == []


def test_more_than_five_candidates_rejected():
    candidates = [_cand(str(i), "Backend", "Docker") for i in range(6)]
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": candidates}, headers=HEADERS)
    assert r.status_code == 422


def test_empty_candidates_rejected():
    r = client.post(ENDPOINT, json={"sanitized_text": CV, "candidates": []}, headers=HEADERS)
    assert r.status_code == 422


@pytest.mark.parametrize("score, expected", [
    (100, "sangat_cocok"), (85, "sangat_cocok"), (84, "cocok"), (70, "cocok"),
    (69, "cukup"), (55, "cukup"), (54, "kurang_cocok"), (0, "kurang_cocok"),
])
def test_verdict_boundaries(score, expected):
    assert verdict_for(score) == expected