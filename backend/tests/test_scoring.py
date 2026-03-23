"""
Unit tests for the deterministic scoring engine.

These tests do not require a database connection; they construct
lightweight Ingredient stubs directly.
"""
import pytest
from app.models.ingredient import Ingredient
from app.services.scoring import calculate_score, ScoringResult


def make_ingredient(
    name: str,
    normalized_name: str,
    is_additive: bool = False,
    concern_level: int = 0,
    additive_type: str | None = None,
    e_number: str | None = None,
) -> Ingredient:
    ing = Ingredient()
    ing.name = name
    ing.normalized_name = normalized_name
    ing.is_additive = is_additive
    ing.concern_level = concern_level
    ing.additive_type = additive_type
    ing.e_number = e_number
    ing.description = None
    return ing


# ── Clean product ──────────────────────────────────────────────────────────

class TestCleanProduct:
    def test_score_is_within_clean_band(self):
        ingredients = [
            make_ingredient("Oats", "oats"),
            make_ingredient("Honey", "honey"),
            make_ingredient("Sea Salt", "sea salt"),
            make_ingredient("Sunflower Oil", "sunflower oil"),
        ]
        result = calculate_score(ingredients)
        assert isinstance(result, ScoringResult)
        assert result.score <= 20
        assert result.band_label == "Clean"

    def test_clean_score_has_no_critical_factors(self):
        ingredients = [
            make_ingredient("Almonds", "almonds"),
            make_ingredient("Sea Salt", "sea salt"),
        ]
        result = calculate_score(ingredients)
        assert result.score <= 20
        assert result.band_color == "#4caf50"


# ── Moderate load ──────────────────────────────────────────────────────────

class TestModerateProduct:
    def test_moderate_additive_count_raises_score(self):
        ingredients = [
            make_ingredient("Wheat Flour", "wheat flour"),
            make_ingredient("Sugar", "sugar"),
            make_ingredient("E471", "mono- and diglycerides of fatty acids", is_additive=True, concern_level=1, e_number="E471"),
            make_ingredient("E472e", "diacetyl tartaric acid esters", is_additive=True, concern_level=1, e_number="E472e"),
            make_ingredient("E322", "lecithins", is_additive=True, concern_level=0, e_number="E322"),
            make_ingredient("E500", "sodium carbonates", is_additive=True, concern_level=0, e_number="E500"),
            make_ingredient("Flavouring", "flavouring"),
        ]
        result = calculate_score(ingredients)
        assert result.score > 20
        assert result.score <= 60

    def test_vague_terms_add_to_score(self):
        ingredients = [
            make_ingredient("Flavouring", "flavouring"),
            make_ingredient("Natural Flavouring", "natural flavouring"),
            make_ingredient("Modified Starch", "modified starch", is_additive=True, concern_level=1),
            make_ingredient("Yeast Extract", "yeast extract"),
        ]
        result = calculate_score(ingredients)
        assert result.score > 0
        assert any("vague" in f.lower() or "broad" in f.lower() for f in result.contributing_factors)


# ── High concern product ───────────────────────────────────────────────────

class TestHighConcernProduct:
    def test_controversial_additives_push_score_high(self):
        ingredients = [
            make_ingredient("Carbonated Water", "carbonated water"),
            make_ingredient("Sugar", "sugar"),
            make_ingredient("E951", "aspartame", is_additive=True, concern_level=3, additive_type="Sweetener", e_number="E951"),
            make_ingredient("E211", "sodium benzoate", is_additive=True, concern_level=3, additive_type="Preservative", e_number="E211"),
            make_ingredient("E102", "tartrazine", is_additive=True, concern_level=3, additive_type="Colour", e_number="E102"),
            make_ingredient("E110", "sunset yellow fcf", is_additive=True, concern_level=3, additive_type="Colour", e_number="E110"),
            make_ingredient("E950", "acesulfame k", is_additive=True, concern_level=2, additive_type="Sweetener", e_number="E950"),
            make_ingredient("Natural Flavouring", "natural flavouring"),
            make_ingredient("Glucose Syrup", "glucose syrup"),
        ]
        result = calculate_score(ingredients)
        assert result.score >= 61
        assert result.band_label in ("Attention Needed", "Highly Processed")

    def test_artificial_sweeteners_flagged(self):
        ingredients = [
            make_ingredient("Water", "water"),
            make_ingredient("Aspartame", "aspartame", is_additive=True, concern_level=3, e_number="E951"),
        ]
        result = calculate_score(ingredients)
        assert any("sweetener" in f.lower() for f in result.contributing_factors)

    def test_multiple_sugars_flagged(self):
        ingredients = [
            make_ingredient("Sugar", "sugar"),
            make_ingredient("Glucose Syrup", "glucose syrup"),
            make_ingredient("High Fructose Corn Syrup", "high fructose corn syrup"),
            make_ingredient("Dextrose", "dextrose"),
        ]
        result = calculate_score(ingredients)
        assert any("sugar" in f.lower() for f in result.contributing_factors)


# ── Sensitivity modifier ───────────────────────────────────────────────────

class TestSensitivityModifier:
    def test_positive_modifier_increases_score(self):
        ingredients = [make_ingredient("Oats", "oats")]
        base = calculate_score(ingredients, sensitivity_modifier=0)
        boosted = calculate_score(ingredients, sensitivity_modifier=10)
        assert boosted.score == base.score + 10

    def test_score_clamps_at_100(self):
        ingredients = [
            make_ingredient("E102", "tartrazine", is_additive=True, concern_level=3, e_number="E102"),
            make_ingredient("E110", "sunset yellow fcf", is_additive=True, concern_level=3, e_number="E110"),
            make_ingredient("E211", "sodium benzoate", is_additive=True, concern_level=3, e_number="E211"),
            make_ingredient("E951", "aspartame", is_additive=True, concern_level=3, e_number="E951"),
        ]
        result = calculate_score(ingredients, sensitivity_modifier=100)
        assert result.score == 100

    def test_score_clamps_at_0(self):
        ingredients = [make_ingredient("Water", "water")]
        result = calculate_score(ingredients, sensitivity_modifier=-50)
        assert result.score == 0


# ── Raw ingredient string convenience function ─────────────────────────────

class TestRawIngredientScoring:
    def test_score_from_raw_clean(self):
        from app.services.scoring import calculate_score_from_raw

        result = calculate_score_from_raw("Oats, Honey, Sea Salt, Sunflower Oil")
        assert result.score <= 30

    def test_score_from_raw_with_e_numbers(self):
        from app.services.scoring import calculate_score_from_raw

        raw = "Water, Sugar, E951 (Aspartame), E211 (Sodium Benzoate), E102 (Tartrazine)"
        result = calculate_score_from_raw(raw)
        assert result.score > 20
