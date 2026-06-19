from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.database.models import models
from app.api import matches, teams, travel, chatbot
from app.rag.vector_store import vector_store

@asynccontextmanager
async def lifespan(app: FastAPI):
    # DB
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # RAG
    vector_store.load_index()
    # Précharger le modèle d'embeddings au démarrage
    from app.rag.embeddings import embedding_service
    embedding_service.model
    yield
    await engine.dispose()

app = FastAPI(
    title="WorldCup Copilot 2026",
    description="AI-powered assistant for FIFA World Cup 2026",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(travel.router, prefix="/api/travel", tags=["Travel"])

app.include_router(chatbot.router, prefix="/api/chat", tags=["Chatbot"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "WorldCup Copilot 2026"}