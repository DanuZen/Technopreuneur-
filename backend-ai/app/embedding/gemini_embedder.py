import math

from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 1536
MAX_BATCH = 100  # batas per panggilan; kecil saja untuk demo


def _normalize(vec: list[float]) -> list[float]:
    norm = math.sqrt(sum(x * x for x in vec))
    if norm == 0:
        raise ValueError("vektor nol tidak bisa dinormalisasi")
    return [x / norm for x in vec]


class GeminiEmbedder:
    def __init__(self, api_key: str = GEMINI_API_KEY):
        self._client = genai.Client(api_key=api_key, http_options={"api_version": "v1beta"})

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Satu panggilan API untuk banyak teks. Hasil selalu dinormalisasi."""
        vectors: list[list[float]] = []
        for start in range(0, len(texts), MAX_BATCH):
            batch = texts[start:start + MAX_BATCH]
            r = self._client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=batch,
                config=types.EmbedContentConfig(output_dimensionality=EMBEDDING_DIM),
            )
            for e in r.embeddings:
                if len(e.values) != EMBEDDING_DIM:
                    raise ValueError(f"dimensi {len(e.values)}, harus {EMBEDDING_DIM}")
                vectors.append(_normalize(e.values))
        return vectors