"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Radio,
  AlertTriangle,
  TrendingUp,
  Film,
  Users,
  Star,
} from "lucide-react";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { SignalCard } from "@/components/signal-card";
import { SignalsByType } from "@/components/charts/signals-by-type";
import { SentimentSpeedometer } from "@/components/charts/sentiment-speedometer";
import { MovieRace } from "@/components/charts/movie-race";
import { MoviesLeaderboard } from "@/components/charts/movies-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverviewStats, getSignals } from "@/lib/api";
import { realStats, realSignals, realBoxOfficeData, movieRaceData, sentimentQuotes } from "@/lib/mock-data";

// Use real data collected from Exa search
const mockStats = realStats;
const mockSignals = realSignals;

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: getOverviewStats,
    placeholderData: mockStats,
  });

  const {
    data: signalsData,
    isLoading: signalsLoading,
    refetch: refetchSignals,
  } = useQuery({
    queryKey: ["signals", { importance: "critical" }],
    queryFn: () => getSignals({ importance: "critical", per_page: 5 }),
    placeholderData: { signals: mockSignals, total: 5, page: 1, per_page: 5 },
  });

  const handleRefresh = () => {
    refetchStats();
    refetchSignals();
  };

  const displayStats = stats || mockStats;
  const displaySignals = signalsData?.signals || mockSignals;

  return (
    <div className="flex flex-col">
      <Header
        title="Дэшборд"
        description="Аналитика российского кинорынка в реальном времени"
        onRefresh={handleRefresh}
        isRefreshing={statsLoading || signalsLoading}
        showDemoAlert
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Сигналов за 7 дней"
            value={displayStats.signals_7d}
            icon={Radio}
            change={displayStats.trend_vs_previous}
            trend={displayStats.trend_vs_previous > 0 ? "up" : "down"}
          />
          <StatCard
            title="Критических"
            value={displayStats.critical_count}
            icon={AlertTriangle}
            className="border-red-500/20"
          />
          <StatCard
            title="Заметных"
            value={displayStats.notable_count}
            icon={TrendingUp}
          />
          <StatCard
            title="Фильмов"
            value={Object.keys(displayStats.by_movie).length}
            icon={Film}
          />
        </div>

        {/* Hero Row - Race and Sentiment */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MovieRace
            movies={movieRaceData.movies}
            days={movieRaceData.days}
            title="Гонка новогоднего проката"
            unit="млн ₽"
          />
          <SentimentSpeedometer
            value={Math.round(
              (displayStats.by_sentiment.positive /
                (displayStats.by_sentiment.positive +
                  displayStats.by_sentiment.negative +
                  displayStats.by_sentiment.neutral)) *
                100
            )}
            quotes={sentimentQuotes}
            title="Sentiment-метр"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <SignalsByType data={displayStats.by_type} />
          <MoviesLeaderboard data={displayStats.by_movie} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Рекорды праздников</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Общие сборы</span>
                <span className="text-lg font-bold text-primary">{realBoxOfficeData.totalHolidayRevenue} млрд ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Рост vs 2025</span>
                <span className="text-lg font-bold text-green-500">+{Math.round((realBoxOfficeData.totalHolidayRevenue / realBoxOfficeData.previousYearRevenue - 1) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Билетов продано</span>
                <span className="text-lg font-bold">{realBoxOfficeData.ticketsSold} млн</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Доля РФ кино</span>
                <span className="text-lg font-bold">{realBoxOfficeData.russianFilmsShare}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ср. билет</span>
                <span className="text-lg font-bold">{realBoxOfficeData.averageTicketPrice} ₽</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signals List */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                Критические сигналы
              </CardTitle>
              <a
                href="/signals?importance=critical"
                className="text-sm text-primary hover:underline"
              >
                Все сигналы →
              </a>
            </CardHeader>
            <CardContent className="space-y-2">
              {displaySignals.slice(0, 5).map((signal) => (
                <SignalCard key={signal.id} signal={signal} compact />
              ))}
              {displaySignals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет критических сигналов
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Последние сигналы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockSignals.slice(0, 5).map((signal) => (
                <SignalCard key={signal.id} signal={signal} compact />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
