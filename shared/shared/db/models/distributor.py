"""
Distributor model - film distributors/studios.
"""

from typing import Optional, TYPE_CHECKING

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.db.models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from shared.db.models.movie import Movie


class Distributor(Base, UUIDMixin, TimestampMixin):
    """
    Film distributor or studio.

    Examples: ЦПШ, Каро Прокат, Вольга, Universal, Disney, etc.
    """

    __tablename__ = "distributors"

    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    logo_url: Mapped[Optional[str]] = mapped_column(String(500))
    website: Mapped[Optional[str]] = mapped_column(String(500))
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Contact
    telegram_channel: Mapped[Optional[str]] = mapped_column(String(100))

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_major: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    movies: Mapped[list["Movie"]] = relationship("Movie", back_populates="distributor")

    def __repr__(self) -> str:
        return f"<Distributor {self.name}>"
