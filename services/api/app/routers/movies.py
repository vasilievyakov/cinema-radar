"""
Movies router.
"""

from typing import Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from shared.db import get_session
from shared.db.repositories.movies import MovieRepository
from shared.schemas.movie import MovieResponse, MovieListResponse

router = APIRouter()


@router.get("", response_model=MovieListResponse)
async def list_movies(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    release_from: Optional[date] = None,
    release_to: Optional[date] = None,
    distributor: Optional[str] = None,
    featured: bool = False,
    session: AsyncSession = Depends(get_session),
):
    """List movies with filters."""
    repo = MovieRepository(session)
    offset = (page - 1) * per_page

    if search:
        movies = await repo.search(search, offset=offset, limit=per_page)
        total = len(movies)  # Simplified for demo
    elif featured:
        movies = await repo.get_featured(limit=per_page)
        total = len(movies)
    elif distributor:
        movies = await repo.get_by_distributor(
            distributor, offset=offset, limit=per_page
        )
        total = len(movies)
    else:
        movies = await repo.get_active(
            offset=offset,
            limit=per_page,
            release_from=release_from,
            release_to=release_to,
        )
        total = await repo.count()

    return MovieListResponse(
        movies=[
            MovieResponse(
                **{
                    **movie.__dict__,
                    "distributor_name": movie.distributor.name
                    if movie.distributor
                    else None,
                }
            )
            for movie in movies
        ],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{slug}", response_model=MovieResponse)
async def get_movie(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    """Get movie by slug."""
    repo = MovieRepository(session)
    movie = await repo.get_by_slug(slug)

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return MovieResponse(
        **{
            **movie.__dict__,
            "distributor_name": movie.distributor.name if movie.distributor else None,
        }
    )
