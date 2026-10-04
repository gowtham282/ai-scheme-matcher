from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routes import auth, schemes, recommendations, eligibility, partners, applications, sources, admin

# Initialize DB tables
Base.metadata.create_all(bind=engine)

# Seed database on boot
with SessionLocal() as db:
    seed_database(db)

app = FastAPI(
    title="AI-Powered Government Scheme Matching & Recommendation Platform",
    description="SIH26092: AI Driven Scheme Matching for Marginalized Entrepreneurs. Official Data Only.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(eligibility.router, prefix=settings.API_V1_STR)
app.include_router(partners.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(sources.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

from .models import Scheme

@app.get("/")
def root():
    with SessionLocal() as db:
        count = db.query(Scheme).count()
    return {
        "platform": "AI-Powered Government Scheme Matching Platform",
        "hackathon": "Smart India Hackathon 2026 (SIH26092)",
        "philosophy": "Right Person -> Right Scheme -> Right Partner -> Right Guidance",
        "schemes_verified_count": count,
        "docs_url": "/docs",
        "api_v1": "/api"
    }

@app.get("/api/health")
def health_check():
    with SessionLocal() as db:
        count = db.query(Scheme).count()
    return {
        "status": "healthy",
        "database": "connected",
        "schemes_count": count,
        "audit_authority": "Official GoI / State Portals"
    }
