"""
Movie schemas.
"""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MovieBase(BaseModel):
    """Base movie schema."""

    title: str
    original_title: Optional[str] = None
    slug: str
    description: Optional[str] = None
    poster_url: Optional[str] = None
    release_date: Optional[date] = None
    year: Optional[int] = None
    runtime_minutes: Optional[int] = None
    age_rating: Optional[str] = None
    kinopoisk_id: Optional[str] = None
    afisha_id: Optional[str] = None


class MovieCreate(MovieBase):
    """Schema for creating a movie."""

    distributor_id: Optional[UUID] = None


class MovieResponse(MovieBase):
    """Schema for movie response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime

    # Ratings
    kinopoisk_rating: Optional[float] = None
    kinopoisk_votes: Optional[int] = None
    afisha_rating: Optional[float] = None
    imdb_rating: Optional[float] = None

    # Aggregated metrics
    signals_count: int = 0
    reviews_count: int = 0
    sentiment_score: Optional[float] = None
    total_screenings: int = 0
    avg_occupancy: Optional[float] = None

    # Status
    is_active: bool = True
    is_featured: bool = False

    # Distributor
    distributor_name: Optional[str] = None


class MovieListResponse(BaseModel):
    """Schema for paginated movie list."""

    movies: list[MovieResponse]
    total: int
    page: int
    per_page: int
