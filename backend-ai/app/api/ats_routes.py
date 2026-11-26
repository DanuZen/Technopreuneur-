import tempfile
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

from app.advice.service import CVAdvice
from app.api.security import require_internal_token
from app.ats.schema import ATSCheckResult
from app.config import MAX_FILE_SIZE_BYTES, SUPPORTED_EXTENSIONS
from app.ingestion.dispatcher import UnsupportedFileError, extract
from app.llm.gemini_provider import get_provider
from app.pipeline import analyze_document, build_advice

router = APIRouter(
    prefix="/internal/v1/cv",
    tags=["cv"],
    dependencies=[Depends(require_internal_token)],
)

class AdviceResponse(BaseModel):
    ats: ATSCheckResult
    advice: Optional[CVAdvice] = None
    advice_error: Optional[str] = None

@router.post("/advice", response_model=AdviceResponse)
async def cv_advice(
    file: UploadFile = File(...),
    jd_keywords: Optional[str] = Form(default=None),
) -> AdviceResponse:
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

    ats, advice, error = await run_in_threadpool(
        build_advice, doc, get_provider(), keywords
    )
    return AdviceResponse(ats=ats, advice=advice, advice_error=error)

@router.post("/ats-check", response_model=ATSCheckResult)
async def ats_check(
    file: UploadFile = File(...),
    jd_keywords: Optional[str] = Form(default=None, description="Kata kunci dipisah koma, opsional"),
) -> ATSCheckResult:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Format tidak didukung: {suffix or 'tanpa ekstensi'}",
        )

    # Baca maksimal batas + 1 byte untuk mendeteksi file yang terlalu besar
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
        # PDF rusak atau tidak bisa dibuka oleh library
        raise HTTPException(status_code=422, detail="File tidak bisa dibaca. Pastikan file tidak rusak.")
    finally:
        tmp_path.unlink(missing_ok=True)

    return analyze_document(doc, jd_keywords=keywords).ats