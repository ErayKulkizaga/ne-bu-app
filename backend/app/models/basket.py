from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Basket(Base):
    __tablename__ = "baskets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), server_default=func.now())

    user: Mapped["User | None"] = relationship("User", back_populates="baskets")  # type: ignore[name-defined]
    items: Mapped[list["BasketItem"]] = relationship(
        "BasketItem", back_populates="basket", cascade="all, delete-orphan"
    )


class BasketItem(Base):
    __tablename__ = "basket_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    basket_id: Mapped[int] = mapped_column(ForeignKey("baskets.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    added_at: Mapped[datetime] = mapped_column(DateTime(), server_default=func.now())

    basket: Mapped["Basket"] = relationship("Basket", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="basket_items")  # type: ignore[name-defined]
