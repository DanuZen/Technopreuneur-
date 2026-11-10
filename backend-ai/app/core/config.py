from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    DEBUG: bool = True

    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    DEFAULT_LLM_MODEL: str = "gpt-4o-mini"
    DEFAULT_EMBEDDING_MODEL: str = "text-embedding-3-small"

    DATABASE_URL: Optional[str] = None
    JOOBLE_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

