"""
Source model - data sources for signal collection.
"""

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import Boolean, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.db.models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from shared.db.models.signal import Signal


class Source(Base, UUIDMixin, TimestampMixin):
    """
    Data source for collecting signals.

    Types: kinopoisk, afisha, telegram, cinema_chain, news_site
    """

    __tablename__ = "sources"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # kinopoisk, afisha, telegram, cinema_chain, news_site

    # Optional movie association (for movie-specific sources)
    movie_slug: Mapped[Optional[str]] = mapped_column(String(200))

    # Collection settings
    check_frequency_hours: Mapped[int] = mapped_column(Integer, default=2)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_checked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    last_error: Mapped[Optional[str]] = mapped_column(String(500))

    # For Telegram sources
    telegram_channel_id: Mapped[Optional[str]] = mapped_column(String(100))

    # Relationships
    signals: Mapped[list["Signal"]] = relationship("Signal", back_populates="source")

    def __repr__(self) -> str:
        return f"<Source {self.name} ({self.type})>"
