from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

from app.config import RULES_VERSION

WEIGHT_TOLERANCE = 0.001


class DimensionName(str, Enum):
    READABILITY = "readability"            # keterbacaan teks dan format
    SECTIONS = "sections"                  # kelengkapan section standar
    KEYWORDS = "keywords"                  # kecocokan keyword dengan lowongan
    CONTENT = "content"                    # kata kerja aksi dan metrik
    CONTACT_LENGTH = "contact_length"      # kontak dan panjang dokumen


class Severity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class ATSIssue(BaseModel):
    code: str = Field(
        pattern=r"^[A-Z][A-Z0-9_]+$",
        description="Kode stabil untuk frontend dan tes, misalnya SCANNED_PDF",
    )
    severity: Severity
    dimension: DimensionName
    message: str = Field(description="Pesan untuk pengguna, dalam Bahasa Indonesia")


class ATSDimension(BaseModel):
    name: DimensionName
    # None berarti dimensi tidak dihitung, misalnya KEYWORDS saat tidak ada lowongan
    score: Optional[int] = Field(default=None, ge=0, le=100)
    weight: float = Field(ge=0, le=1)


class DocumentFlags(BaseModel):
    is_scanned: bool = False
    is_empty: bool = False
    has_multi_column: bool = False
    has_table: bool = False
    has_image: bool = False
    has_contact_info: bool = False
    page_count: int = 0
    char_count: int = 0

class SanitizationSummary(BaseModel):
    removed_categories: list[str] = Field(default_factory=list)
    removed_lines: int = Field(default=0, ge=0)

class ATSCheckResult(BaseModel):
    overall_score: Optional[int] = Field(default=None, ge=0, le=100)
    general_skill_score: int = Field(default=75, ge=0, le=100)
    dimensions: list[ATSDimension]
    flags: DocumentFlags
    issues: list[ATSIssue] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    detected_sections: list[str] = Field(default_factory=list)
    is_estimate: Literal[True] = True   # selalu True: ini heuristik, bukan jaminan lolos ATS
    rules_version: str = RULES_VERSION
    sanitization: SanitizationSummary = Field(default_factory=SanitizationSummary)

    @model_validator(mode="after")
    def check_dimensions(self) -> "ATSCheckResult":
        names = [d.name for d in self.dimensions]
        if set(names) != set(DimensionName) or len(names) != len(DimensionName):
            raise ValueError("dimensions harus berisi tepat lima dimensi, tanpa duplikat")

        total_weight = sum(d.weight for d in self.dimensions)
        if abs(total_weight - 1.0) > WEIGHT_TOLERANCE:
            raise ValueError(f"total bobot harus 1.0, saat ini {total_weight:.3f}")

        return self