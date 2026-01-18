"""
Source repository.
"""

from typing import Optional, Sequence
from datetime import datetime, timedelta

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from shared.db.models.source import Source
from shared.db.repositories.base import BaseRepository


class SourceRepository(BaseRepository[Source]):
    """Repository for Source model."""

    def __init__(self, session: AsyncSession):
        super().__init__(session, Source)

    async def get_by_url(self, url: str) -> Optional[Source]:
        """Get source by URL."""
        result = await self.session.execute(select(Source).where(Source.url == url))
        return result.scalar_one_or_none()

    async def get_active_by_type(self, source_type: str) -> Sequence[Source]:
        """Get active sources by type."""
        result = await self.session.execute(
            select(Source).where(
                and_(
                    Source.type == source_type,
                    Source.is_active == True,
                )
            )
        )
        return result.scalars().all()

    async def get_due_for_check(self) -> Sequence[Source]:
        """Get sources that are due for checking."""
        now = datetime.utcnow()
        result = await self.session.execute(
            select(Source).where(
                and_(
                    Source.is_active == True,
                    # Either never checked or check interval passed
                    (Source.last_checked_at == None)
                    | (
                        Source.last_checked_at
                        < now - timedelta(hours=1) * Source.check_frequency_hours
                    ),
                )
            )
        )
        return result.scalars().all()

    async def mark_checked(self, source: Source, error: Optional[str] = None) -> Source:
        """Mark source as checked."""
        source.last_checked_at = datetime.utcnow()
        source.last_error = error
        await self.session.flush()
        return source
