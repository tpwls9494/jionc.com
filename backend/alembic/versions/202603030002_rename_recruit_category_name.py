"""Rename recruit category to team 모집

Revision ID: 202603030002
Revises: 202603030001
Create Date: 2026-03-03 22:20:00
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "202603030002"
down_revision: Union[str, None] = "202603030001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE categories
        SET name = '팀 모집'
        WHERE slug = 'team-recruit'
          AND name <> '팀 모집'
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE categories
        SET name = '팀 추천(모집)'
        WHERE slug = 'team-recruit'
          AND name = '팀 모집'
        """
    )
