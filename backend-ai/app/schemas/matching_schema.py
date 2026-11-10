from pydantic import BaseModel, Field
from typing import List


class JobMatchEvaluationOutput(BaseModel):
    job_id: str
    match_score: int = Field(..., ge=0, le=100)
    reasons: List[str]
    missing_skills: List[str]
    verdict: str = Field(..., description="sangat_cocok | cocok | cukup | kurang_cocok")

