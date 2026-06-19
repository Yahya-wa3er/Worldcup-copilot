from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.models.models import Match, Team, Stadium


class MatchRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        result = await self.db.execute(
            select(Match)
        )
        return result.scalars().all()

    async def get_by_id(self, match_id: int):
        result = await self.db.execute(
            select(Match).where(Match.id == match_id)
        )
        return result.scalar_one_or_none()

    async def create(self, match_data: dict):
        match = Match(**match_data)
        self.db.add(match)
        await self.db.commit()
        await self.db.refresh(match)
        return match