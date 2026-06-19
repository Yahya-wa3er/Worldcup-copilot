from app.services.llm_service import llm_service


class FootballAgent:
    """Agent spécialisé dans les questions football."""

    SYSTEM_EXTRA = """Tu es spécialisé dans le football.
    Tu connais les équipes, les joueurs, les tactiques et les statistiques.
    Quand on te demande une prédiction, base-toi sur le classement FIFA et l'historique."""

    async def answer(self, question: str, history: list = []) -> str:
        result = await llm_service.generate(
            user_message=question,
            history=history,
            use_rag=True,
        )
        return result["content"]

    # Exemple de ce que doit avoir travel_agent.py et football_agent.py
    async def stream_answer(self, message: str, history: list):
        # Appel de llm_service pour streamer
        async for text_chunk in llm_service.stream_generate(message, history):
            yield text_chunk


football_agent = FootballAgent()