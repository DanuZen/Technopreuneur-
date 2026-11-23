from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.api.security import require_internal_token
from app.contract.schemas import ReasonOut, Stage2Response, Stage2Result
from app.matching.scorer import build_reasons, match_cv_to_job

router = APIRouter(
    prefix="/internal/v1/match",
    tags=["match"],
    dependencies=[Depends(require_internal_token)],
)

MAX_CANDIDATES = 5
MAX_CV_CHARS = 30000
MAX_DESCRIPTION_CHARS = 20000


class CandidateIn(BaseModel):
    job_id: str = Field(min_length=1, max_length=64)
    title: str = Field(default="", max_length=300)
    description: str = Field(default="", max_length=MAX_DESCRIPTION_CHARS)
    skills: list[str] = Field(default_factory=list, max_length=50)


class Stage2Request(BaseModel):
    sanitized_text: str = Field(min_length=1, max_length=MAX_CV_CHARS)
    candidates: list[CandidateIn] = Field(min_length=1, max_length=MAX_CANDIDATES)


def verdict_for(score: int) -> str:
    if score >= 85:
        return "sangat_cocok"
    if score >= 70:
        return "cocok"
    if score >= 55:
        return "cukup"
    return "kurang_cocok"


@router.post("/stage2", response_model=Stage2Response)
def match_stage2(payload: Stage2Request) -> Stage2Response:
    results = []
    for cand in payload.candidates:
        job_text = " ".join([cand.title, cand.description, " ".join(cand.skills)])
        m = match_cv_to_job(payload.sanitized_text, job_text)
        reasons = build_reasons(payload.sanitized_text, m.matched)
        results.append(Stage2Result(
            job_id=cand.job_id,
            match_score=m.score,
            verdict=verdict_for(m.score),
            reasons=[ReasonOut(**r) for r in reasons],
            missing_skills=m.missing,
            # verified = true hanya jika setiap skill yang cocok punya kutipan valid
            verified=len(reasons) == len(m.matched),
        ))
    return Stage2Response(results=results)