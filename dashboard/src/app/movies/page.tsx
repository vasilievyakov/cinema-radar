"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Film,
  Star,
  Calendar,
  TrendingUp,
  BarChart3,
  Search,
  GitCompare,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMovies, type Movie } from "@/lib/api";
import { realMovies, competingReleases } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Use real data collected from Exa search
const mockMovies = realMovies;

// Real competing releases from January 2026
const competingMovies = competingReleases.map(r => ({
  date: r.date,
  movies: r.movies,
  leader: r.leader,
  leaderShare: r.leaderShare,
}));

function MovieCard({ movie }: { movie: Movie }) {
  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), "d MMMM yyyy", { locale: ru })
    : "Дата не указана";

  const sentimentColor =
    movie.sentiment_score !== undefined
      ? movie.sentiment_score > 0.6
        ? "text-green-500"
        : movie.sentiment_score > 0.4
        ? "text-yellow-500"
        : "text-red-500"
      : "text-muted-foreground";

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Poster placeholder */}
          <div className="w-24 h-36 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                {movie.original_title && (
                  <p className="text-sm text-muted-foreground">
                    {movie.original_title}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                {movie.is_active && (
                  <Badge variant="positive">В прокате</Badge>
                )}
                {movie.is_featured && (
                  <Badge variant="critical">Featured</Badge>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              {movie.kinopoisk_rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{movie.kinopoisk_rating}</span>
                  {movie.kinopoisk_votes && (
                    <span className="text-muted-foreground">
                      ({(movie.kinopoisk_votes / 1000).toFixed(0)}K)
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{releaseDate}</span>
              </div>
              {movie.distributor_name && (
                <Badge variant="secondary">{movie.distributor_name}</Badge>
              )}
            </div>

            {/* Metrics row */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>{movie.signals_count} сигналов</span>
              </div>
              {movie.total_screenings > 0 && (
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {movie.total_screenings.toLocaleString("ru-RU")} сеансов
                  </span>
                </div>
              )}
              {movie.avg_occupancy !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  Заполняемость: {movie.avg_occupancy}%
                </div>
              )}
              {movie.sentiment_score !== undefined && (
                <div className={cn("flex items-center gap-1", sentimentColor)}>
                  Сентимент: {Math.round(movie.sentiment_score * 100)}%
                </div>
              )}
            </div>

            {movie.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {movie.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const {
    data: moviesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["movies", searchQuery],
    queryFn: () => getMovies({ search: searchQuery || undefined }),
    placeholderData: { movies: mockMovies, total: 5, page: 1, per_page: 20 },
  });

  const displayMovies = moviesData?.movies || mockMovies;

  const filteredMovies = searchQuery
    ? displayMovies.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.original_title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayMovies;

  return (
    <div className="flex flex-col">
      <Header
        title="Фильмы"
        description="Мониторинг российского кинопроката"
        onRefresh={refetch}
        isRefreshing={isLoading}
        showDemoAlert
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск фильма..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={() => setShowCompare(!showCompare)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors",
              showCompare
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <GitCompare className="h-4 w-4" />
            Сравнение конкурентов
          </button>
        </div>

        {/* Competing movies comparison */}
        {showCompare && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Конкурирующие релизы (одна дата)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {competingMovies.map((group) => (
                <div
                  key={group.date}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="text-sm font-medium text-muted-foreground min-w-[120px]">
                    {format(new Date(group.date), "d MMMM yyyy", { locale: ru })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.movies.map((movie) => (
                      <Badge key={movie} variant="secondary">
                        {movie}
                      </Badge>
                    ))}
                  </div>
                  <button className="ml-auto text-sm text-primary hover:underline">
                    Сравнить →
                  </button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Сравнительный анализ помогает понять позиционирование и долю
                рынка среди конкурентов на ту же дату релиза.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{displayMovies.length}</div>
              <div className="text-sm text-muted-foreground">Всего фильмов</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">
                {displayMovies.filter((m) => m.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">В прокате</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {displayMovies.reduce((acc, m) => acc + m.signals_count, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Всего сигналов</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {displayMovies
                  .reduce(
                    (acc, m) => acc + m.total_screenings,
                    0
                  )
                  .toLocaleString("ru-RU")}
              </div>
              <div className="text-sm text-muted-foreground">Всего сеансов</div>
            </CardContent>
          </Card>
        </div>

        {/* Movies list */}
        <div className="space-y-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {filteredMovies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Фильмы не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
