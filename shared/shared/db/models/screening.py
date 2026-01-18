"""
ScreeningSnapshot model - cinema screenings data.
"""

from datetime import date, datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Date, DateTime, Float, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.db.models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from shared.db.models.movie import Movie


class ScreeningSnapshot(Base, UUIDMixin, TimestampMixin):
    """
    Snapshot of cinema screenings for a movie.

    Captured periodically to track screening availability and occupancy.
    """

    __tablename__ = "screening_snapshots"

    # Movie reference
    movie_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("movies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Location
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    cinema_chain: Mapped[Optional[str]] = mapped_column(
        String(100)
    )  # Karo, Cinema Park, Formula Kino, etc.

    # Snapshot date
    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    snapshot_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    # Metrics
    screenings_count: Mapped[int] = mapped_column(Integer, default=0)
    cinemas_count: Mapped[int] = mapped_column(Integer, default=0)
    halls_count: Mapped[int] = mapped_column(Integer, default=0)

    # Occupancy (if available)
    avg_occupancy_percent: Mapped[Optional[float]] = mapped_column(Float)
    total_seats: Mapped[Optional[int]] = mapped_column(Integer)
    sold_seats: Mapped[Optional[int]] = mapped_column(Integer)

    # Time distribution
    morning_screenings: Mapped[int] = mapped_column(Integer, default=0)  # before 12:00
    afternoon_screenings: Mapped[int] = mapped_column(Integer, default=0)  # 12:00-18:00
    evening_screenings: Mapped[int] = mapped_column(Integer, default=0)  # after 18:00

    # Format distribution
    format_2d: Mapped[int] = mapped_column(Integer, default=0)
    format_3d: Mapped[int] = mapped_column(Integer, default=0)
    format_imax: Mapped[int] = mapped_column(Integer, default=0)
    format_dolby: Mapped[int] = mapped_column(Integer, default=0)

    # Price range
    min_price: Mapped[Optional[int]] = mapped_column(Integer)
    max_price: Mapped[Optional[int]] = mapped_column(Integer)
    avg_price: Mapped[Optional[float]] = mapped_column(Float)

    # Raw data
    raw_data: Mapped[dict] = mapped_column(JSONB, default={})

    # Relationships
    movie: Mapped["Movie"] = relationship("Movie", back_populates="screenings")

    def __repr__(self) -> str:
        return f"<ScreeningSnapshot {self.movie_id} {self.city} {self.snapshot_date}>"
