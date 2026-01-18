# cinema-radar

Russian cinema market intelligence platform

## Architecture

```
cinema-radar/
├── services/
│   ├── api/          # FastAPI REST API
│   ├── worker/       # ARQ background jobs
│   └── scheduler/    # APScheduler cron jobs
├── shared/           # Shared library
├── dashboard/        # Next.js dashboard
└── supabase/         # Database migrations
```

## Quick Start

### Local Development

```bash
# Start infrastructure
docker-compose up -d redis postgres

# Install dependencies
pip install -e ./shared
pip install -r services/api/requirements.txt

# Run migrations
alembic upgrade head

# Start services (in separate terminals)
python -m services.api.app.main
python -m services.worker.app.main
python -m services.scheduler.app.main
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `GEMINI_API_KEY` - Google Gemini API key (for classification)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (optional)

## Data Sources

### Movies & Screenings
- Kinopoisk (ratings, reviews, showtimes)
- Afisha (showtimes, reviews)
- Cinema chains (Karo, Cinema Park, Formula Kino)

### Social & News
- Telegram channels (promotions, discussions)
- News sites (film.ru, kinometro.ru)

## Signal Types

- `review` - User reviews and critic reviews
- `rating_change` - Rating changes on Kinopoisk/Afisha
- `screening` - Showtime changes, hall occupancy
- `news` - News about movies/industry
- `promotion` - Telegram placements, ads
- `box_office` - Box office data

## Tech Stack

- **Backend:** Python 3.12, FastAPI, Pydantic v2
- **Queue:** ARQ (Redis)
- **Scheduler:** APScheduler
- **Database:** PostgreSQL (async)
- **LLM:** Google Gemini
- **Dashboard:** Next.js 15, React Query, Recharts

## Deployment

### Railway

```bash
railway login
railway link
railway up
```

---

Based on [ev-radar](https://github.com/vasilievyakov/ev-radar) architecture
