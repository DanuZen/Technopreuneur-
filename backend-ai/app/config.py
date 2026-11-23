import os

from dotenv import load_dotenv

# Membaca file .env di root proyek. Variabel yang sudah ada di environment tidak ditimpa.
load_dotenv()

RULES_VERSION = "1.0.0"

MIN_CHARS_TOTAL = 50
MIN_CHARS_PER_PAGE = 20

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
MAX_PAGES = 10

SUPPORTED_EXTENSIONS = {".pdf", ".docx"}

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip()
LLM_TIMEOUT_SECONDS = 60

LLM_ALLOW_MOCK = os.getenv("LLM_ALLOW_MOCK", "false").strip().lower() in {"1", "true", "yes"}

INTERNAL_TOKEN = os.getenv("INTERNAL_TOKEN", "").strip()