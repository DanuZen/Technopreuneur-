from pydantic import BaseModel, Field


class JobRecord(BaseModel):
    source: str = Field(min_length=1, max_length=32)
    external_id: str = Field(min_length=1, max_length=128)
    title: str = Field(min_length=2, max_length=300)
    company: str | None = None
    location: str | None = None
    remote: bool = False
    description: str = Field(min_length=1)
    url: str | None = None
    posted_at: str | None = None  # ISO 8601, UTC