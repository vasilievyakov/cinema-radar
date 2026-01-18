"""
Signal classification tasks using LLM.
"""

import json
import logging

import google.generativeai as genai

from shared.settings import get_settings
from shared.db.database import async_session_factory
from shared.db.repositories.signals import SignalRepository

logger = logging.getLogger(__name__)
settings = get_settings()

# Configure Gemini
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)


CLASSIFICATION_PROMPT = """
Ты — AI-ассистент для классификации новостей и сигналов о российском кинорынке.

Проанализируй следующий текст и верни JSON с классификацией:

Текст: {text}

Верни JSON в формате:
{{
    "signal_type": "<тип>",
    "importance": "<важность>",
    "sentiment": "<тональность>",
    "sentiment_score": <число от -1 до 1>,
    "keywords": ["ключевое слово 1", "ключевое слово 2"],
    "summary": "<краткое резюме на русском, 1-2 предложения>"
}}

Типы сигналов (signal_type):
- review: отзыв или рецензия на фильм
- rating_change: изменение рейтинга
- screening: информация о сеансах, расписании
- news: новость о фильме или индустрии
- promotion: рекламный пост, анонс
- box_office: данные о сборах

Важность (importance):
- critical: важная новость, требует внимания
- notable: заметная информация
- minor: рядовая информация

Тональность (sentiment):
- positive: позитивный
- negative: негативный
- neutral: нейтральный
- mixed: смешанный

ВАЖНО: Верни ТОЛЬКО валидный JSON, без дополнительного текста.
"""


async def classify_batch(ctx, batch_size: int = 50):
    """Classify unclassified signals."""
    logger.info(f"Classifying signals (batch_size={batch_size})")

    if not settings.gemini_api_key:
        logger.warning("Gemini API key not configured, skipping classification")
        return {"classified": 0}

    async with async_session_factory() as session:
        signal_repo = SignalRepository(session)
        signals = await signal_repo.get_unclassified(limit=batch_size)

        logger.info(f"Found {len(signals)} unclassified signals")

        classified = 0
        for signal in signals:
            try:
                # Prepare text for classification
                text = signal.title
                if signal.content:
                    text += f"\n\n{signal.content[:1000]}"

                # Call Gemini
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(
                    CLASSIFICATION_PROMPT.format(text=text)
                )

                # Parse response
                response_text = response.text.strip()
                # Extract JSON from response
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0]
                elif "```" in response_text:
                    response_text = response_text.split("```")[1].split("```")[0]

                classification = json.loads(response_text)

                # Update signal
                signal.signal_type = classification.get("signal_type")
                signal.importance = classification.get("importance")
                signal.sentiment = classification.get("sentiment")
                signal.sentiment_score = classification.get("sentiment_score")
                signal.keywords = classification.get("keywords", [])
                signal.summary = classification.get("summary")
                signal.is_classified = True

                classified += 1

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse classification for {signal.id}: {e}")
            except Exception as e:
                logger.error(f"Error classifying signal {signal.id}: {e}")

        await session.commit()

    logger.info(f"Classified {classified} signals")
    return {"classified": classified}
