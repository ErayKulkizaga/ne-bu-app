"""
Integration tests for the /products and /health API routes.

Uses an in-memory SQLite database to avoid requiring a running PostgreSQL instance.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.product import Product

SQLITE_URL = "sqlite:///./test_nebu.db"

engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def seeded_product():
    db = TestingSessionLocal()
    product = Product(
        barcode="1234567890123",
        name="Test Oat Biscuit",
        brand="TestBrand",
        category="Biscuits",
        raw_ingredients="Oats, Wheat Flour, Sugar, Sunflower Oil, Salt",
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    pid = product.id
    db.close()
    return pid


# ── Health ─────────────────────────────────────────────────────────────────

class TestHealth:
    def test_health_returns_200(self, client):
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_response_shape(self, client):
        data = client.get("/health").json()
        assert data["status"] == "ok"
        assert "version" in data


# ── Products ───────────────────────────────────────────────────────────────

class TestProductSearch:
    def test_search_empty_returns_list(self, client):
        response = client.get("/products")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_search_by_name(self, client, seeded_product):
        response = client.get("/products", params={"query": "Oat"})
        assert response.status_code == 200
        results = response.json()
        assert len(results) >= 1
        assert any("Oat" in r["name"] for r in results)

    def test_search_by_barcode(self, client, seeded_product):
        response = client.get("/products", params={"query": "1234567890123"})
        assert response.status_code == 200
        results = response.json()
        assert len(results) >= 1
        assert results[0]["barcode"] == "1234567890123"

    def test_search_no_match(self, client):
        response = client.get("/products", params={"query": "xyznotexist"})
        assert response.status_code == 200
        assert response.json() == []


class TestProductDetail:
    def test_get_existing_product(self, client, seeded_product):
        response = client.get(f"/products/{seeded_product}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == seeded_product
        assert data["name"] == "Test Oat Biscuit"
        assert data["brand"] == "TestBrand"

    def test_get_nonexistent_product(self, client):
        response = client.get("/products/99999")
        assert response.status_code == 404

    def test_product_response_has_required_fields(self, client, seeded_product):
        data = client.get(f"/products/{seeded_product}").json()
        required = {"id", "name", "brand", "category", "barcode", "raw_ingredients", "created_at", "updated_at"}
        assert required.issubset(data.keys())


class TestProductCreate:
    def test_create_product(self, client):
        payload = {
            "name": "New Test Product",
            "brand": "BrandX",
            "category": "Snacks",
            "barcode": "9999999999999",
            "raw_ingredients": "Potato, Salt, Oil",
        }
        response = client.post("/products", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Test Product"
        assert data["id"] is not None
