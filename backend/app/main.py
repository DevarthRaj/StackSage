"""StackSage FastAPI application entry point.

This file does three things:
1. Creates the FastAPI app with metadata for the auto-generated docs
2. Configures CORS middleware so the Next.js frontend can talk to us
3. Registers all route modules (routers)

CORS note:
  During development the frontend runs on localhost:3000 and the backend
  on localhost:8000 — different ports = different origins.  Without CORS
  middleware, the browser blocks all cross-origin requests.  We allow the
  frontend origin explicitly rather than using "*" because Clerk auth
  sends credentials (cookies/tokens) and wildcard origins reject those.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, user
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="RAG-powered project planning API",
)

# ── CORS ─────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(user.router)   