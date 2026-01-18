-- Cinema Radar Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Distributors table
CREATE TABLE distributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    description TEXT,
    telegram_channel VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_major BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Movies table
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    original_title VARCHAR(500),
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    poster_url VARCHAR(500),
    release_date DATE,
    year INTEGER,
    runtime_minutes INTEGER,
    age_rating VARCHAR(10),
    kinopoisk_id VARCHAR(20) UNIQUE,
    afisha_id VARCHAR(50),
    imdb_id VARCHAR(20),
    distributor_id UUID REFERENCES distributors(id) ON DELETE SET NULL,
    kinopoisk_rating FLOAT,
    kinopoisk_votes INTEGER,
    afisha_rating FLOAT,
    imdb_rating FLOAT,
    signals_count INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    sentiment_score FLOAT,
    total_screenings INTEGER DEFAULT 0,
    avg_occupancy FLOAT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_movies_release_date ON movies(release_date);
CREATE INDEX idx_movies_distributor ON movies(distributor_id);

-- Sources table
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    movie_slug VARCHAR(200),
    check_frequency_hours INTEGER DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMPTZ,
    last_error VARCHAR(500),
    telegram_channel_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_sources_type ON sources(type);

-- Signals table
CREATE TABLE signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    movie_id UUID REFERENCES movies(id) ON DELETE SET NULL,
    external_id VARCHAR(500) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    summary TEXT,
    source_url VARCHAR(500) NOT NULL,
    image_url VARCHAR(500),
    author VARCHAR(200),
    signal_type VARCHAR(50),
    importance VARCHAR(20),
    sentiment VARCHAR(20),
    sentiment_score FLOAT,
    rating FLOAT,
    platform_rating VARCHAR(20),
    views_count INTEGER,
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    raw_data JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    is_classified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    keywords JSONB,
    embedding JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_signals_movie ON signals(movie_id);
CREATE INDEX idx_signals_type ON signals(signal_type);
CREATE INDEX idx_signals_importance ON signals(importance);
CREATE INDEX idx_signals_published_at ON signals(published_at);

-- Screening snapshots table
CREATE TABLE screening_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    cinema_chain VARCHAR(100),
    snapshot_date DATE NOT NULL,
    snapshot_time TIMESTAMPTZ NOT NULL,
    screenings_count INTEGER DEFAULT 0,
    cinemas_count INTEGER DEFAULT 0,
    halls_count INTEGER DEFAULT 0,
    avg_occupancy_percent FLOAT,
    total_seats INTEGER,
    sold_seats INTEGER,
    morning_screenings INTEGER DEFAULT 0,
    afternoon_screenings INTEGER DEFAULT 0,
    evening_screenings INTEGER DEFAULT 0,
    format_2d INTEGER DEFAULT 0,
    format_3d INTEGER DEFAULT 0,
    format_imax INTEGER DEFAULT 0,
    format_dolby INTEGER DEFAULT 0,
    min_price INTEGER,
    max_price INTEGER,
    avg_price FLOAT,
    raw_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_screening_movie ON screening_snapshots(movie_id);
CREATE INDEX idx_screening_city ON screening_snapshots(city);
CREATE INDEX idx_screening_date ON screening_snapshots(snapshot_date);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_distributors_updated_at BEFORE UPDATE ON distributors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_signals_updated_at BEFORE UPDATE ON signals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_screening_snapshots_updated_at BEFORE UPDATE ON screening_snapshots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
