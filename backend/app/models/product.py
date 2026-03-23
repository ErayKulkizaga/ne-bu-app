from datetime import datetime
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    barcode: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    brand: Mapped[str | None] = mapped_column(String(128), nullable=True)
    category: Mapped[str | None] = mapped_column(String(64), nullable=True)
    raw_ingredients: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    product_ingredients: Mapped[list["ProductIngredient"]] = relationship(  # type: ignore[name-defined]
        "ProductIngredient", back_populates="product", cascade="all, delete-orphan"
    )
    scans: Mapped[list["Scan"]] = relationship("Scan", back_populates="product")  # type: ignore[name-defined]
    basket_items: Mapped[list["BasketItem"]] = relationship("BasketItem", back_populates="product")  # type: ignore[name-defined]
