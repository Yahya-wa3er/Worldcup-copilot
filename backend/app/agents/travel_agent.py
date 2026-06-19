from app.services.llm_service import llm_service


class TravelAgent:
    """Agent spécialisé dans la planification de voyage."""

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


travel_agent = TravelAgent()