"""
Ingredient normalizer.

Maps raw ingredient tokens to known Ingredient records in the database.
Uses E-number exact matching first, then normalized name lookup,
then falls back to creating a transient unrecognized ingredient stub.
"""
import re
from sqlalchemy.orm import Session

from app.models.ingredient import Ingredient
from app.services.parser import extract_e_number


def normalize_token(token: str) -> str:
    """Lowercase, strip parentheticals, collapse whitespace."""
    cleaned = re.sub(r"\(.*?\)", "", token)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().lower()
    return cleaned


def resolve_ingredient(token: str, db: Session) -> Ingredient | None:
    """
    Try to match a raw token to an existing Ingredient row.
    Returns None if no match is found (caller decides how to handle).
    """
    e_num = extract_e_number(token)
    if e_num:
        result = db.query(Ingredient).filter(Ingredient.e_number == e_num).first()
        if result:
            return result

    normalized = normalize_token(token)
    result = db.query(Ingredient).filter(Ingredient.normalized_name == normalized).first()
    return result


def resolve_ingredients(tokens: list[str], db: Session) -> list[dict]:
    """
    For each token, attempt DB resolution.
    Returns a list of dicts with keys: raw_text, ingredient (or None), e_number.
    """
    results: list[dict] = []
    for position, token in enumerate(tokens):
        ingredient = resolve_ingredient(token, db)
        e_num = extract_e_number(token)
        results.append(
            {
                "position": position,
                "raw_text": token,
                "ingredient": ingredient,
                "e_number": e_num,
            }
        )
    return results
