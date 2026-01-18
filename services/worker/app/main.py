"""
ARQ Worker entry point.
"""

import asyncio
import logging

from arq import run_worker

from shared.queue.client import get_redis_settings
from services.worker.app.tasks.collection import collect_by_type, collect_all
from services.worker.app.tasks.classification import classify_batch
from services.worker.app.tasks.metrics import update_movie_metrics

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WorkerSettings:
    """ARQ Worker settings."""

    redis_settings = get_redis_settings()

    functions = [
        collect_by_type,
        collect_all,
        classify_batch,
        update_movie_metrics,
    ]

    max_jobs = 10
    job_timeout = 600  # 10 minutes
    keep_result = 3600  # 1 hour
    poll_delay = 1.0

    @staticmethod
    async def on_startup(ctx):
        """Worker startup handler."""
        logger.info("Worker started")

    @staticmethod
    async def on_shutdown(ctx):
        """Worker shutdown handler."""
        logger.info("Worker stopped")


if __name__ == "__main__":
    run_worker(WorkerSettings)
