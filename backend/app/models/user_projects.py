from datetime import datetime
from sqlalchemy import String, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class UserProject(Base):
    """
    Stores a user's saved project blueprint.

    Each row represents one project a user has generated.
    user_id comes from Clerk — it's the unique ID Clerk assigns each user.
    """
    __tablename__ = "user_projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # Clerk's user ID — format is "user_2abc123..."
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    # The project idea the user typed in
    project_name: Mapped[str] = mapped_column(String(500), nullable=False)

    # Full blueprint JSON stored as text (we'll parse it when reading)
    blueprint_json: Mapped[str] = mapped_column(Text, nullable=True)

    # The generated agent prompt
    agent_prompt: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return f"<UserProject id={self.id} user={self.user_id} name={self.project_name}>"