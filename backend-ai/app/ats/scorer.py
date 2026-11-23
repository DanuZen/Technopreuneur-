import re
from typing import Optional

from app.ats.checks import run_document_checks
from app.ats.schema import (
    ATSCheckResult,
    ATSDimension,
    ATSIssue,
    DimensionName,
    DocumentFlags,
    Severity,
)
from app.ingestion.models import ExtractedDocument

WEIGHTS: dict[DimensionName, float] = {
    DimensionName.READABILITY: 0.25,
    DimensionName.SECTIONS: 0.20,
    DimensionName.KEYWORDS: 0.25,
    DimensionName.CONTENT: 0.20,
    DimensionName.CONTACT_LENGTH: 0.10,
}

PENALTY: dict[Severity, int] = {
    Severity.CRITICAL: 40,
    Severity.WARNING: 15,
    Severity.INFO: 5,
}

# Kamus heading dwibahasa. Nanti dipindahkan ke resources/heading_aliases.yaml.
REQUIRED_SECTIONS: dict[str, list[str]] = {
    "experience": ["pengalaman kerja", "riwayat pekerjaan", "pengalaman", "work experience", "experience"],
    "education": ["pendidikan", "riwayat pendidikan", "education"],
    "skills": ["keterampilan", "kemampuan", "keahlian", "skills"],
}

BULLET_RE = re.compile(r"^\s*[•\-\*]\s+")
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
PHONE_RE = re.compile(r"(\+62|62|0)[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}")


def _penalty_score(issues: list[ATSIssue], dimension: DimensionName) -> int:
    total = sum(PENALTY[i.severity] for i in issues if i.dimension == dimension)
    return max(0, 100 - total)


def _detect_sections(lines: list[str]) -> set[str]:
    found: set[str] = set()
    for line in lines:
        # Hapus isi kurung, misalnya "Keahlian (SKILLS)" menjadi "keahlian"
        norm = re.sub(r"\([^)]*\)", "", line).strip().rstrip(":").strip().lower()
        if not norm or len(norm) > 40:  # heading biasanya pendek
            continue
        for section, aliases in REQUIRED_SECTIONS.items():
            if any(norm.startswith(alias) for alias in aliases):
                found.add(section)
    return found


def _sections_dimension(lines: list[str]) -> tuple[int, list[str], list[ATSIssue]]:
    found = _detect_sections(lines)
    missing = set(REQUIRED_SECTIONS) - found
    score = round(100 * (len(REQUIRED_SECTIONS) - len(missing)) / len(REQUIRED_SECTIONS))

    issues = [
        ATSIssue(
            code=f"MISSING_SECTION_{name.upper()}",
            severity=Severity.WARNING,
            dimension=DimensionName.SECTIONS,
            message=f"Section {name} tidak terdeteksi. Gunakan heading standar, misalnya "
                    f"{REQUIRED_SECTIONS[name][0].title()}.",
        )
        for name in sorted(missing)
    ]
    return score, sorted(found), issues


def _content_dimension(lines: list[str]) -> tuple[int, list[ATSIssue]]:
    bullets = [line for line in lines if BULLET_RE.match(line)]
    if not bullets:
        return 40, [ATSIssue(
            code="NO_BULLET_POINTS",
            severity=Severity.INFO,
            dimension=DimensionName.CONTENT,
            message="Tidak ada poin-poin pengalaman. Gunakan bullet untuk menjabarkan pencapaian.",
        )]

    with_metric = sum(1 for b in bullets if re.search(r"\d", b))
    ratio = with_metric / len(bullets)
    score = round(100 * ratio)

    issues: list[ATSIssue] = []
    if ratio < 0.3:
        issues.append(ATSIssue(
            code="LOW_METRIC_USAGE",
            severity=Severity.WARNING,
            dimension=DimensionName.CONTENT,
            message="Sebagian besar poin tidak menyebut angka atau hasil. Tambahkan metrik jika memungkinkan.",
        ))
    return score, issues


def _keyword_dimension(text: str, jd_keywords: list[str]) -> tuple[Optional[int], list[ATSIssue]]:
    if not jd_keywords:
        return None, []

    keywords = [k.strip().lower() for k in jd_keywords if k.strip()]
    matched = [k for k in keywords if re.search(rf"\b{re.escape(k)}\b", text, re.IGNORECASE)]
    score = round(100 * len(matched) / len(keywords))

    issues: list[ATSIssue] = []
    if score < 50:
        missing = [k for k in keywords if k not in matched][:5]
        issues.append(ATSIssue(
            code="KEYWORD_GAP",
            severity=Severity.WARNING,
            dimension=DimensionName.KEYWORDS,
            message=f"Kecocokan dengan lowongan rendah. Kata kunci yang belum muncul: {', '.join(missing)}.",
        ))
    return score, issues


def evaluate_cv(doc: ExtractedDocument, jd_keywords: Optional[list[str]] = None) -> ATSCheckResult:
    text = doc.plain_text
    lines = text.splitlines()

    issues = run_document_checks(doc)

    readability = _penalty_score(issues, DimensionName.READABILITY)
    sections_score, detected, section_issues = _sections_dimension(lines)
    content_score, content_issues = _content_dimension(lines)
    keyword_score, keyword_issues = _keyword_dimension(text, jd_keywords or [])
    contact_score = _penalty_score(issues, DimensionName.CONTACT_LENGTH)

    issues = issues + section_issues + content_issues + keyword_issues

    scores: dict[DimensionName, Optional[int]] = {
        DimensionName.READABILITY: readability,
        DimensionName.SECTIONS: sections_score,
        DimensionName.KEYWORDS: keyword_score,
        DimensionName.CONTENT: content_score,
        DimensionName.CONTACT_LENGTH: contact_score,
    }

    dimensions = [
        ATSDimension(name=name, score=scores[name], weight=WEIGHTS[name])
        for name in DimensionName
    ]

    available = [d for d in dimensions if d.score is not None]
    total_weight = sum(d.weight for d in available)
    overall = round(sum(d.score * d.weight for d in available) / total_weight)

    codes = {i.code for i in issues}
    flags = DocumentFlags(
        is_scanned=doc.is_scanned,
        is_empty=doc.is_empty,
        has_multi_column="MULTI_COLUMN_LAYOUT" in codes,
        has_table=doc.has_tables,
        has_image=doc.has_images,
        has_contact_info=bool(EMAIL_RE.search(text) or PHONE_RE.search(text)),
        page_count=doc.page_count,
        char_count=doc.char_count,
    )

    return ATSCheckResult(
        overall_score=overall,
        dimensions=dimensions,
        flags=flags,
        issues=issues,
        detected_sections=detected,
    )