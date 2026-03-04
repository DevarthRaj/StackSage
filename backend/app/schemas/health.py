"""Pydantic schemas for the health endpoint."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Response from GET /health.

    Attributes:
        status: Always "ok" when the server is running.
        version: Semantic version of the API (matches pyproject.toml).
    """

    status: str
    version: str
