"""
APScheduler entry point.
"""

import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from shared.queue import enqueue_task

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def schedule_collection_all():
    """Schedule full collection."""
    logger.info("Scheduling collect_all job")
    await enqueue_task("collect_all")


async def schedule_collection_news():
    """Schedule news collection."""
    logger.info("Scheduling news collection job")
    await enqueue_task("collect_by_type", "news_site")


async def schedule_collection_telegram():
    """Schedule Telegram collection."""
    logger.info("Scheduling Telegram collection job")
    await enqueue_task("collect_by_type", "telegram")


async def schedule_classification():
    """Schedule classification job."""
    logger.info("Scheduling classification job")
    await enqueue_task("classify_batch")


async def schedule_metrics_update():
    """Schedule metrics update job."""
    logger.info("Scheduling metrics update job")
    await enqueue_task("update_movie_metrics")


def create_scheduler() -> AsyncIOScheduler:
    """Create and configure scheduler."""
    scheduler = AsyncIOScheduler()

    # Collection jobs
    # Full collection every 6 hours
    scheduler.add_job(
        schedule_collection_all,
        IntervalTrigger(hours=6),
        id="collect_all",
        replace_existing=True,
    )

    # News collection every 2 hours
    scheduler.add_job(
        schedule_collection_news,
        IntervalTrigger(hours=2),
        id="collect_news",
        replace_existing=True,
    )

    # Telegram collection every hour
    scheduler.add_job(
        schedule_collection_telegram,
        IntervalTrigger(hours=1),
        id="collect_telegram",
        replace_existing=True,
    )

    # Classification every 30 minutes
    scheduler.add_job(
        schedule_classification,
        IntervalTrigger(minutes=30),
        id="classify",
        replace_existing=True,
    )

    # Metrics update every hour
    scheduler.add_job(
        schedule_metrics_update,
        IntervalTrigger(hours=1),
        id="update_metrics",
        replace_existing=True,
    )

    return scheduler


async def main():
    """Main entry point."""
    logger.info("Starting Cinema Radar Scheduler")

    scheduler = create_scheduler()
    scheduler.start()

    logger.info("Scheduler started with jobs:")
    for job in scheduler.get_jobs():
        logger.info(f"  - {job.id}: {job.trigger}")

    # Keep running
    try:
        while True:
            await asyncio.sleep(60)
    except KeyboardInterrupt:
        logger.info("Shutting down scheduler")
        scheduler.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
