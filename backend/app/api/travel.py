from fastapi import APIRouter
from app.schemas.travel import BudgetRequest, BudgetResponse
from app.services.travel_service import travel_service

router = APIRouter()


@router.post("/budget", response_model=BudgetResponse)
async def estimate_budget(request: BudgetRequest):
    """Estime le coût total d'un voyage pour un match."""
    result = travel_service.estimate_budget(
        origin_city=request.origin_city,
        destination_city=request.destination_city,
        nb_persons=request.nb_persons,
        nb_nights=request.nb_nights,
    )
    return result


@router.get("/cities")
async def get_host_cities():
    """Retourne toutes les villes hôtes de la Coupe du Monde 2026."""
    return travel_service.get_host_cities()