from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class AiActionLog(Base):
    __tablename__ = "ai_action_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    endpoint = Column(String(60), nullable=False, index=True)
    source = Column(String(40), nullable=False, index=True)
    intent = Column(String(40), nullable=True, index=True)
    action = Column(String(40), nullable=True, index=True)
    input_hash = Column(String(64), nullable=True, index=True)
    status = Column(String(30), nullable=False, index=True)
    model = Column(String(120), nullable=True)
    latency_ms = Column(Float, nullable=True)
    prompt_tokens = Column(Integer, nullable=True)
    completion_tokens = Column(Integer, nullable=True)
    total_tokens = Column(Integer, nullable=True)
    cost_usd = Column(Float, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User")
