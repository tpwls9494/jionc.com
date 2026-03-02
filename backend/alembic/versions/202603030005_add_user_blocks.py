"""Add user block relationships

Revision ID: 202603030005
Revises: 202603030004
Create Date: 2026-03-04 00:20:00
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "202603030005"
down_revision: Union[str, None] = "202603030004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS user_blocks (
            id SERIAL PRIMARY KEY,
            blocker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            blocked_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_user_blocks_blocker_blocked UNIQUE (blocker_id, blocked_id),
            CONSTRAINT ck_user_blocks_no_self_block CHECK (blocker_id <> blocked_id)
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_user_blocks_blocker_id ON user_blocks (blocker_id)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_user_blocks_blocked_id ON user_blocks (blocked_id)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_user_blocks_created_at ON user_blocks (created_at)"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS user_blocks")
