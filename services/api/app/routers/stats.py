"""
Statistics router.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from shared.db import get_session
from shared.db.repositories.signals import SignalRepository
from shared.db.repositories.movies import MovieRepository
from shared.schemas.stats import OverviewStats, MovieStats

router = APIRouter()


@router.get("/overview", response_model=OverviewStats)
async def get_overview_stats(
    days: int = Query(7, ge=1, le=90),
    session: AsyncSession = Depends(get_session),
):
    """Get overview statistics for dashboard."""
    signal_repo = SignalRepository(session)

    # Get stats for current period
    stats = await signal_repo.get_stats(days=days)

    # Get 24h stats
    stats_24h = await signal_repo.get_stats(days=1)

    return OverviewStats(
        signals_24h=stats_24h["total"],
        signals_7d=stats["total"],
        critical_count=stats["by_importance"].get("critical", 0),
        notable_count=stats["by_importance"].get("notable", 0),
        by_type=stats["by_type"],
        by_sentiment=stats["by_sentiment"],
        trend_vs_previous=0,  # TODO: Calculate trend
    )


@router.get("/movie/{slug}", response_model=MovieStats)
async def get_movie_stats(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    """Get statistics for a specific movie."""
    movie_repo = MovieRepository(session)
    signal_repo = SignalRepository(session)

    movie = await movie_repo.get_by_slug(slug)
    if not movie:
        return MovieStats(movie_slug=slug, movie_title="Not found")

    # Get signal stats for movie
    stats = await signal_repo.get_stats(days=30, movie_id=movie.id)
    stats_24h = await signal_repo.get_stats(days=1, movie_id=movie.id)

    return MovieStats(
        movie_slug=movie.slug,
        movie_title=movie.title,
        kinopoisk_rating=movie.kinopoisk_rating,
        kinopoisk_votes=movie.kinopoisk_votes,
        afisha_rating=movie.afisha_rating,
        signals_total=stats["total"],
        signals_24h=stats_24h["total"],
        reviews_count=movie.reviews_count,
        sentiment_score=movie.sentiment_score,
        positive_count=stats["by_sentiment"].get("positive", 0),
        negative_count=stats["by_sentiment"].get("negative", 0),
        neutral_count=stats["by_sentiment"].get("neutral", 0),
        total_screenings=movie.total_screenings,
        avg_occupancy=movie.avg_occupancy,
    )
