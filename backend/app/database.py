import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# SQLite database file will be created at backend/stacksage.db
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./stacksage.db"
)

# Create the async engine
# echo=True logs all SQL statements — useful for learning, set to False in production
engine = create_async_engine(DATABASE_URL, echo=True)

# Session factory — use this to create database sessions in endpoints
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """
    Base class for all database models.
    All your table classes will inherit from this.
    SQLAlchemy uses it to track which classes represent tables.
    """
    pass


async def get_db():
    """
    FastAPI dependency that provides a database session.
    The 'async with' ensures the session is always closed after use,
    even if an error occurs.

    Usage in endpoints:
        @router.get("/history")
        async def get_history(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        yield session