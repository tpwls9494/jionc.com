"""Add ai_action_logs table

Revision ID: 202603050001
Revises: 202603030008
Create Date: 2026-03-05 10:20:00
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "202603050001"
down_revision: Union[str, None] = "202603030008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS ai_action_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
            endpoint VARCHAR(60) NOT NULL,
            source VARCHAR(40) NOT NULL,
            intent VARCHAR(40) NULL,
            action VARCHAR(40) NULL,
            input_hash VARCHAR(64) NULL,
            status VARCHAR(30) NOT NULL,
            model VARCHAR(120) NULL,
            latency_ms FLOAT NULL,
            prompt_tokens INTEGER NULL,
            completion_tokens INTEGER NULL,
            total_tokens INTEGER NULL,
            cost_usd FLOAT NULL,
            error_message TEXT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_user_id ON ai_action_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_endpoint ON ai_action_logs (endpoint)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_source ON ai_action_logs (source)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_intent ON ai_action_logs (intent)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_action ON ai_action_logs (action)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_status ON ai_action_logs (status)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_input_hash ON ai_action_logs (input_hash)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_ai_action_logs_created_at ON ai_action_logs (created_at)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS ai_action_logs")
