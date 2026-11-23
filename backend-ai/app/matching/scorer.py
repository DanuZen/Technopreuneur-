import re
from dataclasses import dataclass, field

from app.contract.verify import evidence_in_text
from app.matching.keywords import _compiled_patterns, extract_skills

from app.matching.keywords import _compiled_patterns, extract_skills, label_for

@dataclass
class JobMatch:
    score: int                       # 0 sampai 100
    matched: list[str] = field(default_factory=list)
    missing: list[str] = field(default_factory=list)


def match_cv_to_job(cv_text: str, job_text: str) -> JobMatch:
    """Skor dari irisan skill. Hanya skill yang tertulis di CV dihitung sebagai cocok."""
    job_skills = extract_skills(job_text)
    if not job_skills:
        # Lowongan tanpa skill yang dikenali: tidak ada dasar untuk skor
        return JobMatch(score=0)

    cv_skills = extract_skills(cv_text)
    matched = sorted(job_skills & cv_skills)
    missing = sorted(job_skills - cv_skills)
    score = round(100 * len(matched) / len(job_skills))
    return JobMatch(score=score, matched=matched, missing=missing)


def _find_evidence(skill: str, cv_text: str) -> str | None:
    """Kalimat di CV yang memuat skill. None kalau tidak ada kalimat yang bisa dikutip."""
    patterns = [pat for canon, pat in _compiled_patterns() if canon == skill]
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