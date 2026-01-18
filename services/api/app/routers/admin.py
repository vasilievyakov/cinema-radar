"""
Admin router for triggering jobs.
"""

from fastapi import APIRouter

from shared.queue import enqueue_task

router = APIRouter()


@router.post("/jobs/collect/{source_type}")
async def trigger_collection(source_type: str):
    """Trigger signal collection for a source type."""
    job_id = await enqueue_task("collect_by_type", source_type)
    return {"status": "queued", "job_id": job_id, "source_type": source_type}


@router.post("/jobs/collect/all")
async def trigger_collection_all():
    """Trigger signal collection for all sources."""
    job_id = await enqueue_task("collect_all")
    return {"status": "queued", "job_id": job_id}


@router.post("/jobs/classify")
async def trigger_classification():
    """Trigger signal classification."""
    job_id = await enqueue_task("classify_batch")
    return {"status": "queued", "job_id": job_id}


@router.post("/jobs/update-metrics")
async def trigger_metrics_update():
    """Trigger movie metrics update."""
    job_id = await enqueue_task("update_movie_metrics")
    return {"status": "queued", "job_id": job_id}
