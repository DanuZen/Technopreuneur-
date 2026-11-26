from typing import Literal

from pydantic import BaseModel, Field

Verdict = Literal["sangat_cocok", "cocok", "cukup", "kurang_cocok"]


class ReasonOut(BaseModel):
    text: str
    evidence: str = Field(min_length=1)


class Stage2Result(BaseModel):
    job_id: str
    match_score: int = Field(ge=0, le=100)
    verdict: Verdict
    reasons: list[ReasonOut]
    missing_skills: list[str]
    verified: bool


class Stage2Response(BaseModel):
    results: list[Stage2Result]

class AnalyzeResponse(BaseModel):
    ats: dict
    advice: dict | None = None
    advice_status: Literal["ok", "unavailable", "quota_exhausted"]
    advice_message: str | None = None
    cv_embedding: list[float] = Field(min_length=1536, max_length=1536)
    sanitized_text: str
    profile: dict | None = None
    strengths: list[str] = Field(default_factory=list)