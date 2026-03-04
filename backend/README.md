# StackSage Backend

FastAPI backend for the StackSage RAG-powered project planning platform.

## Setup (Local Development)

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
app/
├── main.py         # FastAPI app entry point + CORS
├── config.py       # Pydantic Settings (env var validation)
├── routers/        # API route modules
├── services/       # Business logic
├── models/         # SQLAlchemy ORM models
└── schemas/        # Pydantic request/response models
```
