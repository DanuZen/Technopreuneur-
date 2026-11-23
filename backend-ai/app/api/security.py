import secrets

from fastapi import Header, HTTPException

from app.config import INTERNAL_TOKEN


def require_internal_token(x_internal_token: str = Header(default="")) -> None:
    if not INTERNAL_TOKEN:
        raise HTTPException(status_code=503, detail="INTERNAL_TOKEN belum dikonfigurasi")
    if not secrets.compare_digest(x_internal_token, INTERNAL_TOKEN):
        raise HTTPException(status_code=401, detail="unauthorized")