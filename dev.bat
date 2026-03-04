@echo off
REM ============================================================================
REM StackSage — Local Development Launcher (Windows)
REM
REM Starts all services in separate terminal windows.
REM Prerequisites:
REM   1. Redis running (install via WSL2: sudo apt install redis-server)
REM      or via winget: winget install Redis.Redis
REM   2. Python virtual environment set up in backend/
REM   3. npm install done in frontend/
REM
REM RAM budget when all services are running:
REM   Next.js dev: ~300MB | FastAPI: ~150MB | Celery: ~100MB | Redis: ~50MB
REM   Total: ~600MB (comfortable on 8GB machine)
REM ============================================================================

echo.
echo  StackSage - Starting Development Services
echo  ===========================================
echo.

REM ── Check for .env file ──────────────────────────────────────────────────
if not exist ".env" (
    echo [WARNING] No .env file found! Copy .env.example to .env and fill in your API keys.
    echo           copy .env.example .env
    echo.
    pause
    exit /b 1
)

REM ── Start Frontend (Next.js) ─────────────────────────────────────────────
echo [1/3] Starting Next.js frontend on http://localhost:3000 ...
start "StackSage Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM ── Start Backend (FastAPI) ──────────────────────────────────────────────
echo [2/3] Starting FastAPI backend on http://localhost:8000 ...
start "StackSage Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

REM ── Start Celery Worker (optional, only when needed) ─────────────────────
echo [3/3] Starting Celery worker (for background tasks) ...
start "StackSage Celery" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate && celery -A celery_worker worker --loglevel=info --pool=solo"

echo.
echo  All services started in separate windows.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo.
echo  Make sure Redis is running before using Celery.
echo  Press any key to exit this launcher...
pause >nul
