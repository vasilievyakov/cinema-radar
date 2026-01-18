"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SentimentGaugeProps {
  positive: number;
  negative: number;
  neutral: number;
}

export function SentimentGauge({
  positive,
  negative,
  neutral,
}: SentimentGaugeProps) {
  const total = positive + negative + neutral;
  const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;

  // Score from -100 to 100
  const score = total > 0 ? Math.round(((positive - negative) / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Тональность сигналов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Score */}
          <div className="text-4xl font-bold mb-4">
            <span
              className={
                score > 0
                  ? "text-green-500"
                  : score < 0
                  ? "text-red-500"
                  : "text-gray-500"
              }
            >
              {score > 0 ? "+" : ""}
              {score}
            </span>
          </div>

          {/* Bar */}
          <div className="w-full h-4 rounded-full bg-muted flex overflow-hidden">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${positivePercent}%` }}
            />
            <div
              className="bg-gray-500 transition-all"
              style={{ width: `${neutralPercent}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${negativePercent}%` }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between w-full mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">
                Позитив {positivePercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-muted-foreground">
                Нейтрал {neutralPercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">
                Негатив {negativePercent}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
