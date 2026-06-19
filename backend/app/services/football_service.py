import httpx
from app.core.config import settings
from typing import Optional

class FootballService:

    def __init__(self):
        self._client = None

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=settings.FOOTBALL_API_BASE_URL,
                headers={"X-Auth-Token": settings.FOOTBALL_API_KEY},
                timeout=httpx.Timeout(15.0),
            )
        return self._client

    async def get_competitions(self):
        """Liste toutes les compétitions disponibles."""
        client = self._get_client()
        resp = await client.get("/competitions")
        resp.raise_for_status()
        return resp.json()

    async def get_matches(self, competition_id: str = "WC"):
        """Récupère tous les matchs d'une compétition."""
        client = self._get_client()
        resp = await client.get(f"/competitions/{competition_id}/matches")
        resp.raise_for_status()
        return resp.json()

    async def get_teams(self, competition_id: str = "WC"):
        """Récupère toutes les équipes d'une compétition."""
        client = self._get_client()
        resp = await client.get(f"/competitions/{competition_id}/teams")
        resp.raise_for_status()
        return resp.json()

    async def get_standings(self, competition_id: str = "WC"):
        """Récupère les classements."""
        client = self._get_client()
        resp = await client.get(f"/competitions/{competition_id}/standings")
        resp.raise_for_status()
        return resp.json()

    async def get_scorers(self, competition_id: str = "WC"):
        """Récupère les meilleurs buteurs."""
        client = self._get_client()
        resp = await client.get(
            f"/competitions/{competition_id}/scorers",
            params={"limit": 20}
        )
        resp.raise_for_status()
        return resp.json()


football_service = FootballService()