from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.models.models import Team


class TeamRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        result = await self.db.execute(select(Team))
        return result.scalars().all()

    async def get_by_id(self, team_id: int):
        result = await self.db.execute(
            select(Team).where(Team.id == team_id)
        )
        return result.scalar_one_or_none()

    async def create(self, team_data: dict):
        team = Team(**team_data)
        self.db.add(team)
        await self.db.commit()
        await self.db.refresh(team)
        return team