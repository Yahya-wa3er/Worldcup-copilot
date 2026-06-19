from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.models.models import ChatSession, ChatMessage
import uuid


class ChatRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_session(self) -> ChatSession:
        session = ChatSession(id=str(uuid.uuid4()))
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_session(self, session_id: str) -> ChatSession:
        result = await self.db.execute(
            select(ChatSession).where(ChatSession.id == session_id)
        )
        return result.scalar_one_or_none()

    async def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
    ) -> ChatMessage:
        message = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            role=role,
            content=content,
        )
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def get_history(self, session_id: str) -> list:
        result = await self.db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
        )
        messages = result.scalars().all()
        return [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]