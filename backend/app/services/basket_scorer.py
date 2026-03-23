"""
Basket-level scoring service.

Aggregates individual product scores and generates a basket summary.
"""
from sqlalchemy.orm import Session

from app.models.basket import Basket
from app.models.product import Product
from app.schemas.basket import BasketSummary, BasketSummaryItem
from app.services.scoring import calculate_score_from_raw, _band


def get_basket_summary(basket_id: int, db: Session) -> BasketSummary | None:
    basket = db.query(Basket).filter(Basket.id == basket_id).first()
    if not basket:
        return None

    items_data: list[BasketSummaryItem] = []

    for item in basket.items:
        product: Product = item.product
        score = 0
        if product.raw_ingredients:
            result = calculate_score_from_raw(product.raw_ingredients)
            score = result.score
        label, _, _ = _band(score)
        items_data.append(
            BasketSummaryItem(
                product_id=product.id,
                product_name=product.name,
                brand=product.brand,
                score=score,
                score_label=label,
            )
        )

    if not items_data:
        average = 0.0
    else:
        average = sum(i.score for i in items_data) / len(items_data)

    overall_label, _, _ = _band(int(average))

    summary_text = _build_summary_text(items_data, average, overall_label)

    return BasketSummary(
        basket_id=basket_id,
        item_count=len(items_data),
        average_score=round(average, 1),
        overall_label=overall_label,
        items=items_data,
        summary_text=summary_text,
    )


def _build_summary_text(
    items: list[BasketSummaryItem],
    average: float,
    overall_label: str,
) -> str:
    if not items:
        return "Your basket is empty."

    high_items = [i for i in items if i.score > 60]
    clean_items = [i for i in items if i.score <= 20]

    parts: list[str] = [
        f"Your basket contains {len(items)} product(s) with an average score of {average:.0f}/100 ({overall_label})."
    ]

    if high_items:
        names = ", ".join(i.product_name for i in high_items[:2])
        parts.append(
            f"{names} {'has' if len(high_items) == 1 else 'have'} higher processing signals — "
            "you may want to consider alternatives."
        )

    if clean_items:
        names = ", ".join(i.product_name for i in clean_items[:2])
        parts.append(f"{names} {'appears' if len(clean_items) == 1 else 'appear'} to have a cleaner ingredient profile.")

    parts.append("This summary is for informational purposes and does not constitute dietary or medical advice.")

    return " ".join(parts)
