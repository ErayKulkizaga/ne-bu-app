from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.basket import Basket, BasketItem
from app.schemas.basket import (
    BasketCreate,
    BasketItemCreate,
    BasketResponse,
    BasketSummary,
)
from app.services.basket_scorer import get_basket_summary

router = APIRouter()


@router.post("", response_model=BasketResponse, status_code=status.HTTP_201_CREATED)
def create_basket(payload: BasketCreate, db: Session = Depends(get_db)) -> Basket:
    basket = Basket(user_id=payload.user_id)
    db.add(basket)
    db.commit()
    db.refresh(basket)
    return basket


@router.post("/{basket_id}/items", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_item_to_basket(
    basket_id: int,
    payload: BasketItemCreate,
    db: Session = Depends(get_db),
) -> dict:
    basket = db.query(Basket).filter(Basket.id == basket_id).first()
    if not basket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Basket not found")

    from app.models.product import Product

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    item = BasketItem(basket_id=basket_id, product_id=payload.product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "basket_id": basket_id, "product_id": payload.product_id}


@router.get("/{basket_id}/summary", response_model=BasketSummary)
def basket_summary(basket_id: int, db: Session = Depends(get_db)) -> BasketSummary:
    summary = get_basket_summary(basket_id, db)
    if summary is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Basket not found")
    return summary


@router.get("/{basket_id}", response_model=BasketResponse)
def get_basket(basket_id: int, db: Session = Depends(get_db)) -> Basket:
    basket = db.query(Basket).filter(Basket.id == basket_id).first()
    if not basket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Basket not found")
    return basket
