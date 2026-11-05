"""
FastAPI application entrypoint for the AI-First HCP CRM backend.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import interactions, chat

# Import models so they register with Base.metadata before create_all
from app.models import hcp, interaction, followup  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-First HCP CRM API",
    description="Backend for the HCP Log Interaction module — structured form + conversational AI chat.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interactions.router)
app.include_router(chat.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "env": settings.ENV}
