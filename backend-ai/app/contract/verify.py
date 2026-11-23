import re
from typing import Iterable

EMBEDDING_DIM = 1536


def normalize(text: str) -> str:
    """Huruf kecil dan spasi dirapikan. Dipakai untuk membandingkan kutipan dengan teks CV."""
    return re.sub(r"\s+", " ", text.lower()).strip()


def evidence_in_text(evidence: str, text: str) -> bool:
    """True jika kutipan benar-benar ada di teks, setelah normalisasi."""
    if not evidence or not evidence.strip():
        return False
    return normalize(evidence) in normalize(text)


def verify_reasons(reasons: Iterable[dict], cv_text: str) -> list[dict]:
    """Hanya alasan yang kutipannya ada di CV yang dikembalikan."""
    return [r for r in reasons if evidence_in_text(r.get("evidence", ""), cv_text)]


def check_embedding_dim(vector: list[float]) -> bool:
    return len(vector) == EMBEDDING_DIM