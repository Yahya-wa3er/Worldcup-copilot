from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class HotelResponse(BaseModel):
    id: int
    name: str
    city: str
    country: str
    stars: Optional[int] = None
    price_per_night: Optional[float] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True


class BudgetRequest(BaseModel):
    origin_city: str
    destination_city: str
    nb_persons: int = 1
    nb_nights: int = 3


class BudgetResponse(BaseModel):
    origin_city: str
    destination_city: str
    nb_persons: int
    nb_nights: int
    flight_cost: float
    hotel_cost: float
    transport_cost: float
    total_cost: float
    details: dict

    class Config:
        from_attributes = True