from sqlalchemy import String, Text, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    normalized_name: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    e_number: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    is_additive: Mapped[bool] = mapped_column(Boolean, default=False)
    additive_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    # concern_level: 0=none, 1=low, 2=moderate, 3=high
    concern_level: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    product_ingredients: Mapped[list["ProductIngredient"]] = relationship(
        "ProductIngredient", back_populates="ingredient"
    )


class ProductIngredient(Base):
    __tablename__ = "product_ingredients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredients.id"), index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    raw_text: Mapped[str | None] = mapped_column(String(256), nullable=True)

    product: Mapped["Product"] = relationship("Product", back_populates="product_ingredients")  # type: ignore[name-defined]
    ingredient: Mapped["Ingredient"] = relationship("Ingredient", back_populates="product_ingredients")
