import tempfile
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.api.security import require_internal_token
from app.config import MAX_FILE_SIZE_BYTES, SUPPORTED_EXTENSIONS
from app.contract.schemas import AnalyzeResponse
from app.embedding.gemini_embedder import GeminiEmbedder
from app.ingestion.dispatcher import UnsupportedFileError, extract
from app.llm.gemini_provider import get_provider
from app.pipeline import analyze_document, build_advice

router = APIRouter(
    prefix="/internal/v1/cv",
    tags=["cv"],
    dependencies=[Depends(require_internal_token)],
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
        doc = extract(tmp_path)
    except UnsupportedFileError as exc:
        raise HTTPException(status_code=415, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=422, detail="File tidak bisa dibaca. Pastikan file tidak rusak.")
    finally:
        tmp_path.unlink(missing_ok=True)

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

    return AnalyzeResponse(
        ats=out.ats.model_dump(mode="json"),
        advice=advice.model_dump(mode="json") if advice else None,
        advice_status=advice_status,
        advice_message=advice_error,
        cv_embedding=cv_embedding,
        sanitized_text=out.sanitized_text,
    )