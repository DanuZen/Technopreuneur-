import logging
import time

from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError

from app.config import GEMINI_API_KEY, GEMINI_MODEL, LLM_ALLOW_MOCK, LLM_TIMEOUT_SECONDS
from app.llm.fallback import FallbackProvider

logger = logging.getLogger(__name__)

MAX_ATTEMPTS = 3
FALLBACK_GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"]


class GeminiProvider:
    name = "gemini"

    def __init__(self, api_key: str, model: str):
        self._client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                api_version="v1beta",
                timeout=LLM_TIMEOUT_SECONDS * 1000,  # SDK memakai milidetik
            ),
        )
        self._model = model

    def _call_model(self, model_name: str, system_prompt: str, user_prompt: str) -> str:
        response = self._client.models.generate_content(
            model=model_name,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
        return response.text or ""

    def generate_json(self, system_prompt: str, user_prompt: str) -> str:
        models_to_try = [self._model] + [
            m for m in FALLBACK_GEMINI_MODELS if m != self._model
        ]
        last_error: Exception | None = None

        for model_name in models_to_try:
            for attempt in range(MAX_ATTEMPTS):
                try:
                    return self._call_model(model_name, system_prompt, user_prompt)
                except ClientError as exc:
                    code = getattr(exc, "code", None)
                    # Jika nama model belum tersedia (404), otomatis coba model fallback resmi
                    if code == 404:
                        last_error = exc
                        logger.warning("Model %s tidak ditemukan (404), mencoba fallback.", model_name)
                        break
                    raise
                except ServerError as exc:
                    last_error = exc
                    logger.warning(
                        "Gemini sibuk (percobaan %d/%d), kode=%s",
                        attempt + 1, MAX_ATTEMPTS, getattr(exc, "code", "?"),
                    )
                    if attempt < MAX_ATTEMPTS - 1:
                        time.sleep(2 * (attempt + 1))
        if last_error:
            raise last_error
        raise RuntimeError("Tidak ada model Gemini yang berhasil dipanggil")


def get_provider() -> FallbackProvider:
    chain = []
    if GEMINI_API_KEY:
        chain.append(GeminiProvider(GEMINI_API_KEY, GEMINI_MODEL))
    if not chain and LLM_ALLOW_MOCK:
        from app.llm.mock_provider import MockLLMProvider
        chain.append(MockLLMProvider())
    return FallbackProvider(chain)