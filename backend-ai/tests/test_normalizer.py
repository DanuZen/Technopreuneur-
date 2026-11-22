import json
from pathlib import Path

from app.jobs.normalizer import clean_text, normalize_many

FIXTURE = Path(__file__).parent / "fixtures" / "arbeitnow_sample.json"


def _jobs():
    return normalize_many(json.loads(FIXTURE.read_text(encoding="utf-8")))


def _by_id(jobs, external_id):
    return next(j for j in jobs if j.external_id == external_id)


def test_item_without_title_is_dropped():
    ids = [j.external_id for j in _jobs()]
    assert "contoh-tanpa-judul" not in ids


def test_html_is_unescaped_and_stripped():
    job = _by_id(_jobs(), "contoh-backend-engineer-1")
    assert "<" not in job.description
    assert "&lt;" not in job.description
    assert "Membangun REST API dengan Python dan FastAPI." in job.description


def test_epoch_becomes_iso_utc():
    job = _by_id(_jobs(), "contoh-backend-engineer-1")
    assert job.posted_at is not None
    assert job.posted_at.startswith("2026-")
    assert job.posted_at.endswith("+00:00")


def test_null_created_at_gives_none():
    job = _by_id(_jobs(), "contoh-data-analyst-3")
    assert job.posted_at is None


def test_remote_flag_preserved():
    assert _by_id(_jobs(), "contoh-backend-engineer-1").remote is True
    assert _by_id(_jobs(), "contoh-data-analyst-3").remote is False


def test_clean_text_length_is_capped():
    assert len(clean_text("x" * 30000)) <= 20000