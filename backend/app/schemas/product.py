from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    brand: str | None = None
    category: str | None = None
    barcode: str | None = None
    raw_ingredients: str | None = None
    image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    brand: str | None = None
    category: str | None = None
    raw_ingredients: str | None = None
    image_url: str | None = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    brand: str | None
    category: str | None
    barcode: str | None
    image_url: str | None
