"""
Statistics schemas.
"""

from typing import Optional

from pydantic import BaseModel


class OverviewStats(BaseModel):
    """Overview statistics for dashboard."""

    # Signal counts
    signals_24h: int = 0
    signals_7d: int = 0
    critical_count: int = 0
    notable_count: int = 0

    # By dimensions
    by_movie: dict[str, int] = {}
    by_type: dict[str, int] = {}
    by_sentiment: dict[str, int] = {}

    # Trend
    trend_vs_previous: float = 0


class MovieStats(BaseModel):
    """Statistics for a specific movie."""

    movie_slug: str
    movie_title: str

    # Ratings
    kinopoisk_rating: Optional[float] = None
    kinopoisk_votes: Optional[int] = None
    afisha_rating: Optional[float] = None

    # Signals
    signals_total: int = 0
    signals_24h: int = 0
    reviews_count: int = 0

    # Sentiment
    sentiment_score: Optional[float] = None
    positive_count: int = 0
    negative_count: int = 0
    neutral_count: int = 0

    # Screenings
    total_screenings: int = 0
    avg_occupancy: Optional[float] = None
    screenings_trend: float = 0  # % change vs previous period
