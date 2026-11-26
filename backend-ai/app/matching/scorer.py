import re
from dataclasses import dataclass, field
from typing import Optional

from app.contract.verify import evidence_in_text
from app.matching.keywords import (
    _compiled_patterns,
    extract_skills,
    label_for,
    load_skill_map,
)


@dataclass
class JobMatch:
    score: int                       # 0 sampai 100
    matched: list[str] = field(default_factory=list)
    missing: list[str] = field(default_factory=list)


def _normalize_explicit_custom_skills(explicit_skills: Optional[list[str]]) -> list[str]:
    """Ambil kata kunci eksplisit dari perusahaan yang belum terdaftar di skills.yaml."""
    if not explicit_skills:
        return []
    known_synonyms = {
        syn.lower()
        for syns in load_skill_map().values()
        for syn in syns
    } | {canon.lower() for canon in load_skill_map()}

    custom: list[str] = []
    seen: set[str] = set()
    for raw in explicit_skills:
        term = raw.strip()
        low = term.lower()
        if len(term) >= 2 and low not in known_synonyms and low not in seen:
            seen.add(low)
            custom.append(term)
    return custom


def _term_in_text(term: str, text: str) -> bool:
    pat = re.compile(
        rf"(?<![a-z0-9+#]){re.escape(term)}(?![a-z0-9+#])",
        re.IGNORECASE,
    )
    return bool(pat.search(text))


def match_cv_to_job(
    cv_text: str,
    job_text: str,
    explicit_skills: Optional[list[str]] = None,
) -> JobMatch:
    """Skor dari irisan skill kamus + kata kunci kustom eksplisit perusahaan."""
    job_skills = extract_skills(job_text)
    custom_terms = _normalize_explicit_custom_skills(explicit_skills)

    if not job_skills and not custom_terms:
        return JobMatch(score=0)

    cv_skills = extract_skills(cv_text)
    matched_canon = sorted(job_skills & cv_skills)
    missing_canon = sorted(job_skills - cv_skills)

    matched_custom = [t for t in custom_terms if _term_in_text(t, cv_text)]
    missing_custom = [t.lower() for t in custom_terms if not _term_in_text(t, cv_text)]

    matched = matched_canon + matched_custom
    missing = missing_canon + missing_custom
    total_required = len(job_skills) + len(custom_terms)
    score = round(100 * len(matched) / total_required) if total_required else 0
    return JobMatch(score=score, matched=matched, missing=missing)


def _find_evidence(skill: str, cv_text: str) -> str | None:
    """Kalimat di CV yang memuat skill kanonik maupun skill kustom eksplisit."""
    patterns = [pat for canon, pat in _compiled_patterns() if canon == skill]
    if not patterns:
        patterns = [
            re.compile(
                rf"(?<![a-z0-9+#]){re.escape(skill)}(?![a-z0-9+#])",
                re.IGNORECASE,
            )
        ]

    sentences = re.split(r"(?<=[.!?])\s+|\n+", cv_text)
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        if any(p.search(sentence) for p in patterns) and evidence_in_text(sentence, cv_text):
            return sentence[:200]
    return None


def build_reasons(cv_text: str, matched: list[str]) -> list[dict]:
    """Alasan kecocokan. Skill tanpa kutipan valid di CV tidak masuk daftar."""
    reasons = []
    for skill in matched:
        evidence = _find_evidence(skill, cv_text)
        if evidence:
            reasons.append({
                "text": f"Memiliki pengalaman dengan {label_for(skill)}",
                "evidence": evidence,
            })
    return reasons
