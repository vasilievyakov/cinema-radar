"""
FastAPI application entry point.
"""

import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.settings import get_settings
from services.api.app.routers import movies, signals, stats, admin

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    yield
    # Shutdown


app = FastAPI(
    title="Cinema Radar API",
    description="Russian cinema market intelligence API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(movies.router, prefix="/movies", tags=["movies"])
app.include_router(signals.router, prefix="/signals", tags=["signals"])
app.include_router(stats.router, prefix="/stats", tags=["stats"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Cinema Radar API",
        "version": "0.1.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run(
        "services.api.app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
