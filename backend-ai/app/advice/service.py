import json
import re
from typing import Literal, Optional

from pydantic import BaseModel, Field, ValidationError, field_validator

from app.advice.prompts import SYSTEM_PROMPT, build_user_prompt
from app.ats.schema import ATSCheckResult, DimensionName
from app.llm.base import LLMProvider
from app.contract.verify import normalize as _norm


class AdviceError(Exception):
    pass

class Suggestion(BaseModel):
    dimension: DimensionName
    priority: Literal["high", "medium", "low"]
    text: str = Field(min_length=10, max_length=300)
    evidence: Optional[str] = None  # kutipan persis dari CV, atau None

    @field_validator("evidence")
    @classmethod
    def _blank_to_none(cls, value: Optional[str]) -> Optional[str]:
        if value is None or not value.strip():
            return None
        return value.strip()


class CVAdvice(BaseModel):
    summary: str = Field(min_length=5, max_length=500)
    suggestions: list[Suggestion] = Field(max_length=6)
    provider: str
    is_mock: bool = False


_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def _parse(raw: str) -> dict:
    cleaned = _FENCE_RE.sub("", raw.strip()).strip()
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise AdviceError("Respons LLM bukan JSON valid") from exc
    if not isinstance(data, dict):
        raise AdviceError("Respons LLM harus berupa objek JSON")
    return data


def generate_advice(
    sanitized_text: str,
    ats: ATSCheckResult,
    provider: LLMProvider,
) -> CVAdvice:
    raw = provider.generate_json(SYSTEM_PROMPT, build_user_prompt(sanitized_text, ats))
    data = _parse(raw)

    try:
        advice = CVAdvice.model_validate({
            **data,
            "provider": provider.name,
            "is_mock": provider.name == "mock",
        })
    except ValidationError as exc:
        raise AdviceError("Respons LLM tidak sesuai skema") from exc

    advice.suggestions = _filter_unsupported(advice.suggestions, sanitized_text)
    return advice

SKILL_TERMS = {
    "python", "fastapi", "flask", "django", "node.js", "nodejs", "express",
    "react", "next.js", "tailwind", "javascript", "typescript",
    "postgresql", "mysql", "sql", "mongodb", "redis", "pgvector",
    "docker", "kubernetes", "linux", "git", "github", "aws", "gcp",
    "mlflow", "tensorflow", "pytorch", "scikit-learn", "pandas",
    "sqlalchemy", "pydantic", "rest api", "machine learning",
}


def _mentioned_skills(text: str) -> set[str]:
    lowered = text.lower()
    return {
        term for term in SKILL_TERMS
        if re.search(rf"(?<![a-z0-9]){re.escape(term)}(?![a-z0-9])", lowered)
    }


def _filter_unsupported(suggestions: list[Suggestion], cv_text: str) -> list[Suggestion]:
    cv_norm = _norm(cv_text)
    kept = []
    for s in suggestions:
        if s.evidence is None:
            # Saran tanpa kutipan hanya boleh berupa instruksi umum atau saran struktur
            kept.append(s)
        elif _norm(s.evidence) in cv_norm:
            # Kutipan harus benar-benar ada di CV
            kept.append(s)
    return kept