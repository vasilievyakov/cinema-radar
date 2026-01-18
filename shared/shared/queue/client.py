"""
Redis queue client for ARQ.
"""

from typing import Any, Optional
from functools import lru_cache

from arq import create_pool
from arq.connections import RedisSettings, ArqRedis

from shared.settings import get_settings


@lru_cache
def get_redis_settings() -> RedisSettings:
    """Get Redis settings from environment."""
    settings = get_settings()
    # Parse redis URL
    url = settings.redis_url
    if url.startswith("redis://"):
        url = url[8:]

    # Handle authentication
    if "@" in url:
        auth, host_port = url.split("@")
        if ":" in auth:
            _, password = auth.split(":", 1)
        else:
            password = auth
        host_port_parts = host_port.split(":")
        host = host_port_parts[0]
        port = int(host_port_parts[1]) if len(host_port_parts) > 1 else 6379
        return RedisSettings(host=host, port=port, password=password)
    else:
        host_port_parts = url.split(":")
        host = host_port_parts[0]
        port = int(host_port_parts[1]) if len(host_port_parts) > 1 else 6379
        return RedisSettings(host=host, port=port)


async def get_redis_pool() -> ArqRedis:
    """Get Redis connection pool."""
    return await create_pool(get_redis_settings())


async def enqueue_task(
    task_name: str,
    *args: Any,
    _queue_name: Optional[str] = None,
    **kwargs: Any,
) -> str:
    """Enqueue a task to be processed by worker."""
    pool = await get_redis_pool()
    job = await pool.enqueue_job(
        task_name,
        *args,
        _queue_name=_queue_name,
        **kwargs,
    )
    return job.job_id if job else ""
