from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.football_service import football_service

router = APIRouter()


@router.get("/")
async def get_teams():
    """Récupère les équipes depuis l'API football."""
    try:
        data = await football_service.get_teams()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))