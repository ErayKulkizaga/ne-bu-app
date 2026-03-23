"""
Seed script: populates AdditiveProfile, Ingredient, and Product tables
from backend/app/seed/data/products.json.

Idempotent: re-running will not create duplicates.

Usage (from backend/ directory):
    python -m app.seed.seed_products
"""
import json
import sys
from pathlib import Path

# Ensure the backend root is on sys.path when run as a script
sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from app.database import SessionLocal, engine, Base
from app.models import (  # noqa: F401 — registers all models with Base
    Product,
    Ingredient,
    AdditiveProfile,
)


DATA_FILE = Path(__file__).parent / "data" / "products.json"


def seed() -> None:
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)

    with open(DATA_FILE, encoding="utf-8") as f:
        data = json.load(f)

    db = SessionLocal()
    try:
        _seed_additives(db, data["additives"])
        _seed_ingredients(db, data["ingredients"])
        _seed_products(db, data["products"])
        db.commit()
        print("Seed complete.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


def _seed_additives(db, additives: list[dict]) -> None:
    count = 0
    for entry in additives:
        exists = db.query(AdditiveProfile).filter(AdditiveProfile.e_number == entry["e_number"]).first()
        if exists:
            continue
        db.add(
            AdditiveProfile(
                e_number=entry["e_number"],
                name=entry["name"],
                category=entry.get("category"),
                concern_level=entry.get("concern_level", 0),
                notes=entry.get("notes"),
            )
        )
        count += 1
    print(f"  Additives: inserted {count} new records")


def _seed_ingredients(db, ingredients: list[dict]) -> None:
    count = 0
    for entry in ingredients:
        exists = db.query(Ingredient).filter(Ingredient.normalized_name == entry["normalized_name"]).first()
        if exists:
            continue
        db.add(
            Ingredient(
                name=entry["name"],
                normalized_name=entry["normalized_name"],
                e_number=entry.get("e_number"),
                is_additive=entry.get("is_additive", False),
                additive_type=entry.get("additive_type"),
                concern_level=entry.get("concern_level", 0),
                description=entry.get("description"),
            )
        )
        count += 1

    print(f"  Ingredients: inserted {count} new records")


def _seed_products(db, products: list[dict]) -> None:
    count = 0
    for entry in products:
        exists = (
            db.query(Product).filter(Product.barcode == entry.get("barcode")).first()
            if entry.get("barcode")
            else None
        )
        if exists:
            continue
        db.add(
            Product(
                barcode=entry.get("barcode"),
                name=entry["name"],
                brand=entry.get("brand"),
                category=entry.get("category"),
                raw_ingredients=entry.get("raw_ingredients"),
            )
        )
        count += 1
    print(f"  Products: inserted {count} new records")


if __name__ == "__main__":
    seed()
