"""
Movie repository.
"""

from typing import Optional, Sequence
from datetime import date

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from shared.db.models.movie import Movie
from shared.db.repositories.base import BaseRepository


class MovieRepository(BaseRepository[Movie]):
    """Repository for Movie model."""

    def __init__(self, session: AsyncSession):
        super().__init__(session, Movie)

    async def get_by_slug(self, slug: str) -> Optional[Movie]:
        """Get movie by slug."""
        result = await self.session.execute(
            select(Movie)
            .where(Movie.slug == slug)
            .options(selectinload(Movie.distributor))
        )
        return result.scalar_one_or_none()

    async def get_by_kinopoisk_id(self, kinopoisk_id: str) -> Optional[Movie]:
        """Get movie by Kinopoisk ID."""
        result = await self.session.execute(
            select(Movie).where(Movie.kinopoisk_id == kinopoisk_id)
        )
        return result.scalar_one_or_none()

    async def get_active(
        self,
        *,
        offset: int = 0,
        limit: int = 50,
        release_from: Optional[date] = None,
        release_to: Optional[date] = None,
    ) -> Sequence[Movie]:
        """Get active movies with optional date filters."""
        query = select(Movie).where(Movie.is_active == True)

        if release_from:
            query = query.where(Movie.release_date >= release_from)
        if release_to:
            query = query.where(Movie.release_date <= release_to)

        query = (
            query.order_by(Movie.release_date.desc().nullslast())
            .offset(offset)
            .limit(limit)
        )

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_featured(self, limit: int = 10) -> Sequence[Movie]:
        """Get featured movies."""
        result = await self.session.execute(
            select(Movie)
            .where(and_(Movie.is_active == True, Movie.is_featured == True))
            .order_by(Movie.release_date.desc().nullslast())
            .limit(limit)
        )
        return result.scalars().all()

    async def search(
        self,
        query: str,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> Sequence[Movie]:
        """Search movies by title."""
        search_pattern = f"%{query}%"
        result = await self.session.execute(
            select(Movie)
            .where(
                or_(
                    Movie.title.ilike(search_pattern),
                    Movie.original_title.ilike(search_pattern),
                )
            )
            .order_by(Movie.release_date.desc().nullslast())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_by_distributor(
        self,
        distributor_slug: str,
        *,
        offset: int = 0,
        limit: int = 50,
    ) -> Sequence[Movie]:
        """Get movies by distributor."""
        from shared.db.models.distributor import Distributor

        result = await self.session.execute(
            select(Movie)
            .join(Movie.distributor)
            .where(Distributor.slug == distributor_slug)
            .order_by(Movie.release_date.desc().nullslast())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()
