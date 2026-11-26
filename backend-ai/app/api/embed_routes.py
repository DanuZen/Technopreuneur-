from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.security import require_internal_token
from app.embedding.gemini_embedder import EMBEDDING_DIM, GeminiEmbedder
from app.sanitization.sanitizer import sanitize_text

router = APIRouter(
    prefix="/internal/v1",
    tags=["embedding"],
    dependencies=[Depends(require_internal_token)],
)

MAX_BATCH_TEXTS = 50
MAX_TEXT_CHARS = 20000


class EmbedRequest(BaseModel):
    texts: list[str] = Field(min_length=1, max_length=MAX_BATCH_TEXTS)


class EmbedResponse(BaseModel):
    embeddings: list[list[float]]
    dimensions: int = EMBEDDING_DIM


@router.post("/embed", response_model=EmbedResponse)
def create_embeddings(payload: EmbedRequest) -> EmbedResponse:
    cleaned: list[str] = []
    for raw in payload.texts:
        sanitized = sanitize_text(raw[:MAX_TEXT_CHARS]).text.strip()
        if not sanitized:
            raise HTTPException(status_code=400, detail="Teks embedding tidak boleh kosong")
        cleaned.append(sanitized)

    try:
        vectors = GeminiEmbedder().embed(cleaned)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=503, detail="Layanan embedding sedang tidak tersedia")

    return EmbedResponse(embeddings=vectors, dimensions=EMBEDDING_DIM)
