from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.recommender import get_alternatives

router = APIRouter()


@router.get("/product/{product_id}")
def get_product_recommendations(
    product_id: int,
    limit: int = Query(default=3, ge=1, le=10),
    db: Session = Depends(get_db),
) -> list[dict]:
    from app.models.product import Product

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    return get_alternatives(product_id, db, limit=limit)
