"""
Cinema Radar data sources configuration.

Sources to monitor for signals and movie data.
"""

DISTRIBUTORS_SEED = [
    {
        "name": "Централ Партнершип",
        "slug": "central-partnership",
        "website": "https://www.centpart.ru",
        "is_major": True,
    },
    {
        "name": "Каро Прокат",
        "slug": "karo-prokat",
        "website": "https://karofilm.ru",
        "is_major": True,
    },
    {
        "name": "Вольга",
        "slug": "volga",
        "website": "https://volga.film",
        "is_major": True,
    },
    {
        "name": "Наше Кино",
        "slug": "nashe-kino",
        "website": "https://nashekino.ru",
        "is_major": True,
    },
    {
        "name": "Universal Pictures Russia",
        "slug": "universal",
        "website": "https://www.universalpictures.ru",
        "is_major": True,
    },
    {
        "name": "Sony Pictures Russia",
        "slug": "sony",
        "website": "https://www.sonypictures.ru",
        "is_major": True,
    },
    {
        "name": "Disney",
        "slug": "disney",
        "website": "https://www.disney.ru",
        "is_major": True,
    },
    {
        "name": "Warner Bros. Russia",
        "slug": "warner-bros",
        "website": "https://www.warnerbros.ru",
        "is_major": True,
    },
]

MOVIES_SEED = [
    # Примеры фильмов для демо
    {
        "title": "Чебурашка 2",
        "slug": "cheburashka-2",
        "release_date": "2026-01-01",
        "kinopoisk_id": "5446742",
        "distributor_slug": "central-partnership",
    },
    {
        "title": "Майор Гром: Игра",
        "slug": "major-grom-igra",
        "release_date": "2026-02-20",
        "kinopoisk_id": "1392193",
        "distributor_slug": "nashe-kino",
    },
]

SOURCES = [
    # ═══════════════════════════════════════════════════════════
    # NEWS SITES
    # ═══════════════════════════════════════════════════════════
    {
        "name": "Film.ru - Новости",
        "url": "https://www.film.ru/news",
        "type": "news_site",
        "check_frequency_hours": 2,
    },
    {
        "name": "Kinometro - Новости",
        "url": "https://www.kinometro.ru/news",
        "type": "news_site",
        "check_frequency_hours": 2,
    },
    {
        "name": "Кинопоиск - Новости",
        "url": "https://www.kinopoisk.ru/media/news/",
        "type": "news_site",
        "check_frequency_hours": 2,
    },
    # ═══════════════════════════════════════════════════════════
    # KINOPOISK (ratings, reviews)
    # ═══════════════════════════════════════════════════════════
    {
        "name": "Кинопоиск - Сейчас в кино",
        "url": "https://www.kinopoisk.ru/afisha/new/",
        "type": "kinopoisk",
        "check_frequency_hours": 6,
    },
    {
        "name": "Кинопоиск - Скоро в кино",
        "url": "https://www.kinopoisk.ru/afisha/soon/",
        "type": "kinopoisk",
        "check_frequency_hours": 12,
    },
    # ═══════════════════════════════════════════════════════════
    # AFISHA (showtimes)
    # ═══════════════════════════════════════════════════════════
    {
        "name": "Афиша - Москва",
        "url": "https://www.afisha.ru/msk/schedule_cinema/",
        "type": "afisha",
        "check_frequency_hours": 4,
    },
    {
        "name": "Афиша - Санкт-Петербург",
        "url": "https://www.afisha.ru/spb/schedule_cinema/",
        "type": "afisha",
        "check_frequency_hours": 4,
    },
    # ═══════════════════════════════════════════════════════════
    # CINEMA CHAINS
    # ═══════════════════════════════════════════════════════════
    {
        "name": "КАРО - Расписание Москва",
        "url": "https://karofilm.ru/cinema",
        "type": "cinema_chain",
        "check_frequency_hours": 6,
    },
    {
        "name": "Синема Парк - Расписание",
        "url": "https://www.cinemapark.ru/",
        "type": "cinema_chain",
        "check_frequency_hours": 6,
    },
    {
        "name": "Формула Кино - Расписание",
        "url": "https://www.formulakino.ru/",
        "type": "cinema_chain",
        "check_frequency_hours": 6,
    },
    # ═══════════════════════════════════════════════════════════
    # TELEGRAM CHANNELS (cinema-related)
    # ═══════════════════════════════════════════════════════════
    {
        "name": "Кино.опиздюл",
        "url": "https://t.me/kinopisdul",
        "type": "telegram",
        "telegram_channel_id": "kinopisdul",
        "check_frequency_hours": 1,
    },
    {
        "name": "Кинопоиск",
        "url": "https://t.me/kinopoisk",
        "type": "telegram",
        "telegram_channel_id": "kinopoisk",
        "check_frequency_hours": 2,
    },
    {
        "name": "Ещёнепознер",
        "url": "https://t.me/eshenepozner",
        "type": "telegram",
        "telegram_channel_id": "eshenepozner",
        "check_frequency_hours": 2,
    },
    # ═══════════════════════════════════════════════════════════
    # BOX OFFICE
    # ═══════════════════════════════════════════════════════════
    {
        "name": "Kinometro - Бокс-офис",
        "url": "https://www.kinometro.ru/box",
        "type": "box_office",
        "check_frequency_hours": 12,
    },
]
