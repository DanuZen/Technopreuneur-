from fastapi import FastAPI

from app.api.ats_routes import router as ats_router
from app.api.match_routes import router as match_router
from app.config import RULES_VERSION
from app.api.analyze_routes import router as analyze_router

app = FastAPI(title="CareerMatch AI Backend", version="0.1.0")

app.include_router(ats_router)
app.include_router(match_router)
app.include_router(analyze_router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "rules_version": RULES_VERSION}