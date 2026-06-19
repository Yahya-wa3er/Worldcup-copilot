from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.database.repositories.match_repository import MatchRepository
from app.schemas.match import MatchCreate, MatchResponse
from app.services.football_service import football_service
from typing import List

router = APIRouter()


@router.get("/")
async def get_matches(db: AsyncSession = Depends(get_db)):
    """Récupère les matchs depuis l'API football."""
    try:
        data = await football_service.get_matches()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/standings")
async def get_standings():
    try:
        data = await football_service.get_standings()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scorers")
async def get_scorers():
    """Récupère les meilleurs buteurs."""
    try:
        data = await football_service.get_scorers()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))