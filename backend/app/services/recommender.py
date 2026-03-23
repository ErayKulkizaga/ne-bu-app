"""
Recommendation service.

Finds cleaner alternative products in the same category.
Uses deterministic scoring so results are reproducible.
"""
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.ingredient import Ingredient
from app.services.parser import parse_ingredients
from app.services.scoring import calculate_score_from_raw


def get_alternatives(
    product_id: int,
    db: Session,
    limit: int = 3,
) -> list[dict]:
    """
    Return up to `limit` products in the same category that score lower
    than the target product, ordered by ascending risk score.
    """
    target = db.query(Product).filter(Product.id == product_id).first()
    if not target or not target.category:
        return []

    target_score = _quick_score(target)

    candidates = (
        db.query(Product)
        .filter(Product.category == target.category, Product.id != product_id)
        .all()
    )

    scored: list[tuple[int, Product]] = []
    for candidate in candidates:
        s = _quick_score(candidate)
        if s < target_score:
            scored.append((s, candidate))

    scored.sort(key=lambda x: x[0])

    return [
        {
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "score": s,
            "score_label": _label(s),
        }
        for s, p in scored[:limit]
    ]


def _quick_score(product: Product) -> int:
    if not product.raw_ingredients:
        return 0
    result = calculate_score_from_raw(product.raw_ingredients)
    return result.score


def _label(score: int) -> str:
    if score <= 20:
        return "Clean"
    if score <= 40:
        return "Low Concern"
    if score <= 60:
        return "Moderate Concern"
    if score <= 80:
        return "Attention Needed"
    return "Highly Processed"
