"""
Signal model - collected and classified market signals.
"""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, String, Text, DateTime, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.db.models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from shared.db.models.source import Source
    from shared.db.models.movie import Movie


class Signal(Base, UUIDMixin, TimestampMixin):
    """
    Market signal - review, news, rating change, etc.

    Classified by LLM with signal_type, importance, sentiment.
    """

    __tablename__ = "signals"

    # Source reference
    source_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("sources.id", ondelete="SET NULL"),
    )
    external_id: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)

    # Movie reference
    movie_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("movies.id", ondelete="SET NULL"),
        index=True,
    )

    # Content
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text)
    summary: Mapped[Optional[str]] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500))
    author: Mapped[Optional[str]] = mapped_column(String(200))

    # Classification (LLM)
    signal_type: Mapped[Optional[str]] = mapped_column(
        String(50), index=True
    )  # review, rating_change, screening, news, promotion, box_office
    importance: Mapped[Optional[str]] = mapped_column(
        String(20), index=True
    )  # critical, notable, minor
    sentiment: Mapped[Optional[str]] = mapped_column(
        String(20)
    )  # positive, negative, neutral, mixed
    sentiment_score: Mapped[Optional[float]] = mapped_column(Float)  # -1 to 1

    # Review-specific
    rating: Mapped[Optional[float]] = mapped_column(Float)  # User rating if review
    platform_rating: Mapped[Optional[str]] = mapped_column(
        String(20)
    )  # e.g., "8.5/10", "4/5"

    # Engagement metrics (for Telegram/social)
    views_count: Mapped[Optional[int]] = mapped_column(Integer)
    likes_count: Mapped[Optional[int]] = mapped_column(Integer)
    comments_count: Mapped[Optional[int]] = mapped_column(Integer)
    shares_count: Mapped[Optional[int]] = mapped_column(Integer)

    # Metadata
    raw_data: Mapped[dict] = mapped_column(JSONB, default={})
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        index=True,
    )
    is_classified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    # Keywords extracted by LLM
    keywords: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)

    # Embedding for semantic search (JSONB since no pgvector)
    embedding: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)

    # Relationships
    source: Mapped[Optional["Source"]] = relationship(
        "Source", back_populates="signals"
    )
    movie: Mapped[Optional["Movie"]] = relationship("Movie", back_populates="signals")

    def __repr__(self) -> str:
        return f"<Signal {self.external_id[:30]}...>"
