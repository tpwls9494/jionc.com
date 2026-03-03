"""Enforce case-insensitive uniqueness for usernames

Revision ID: 202603030007
Revises: 202603030006
Create Date: 2026-03-03 12:30:00
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "202603030007"
down_revision: Union[str, None] = "202603030006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE users SET username = BTRIM(username)")
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (
                SELECT LOWER(username)
                FROM users
                GROUP BY LOWER(username)
                HAVING COUNT(*) > 1
            ) THEN
                RAISE EXCEPTION 'Duplicate usernames found when ignoring case';
            END IF;
        END
        $$;
        """
    )
    op.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS uq_users_username_lower ON users (LOWER(username))"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS uq_users_username_lower")
