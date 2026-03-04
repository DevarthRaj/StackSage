"""Celery application entry point.

This file creates and configures the Celery app instance. During Phase 1 it
is a stub — no tasks are registered yet.  The Celery Beat scheduler for
periodic RAG index refreshes will be added in Phase 3.

WHY CELERY?
  Some operations (scraping 10+ websites, embedding thousands of chunks,
  ingesting an entire GitHub repo) can take minutes.  Celery lets us push
  these into a background worker so the FastAPI request/response cycle
  stays fast.  Redis acts as both the message broker (task queue) and
  result backend (where we store task outcomes).

LOCAL DEV NOTE:
  On an 8GB RAM machine, only start the Celery worker when you actually
  need to run background tasks.  It uses ~100MB RAM.
  Start with:  celery -A celery_worker worker --loglevel=info
"""

from celery import Celery

from app.config import settings

celery_app = Celery(
    "stacksage",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

# Autodiscover tasks from app.services.* modules (added in later phases)
celery_app.autodiscover_tasks(["app.services"])

# ── Celery Beat schedule (disabled locally via env var) ──────────────────
if settings.enable_scheduled_rag_refresh:
    celery_app.conf.beat_schedule = {
        "refresh-rag-index-weekly": {
            "task": "app.services.rag.refresh_rag_index",
            "schedule": 60 * 60 * 24 * 7,  # 7 days in seconds
        },
    }
