from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.agents.planner_agent import planner_agent
from app.database.repositories.chat_repository import ChatRepository
from fastapi.responses import StreamingResponse
import json

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    intent: str
    session_id: str


@router.post("/")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    repo = ChatRepository(db)

    # 1. Créer ou récupérer la session
    if request.session_id:
        session = await repo.get_session(request.session_id)
        if not session:
            session = await repo.create_session()
    else:
        session = await repo.create_session()

    # 2. Récupérer l'historique
    history = await repo.get_history(session.id)

    # Sauvegarder immédiatement le message de l'utilisateur en BDD
    await repo.add_message(session.id, "user", request.message)

    # 3. Générateur de flux qui appelle ".stream()" de planner_agent
    async def event_generator():
        full_response = ""
        intent_detected = "chat"

        # On appelle la nouvelle méthode .stream() que l'on a créée !
        async for chunk in planner_agent.stream(message=request.message, history=history):
            text_chunk = chunk.get("response", "")
            intent_detected = chunk.get("intent", "chat")
            full_response += text_chunk

            # On envoie chaque morceau au frontend ligne par ligne
            yield json.dumps({
                "response": text_chunk,
                "intent": intent_detected,
                "session_id": session.id
            }) + "\n"

        # 4. Une fois le streaming complètement fini, on sauvegarde la réponse globale de l'assistant en BDD
        if full_response:
            await repo.add_message(session.id, "assistant", full_response)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/{session_id}/history")
async def get_history(session_id: str, db: AsyncSession = Depends(get_db)):
    """Récupère l'historique d'une conversation."""
    repo = ChatRepository(db)
    history = await repo.get_history(session_id)
    return {"session_id": session_id, "messages": history}