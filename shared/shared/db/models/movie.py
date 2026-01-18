"""
Movie model - films being monitored.
"""

from datetime import date, datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, Date, Integer, String, Text, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.db.models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from shared.db.models.signal import Signal
    from shared.db.models.screening import ScreeningSnapshot
    from shared.db.models.distributor import Distributor


class Movie(Base, UUIDMixin, TimestampMixin):
    """
    Movie being monitored.

    Tracks Russian theatrical releases with ratings, signals, and screenings.
    """

    __tablename__ = "movies"

    # Basic info
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    original_title: Mapped[Optional[str]] = mapped_column(String(500))
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    poster_url: Mapped[Optional[str]] = mapped_column(String(500))

    # Release info
    release_date: Mapped[Optional[date]] = mapped_column(Date, index=True)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    runtime_minutes: Mapped[Optional[int]] = mapped_column(Integer)
    age_rating: Mapped[Optional[str]] = mapped_column(
        String(10)
    )  # 0+, 6+, 12+, 16+, 18+

    # External IDs
    kinopoisk_id: Mapped[Optional[str]] = mapped_column(String(20), unique=True)
    afisha_id: Mapped[Optional[str]] = mapped_column(String(50))
    imdb_id: Mapped[Optional[str]] = mapped_column(String(20))

    # Distributor
    distributor_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("distributors.id", ondelete="SET NULL"),
    )

    # Aggregated metrics (updated by scheduler)
    kinopoisk_rating: Mapped[Optional[float]] = mapped_column(Float)
    kinopoisk_votes: Mapped[Optional[int]] = mapped_column(Integer)
    afisha_rating: Mapped[Optional[float]] = mapped_column(Float)
    imdb_rating: Mapped[Optional[float]] = mapped_column(Float)

    signals_count: Mapped[int] = mapped_column(Integer, default=0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    sentiment_score: Mapped[Optional[float]] = mapped_column(Float)  # -1 to 1
    total_screenings: Mapped[int] = mapped_column(Integer, default=0)
    avg_occupancy: Mapped[Optional[float]] = mapped_column(Float)

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    distributor: Mapped[Optional["Distributor"]] = relationship(
        "Distributor", back_populates="movies"
    )
    signals: Mapped[list["Signal"]] = relationship("Signal", back_populates="movie")
    screenings: Mapped[list["ScreeningSnapshot"]] = relationship(
        "ScreeningSnapshot", back_populates="movie"
    )

    def __repr__(self) -> str:
        return f"<Movie {self.title} ({self.year})>"
