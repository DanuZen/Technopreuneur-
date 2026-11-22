import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.contract.schemas import Stage2Response, Stage2Result
from app.contract.verify import evidence_in_text
from app.main import app

EXAMPLES = Path(__file__).resolve().parents[1] / "docs" / "contract" / "examples"
TEST_TOKEN = "token-uji-untuk-pytest"


def _load(name: str) -> dict:
    return json.loads((EXAMPLES / name).read_text(encoding="utf-8"))


@pytest.fixture
def client(monkeypatch):
    import app.api.security as sec
    monkeypatch.setattr(sec, "INTERNAL_TOKEN", TEST_TOKEN)
    return TestClient(app)


def test_example_response_matches_schema():
    Stage2Response.model_validate(_load("stage2_response.json"))


def test_live_endpoint_matches_example_response(client):
    req = _load("stage2_request.json")
    r = client.post(
        "/internal/v1/match/stage2",
        json=req,
        headers={"X-Internal-Token": TEST_TOKEN},
    )
    assert r.status_code == 200
    expected = _load("stage2_response.json")
    assert r.json() == expected


def test_every_example_reason_is_verifiable():
    example = _load("stage2_response.json")
    cv = _load("stage2_request.json")["sanitized_text"]
    for result in example["results"]:
        for reason in result["reasons"]:
            assert evidence_in_text(reason["evidence"], cv)


def test_score_out_of_range_rejected():
    bad = _load("stage2_response.json")
    bad["results"][0]["match_score"] = 150
    with pytest.raises(ValidationError):
        Stage2Response.model_validate(bad)


def test_unknown_verdict_rejected():
    bad = _load("stage2_response.json")
    bad["results"][0]["verdict"] = "luar_biasa"
    with pytest.raises(ValidationError):
        Stage2Response.model_validate(bad)


def test_missing_field_rejected():
    bad = _load("stage2_response.json")
    del bad["results"][0]["verified"]
    with pytest.raises(ValidationError):
        Stage2Response.model_validate(bad)


def test_empty_evidence_rejected():
    bad = _load("stage2_response.json")
    bad["results"][0]["reasons"][0]["evidence"] = ""
    with pytest.raises(ValidationError):
        Stage2Result.model_validate(bad["results"][0])