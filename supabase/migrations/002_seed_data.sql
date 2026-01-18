-- Seed distributors
INSERT INTO distributors (name, slug, website, is_major) VALUES
('Централ Партнершип', 'central-partnership', 'https://www.centpart.ru', true),
('Каро Прокат', 'karo-prokat', 'https://karofilm.ru', true),
('Вольга', 'volga', 'https://volga.film', true),
('Наше Кино', 'nashe-kino', 'https://nashekino.ru', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed sources
INSERT INTO sources (name, url, type, check_frequency_hours) VALUES
('Film.ru - Новости', 'https://www.film.ru/news', 'news_site', 2),
('Kinometro - Новости', 'https://www.kinometro.ru/news', 'news_site', 2),
('Кинопоиск - Новости', 'https://www.kinopoisk.ru/media/news/', 'news_site', 2),
('Кинопоиск - Сейчас в кино', 'https://www.kinopoisk.ru/afisha/new/', 'kinopoisk', 6),
('Афиша - Москва', 'https://www.afisha.ru/msk/schedule_cinema/', 'afisha', 4),
('Кинопоиск TG', 'https://t.me/kinopoisk', 'telegram', 2),
('Kinometro - Бокс-офис', 'https://www.kinometro.ru/box', 'box_office', 12)
ON CONFLICT DO NOTHING;

-- Seed sample movies
INSERT INTO movies (title, slug, release_date, year, kinopoisk_id, distributor_id, is_featured) VALUES
('Чебурашка 2', 'cheburashka-2', '2026-01-01', 2026, '5446742',
    (SELECT id FROM distributors WHERE slug = 'central-partnership'), true),
('Майор Гром: Игра', 'major-grom-igra', '2026-02-20', 2026, '1392193',
    (SELECT id FROM distributors WHERE slug = 'nashe-kino'), true),
('Сто лет тому вперёд', 'sto-let-tomu-vpered', '2024-04-18', 2024, '775276',
    (SELECT id FROM distributors WHERE slug = 'central-partnership'), false),
('Бременские музыканты', 'bremenskie-muzykanty', '2024-01-01', 2024, '1300609',
    (SELECT id FROM distributors WHERE slug = 'central-partnership'), false),
('Мастер и Маргарита', 'master-i-margarita', '2024-01-25', 2024, '667883',
    (SELECT id FROM distributors WHERE slug = 'karo-prokat'), false)
ON CONFLICT (slug) DO NOTHING;
