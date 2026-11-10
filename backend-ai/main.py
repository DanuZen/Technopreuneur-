from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title="CareerMatch AI — AI & Recommendation Engine",
    description="Service AI untuk ekstraksi CV, scoring, profiling terstruktur, dan matching lowongan 2-tahap.",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "backend-ai",
        "version": "1.0.0",
        "lead": "Florensius Panca Gati (23343006)"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

