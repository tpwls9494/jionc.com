from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class UserBlock(Base):
    __tablename__ = "user_blocks"
    __table_args__ = (
        UniqueConstraint(
            "blocker_id",
            "blocked_id",
            name="uq_user_blocks_blocker_blocked",
        ),
        CheckConstraint(
            "blocker_id <> blocked_id",
            name="ck_user_blocks_no_self_block",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    blocker_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    blocked_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    blocker = relationship("User", foreign_keys=[blocker_id], back_populates="blocking_links")
    blocked = relationship("User", foreign_keys=[blocked_id], back_populates="blocked_by_links")
