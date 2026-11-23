import logging
import time

from google import genai
from google.genai import types
from google.genai.errors import ServerError

from app.config import GEMINI_API_KEY, GEMINI_MODEL, LLM_ALLOW_MOCK, LLM_TIMEOUT_SECONDS
from app.llm.fallback import FallbackProvider

logger = logging.getLogger(__name__)

MAX_ATTEMPTS = 3


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

    def generate_json(self, system_prompt: str, user_prompt: str) -> str:
        last_error = None
        for attempt in range(MAX_ATTEMPTS):
            try:
                response = self._client.models.generate_content(
                    model=self._model,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        response_mime_type="application/json",
                        temperature=0.2,
                    ),
                )
                return response.text or ""
            except ServerError as exc:
                # 5xx bersifat sementara: coba lagi. Pesan dari server tidak dicatat, hanya kodenya.
                last_error = exc
                logger.warning(
                    "Gemini sibuk (percobaan %d/%d), kode=%s",
                    attempt + 1, MAX_ATTEMPTS, getattr(exc, "code", "?"),
                )
                if attempt < MAX_ATTEMPTS - 1:
                    time.sleep(10 * (attempt + 1))  # 10 lalu 20 detik # 3 lalu 6 detik
        raise last_error


def get_provider() -> FallbackProvider:
    chain = []
    if GEMINI_API_KEY:
        chain.append(GeminiProvider(GEMINI_API_KEY, GEMINI_MODEL))
    if not chain and LLM_ALLOW_MOCK:
        from app.llm.mock_provider import MockLLMProvider
        chain.append(MockLLMProvider())
    return FallbackProvider(chain)