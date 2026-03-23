from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AdditiveProfile(Base):
    __tablename__ = "additive_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    e_number: Mapped[str] = mapped_column(String(16), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    category: Mapped[str | None] = mapped_column(String(64), nullable=True)
    # concern_level: 0=none, 1=low, 2=moderate, 3=high
    concern_level: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
