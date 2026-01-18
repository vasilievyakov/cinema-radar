"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, Play, Pause, RotateCcw } from "lucide-react";

interface MovieData {
  name: string;
  color: string;
  values: number[]; // Revenue per day
}

interface MovieRaceProps {
  movies: MovieData[];
  days: string[]; // Day labels
  title?: string;
  unit?: string;
}

export function MovieRace({
  movies,
  days,
  title = "Гонка фильмов",
  unit = "млн ₽",
}: MovieRaceProps) {
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Calculate cumulative values up to current day
  const getCumulativeValue = (movieIndex: number, dayIndex: number) => {
    return movies[movieIndex].values
      .slice(0, dayIndex + 1)
      .reduce((a, b) => a + b, 0);
  };

  // Get max value for scaling
  const maxValue = Math.max(
    ...movies.map((m) => m.values.reduce((a, b) => a + b, 0))
  );

  // Sort movies by current cumulative value
  const sortedMovies = [...movies]
    .map((movie, index) => ({
      ...movie,
      originalIndex: index,
      cumulative: getCumulativeValue(index, currentDay),
    }))
    .sort((a, b) => b.cumulative - a.cumulative);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentDay((prev) => {
        if (prev >= days.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, days.length]);

  const handlePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setCurrentDay(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentDay(0);
    setIsPlaying(false);
    setHasStarted(false);
  };

  const handleDayClick = (index: number) => {
    setCurrentDay(index);
    setHasStarted(true);
    setIsPlaying(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{days[currentDay]}</Badge>
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title={isPlaying ? "Пауза" : "Воспроизвести"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Сбросить"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Race bars */}
        <div className="space-y-3">
          {sortedMovies.map((movie, index) => {
            const barWidth = (movie.cumulative / maxValue) * 100;
            const isLeader = index === 0;

            return (
              <div key={movie.name} className="relative">
                <div className="flex items-center gap-3">
                  {/* Position */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      isLeader
                        ? "bg-yellow-500 text-yellow-950"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className="w-28 truncate text-sm font-medium">
                    {movie.name}
                  </div>

                  {/* Bar container */}
                  <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
                    {/* Animated bar */}
                    <div
                      className="h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max(barWidth, 5)}%`,
                        backgroundColor: movie.color,
                      }}
                    >
                      {barWidth > 20 && (
                        <span className="text-xs font-bold text-white drop-shadow">
                          {movie.cumulative.toLocaleString("ru-RU")}
                        </span>
                      )}
                    </div>

                    {/* Value outside if bar is too small */}
                    {barWidth <= 20 && (
                      <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium"
                        style={{ color: movie.color }}
                      >
                        {movie.cumulative.toLocaleString("ru-RU")}
                      </span>
                    )}
                  </div>

                  {/* Unit */}
                  <div className="w-16 text-right text-xs text-muted-foreground">
                    {unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-1">
            {days.map((day, index) => (
              <button
                key={day}
                onClick={() => handleDayClick(index)}
                className={cn(
                  "flex-1 h-2 rounded-full transition-colors",
                  index <= currentDay
                    ? "bg-primary"
                    : "bg-muted hover:bg-muted-foreground/30"
                )}
                title={day}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{days[0]}</span>
            <span>{days[days.length - 1]}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold" style={{ color: sortedMovies[0]?.color }}>
              {sortedMovies[0]?.name}
            </div>
            <div className="text-xs text-muted-foreground">Лидер</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {(sortedMovies[0]?.cumulative - sortedMovies[1]?.cumulative).toLocaleString("ru-RU")}
            </div>
            <div className="text-xs text-muted-foreground">Отрыв ({unit})</div>
          </div>
          <div>
            <div className="text-lg font-bold">{currentDay + 1}</div>
            <div className="text-xs text-muted-foreground">День проката</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
