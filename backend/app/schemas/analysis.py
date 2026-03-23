from pydantic import BaseModel
from app.schemas.ingredient import ProductIngredientResponse
from app.schemas.product import ProductResponse


class ScoreBand(BaseModel):
    label: str
    color: str
    description: str


class IngredientFlag(BaseModel):
    name: str
    e_number: str | None
    concern_level: int
    reason: str


class ExplanationCard(BaseModel):
    title: str
    body: str
    severity: str  # "info" | "warning" | "caution"


class AnalysisResult(BaseModel):
    product: ProductResponse
    ingredients: list[ProductIngredientResponse]
    score: int
    score_band: ScoreBand
    flagged_ingredients: list[IngredientFlag]
    explanation_cards: list[ExplanationCard]
    contributing_factors: list[str]


class ProductDetailResponse(BaseModel):
    product: ProductResponse
    ingredients: list[ProductIngredientResponse]
    score: int
    score_band: ScoreBand
    flagged_ingredients: list[IngredientFlag]
    explanation_cards: list[ExplanationCard]
    contributing_factors: list[str]
    alternatives: list[dict]
