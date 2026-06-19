from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.database.models.models import MatchStatus, MatchPhase


class MatchBase(BaseModel):
    home_team_id: int
    away_team_id: int
    stadium_id: Optional[int] = None
    kickoff_time: datetime
    phase: MatchPhase
    group_name: Optional[str] = None


class MatchCreate(MatchBase):
    pass


class MatchResponse(MatchBase):
    id: int
    status: MatchStatus
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True