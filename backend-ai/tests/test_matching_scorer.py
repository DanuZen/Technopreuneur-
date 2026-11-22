from app.matching.scorer import match_cv_to_job

CV = "Membangun REST API dengan FastAPI dan PostgreSQL. Menggunakan Docker."
JOB = "Dibutuhkan Python, FastAPI, Docker, dan Kubernetes."


def test_score_counts_only_job_skills_present_in_cv():
    result = match_cv_to_job(CV, JOB)
    assert "fastapi" in result.matched
    assert "docker" in result.matched
    assert "kubernetes" in result.missing
    assert "python" in result.missing  # tidak ada di CV, jadi tidak boleh dianggap cocok


def test_no_skill_in_job_gives_zero_not_error():
    result = match_cv_to_job(CV, "Lowongan tanpa keterangan teknis.")
    assert result.score == 0
    assert result.matched == []


def test_full_match_gives_100():
    result = match_cv_to_job("Python dan Docker", "Python, Docker")
    assert result.score == 100
    assert result.missing == []


def test_score_is_within_range():
    result = match_cv_to_job(CV, JOB)
    assert 0 <= result.score <= 100