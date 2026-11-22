"""Uji satu embedding: cek dimensi dan normalisasi. Tidak menyimpan apa pun."""
import math

from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY

MODEL = "gemini-embedding-001"
DIM = 1536


def main() -> None:
    client = genai.Client(api_key=GEMINI_API_KEY, http_options={"api_version": "v1beta"})
    r = client.models.embed_content(
        model=MODEL,
        contents=["Membangun API backend dengan Python dan FastAPI"],
        config=types.EmbedContentConfig(output_dimensionality=DIM),
    )
    vec = r.embeddings[0].values
    print("dimensi:", len(vec))

    norm = math.sqrt(sum(x * x for x in vec))
    print("panjang sebelum normalisasi:", round(norm, 4))

    vec = [x / norm for x in vec]
    print("panjang setelah normalisasi:", round(math.sqrt(sum(x * x for x in vec)), 4))


if __name__ == "__main__":
    main()