"""
Signal repository.
"""

from typing import Optional, Sequence
from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from shared.db.models.signal import Signal
from shared.db.repositories.base import BaseRepository


class SignalRepository(BaseRepository[Signal]):
    """Repository for Signal model."""

    def __init__(self, session: AsyncSession):
        super().__init__(session, Signal)

    async def get_by_external_id(self, external_id: str) -> Optional[Signal]:
        """Get signal by external ID."""
        result = await self.session.execute(
            select(Signal).where(Signal.external_id == external_id)
        )
        return result.scalar_one_or_none()

    async def exists_by_external_id(self, external_id: str) -> bool:
        """Check if signal with external ID exists."""
        result = await self.session.execute(
            select(func.count())
            .select_from(Signal)
            .where(Signal.external_id == external_id)
        )
        return (result.scalar() or 0) > 0

    async def get_for_movie(
        self,
        movie_id: UUID,
        *,
        signal_type: Optional[str] = None,
        importance: Optional[str] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Sequence[Signal]:
        """Get signals for a movie."""
        query = select(Signal).where(Signal.movie_id == movie_id)

        if signal_type:
            query = query.where(Signal.signal_type == signal_type)
        if importance:
            query = query.where(Signal.importance == importance)

        query = (
            query.order_by(Signal.published_at.desc().nullslast())
            .offset(offset)
            .limit(limit)
        )

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_unclassified(self, limit: int = 100) -> Sequence[Signal]:
        """Get unclassified signals."""
        result = await self.session.execute(
            select(Signal)
            .where(Signal.is_classified == False)
            .order_by(Signal.created_at)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_recent(
        self,
        *,
        hours: int = 24,
        signal_type: Optional[str] = None,
        importance: Optional[str] = None,
        movie_id: Optional[UUID] = None,
        offset: int = 0,
        limit: int = 100,
    ) -> Sequence[Signal]:
        """Get recent signals."""
        since = datetime.utcnow() - timedelta(hours=hours)
        query = select(Signal).where(
            Signal.published_at >= since,
            Signal.is_published == True,
        )

        if signal_type:
            query = query.where(Signal.signal_type == signal_type)
        if importance:
            query = query.where(Signal.importance == importance)
        if movie_id:
            query = query.where(Signal.movie_id == movie_id)

        query = query.order_by(Signal.published_at.desc()).offset(offset).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_stats(
        self,
        *,
        days: int = 7,
        movie_id: Optional[UUID] = None,
    ) -> dict:
        """Get signal statistics."""
        since = datetime.utcnow() - timedelta(days=days)
        base_filter = and_(
            Signal.published_at >= since,
            Signal.is_published == True,
        )

        if movie_id:
            base_filter = and_(base_filter, Signal.movie_id == movie_id)

        # Total count
        total_result = await self.session.execute(
            select(func.count()).select_from(Signal).where(base_filter)
        )
        total = total_result.scalar() or 0

        # By type
        type_result = await self.session.execute(
            select(Signal.signal_type, func.count())
            .where(base_filter)
            .group_by(Signal.signal_type)
        )
        by_type = dict(type_result.all())

        # By importance
        importance_result = await self.session.execute(
            select(Signal.importance, func.count())
            .where(base_filter)
            .group_by(Signal.importance)
        )
        by_importance = dict(importance_result.all())

        # By sentiment
        sentiment_result = await self.session.execute(
            select(Signal.sentiment, func.count())
            .where(base_filter)
            .group_by(Signal.sentiment)
        )
        by_sentiment = dict(sentiment_result.all())

        return {
            "total": total,
            "by_type": by_type,
            "by_importance": by_importance,
            "by_sentiment": by_sentiment,
        }
