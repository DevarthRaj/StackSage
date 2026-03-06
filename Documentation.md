# Project Structure Documentation

## CI/CD Configuration

### `.github/workflows/ci.yml`
This is your GitHub Actions file. Every time you push code to GitHub, it automatically runs your linter and type checker to catch errors. Think of it as an automated code reviewer that runs in the cloud.

---

## Backend Structure

### `backend/app/models/__init__.py`
This is where your database table definitions live. In SQLAlchemy, you define Python classes that map to database tables. The `__init__.py` just makes the folder a Python package (importable module).

### `backend/app/routers/`
Think of routers as departments in a company. Each router handles a specific group of API endpoints. 

- **`health.py`** is a router that has one job: answer "is the server alive?" — used by Docker and monitoring tools to check if your app is running.

### `backend/app/schemas/`
Schemas are the "contract" for your API. They define exactly what shape data must be when it comes IN to your API and goes OUT. Built with Pydantic. 

- The `health.py` schema defines what a health check response looks like (e.g. `{"status": "ok"}`).

### `backend/app/services/`
Services contain the actual business logic. Routers receive requests and call services to do the real work. This separation keeps your code clean — routers just route, services actually think.

### `backend/app/services/config.py`
Loads all your environment variables (API keys etc.) from the `.env` file into a Python object your whole app can import. So instead of `os.environ.get("GROQ_API_KEY")` everywhere, you just do `config.GROQ_API_KEY`.

### `backend/app/main.py`
The entry point of your entire FastAPI app. This is where the app is created, routers are registered, CORS is configured, and the server starts. Every request flows through here first.

### `backend/tests/`
Where your automated tests live. `test_health.py` tests that your health endpoint actually returns the right response. You run these with pytest.

### `backend/venv/`
Your Python virtual environment. This is an isolated Python installation just for this project. It contains all your installed packages (FastAPI, LangChain, etc.) without polluting your global Python installation. **You never touch this folder manually.**

### `backend/celery_worker.py`
The entry point for your Celery worker process (explained below in the [What is Celery?](#what-is-celery) section).

### `backend/Dockerfile`
Instructions for building a Docker image of your backend. It tells Docker: "start with Python 3.11, copy these files, install these packages, run this command."

### `backend/pyproject.toml`
Modern Python project configuration. Defines your project name, Python version, and tool settings (Ruff linter rules, mypy type checker settings). Replaces the old `setup.py`.

### `backend/requirements.txt`
The list of every Python package your project needs. Running `pip install -r requirements.txt` installs all of them at once.

---

## Frontend Structure

### `frontend/src/app/`
In Next.js App Router, every folder inside `app/` becomes a URL route. A folder called `dashboard` becomes `/dashboard`, a folder called `sign-in` becomes `/sign-in`.

### `frontend/src/lib/`
Shared utility functions and helper code used across multiple components. Things like API call functions, date formatters, etc.

### `frontend/.next/`
Auto-generated build output from Next.js. **Never touch or commit this.** It's in `.gitignore`.

### `frontend/node_modules/`
All your JavaScript packages installed by npm. **Never touch or commit this either.**

### `frontend/next.config.ts`
Configuration for Next.js itself. You set things here like allowed image domains, environment variable exposure, redirects, etc.

### `frontend/components.json`
Configuration file for shadcn/ui. It tells the shadcn CLI where to put components, what styling system to use, etc.

---

## Root Configuration Files

### `.env.example`
A template showing all required environment variables **WITHOUT** the actual secret values. You commit this to GitHub. Developers clone the repo, copy this to `.env`, and fill in their own keys.

### `dev.bat` and `dev.sh`
These are startup scripts. Instead of opening 4 terminals and remembering which command to run in each, you run one script and it starts everything. 
- `.sh` is for Linux/Mac
- `.bat` is for Windows

Since you're on Windows, you'll use `dev.bat`. It starts FastAPI, Celery, Redis etc. all at once.

### `docker-compose.yml`
The master file that defines all your services (FastAPI, Redis, Qdrant, Celery) as containers and how they connect. For deployment only on your machine.

### `docker-compose.dev.yml`
A lighter version for local dev that only runs the services that are hard to install natively.

---

## Infrastructure Components

### What is Qdrant?
Qdrant is a **vector database**. Normal databases store text and numbers. Qdrant stores vectors — lists of floating point numbers (like `[0.23, -0.81, 0.44, ...]`) that represent the meaning of text mathematically.

When you embed a sentence like "how to build a chat app", it becomes a vector of 768 numbers. Qdrant stores millions of these. When you search, it finds vectors that are mathematically close — meaning semantically similar — incredibly fast. This is what makes RAG (Retrieval-Augmented Generation) work. Without it, you'd have to scan every document every time.

### What is Celery?
Celery is a **task queue** — a system for running jobs in the background without blocking your API.

**Example Scenario:**
Imagine a user clicks "Refresh Knowledge Base." That job takes 3 minutes (scraping 10 websites, embedding thousands of chunks, upserting into Qdrant). If you ran that inside FastAPI directly, the user's browser would hang for 3 minutes waiting for a response. That's terrible UX.

**Instead, the flow works like this:**
1. FastAPI receives the request
2. Instantly says "job queued, here's a job ID"
3. Hands the actual work to Celery
4. Celery runs it in a separate process
5. User can check back later

**Redis** is what Celery uses as its **"message broker"** — the middleman that holds the list of tasks waiting to be run. FastAPI puts tasks into Redis, Celery picks them up from Redis and runs them.

**`celery_worker.py`** is the process you run separately that actually executes those background tasks. It's always listening to Redis for new work.