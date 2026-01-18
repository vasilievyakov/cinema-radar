"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film } from "lucide-react";

interface MoviesLeaderboardProps {
  data: Record<string, number>;
  title?: string;
}

export function MoviesLeaderboard({
  data,
  title = "Топ фильмов по активности",
}: MoviesLeaderboardProps) {
  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const maxValue = sortedData[0]?.[1] || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedData.map(([name, value], index) => (
            <div key={name} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Film className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">{name}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                {value}
              </span>
            </div>
          ))}
          {sortedData.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет данных
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
