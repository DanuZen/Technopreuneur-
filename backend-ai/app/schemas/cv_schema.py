from pydantic import BaseModel, Field
from typing import List, Optional


class ExperienceItem(BaseModel):
    title: str
    company: str
    start: str
    end: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    degree: str
    institution: str
    year: int


class ScoreBreakdown(BaseModel):
    struktur: int = Field(..., ge=0, le=20)
    kejelasan: int = Field(..., ge=0, le=20)
    pencapaian_terukur: int = Field(..., ge=0, le=20)
    relevansi_skill: int = Field(..., ge=0, le=20)
    kelengkapan: int = Field(..., ge=0, le=20)


class CVAnalysisOutput(BaseModel):
    summary: str
    skills: List[str]
    experiences: List[ExperienceItem]
    education: List[EducationItem]
    seniority: str = Field(..., description="intern | junior | mid | senior | lead")
    field: str
    languages: List[str] = Field(default_factory=list)
    score: int = Field(..., ge=0, le=100)
    score_breakdown: ScoreBreakdown
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]

