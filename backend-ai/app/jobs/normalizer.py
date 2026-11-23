import datetime as dt
import html
import re

from app.jobs.schema import JobRecord

SOURCE = "arbeitnow"
MAX_DESCRIPTION_CHARS = 20000


def clean_text(raw: str | None) -> str:
    """Buka escape HTML, hapus tag, rapikan spasi. Deskripsi dibatasi panjangnya."""
    text = html.unescape(raw or "")
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:MAX_DESCRIPTION_CHARS]


def _iso_from_epoch(value) -> str | None:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return dt.datetime.fromtimestamp(value, tz=dt.timezone.utc).isoformat()


def normalize_arbeitnow(item: dict) -> JobRecord | None:
    """Satu item Arbeitnow ke JobRecord. None jika data wajib kosong."""
    slug = str(item.get("slug") or "").strip()
    title = str(item.get("title") or "").strip()
    description = clean_text(item.get("description"))
    if not slug or len(title) < 2 or not description:
        return None
    return JobRecord(
        source=SOURCE,
        external_id=slug,
        title=title,
        company=item.get("company_name") or None,
        location=item.get("location") or None,
        remote=bool(item.get("remote")),
        description=description,
        url=item.get("url") or None,
        posted_at=_iso_from_epoch(item.get("created_at")),
    )


def normalize_many(payload: dict) -> list[JobRecord]:
    records = []
    for item in payload.get("data") or []:
        record = normalize_arbeitnow(item)
        if record is not None:
            records.append(record)
    return records