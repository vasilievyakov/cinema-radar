"""
Metrics update tasks.
"""

import logging
from sqlalchemy import select, func

from shared.db.database import async_session_factory
from shared.db.models.movie import Movie
from shared.db.models.signal import Signal

logger = logging.getLogger(__name__)


async def update_movie_metrics(ctx):
    """Update aggregated metrics for all movies."""
    logger.info("Updating movie metrics")

    async with async_session_factory() as session:
        # Get all active movies
        result = await session.execute(select(Movie).where(Movie.is_active == True))
        movies = result.scalars().all()

        updated = 0
        for movie in movies:
            try:
                # Count signals
                signals_count_result = await session.execute(
                    select(func.count())
                    .select_from(Signal)
                    .where(Signal.movie_id == movie.id)
                )
                movie.signals_count = signals_count_result.scalar() or 0

                # Count reviews
                reviews_count_result = await session.execute(
                    select(func.count())
                    .select_from(Signal)
                    .where(
                        Signal.movie_id == movie.id,
                        Signal.signal_type == "review",
                    )
                )
                movie.reviews_count = reviews_count_result.scalar() or 0

                # Calculate average sentiment score
                sentiment_result = await session.execute(
                    select(func.avg(Signal.sentiment_score)).where(
                        Signal.movie_id == movie.id,
                        Signal.sentiment_score != None,
                    )
                )
                movie.sentiment_score = sentiment_result.scalar()

                updated += 1

            except Exception as e:
                logger.error(f"Error updating metrics for movie {movie.id}: {e}")

        await session.commit()

    logger.info(f"Updated metrics for {updated} movies")
    return {"updated": updated}
