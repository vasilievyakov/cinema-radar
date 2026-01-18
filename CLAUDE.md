# Cinema Radar - Project Notes

## Overview
Russian cinema market intelligence platform. Monitors movies, screenings, reviews, and social signals.

## Architecture
Microservices: API (FastAPI) + Worker (ARQ) + Scheduler (APScheduler) + Dashboard (Next.js)

## Data Models

### Movie
- title, original_title, slug
- release_date, distributor
- kinopoisk_id, afisha_id
- poster_url, description
- Aggregated: signals_count, avg_rating, sentiment_score

### Signal
Types: review, rating_change, screening, news, promotion, box_office
Importance: critical, notable, minor
Sentiment: positive, negative, neutral

### Source
Types: kinopoisk, afisha, telegram, cinema_chain, news_site

### ScreeningSnapshot
- movie_id, cinema_chain, city
- screenings_count, occupancy_percent
- snapshot_date

## Key Decisions

### Data Sources Priority
1. Kinopoisk - main source for ratings/reviews
2. Afisha - showtimes and alternative reviews
3. Telegram - promotional placements
4. Cinema chains - occupancy data (if accessible)

### Classification
Using Gemini for:
- Review sentiment analysis
- Signal importance classification
- Extracting key topics from reviews

## API Endpoints

### Movies
- GET /movies - list movies with filters
- GET /movies/{slug} - movie details with signals
- GET /movies/{slug}/signals - signals for movie

### Signals
- GET /signals - list signals with filters
- GET /signals/stats - aggregated statistics

### Admin
- POST /admin/jobs/collect/{source_type} - trigger collection
- POST /admin/jobs/classify - trigger classification

## Scraping Notes

### Kinopoisk
- Has API but rate-limited
- Reviews available via web scraping
- Showtimes require location

### Telegram
- Use Telethon or Pyrogram for channel monitoring
- Track specific cinema-related channels
- Parse post engagement (views, forwards)

## Database
Using Railway Postgres (no pgvector - use JSONB for embeddings)
