"""Health check endpoint.

This is the simplest possible endpoint — it exists so we can:
  1. Verify the backend is running during development
  2. Use it as a Docker/Railway health check target
  3. Confirm CORS is working when the frontend calls it

The Pydantic response model guarantees the shape of the JSON response,
which means FastAPI also auto-generates accurate OpenAPI docs for it.
"""

from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return the current health status and version of the API."""
    return HealthResponse(status="ok", version="0.1.0")
