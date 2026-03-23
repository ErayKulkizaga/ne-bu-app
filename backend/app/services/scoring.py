"""
Deterministic risk scoring engine for NeBU.

Score range: 0–100
  0–20  : Clean
  21–40 : Low Concern
  41–60 : Moderate Concern
  61–80 : Attention Needed
  81–100: Highly Processed

Scoring is intentionally conservative and non-diagnostic.
Language guidance: use "may be worth attention", "some consumers may prefer
to avoid", "depending on personal sensitivities".
"""
from dataclasses import dataclass, field

from app.models.ingredient import Ingredient

# ── Vague / highly-processed signal terms ──────────────────────────────────
VAGUE_TERMS = {
    "flavouring",
    "natural flavouring",
    "artificial flavouring",
    "flavour",
    "natural flavour",
    "modified starch",
    "hydrolysed protein",
    "yeast extract",
    "spices",
    "herb extract",
}

# ── Artificial sweetener normalized names ──────────────────────────────────
ARTIFICIAL_SWEETENERS = {
    "aspartame",
    "acesulfame k",
    "acesulfame potassium",
    "sucralose",
    "saccharin",
    "cyclamate",
    "neotame",
    "advantame",
    "steviol glycosides",
}

# ── Added sugar aliases ────────────────────────────────────────────────────
ADDED_SUGAR_ALIASES = {
    "sugar",
    "glucose",
    "fructose",
    "glucose syrup",
    "high fructose corn syrup",
    "corn syrup",
    "sucrose",
    "dextrose",
    "maltose",
    "invert sugar",
    "molasses",
    "caramel",
    "honey",
    "agave",
    "cane sugar",
}


@dataclass
class ScoringResult:
    score: int
    band_label: str
    band_color: str
    band_description: str
    contributing_factors: list[str] = field(default_factory=list)


def _band(score: int) -> tuple[str, str, str]:
    """Return (label, color, description) for a given score."""
    if score <= 20:
        return ("Clean", "#4caf50", "This product appears relatively clean based on its ingredient profile.")
    if score <= 40:
        return (
            "Low Concern",
            "#8bc34a",
            "A small number of ingredients may be worth a closer look depending on personal sensitivities.",
        )
    if score <= 60:
        return (
            "Moderate Concern",
            "#ffc107",
            "Several ingredients in this product may be worth attention for consumers who prefer minimally processed foods.",
        )
    if score <= 80:
        return (
            "Attention Needed",
            "#ff9800",
            "This product contains multiple ingredients that some consumers may prefer to avoid.",
        )
    return (
        "Highly Processed",
        "#f44336",
        "This product shows multiple signals of heavy processing. Consumers with specific sensitivities may want to consider alternatives.",
    )


def calculate_score(
    ingredients: list[Ingredient],
    sensitivity_modifier: int = 0,
) -> ScoringResult:
    """
    Calculate a risk score from a list of resolved Ingredient objects.

    sensitivity_modifier: optional +/- integer applied by user preferences.
    """
    score = 0
    factors: list[str] = []

    resolved_names = {i.normalized_name.lower() for i in ingredients if i.normalized_name}
    additive_count = sum(1 for i in ingredients if i.is_additive)
    high_concern = [i for i in ingredients if i.concern_level >= 3]
    moderate_concern = [i for i in ingredients if i.concern_level == 2]

    # ── Additive count tier ────────────────────────────────────────────────
    if additive_count >= 8:
        score += 25
        factors.append(f"High additive count ({additive_count} additives detected)")
    elif additive_count >= 4:
        score += 15
        factors.append(f"Moderate additive count ({additive_count} additives detected)")
    elif additive_count >= 1:
        score += 5
        factors.append(f"{additive_count} additive(s) present")

    # ── High-concern additives ─────────────────────────────────────────────
    if high_concern:
        names = ", ".join(i.name for i in high_concern[:3])
        score += len(high_concern) * 10
        factors.append(f"Controversial additive(s) detected: {names}")

    # ── Moderate-concern additives ─────────────────────────────────────────
    if moderate_concern:
        score += len(moderate_concern) * 5
        factors.append(f"{len(moderate_concern)} moderate-concern additive(s) present")

    # ── Artificial sweeteners ──────────────────────────────────────────────
    sweeteners_found = resolved_names & ARTIFICIAL_SWEETENERS
    if sweeteners_found:
        score += 12
        factors.append(f"Artificial sweetener(s) found: {', '.join(sweeteners_found)}")

    # ── Vague / highly-processed signals ──────────────────────────────────
    vague_found = resolved_names & VAGUE_TERMS
    if len(vague_found) >= 3:
        score += 10
        factors.append("Multiple vague or broad ingredient terms detected")
    elif vague_found:
        score += 5
        factors.append("Vague ingredient term(s) present (e.g. 'flavouring', 'modified starch')")

    # ── Added sugar aliases ────────────────────────────────────────────────
    sugars_found = resolved_names & ADDED_SUGAR_ALIASES
    if len(sugars_found) >= 3:
        score += 12
        factors.append("Multiple added sugar sources detected")
    elif sugars_found:
        score += 6
        factors.append(f"Added sugar source(s): {', '.join(sugars_found)}")

    # ── User sensitivity modifier ──────────────────────────────────────────
    if sensitivity_modifier:
        score += sensitivity_modifier
        if sensitivity_modifier > 0:
            factors.append("Score adjusted upward based on your sensitivity settings")

    score = max(0, min(score, 100))
    label, color, description = _band(score)

    return ScoringResult(
        score=score,
        band_label=label,
        band_color=color,
        band_description=description,
        contributing_factors=factors,
    )


def calculate_score_from_raw(
    raw_ingredients: str,
    sensitivity_modifier: int = 0,
) -> ScoringResult:
    """
    Convenience overload for situations where resolved Ingredient objects
    are not yet available — uses heuristic token analysis only.
    """
    from app.services.parser import parse_ingredients

    tokens = parse_ingredients(raw_ingredients)
    mock_ingredients: list[Ingredient] = []

    for token in tokens:
        from app.services.parser import extract_e_number

        e_num = extract_e_number(token)
        stub = Ingredient()
        stub.name = token
        stub.normalized_name = token.lower()
        stub.e_number = e_num
        stub.is_additive = bool(e_num)
        stub.concern_level = 1 if e_num else 0
        stub.additive_type = None
        mock_ingredients.append(stub)

    return calculate_score(mock_ingredients, sensitivity_modifier)
