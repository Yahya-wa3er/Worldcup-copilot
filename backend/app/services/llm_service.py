import logging
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from app.rag.retrieval import rag_service
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Tu es WorldCup Copilot, un assistant expert de la Coupe du Monde 2026.
Tu aides les supporters avec :
- Les matchs, scores, équipes et joueurs
- La planification du voyage (vols, hôtels, transport)
- Les informations sur les stades
- L'estimation du budget

Faits importants :
- La Coupe du Monde 2026 est organisée par USA, Canada et Mexique
- 48 équipes, 104 matchs, 16 villes hôtes
- Du 11 juin au 19 juillet 2026
- La finale est au MetLife Stadium, New Jersey

Réponds toujours dans la langue de l'utilisateur.
Sois précis, concis (3-4 phrases max sauf demande explicite) et enthousiaste pour le football !"""


def _build_llm():
    if settings.LLM_PROVIDER == "groq":
        from langchain_groq import ChatGroq
        return ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model="llama-3.3-70b-versatile",  # Llama3 70B sur Groq
            temperature=0.7,
            max_tokens=512,
        )
    else:
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model="llama3.2:3b",
            temperature=0.7,
            num_predict=300,
        )


class LLMService:

    def __init__(self):
        self._llm = None

    @property
    def llm(self):
        if self._llm is None:
            logger.info(f"Chargement LLM provider: {settings.LLM_PROVIDER}")
            self._llm = _build_llm()
        return self._llm

    async def _prepare_messages_async(
            self, user_message: str, history: list, use_rag: bool
    ) -> list:
        from app.services.live_context_service import get_live_context

        # Fetch en parallèle pour gagner du temps
        import asyncio
        rag_context, live_context = await asyncio.gather(
            asyncio.to_thread(rag_service.retrieve, user_message) if use_rag else asyncio.sleep(0),
            get_live_context()
        )

        if not use_rag:
            rag_context = ""

        # ── Le contexte live EN PREMIER — Groq lit de haut en bas
        system_content = ""

        if live_context:
            system_content += f"""=== DONNÉES OFFICIELLES EN TEMPS RÉEL ===
    {live_context}
    =========================================

    Ces données sont OFFICIELLES et À JOUR. Utilise-les en priorité absolue pour répondre.
    Si une information est dans ces données, donne-la directement sans dire que tu ne sais pas.

    """

        # ── Puis le prompt système
        system_content += SYSTEM_PROMPT

        # ── Puis le RAG
        if rag_context:
            system_content += f"\n\n📚 BASE DE CONNAISSANCES WC 2026 :\n{rag_context}"

        messages = [SystemMessage(content=system_content)]

        for msg in history[-6:]:  # réduit à 6 pour alléger le contexte
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=user_message))
        return messages

    async def generate(
            self, user_message: str, history: list = [], use_rag: bool = True
    ) -> dict:
        messages = await self._prepare_messages_async(user_message, history, use_rag)
        response = await self.llm.ainvoke(messages)
        return {
            "content": response.content,
            "rag_used": use_rag,
        }

    async def stream_generate(
            self, user_message: str, history: list = [], use_rag: bool = True
    ):
        messages = await self._prepare_messages_async(user_message, history, use_rag)
        async for chunk in self.llm.astream(messages):
            if chunk.content:
                yield chunk.content


llm_service = LLMService()