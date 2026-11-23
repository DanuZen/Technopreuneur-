from app.contract.verify import evidence_in_text
from app.matching.scorer import build_reasons, match_cv_to_job

CV = (
    "Membangun REST API dengan FastAPI dan PostgreSQL. "
    "Menggunakan Docker untuk deployment. "
    "Tertarik pada kecerdasan buatan."
)
JOB = "Dibutuhkan Python, FastAPI, Docker, dan Kubernetes."


def test_every_reason_evidence_is_in_cv():
    result = match_cv_to_job(CV, JOB)
    for reason in build_reasons(CV, result.matched):
        assert evidence_in_text(reason["evidence"], CV)


def test_reason_only_for_matched_skill():
    result = match_cv_to_job(CV, JOB)
    reasons = build_reasons(CV, result.matched)
    texts = " ".join(r["text"] for r in reasons)
    assert "kubernetes" not in texts
    assert "python" not in texts  # Python tidak ada di CV, jadi tidak boleh dicantumkan


def test_no_evidence_no_reason():
    reasons = build_reasons("Tertarik pada desain grafis.", ["fastapi"])
    assert reasons == []


def test_evidence_is_a_single_sentence():
    reasons = build_reasons(CV, ["fastapi"])
    assert reasons
    assert "Docker" not in reasons[0]["evidence"]