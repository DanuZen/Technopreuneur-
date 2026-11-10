from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.extractor import DocumentExtractor

api_router = APIRouter()


@api_router.post("/extract-cv", summary="Ekstrak teks dari file CV (.pdf/.docx)")
async def extract_cv_text(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nama file tidak valid.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file melebihi batas maksimal 5 MB.")

    try:
        text = DocumentExtractor.extract_text(file.filename, contents)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses dokumen: {str(e)}")

    if not text.strip():
        return {
            "status": "warning",
            "is_empty": True,
            "message": "Dokumen terbaca kosong. CV Anda terdeteksi sebagai scan gambar. Silakan unggah dokumen PDF/DOCX teks digital.",
            "extracted_text": ""
        }

    return {
        "status": "success",
        "is_empty": False,
        "filename": file.filename,
        "char_count": len(text),
        "extracted_text": text
    }


@api_router.post("/generate-embedding", summary="Buat vektor embedding teks")
async def generate_embedding(payload: dict):
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Parameter 'text' wajib diisi.")
    # Endpoint stub untuk menghasilkan embedding
    return {
        "status": "success",
        "embedding_length": 1536,
        "note": "Hubungkan dengan embedding model provider di app/services"
    }

