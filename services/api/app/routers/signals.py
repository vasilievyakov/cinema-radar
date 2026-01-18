"""
Signals router.
"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from shared.db import get_session
from shared.db.repositories.signals import SignalRepository
from shared.db.repositories.movies import MovieRepository
from shared.schemas.signal import SignalResponse, SignalListResponse

router = APIRouter()


@router.get("", response_model=SignalListResponse)
async def list_signals(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    movie_slug: Optional[str] = None,
    signal_type: Optional[str] = None,
    importance: Optional[str] = None,
    hours: int = Query(168, ge=1, le=720),  # Default 7 days
    session: AsyncSession = Depends(get_session),
):
    """List signals with filters."""
    repo = SignalRepository(session)
    offset = (page - 1) * per_page

    # Get movie ID if slug provided
    movie_id = None
    if movie_slug:
        movie_repo = MovieRepository(session)
        movie = await movie_repo.get_by_slug(movie_slug)
        if movie:
            movie_id = movie.id

    signals = await repo.get_recent(
        hours=hours,
        signal_type=signal_type,
        importance=importance,
        movie_id=movie_id,
        offset=offset,
        limit=per_page,
    )

    # Build response with related data
    signal_responses = []
    for signal in signals:
        response = SignalResponse(
            **{
                **signal.__dict__,
                "movie_title": signal.movie.title if signal.movie else None,
                "source_name": signal.source.name if signal.source else None,
            }
        )
        signal_responses.append(response)

    return SignalListResponse(
        signals=signal_responses,
        total=len(signals),  # Simplified
        page=page,
        per_page=per_page,
    )


@router.get("/critical", response_model=SignalListResponse)
async def list_critical_signals(
    per_page: int = Query(10, ge=1, le=50),
    session: AsyncSession = Depends(get_session),
):
    """List critical signals."""
    repo = SignalRepository(session)

    signals = await repo.get_recent(
        hours=168,
        importance="critical",
        limit=per_page,
    )

    signal_responses = []
    for signal in signals:
        response = SignalResponse(
            **{
                **signal.__dict__,
                "movie_title": signal.movie.title if signal.movie else None,
                "source_name": signal.source.name if signal.source else None,
            }
        )
        signal_responses.append(response)

    return SignalListResponse(
        signals=signal_responses,
        total=len(signals),
        page=1,
        per_page=per_page,
    )
