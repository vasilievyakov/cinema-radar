"""
Signal schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SignalBase(BaseModel):
    """Base signal schema."""

    title: str
    content: Optional[str] = None
    summary: Optional[str] = None
    source_url: str
    image_url: Optional[str] = None
    author: Optional[str] = None


class SignalCreate(SignalBase):
    """Schema for creating a signal."""

    external_id: str
    source_id: Optional[UUID] = None
    movie_id: Optional[UUID] = None
    published_at: Optional[datetime] = None
    raw_data: dict = {}


class SignalResponse(SignalBase):
    """Schema for signal response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    external_id: str
    created_at: datetime
    published_at: Optional[datetime] = None

    # Classification
    signal_type: Optional[str] = None
    importance: Optional[str] = None
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None

    # Review-specific
    rating: Optional[float] = None
    platform_rating: Optional[str] = None

    # Engagement
    views_count: Optional[int] = None
    likes_count: Optional[int] = None
    comments_count: Optional[int] = None
    shares_count: Optional[int] = None

    # Status
    is_classified: bool = False
    is_published: bool = True
    is_featured: bool = False

    # Related
    movie_title: Optional[str] = None
    source_name: Optional[str] = None


class SignalListResponse(BaseModel):
    """Schema for paginated signal list."""

    signals: list[SignalResponse]
    total: int
    page: int
    per_page: int
