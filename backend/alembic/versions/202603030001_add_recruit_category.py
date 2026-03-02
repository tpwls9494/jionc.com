"""Add recruit-only community category

Revision ID: 202603030001
Revises: 202603020002
Create Date: 2026-03-03 21:40:00
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "202603030001"
down_revision: Union[str, None] = "202603020002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO categories (name, description, slug, icon, "order", is_active)
        SELECT
            '팀 모집',
            '프로젝트/스터디 팀 모집 게시판',
            'team-recruit',
            '🤝',
            COALESCE((SELECT MAX("order") + 1 FROM categories), 1),
            TRUE
        WHERE NOT EXISTS (
            SELECT 1
            FROM categories
            WHERE slug = 'team-recruit' OR name IN ('팀 모집', '팀 추천(모집)')
        )
        """
    )


def downgrade() -> None:
    # Keep existing data on downgrade to avoid foreign key issues with posts.
    pass
