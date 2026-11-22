from dataclasses import dataclass
from typing import Optional

from app.ats.schema import ATSCheckResult, SanitizationSummary
from app.ats.scorer import evaluate_cv
from app.ingestion.models import ExtractedDocument
from app.sanitization.sanitizer import sanitize_text

from app.advice.service import AdviceError, CVAdvice, generate_advice
from app.llm.base import LLMProvider
from google.genai.errors import ClientError

import logging

logger = logging.getLogger(__name__)

@dataclass
class AnalysisOutput:
    ats: ATSCheckResult      # dikirim ke klien
    sanitized_text: str      # hanya untuk tahap LLM, tidak pernah dikembalikan ke klien


def analyze_document(
    doc: ExtractedDocument,
    jd_keywords: Optional[list[str]] = None,
) -> AnalysisOutput:
    sanitized = sanitize_text(doc.plain_text)
    ats = evaluate_cv(doc, jd_keywords=jd_keywords or [])
    ats.sanitization = SanitizationSummary(
        removed_categories=sanitized.report.removed_categories,
        removed_lines=sanitized.report.removed_lines,
    )
    return AnalysisOutput(ats=ats, sanitized_text=sanitized.text)

def build_advice(
    doc: ExtractedDocument,
    provider: LLMProvider,
    jd_keywords: Optional[list[str]] = None,
    analysis: Optional[AnalysisOutput] = None,
) -> tuple[ATSCheckResult, Optional[CVAdvice], Optional[str]]:
    out = analysis or analyze_document(doc, jd_keywords=jd_keywords)
    try:
        advice = generate_advice(out.sanitized_text, out.ats, provider)
        return out.ats, advice, None
    except ClientError as exc:
        code = getattr(exc, "code", None)
        if code == 429:
            return out.ats, None, "Kuota layanan saran sudah habis untuk hari ini. Coba lagi nanti."
        logger.error("Provider LLM menolak permintaan: kode=%s", code)
        return out.ats, None, "Layanan saran sedang tidak tersedia. Coba lagi nanti."
    except AdviceError as exc:
        return out.ats, None, str(exc)
    except Exception:
        # Detail error hanya masuk ke log server, tidak ke respons klien
        logger.exception("Gagal memanggil provider LLM")
        return out.ats, None, "Layanan saran sedang tidak tersedia. Coba lagi nanti."