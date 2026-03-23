# NeBU — Know What's In Your Food

**NeBU** is an AI-assisted mobile app that analyses food and market products based on their ingredients. Users can search by product name or barcode to get an ingredient breakdown, a deterministic risk score, plain-language explanation cards, and cleaner product alternatives.

> **Disclaimer:** NeBU is an informational tool only. Nothing in this application constitutes medical, nutritional, or dietary advice.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo + TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Backend | FastAPI + Python 3.11+ |
| Database | PostgreSQL 15+ |
| ORM | SQLAlchemy 2 |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| API docs | Swagger UI (`/docs`) |
| Testing | Pytest + FastAPI TestClient |

---

## Monorepo Structure

```
ne-bu-app/
├── apps/
│   └── mobile/          # Expo React Native app
├── backend/             # FastAPI backend
└── docs/
    └── architecture.md  # System design notes
```

---

## Prerequisites

- **Python** 3.11+
- **Node.js** 20+ and npm / pnpm
- **Expo CLI** (`npm install -g expo-cli`)
- **PostgreSQL** 15+ (locally or via Docker)

---

## Local Setup

### 1. Clone and enter the repo

```bash
git clone https://github.com/your-username/ne-bu-app.git
cd ne-bu-app
```

### 2. Start PostgreSQL

Using Docker (recommended):

```bash
docker run --name nebu-postgres \
  -e POSTGRES_DB=nebu_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

Or use an existing local PostgreSQL instance and create the database:

```sql
CREATE DATABASE nebu_db;
```

### 3. Set up the backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if your database credentials differ

# Run database migrations
alembic upgrade head

# Seed sample data (products, ingredients, additives)
python -m app.seed.seed_products

# Start the development server
uvicorn app.main:app --reload --port 8000
```

API docs are available at: `http://localhost:8000/docs`

### 4. Set up the mobile app

```bash
cd apps/mobile

npm install

# Configure environment
cp .env.example .env
# Set EXPO_PUBLIC_API_URL=http://localhost:8000
# (or your machine's LAN IP if testing on a physical device)

npm start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with the Expo Go app.

---

## Running Tests

```bash
cd backend
pytest
```

Tests use an in-memory SQLite database and do not require a running PostgreSQL instance.

---

## Seed Data

The seed script populates the following:

- 12 realistic food products (chips, yoghurt, energy drink, biscuits, spreads, granola bars)
- ~19 common ingredients
- 27 additive profiles (E100–E960 subset) with concern levels and notes

Re-running the seed script is safe — it skips existing records.

---

## Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/products?query=` | Search by name or barcode |
| GET | `/products/{id}` | Product detail |
| POST | `/analysis/product/{id}` | Full ingredient analysis |
| POST | `/basket` | Create basket |
| POST | `/basket/{id}/items` | Add product to basket |
| GET | `/basket/{id}/summary` | Basket risk summary |
| GET | `/recommendations/product/{id}` | Cleaner alternatives |
| POST | `/ocr/upload` | Label photo OCR (placeholder — HTTP 501) |

---

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for:

- System diagram
- Analysis data flow
- Scoring rubric
- Database schema overview
- Service responsibilities
- Future roadmap

---

## Project Goals

- Portfolio-quality, production-style codebase
- Clean architecture with real separation of concerns
- Cautious, non-diagnostic consumer language throughout
- Modular service layer ready for LLM integration
- Fully typed — strict TypeScript on mobile, clean typing in Python

---

## License

MIT
