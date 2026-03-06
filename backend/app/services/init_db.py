import asyncio
from app.models.database import engine, Base
from app.models.user_projects import UserProject  # noqa: F401 — import needed so Base knows about this table


async def init_database():
    """
    Creates all database tables if they don't exist.
    Safe to run multiple times — it won't delete existing data.
    """
    async with engine.begin() as conn:
        print("Creating database tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Database tables created successfully.")


if __name__ == "__main__":
    asyncio.run(init_database())