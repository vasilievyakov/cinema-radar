const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Signal {
  id: string;
  external_id: string;
  title: string;
  content?: string;
  summary?: string;
  source_url: string;
  image_url?: string;
  author?: string;
  signal_type?: string;
  importance?: "critical" | "notable" | "minor";
  sentiment?: "positive" | "negative" | "neutral" | "mixed";
  sentiment_score?: number;
  rating?: number;
  platform_rating?: string;
  views_count?: number;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  published_at?: string;
  created_at: string;
  is_classified: boolean;
  is_published: boolean;
  is_featured: boolean;
  movie_title?: string;
  source_name?: string;
}

export interface Movie {
  id: string;
  title: string;
  original_title?: string;
  slug: string;
  description?: string;
  poster_url?: string;
  release_date?: string;
  year?: number;
  runtime_minutes?: number;
  age_rating?: string;
  kinopoisk_id?: string;
  kinopoisk_rating?: number;
  kinopoisk_votes?: number;
  afisha_rating?: number;
  imdb_rating?: number;
  signals_count: number;
  reviews_count: number;
  sentiment_score?: number;
  total_screenings: number;
  avg_occupancy?: number;
  is_active: boolean;
  is_featured: boolean;
  distributor_name?: string;
  created_at: string;
  updated_at: string;
}

export interface OverviewStats {
  signals_24h: number;
  signals_7d: number;
  critical_count: number;
  notable_count: number;
  by_movie: Record<string, number>;
  by_type: Record<string, number>;
  by_sentiment: Record<string, number>;
  trend_vs_previous: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const res = await fetch(`${API_URL}/stats/overview`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getSignals(params?: {
  movie_slug?: string;
  signal_type?: string;
  importance?: string;
  hours?: number;
  page?: number;
  per_page?: number;
}): Promise<{ signals: Signal[]; total: number; page: number; per_page: number }> {
  const searchParams = new URLSearchParams();
  if (params?.movie_slug) searchParams.set("movie_slug", params.movie_slug);
  if (params?.signal_type) searchParams.set("signal_type", params.signal_type);
  if (params?.importance) searchParams.set("importance", params.importance);
  if (params?.hours) searchParams.set("hours", params.hours.toString());
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());

  const res = await fetch(`${API_URL}/signals?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch signals");
  return res.json();
}

export async function getMovies(params?: {
  search?: string;
  featured?: boolean;
  distributor?: string;
  page?: number;
  per_page?: number;
}): Promise<{ movies: Movie[]; total: number; page: number; per_page: number }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.distributor) searchParams.set("distributor", params.distributor);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());

  const res = await fetch(`${API_URL}/movies?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function getMovie(slug: string): Promise<Movie> {
  const res = await fetch(`${API_URL}/movies/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}
