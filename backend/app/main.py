from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import health, products, analysis, recommendations, basket, ocr

settings = get_settings()

app = FastAPI(
    title="NeBU API",
    description="AI-assisted food ingredient analysis backend for the NeBU mobile app.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(basket.router, prefix="/basket", tags=["Basket"])
app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])


@app.on_event("startup")
async def startup_event() -> None:
    pass
