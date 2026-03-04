#!/bin/bash
# ============================================================================
# StackSage — Local Development Launcher (Linux/macOS/WSL2)
#
# Starts all services in background.  Stop with: kill $(jobs -p)
# Prerequisites:
#   1. Redis running: redis-server (or sudo systemctl start redis)
#   2. Python venv set up in backend/
#   3. npm install done in frontend/
# ============================================================================

set -e

echo ""
echo "  StackSage - Starting Development Services"
echo "  ==========================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Check .env ───────────────────────────────────────────────────────────
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "[WARNING] No .env file found! Run: cp .env.example .env"
    exit 1
fi

# ── Frontend ─────────────────────────────────────────────────────────────
echo "[1/3] Starting Next.js frontend on http://localhost:3000 ..."
(cd "$SCRIPT_DIR/frontend" && npm run dev) &

# ── Backend ──────────────────────────────────────────────────────────────
echo "[2/3] Starting FastAPI backend on http://localhost:8000 ..."
(cd "$SCRIPT_DIR/backend" && source venv/bin/activate && uvicorn app.main:app --reload --port 8000) &

# ── Celery Worker ────────────────────────────────────────────────────────
echo "[3/3] Starting Celery worker ..."
(cd "$SCRIPT_DIR/backend" && source venv/bin/activate && celery -A celery_worker worker --loglevel=info) &

echo ""
echo "  All services started in background."
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "  Stop all: kill \$(jobs -p)"

wait
