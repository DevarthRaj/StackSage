# StackSage

> RAG-powered project architecture planner — input your idea and hardware specs, get a complete blueprint, an agent-ready implementation prompt, and tools to maximize your AI workflow. All free.

![Status](https://img.shields.io/badge/status-in%20development-emerald)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## What is StackSage?

Most developers waste hours figuring out which stack fits their machine, their budget, and today's tooling landscape. StackSage solves all three at once.

You describe your project idea. You tell it your hardware. It tells you exactly what to build with, what you can actually run, and generates a prompt that lets a coding agent build it for you.

---

## Three Core Features

### 1. Project Blueprint
- Full architecture plan with step-by-step explanation
- Interactive tech stack graph (React Flow) — nodes, edges, dependencies
- Every tool checked against your hardware: ✅ Compatible · ⚠️ Possible · ❌ Incompatible
- Free and open-source alternatives always included
- Powered by a live RAG pipeline updated from real sources weekly

### 2. Agent Prompt Generator
- Generates a comprehensive, copy-paste-ready prompt
- Works with Claude Code, Cursor, Windsurf, or any coding agent
- Customizable scope: MVP vs full build, target agent, complexity level
- Designed to maximise autonomous implementation

### 3. Repo-to-Text Converter
- Paste any public GitHub URL or upload a local ZIP
- Converts the entire repo into a single LLM-digestible text blob
- Smart filtering — skips `node_modules`, `.git`, lock files, binaries
- Token count estimate so you know if it fits your target model's context window

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 15 + TypeScript | Framework |
| Tailwind CSS + shadcn/ui | Styling and components |
| React Flow | Interactive tech stack graph |
| Framer Motion | Animations |
| Clerk v7 | Authentication |

### Backend
| Tool | Purpose |
|---|---|
| FastAPI (Python 3.11+) | API server |
| LangChain v0.3 (LCEL) | RAG orchestration |
| Qdrant Cloud | Vector database |
| Google text-embedding-004 | Embeddings (free, 768 dims) |
| Groq (Llama 3.3 70B) | Primary LLM (free) |
| Gemini 1.5 Flash | Fallback LLM (free) |
| Cohere Rerank | Result reranking (free tier) |
| Celery + Redis | Background task queue |
| SQLite + SQLAlchemy | User project history |

### DevOps
| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Containerisation (deployment) |
| GitHub Actions | CI — lint and type check on push |
| Vercel | Frontend deployment |
| Railway | Backend + Redis deployment |

---

## RAG Knowledge Sources

The knowledge base is updated weekly from these sources:

- **Hugging Face Papers** — daily AI research feed
- **OpenRouter Model List** — live LLM pricing and specs
- **Ollama Library** — local models and hardware requirements
- **Papers With Code** — SOTA methods and code links
- **GitHub Trending (AI/ML)** — hot new tools
- **LangChain / LlamaIndex changelogs** — framework updates
- **r/LocalLLaMA** — free and local AI tool discussion
- **Towards Data Science** — practical AI tutorials

---

## Project Structure

```
StackSage/
├── frontend/                  # Next.js 15 app
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── dashboard/     # Protected dashboard
│   │   │   ├── sign-in/       # Clerk auth pages
│   │   │   └── sign-up/
│   │   ├── components/        # Shared components
│   │   └── lib/               # Utilities and API helpers
│   └── proxy.ts               # Clerk middleware (route protection)
│
├── backend/                   # FastAPI app
│   ├── app/
│   │   ├── routers/           # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── auth.py        # Clerk JWT verification
│   │   │   ├── qdrant_service.py
│   │   │   ├── embedding_service.py
│   │   │   ├── rag_chain.py
│   │   │   ├── hardware_filter.py
│   │   │   └── scrapers/
│   │   ├── models/            # SQLAlchemy + Pydantic schemas
│   │   ├── data/
│   │   │   └── hardware_specs.json
│   │   ├── config.py          # All settings from .env
│   │   └── main.py            # App entry point
│   ├── tasks/
│   │   └── rag_tasks.py       # Celery background jobs
│   └── celery_worker.py
│
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI
├── docker-compose.yml         # Deployment only
├── docker-compose.dev.yml     # Lightweight local dev
└── Documentation.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Redis (via WSL2 on Windows: `sudo apt install redis-server`)
- A free [Qdrant Cloud](https://cloud.qdrant.io) cluster

### 1. Clone the repo
```bash
git clone https://github.com/DevarthRaj/StackSage.git
cd StackSage
```

### 2. Set up the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

Required keys (all free, no credit card):

| Key | Get it from |
|---|---|
| `GROQ_API_KEY` | console.groq.com |
| `GEMINI_API_KEY` | aistudio.google.com |
| `COHERE_API_KEY` | dashboard.cohere.com |
| `QDRANT_URL` | cloud.qdrant.io |
| `QDRANT_API_KEY` | cloud.qdrant.io |
| `CLERK_SECRET_KEY` | dashboard.clerk.com |
| `CLERK_JWKS_URL` | dashboard.clerk.com → API Keys |

Initialise the database:
```bash
python -m app.services.init_db
```

### 3. Set up the frontend
```bash
cd frontend
npm install
```

Copy `.env.example` to `.env.local` and fill in your Clerk keys:
```bash
cp .env.example .env.local
```

### 4. Run in development

Open three terminals:

```bash
# Terminal 1 — Backend
cd backend && venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Celery worker (in WSL2)
cd backend && source venv/bin/activate
celery -A celery_worker.celery_app worker --loglevel=info

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000`

### 5. Seed the knowledge base

After signing in, go to the dashboard and click **"Refresh Knowledge Base"** — or hit the endpoint directly:

```bash
curl -X POST http://localhost:8000/api/rag/refresh \
  -H "Authorization: Bearer YOUR_CLERK_JWT"
```

This scrapes all sources, embeds the documents, and populates Qdrant. Takes 2–5 minutes. Only needs to be done once (then weekly automatically on deployment).

---

## Environment Variables

### `backend/.env`

```bash
# App
APP_NAME=StackSage
DEBUG=false

# LLM
GROQ_API_KEY=
GEMINI_API_KEY=

# Embeddings + Reranking
COHERE_API_KEY=

# Vector DB
QDRANT_URL=
QDRANT_API_KEY=
QDRANT_COLLECTION_NAME=stacksage_docs
EMBEDDING_DIMENSION=768

# Auth
CLERK_SECRET_KEY=
CLERK_JWKS_URL=

# Database
DATABASE_URL=sqlite+aiosqlite:///./stacksage.db

# Redis
REDIS_URL=redis://localhost:6379/0

# Features
ENABLE_SCHEDULED_RAG_REFRESH=false
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local`

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Hardware Requirements

StackSage is designed to run on modest hardware. **No GPU required.**

| Component | Minimum |
|---|---|
| RAM | 8GB |
| GPU | Not required (all LLMs run via free APIs) |
| Disk | 3GB free (for dependencies) |
| OS | Windows / macOS / Linux |

All LLM inference runs on Groq's servers — not your machine.

---

## Development Status

| Phase | Description | Status |
|---|---|---|
| 1 | Project scaffold, Docker, CI | ✅ Complete |
| 2 | Clerk auth, SQLite, JWT verification | ✅ Complete |
| 3 | RAG pipeline, embeddings, scrapers | 🔄 In Progress |
| 4 | Blueprint generation + React Flow graph | ⏳ Pending |
| 5 | Agent prompt generator | ⏳ Pending |
| 6 | Repo-to-text converter | ⏳ Pending |
| 7 | UI polish, Docker, deployment | ⏳ Pending |

---

## Contributing

This project is in active development. If you find a bug or want to suggest a RAG knowledge source, open an issue.

---

## License

MIT 
