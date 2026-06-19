from app.services.llm_service import llm_service
from app.agents.football_agent import football_agent
from app.agents.travel_agent import travel_agent
from fastapi.responses import StreamingResponse


class PlannerAgent:
    """
    Agent principal qui analyse la question
    et la redirige vers le bon agent spécialisé avec support du Streaming.
    """

    async def classify_intent(self, message: str) -> str:
        """Classification rapide par mots-clés — pas d'appel LLM."""
        msg = message.lower()

        travel_keywords = [
            "vol", "avion", "hôtel", "hotel", "voyage", "budget",
            "coût", "cout", "prix", "transport", "stade", "stadium",
            "billet", "ticket", "logement", "réserver",
        ]

        if any(k in msg for k in travel_keywords):
            return "travel"
        return "football"

    async def stream(self, message: str, history: list = []):
        """Analyse l'intention et cède le flux de morceaux de texte au routeur."""

        # 1. Classifier l'intention
        intent = await self.classify_intent(message)

        # 2. Rediriger vers la méthode de streaming du bon agent
        if intent == "football":
            # On suppose que football_agent aura une méthode .stream_answer()
            async for chunk in football_agent.stream_answer(message, history):
                yield {"intent": intent, "response": chunk}

        elif intent in ["travel", "budget", "stadium"]:
            # On suppose que travel_agent aura une méthode .stream_answer()
            async for chunk in travel_agent.stream_answer(message, history):
                yield {"intent": intent, "response": chunk}

        else:
            # Si aucun agent ne correspond, on streame directement depuis le service LLM global
            async for chunk in llm_service.stream_generate(message, history):
                # Adapter selon la structure de retour de votre llm_service (généralement du texte brut ou un dict)
                text_chunk = chunk if isinstance(chunk, str) else chunk.get("content", "")
                yield {"intent": intent, "response": text_chunk}


planner_agent = PlannerAgent()