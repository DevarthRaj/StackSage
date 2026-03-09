"""StackSage configuration — loads and validates all environment variables.

Uses pydantic-settings so that every env var is typed, validated, and has a
clear default where appropriate. Missing required vars cause a startup error
with a descriptive message instead of a silent `None`.

Trade-off note:
  We use `str | None` for optional API keys so the app can start even if
  not every provider is configured. The services themselves check for `None`
  and raise a clear error at call time instead of at startup.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from environment variables or .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────
    app_name: str = "StackSage"
    app_version: str = "0.1.0"
    debug: bool = False

    # ── LLM Providers (all free-tier, no credit card) ────────────────────
    llm_provider: str = "groq"  # "groq" or "gemini"
    groq_api_key: str | None = None
    gemini_api_key: str | None = None

    # ── Embeddings (Google text-embedding-004, 768 dims, free) ──────────
    embedding_provider: str = "google"
    # Uses gemini_api_key above — same key covers Gemini Flash + embeddings

    # ── Reranking (Cohere free tier) ─────────────────────────────────────
    cohere_api_key: str | None = None

    # ── Vector DB (Qdrant Cloud free tier during dev) ────────────────────
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str | None = None
    qdrant_collection_name: str = "stacksage_docs"
    embedding_dimension: int = 768

    # ── Auth (Clerk) ─────────────────────────────────────────────────────
    clerk_secret_key: str | None = None
    clerk_jwks_url: str = "https://clerk.dev/oauth/jwks"

    # ── Database (SQLite default — swap to PostgreSQL by changing URL) ───
    database_url: str = "sqlite+aiosqlite:///./stacksage.db"

    # ── Task Queue (Redis) ───────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"

    # ── RAG Scheduling ───────────────────────────────────────────────────
    enable_scheduled_rag_refresh: bool = False

    # ── CORS ─────────────────────────────────────────────────────────────
    frontend_url: str = "http://localhost:3000"


# Singleton — import `settings` anywhere in the app
settings = Settings()
