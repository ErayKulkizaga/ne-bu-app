from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.ingredient import Ingredient, ProductIngredient
from app.schemas.analysis import AnalysisResult, IngredientFlag, ScoreBand
from app.schemas.ingredient import ProductIngredientResponse, IngredientResponse
from app.schemas.product import ProductResponse
from app.services.parser import parse_ingredients
from app.services.normalizer import resolve_ingredients
from app.services.scoring import calculate_score
from app.services.explainer import generate_explanation_cards

router = APIRouter()


@router.post("/product/{product_id}", response_model=AnalysisResult)
def analyze_product(
    product_id: int,
    sensitivity_modifier: int = 0,
    db: Session = Depends(get_db),
) -> AnalysisResult:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if not product.raw_ingredients:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Product has no ingredient data to analyze",
        )

    tokens = parse_ingredients(product.raw_ingredients)
    resolved = resolve_ingredients(tokens, db)

    # Collect resolved Ingredient objects; create transient stubs for unresolved tokens
    ingredient_objects: list[Ingredient] = []
    pi_responses: list[ProductIngredientResponse] = []

    for entry in resolved:
        ing: Ingredient | None = entry["ingredient"]
        if ing is None:
            ing = Ingredient()
            ing.id = -1
            ing.name = entry["raw_text"]
            ing.normalized_name = entry["raw_text"].lower()
            ing.e_number = entry["e_number"]
            ing.is_additive = bool(entry["e_number"])
            ing.concern_level = 0
            ing.additive_type = None
            ing.description = None
        ingredient_objects.append(ing)
        pi_responses.append(
            ProductIngredientResponse(
                position=entry["position"],
                raw_text=entry["raw_text"],
                ingredient=IngredientResponse(
                    id=ing.id if ing.id else -1,
                    name=ing.name,
                    normalized_name=ing.normalized_name,
                    e_number=ing.e_number,
                    is_additive=ing.is_additive,
                    additive_type=ing.additive_type,
                    concern_level=ing.concern_level,
                    description=ing.description,
                ),
            )
        )

    scoring_result = calculate_score(ingredient_objects, sensitivity_modifier)

    flagged = [
        IngredientFlag(
            name=i.name,
            e_number=i.e_number,
            concern_level=i.concern_level,
            reason=_concern_reason(i),
        )
        for i in ingredient_objects
        if i.concern_level >= 2 or i.is_additive
    ]

    cards = generate_explanation_cards(scoring_result, ingredient_objects)

    return AnalysisResult(
        product=ProductResponse.model_validate(product),
        ingredients=pi_responses,
        score=scoring_result.score,
        score_band=ScoreBand(
            label=scoring_result.band_label,
            color=scoring_result.band_color,
            description=scoring_result.band_description,
        ),
        flagged_ingredients=flagged,
        explanation_cards=cards,
        contributing_factors=scoring_result.contributing_factors,
    )


def _concern_reason(ingredient: Ingredient) -> str:
    if ingredient.concern_level >= 3:
        return "This additive has been subject to consumer discussion and may be worth attention."
    if ingredient.concern_level == 2:
        return "Some consumers may prefer to avoid this ingredient depending on personal sensitivities."
    if ingredient.is_additive:
        return "Classified as a food additive."
    return "Present in the ingredient list."
