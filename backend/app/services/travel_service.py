from typing import Optional


# Coûts moyens estimés par ville hôte (en USD)
CITY_DATA = {
    "New York": {"hotel_avg": 200, "transport_daily": 30, "flight_base": 800},
    "Los Angeles": {"hotel_avg": 180, "transport_daily": 25, "flight_base": 750},
    "Miami": {"hotel_avg": 160, "transport_daily": 20, "flight_base": 700},
    "Dallas": {"hotel_avg": 130, "transport_daily": 20, "flight_base": 650},
    "San Francisco": {"hotel_avg": 220, "transport_daily": 35, "flight_base": 780},
    "Seattle": {"hotel_avg": 150, "transport_daily": 25, "flight_base": 720},
    "Boston": {"hotel_avg": 170, "transport_daily": 25, "flight_base": 730},
    "Atlanta": {"hotel_avg": 140, "transport_daily": 20, "flight_base": 660},
    "Kansas City": {"hotel_avg": 120, "transport_daily": 15, "flight_base": 620},
    "Philadelphia": {"hotel_avg": 150, "transport_daily": 20, "flight_base": 690},
    "Toronto": {"hotel_avg": 160, "transport_daily": 25, "flight_base": 710},
    "Vancouver": {"hotel_avg": 170, "transport_daily": 25, "flight_base": 740},
    "Mexico City": {"hotel_avg": 100, "transport_daily": 15, "flight_base": 580},
    "Guadalajara": {"hotel_avg": 90, "transport_daily": 12, "flight_base": 560},
    "Monterrey": {"hotel_avg": 95, "transport_daily": 12, "flight_base": 570},
}


class TravelService:

    def estimate_budget(
        self,
        origin_city: str,
        destination_city: str,
        nb_persons: int = 1,
        nb_nights: int = 3,
    ) -> dict:
        """
        Estime le coût total d'un voyage pour un match de la Coupe du Monde.
        """
        city = CITY_DATA.get(destination_city)

        if not city:
            # Valeurs par défaut si ville inconnue
            city = {"hotel_avg": 150, "transport_daily": 25, "flight_base": 700}

        flight_cost = city["flight_base"] * nb_persons
        hotel_cost = city["hotel_avg"] * nb_nights * nb_persons
        transport_cost = city["transport_daily"] * nb_nights * nb_persons
        total = flight_cost + hotel_cost + transport_cost

        return {
            "origin_city": origin_city,
            "destination_city": destination_city,
            "nb_persons": nb_persons,
            "nb_nights": nb_nights,
            "flight_cost": round(flight_cost, 2),
            "hotel_cost": round(hotel_cost, 2),
            "transport_cost": round(transport_cost, 2),
            "total_cost": round(total, 2),
            "details": {
                "flight_per_person": city["flight_base"],
                "hotel_per_night": city["hotel_avg"],
                "transport_per_day": city["transport_daily"],
                "currency": "USD",
                "note": "Estimation basée sur les prix moyens 2026",
            },
        }

    def get_host_cities(self) -> list:
        """Retourne la liste des villes hôtes avec leurs infos."""
        return [
            {"city": city, "data": data}
            for city, data in CITY_DATA.items()
        ]


travel_service = TravelService()