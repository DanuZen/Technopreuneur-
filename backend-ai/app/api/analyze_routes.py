import tempfile
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field

from app.api.security import require_internal_token
from app.config import MAX_FILE_SIZE_BYTES, SUPPORTED_EXTENSIONS
from app.contract.schemas import AnalyzeResponse
from app.embedding.gemini_embedder import GeminiEmbedder
from app.ingestion.dispatcher import UnsupportedFileError, extract
from app.ingestion.models import ExtractedDocument, TextBlock
from app.llm.gemini_provider import get_provider
from app.pipeline import analyze_document, build_advice
from app.profile.extractor import extract_structured_profile

router = APIRouter(
    prefix="/internal/v1/cv",
    tags=["cv"],
    dependencies=[Depends(require_internal_token)],
)


class AnalyzeTextRequest(BaseModel):
    text: str = Field(min_length=1, max_length=30000)
    jd_keywords: list[str] = Field(default_factory=list, max_length=50)


def _run_full_analysis(doc: ExtractedDocument, keywords: list[str]) -> AnalyzeResponse:
    out = analyze_document(doc, jd_keywords=keywords)

    # Saran: kegagalan LLM tidak menggagalkan hasil ATS
    _, advice, advice_error = build_advice(
        doc, get_provider(), jd_keywords=keywords, analysis=out
    )

    advice_status = "ok" if advice else (
        "quota_exhausted"
        if advice_error and "Kuota" in advice_error
        else "unavailable"
    )

    # Embedding CV dari teks yang sudah disanitasi, bukan teks asli
    try:
        cv_embedding = GeminiEmbedder().embed([out.sanitized_text])[0]
    except Exception:
        raise HTTPException(status_code=503, detail="Layanan embedding sedang tidak tersedia")

    profile = extract_structured_profile(out.sanitized_text)

    return AnalyzeResponse(
        ats=out.ats.model_dump(mode="json"),
        advice=advice.model_dump(mode="json") if advice else None,
        advice_status=advice_status,
        advice_message=advice_error,
        cv_embedding=cv_embedding,
        sanitized_text=out.sanitized_text,
        profile=profile.model_dump(mode="json"),
        strengths=out.ats.strengths,
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    file: UploadFile = File(...),
    jd_keywords: Optional[str] = Form(default=None),
) -> AnalyzeResponse:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=415, detail=f"Format tidak didukung: {suffix or 'tanpa ekstensi'}")

    content = await file.read(MAX_FILE_SIZE_BYTES + 1)
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="Ukuran file melebihi 5 MB")
    if not content:
        raise HTTPException(status_code=400, detail="File kosong")

    keywords = [k.strip() for k in jd_keywords.split(",") if k.strip()] if jd_keywords else []

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    try:
        doc = await run_in_threadpool(extract, tmp_path)
    except UnsupportedFileError as exc:
        raise HTTPException(status_code=415, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=422, detail="File tidak bisa dibaca. Pastikan file tidak rusak.")
    finally:
        tmp_path.unlink(missing_ok=True)

    return await run_in_threadpool(_run_full_analysis, doc, keywords)


@router.post("/analyze-text", response_model=AnalyzeResponse)
def analyze_text(payload: AnalyzeTextRequest) -> AnalyzeResponse:
    lines = [line.strip() for line in payload.text.splitlines() if line.strip()]
    if not lines:
        raise HTTPException(status_code=400, detail="Teks CV tidak boleh kosong")

    doc = ExtractedDocument(
        blocks=[TextBlock(text=line, page=1, region="body") for line in lines],
        page_count=1,
        font_count=1,
        is_empty=False,
    )
    keywords = [k.strip() for k in payload.jd_keywords if k and k.strip()]
    return _run_full_analysis(doc, keywords)
