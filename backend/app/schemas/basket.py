from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BasketCreate(BaseModel):
    user_id: int | None = None


class BasketItemCreate(BaseModel):
    product_id: int


class BasketItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    added_at: datetime
    product_name: str | None = None
    product_score: int | None = None


class BasketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int | None
    created_at: datetime


class BasketSummaryItem(BaseModel):
    product_id: int
    product_name: str
    brand: str | None
    score: int
    score_label: str


class BasketSummary(BaseModel):
    basket_id: int
    item_count: int
    average_score: float
    overall_label: str
    items: list[BasketSummaryItem]
    summary_text: str
