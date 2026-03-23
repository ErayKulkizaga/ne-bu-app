from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    device_id: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    preferences: Mapped[list["UserPreference"]] = relationship(
        "UserPreference", back_populates="user", cascade="all, delete-orphan"
    )
    scans: Mapped[list["Scan"]] = relationship("Scan", back_populates="user")  # type: ignore[name-defined]
    baskets: Mapped[list["Basket"]] = relationship("Basket", back_populates="user")  # type: ignore[name-defined]


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    preference_key: Mapped[str] = mapped_column(String(64), nullable=False)
    preference_value: Mapped[str] = mapped_column(String(256), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="preferences")
