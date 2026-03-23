"""
Explanation card generator.

Maps score bands and flagged ingredients to plain-language consumer guidance.
All language avoids definitive medical claims and uses cautious phrasing.
"""
from app.models.ingredient import Ingredient
from app.schemas.analysis import ExplanationCard
from app.services.scoring import (
    ARTIFICIAL_SWEETENERS,
    ADDED_SUGAR_ALIASES,
    VAGUE_TERMS,
    ScoringResult,
)


def generate_explanation_cards(
    scoring_result: ScoringResult,
    ingredients: list[Ingredient],
) -> list[ExplanationCard]:
    cards: list[ExplanationCard] = []

    # ── Overall score card ─────────────────────────────────────────────────
    cards.append(
        ExplanationCard(
            title=f"Overall Rating: {scoring_result.band_label}",
            body=scoring_result.band_description,
            severity=_severity_for_band(scoring_result.band_label),
        )
    )

    resolved_names = {i.normalized_name.lower() for i in ingredients if i.normalized_name}

    # ── Additive card ──────────────────────────────────────────────────────
    high_concern = [i for i in ingredients if i.concern_level >= 3]
    if high_concern:
        names = ", ".join(i.name for i in high_concern[:4])
        cards.append(
            ExplanationCard(
                title="Controversial Additives Detected",
                body=(
                    f"This product contains {names}. "
                    "Some of these additives have been subject to ongoing consumer discussion. "
                    "Depending on personal sensitivities, you may wish to review these ingredients."
                ),
                severity="warning",
            )
        )

    # ── Sweetener card ────────────────────────────────────────────────────
    sweeteners = resolved_names & ARTIFICIAL_SWEETENERS
    if sweeteners:
        cards.append(
            ExplanationCard(
                title="Artificial Sweeteners Present",
                body=(
                    f"Artificial sweetener(s) were identified: {', '.join(sweeteners)}. "
                    "Some consumers may prefer to avoid artificial sweeteners depending on "
                    "dietary preferences or individual sensitivity."
                ),
                severity="caution",
            )
        )

    # ── Sugar card ────────────────────────────────────────────────────────
    sugars = resolved_names & ADDED_SUGAR_ALIASES
    if len(sugars) >= 2:
        cards.append(
            ExplanationCard(
                title="Multiple Sugar Sources",
                body=(
                    f"This product lists {len(sugars)} sugar-related ingredients ({', '.join(list(sugars)[:3])}…). "
                    "Products with multiple added sugar sources may be worth attention for those "
                    "monitoring their sugar intake."
                ),
                severity="caution",
            )
        )

    # ── Vague terms card ──────────────────────────────────────────────────
    vague = resolved_names & VAGUE_TERMS
    if vague:
        cards.append(
            ExplanationCard(
                title="Broad or Vague Ingredient Terms",
                body=(
                    "Some ingredients such as 'flavouring' or 'modified starch' are listed without "
                    "further specification. Consumers who prefer full ingredient transparency may "
                    "want to note this."
                ),
                severity="info",
            )
        )

    # ── Clean product card ────────────────────────────────────────────────
    if scoring_result.score <= 20 and not high_concern:
        cards.append(
            ExplanationCard(
                title="Relatively Clean Profile",
                body=(
                    "Based on the detected ingredient profile, this product appears to have a "
                    "low level of additives and processing signals. This does not constitute "
                    "nutritional advice."
                ),
                severity="info",
            )
        )

    return cards


def _severity_for_band(band_label: str) -> str:
    mapping = {
        "Clean": "info",
        "Low Concern": "info",
        "Moderate Concern": "caution",
        "Attention Needed": "warning",
        "Highly Processed": "warning",
    }
    return mapping.get(band_label, "info")
