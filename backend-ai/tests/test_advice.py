import json

import pytest

from app.advice.prompts import SYSTEM_PROMPT, build_user_prompt
from app.advice.service import AdviceError, Suggestion, _filter_unsupported, generate_advice
from app.ats.schema import DimensionName
from app.ats.scorer import evaluate_cv
from app.ingestion.models import ExtractedDocument, TextBlock
from app.llm.mock_provider import MockLLMProvider
from app.pipeline import analyze_document


class FixedProvider:
    name = "fake"

    def __init__(self, payload: str):
        self.payload = payload

    def generate_json(self, system_prompt: str, user_prompt: str) -> str:
        return self.payload


def _ats(lines: list[str]):
    doc = ExtractedDocument(blocks=[TextBlock(text=t, page=1) for t in lines], page_count=1)
    return evaluate_cv(doc)


def _s(text, evidence=None, dimension=DimensionName.CONTENT):
    return Suggestion(dimension=dimension, priority="high", text=text, evidence=evidence)


VALID = {
    "summary": "CV perlu perbaikan pada section dan keyword.",
    "suggestions": [
        {"dimension": "sections", "priority": "high",
         "text": "Tambahkan section Pengalaman Kerja dengan heading standar."},
    ],
}


# --- Layanan dan provider mock ---

def test_mock_provider_returns_valid_advice():
    ats = _ats(["Budi", "budi@example.com"])
    advice = generate_advice("Budi\nbudi@example.com", ats, MockLLMProvider())
    assert advice.is_mock is True
    assert advice.provider == "mock"
    assert advice.suggestions


def test_mock_suggestions_follow_issues():
    ats = _ats(["Budi", "budi@example.com"])
    advice = generate_advice("Budi\nbudi@example.com", ats, MockLLMProvider())
    dimensions = {s.dimension.value for s in advice.suggestions}
    assert "sections" in dimensions


# --- Parsing dan validasi respons LLM ---

def test_strips_markdown_fences():
    payload = "```json\n" + json.dumps(VALID) + "\n```"
    advice = generate_advice("x", _ats(["x"]), FixedProvider(payload))
    assert advice.summary == VALID["summary"]


def test_invalid_json_raises():
    with pytest.raises(AdviceError):
        generate_advice("x", _ats(["x"]), FixedProvider("bukan json"))


def test_non_object_json_raises():
    with pytest.raises(AdviceError):
        generate_advice("x", _ats(["x"]), FixedProvider("[1, 2, 3]"))


def test_unknown_dimension_rejected():
    payload = json.dumps({
        "summary": "Ringkasan cukup panjang.",
        "suggestions": [{"dimension": "looks", "priority": "high", "text": "Saran yang cukup panjang."}],
    })
    with pytest.raises(AdviceError):
        generate_advice("x", _ats(["x"]), FixedProvider(payload))


def test_too_many_suggestions_rejected():
    suggestion = {"dimension": "content", "priority": "low", "text": "Saran yang cukup panjang."}
    payload = json.dumps({"summary": "Ringkasan cukup panjang.", "suggestions": [suggestion] * 7})
    with pytest.raises(AdviceError):
        generate_advice("x", _ats(["x"]), FixedProvider(payload))


# --- Prompt dan sanitasi ---

def test_system_prompt_forbids_demographics():
    assert "usia" in SYSTEM_PROMPT.lower()
    assert "jenis kelamin" in SYSTEM_PROMPT.lower()


def test_cv_text_is_delimited():
    ats = _ats(["x"])
    prompt = build_user_prompt("Budi", ats)
    assert "<cv>" in prompt and "</cv>" in prompt


def test_sensitive_value_never_reaches_prompt():
    doc = ExtractedDocument(
        blocks=[
            TextBlock(text="Budi Santoso", page=1),
            TextBlock(text="Tanggal Lahir: 12 Maret 1999", page=1),
            TextBlock(text="budi@example.com", page=1),
        ],
        page_count=1,
    )
    out = analyze_document(doc)
    prompt = build_user_prompt(out.sanitized_text, out.ats)
    assert "12 Maret 1999" not in prompt
    assert "budi@example.com" in prompt


# --- Filter evidence ---

def test_suggestion_with_evidence_found_in_cv_is_kept():
    cv = "Membangun API backend dengan Python dan Docker."
    kept = _filter_unsupported(
        [_s("Perjelas peran Anda di proyek API.", evidence="Membangun API backend dengan Python")],
        cv,
    )
    assert len(kept) == 1


def test_suggestion_with_fabricated_evidence_is_dropped():
    cv = "Membangun API backend dengan Python."
    kept = _filter_unsupported(
        [_s("Tambahkan detail PostgreSQL.", evidence="pengalaman PostgreSQL 3 tahun")],
        cv,
    )
    assert kept == []


def test_structural_suggestion_without_evidence_is_kept():
    cv = "Budi\nbudi@example.com"
    kept = _filter_unsupported(
        [_s("Tambahkan section Pendidikan.", dimension=DimensionName.SECTIONS)],
        cv,
    )
    assert len(kept) == 1


def test_whitespace_and_case_differences_are_tolerated():
    cv = "Membangun   API\nbackend dengan Python"
    kept = _filter_unsupported([_s("Perjelas peran.", evidence="membangun api backend")], cv)
    assert len(kept) == 1


def test_generate_advice_drops_fabricated_evidence():
    payload = json.dumps({
        "summary": "Ringkasan cukup panjang.",
        "suggestions": [
            {"dimension": "content", "priority": "high",
             "text": "Tambahkan detail PostgreSQL di proyek.",
             "evidence": "pengalaman PostgreSQL 3 tahun"},
            {"dimension": "content", "priority": "high",
             "text": "Perjelas peran di proyek API.",
             "evidence": "Membangun API backend dengan Python"},
        ],
    })
    cv = "Membangun API backend dengan Python."
    advice = generate_advice(cv, _ats([cv]), FixedProvider(payload))
    texts = [s.text for s in advice.suggestions]
    assert len(texts) == 1
    assert "API" in texts[0]