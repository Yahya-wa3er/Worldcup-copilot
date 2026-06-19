from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TeamBase(BaseModel):
    name: str
    short_name: str
    coach: Optional[str] = None
    fifa_ranking: Optional[int] = None
    confederation: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True