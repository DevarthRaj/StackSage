"""Tests for the health check endpoint."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_200() -> None:
    """GET /health should return 200 with status=ok and a version string."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_response_shape() -> None:
    """Response must include exactly the fields defined in HealthResponse."""
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    # Version should be a semantic version string like "0.1.0"
    parts = data["version"].split(".")
    assert len(parts) == 3, "Version must be semver (MAJOR.MINOR.PATCH)"
