"""
Signal collection tasks.
"""

import logging
from datetime import datetime

import httpx
from bs4 import BeautifulSoup

from shared.db.database import async_session_factory
from shared.db.repositories.sources import SourceRepository
from shared.db.repositories.signals import SignalRepository

logger = logging.getLogger(__name__)


async def collect_by_type(ctx, source_type: str):
    """Collect signals from sources of a specific type."""
    logger.info(f"Collecting signals from {source_type} sources")

    async with async_session_factory() as session:
        source_repo = SourceRepository(session)
        signal_repo = SignalRepository(session)

        sources = await source_repo.get_active_by_type(source_type)
        logger.info(f"Found {len(sources)} active {source_type} sources")

        collected = 0
        for source in sources:
            try:
                if source_type == "news_site":
                    signals = await _collect_news(source.url)
                elif source_type == "kinopoisk":
                    signals = await _collect_kinopoisk(source.url)
                elif source_type == "telegram":
                    signals = await _collect_telegram(source.telegram_channel_id)
                else:
                    signals = []

                # Save signals
                for signal_data in signals:
                    external_id = signal_data.get("external_id")
                    if not await signal_repo.exists_by_external_id(external_id):
                        await signal_repo.create(
                            source_id=source.id,
                            **signal_data,
                        )
                        collected += 1

                await source_repo.mark_checked(source)
                await session.commit()

            except Exception as e:
                logger.error(f"Error collecting from {source.name}: {e}")
                await source_repo.mark_checked(source, error=str(e))
                await session.commit()

    logger.info(f"Collected {collected} new signals")
    return {"collected": collected}


async def collect_all(ctx):
    """Collect signals from all source types."""
    logger.info("Collecting signals from all sources")

    source_types = ["news_site", "kinopoisk", "afisha", "telegram"]
    total_collected = 0

    for source_type in source_types:
        try:
            result = await collect_by_type(ctx, source_type)
            total_collected += result.get("collected", 0)
        except Exception as e:
            logger.error(f"Error collecting {source_type}: {e}")

    return {"collected": total_collected}


async def _collect_news(url: str) -> list[dict]:
    """Collect signals from a news site."""
    signals = []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")

            # Generic news article extraction (customize per site)
            articles = soup.find_all("article") or soup.find_all(
                "div", class_=lambda x: x and "news" in x.lower()
            )

            for article in articles[:20]:  # Limit to 20 articles
                title_el = article.find(["h1", "h2", "h3", "a"])
                link_el = article.find("a", href=True)

                if title_el and link_el:
                    title = title_el.get_text(strip=True)
                    link = link_el["href"]

                    if not link.startswith("http"):
                        # Relative URL
                        from urllib.parse import urljoin

                        link = urljoin(url, link)

                    signals.append(
                        {
                            "external_id": f"news:{link}",
                            "title": title[:500],
                            "source_url": link,
                            "published_at": datetime.utcnow(),
                        }
                    )

    except Exception as e:
        logger.error(f"Error fetching news from {url}: {e}")

    return signals


async def _collect_kinopoisk(url: str) -> list[dict]:
    """Collect signals from Kinopoisk."""
    signals = []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url, timeout=30, headers={"User-Agent": "Mozilla/5.0"}
            )
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")

            # Find movie links
            movie_links = soup.find_all("a", href=lambda x: x and "/film/" in str(x))

            for link in movie_links[:20]:
                title = link.get_text(strip=True)
                href = link.get("href", "")

                if title and href:
                    full_url = f"https://www.kinopoisk.ru{href}"
                    signals.append(
                        {
                            "external_id": f"kp:{href}",
                            "title": f"Кинопоиск: {title[:450]}",
                            "source_url": full_url,
                            "published_at": datetime.utcnow(),
                        }
                    )

    except Exception as e:
        logger.error(f"Error fetching from Kinopoisk {url}: {e}")

    return signals


async def _collect_telegram(channel_id: str) -> list[dict]:
    """Collect signals from Telegram channel."""
    signals = []

    # For now, use Telegram web preview
    # In production, use Telethon or Pyrogram
    try:
        url = f"https://t.me/s/{channel_id}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")

            messages = soup.find_all("div", class_="tgme_widget_message_text")

            for i, msg in enumerate(messages[:20]):
                text = msg.get_text(strip=True)[:500]
                if text:
                    signals.append(
                        {
                            "external_id": f"tg:{channel_id}:{i}:{datetime.utcnow().timestamp()}",
                            "title": text[:200],
                            "content": text,
                            "source_url": url,
                            "published_at": datetime.utcnow(),
                        }
                    )

    except Exception as e:
        logger.error(f"Error fetching from Telegram {channel_id}: {e}")

    return signals
