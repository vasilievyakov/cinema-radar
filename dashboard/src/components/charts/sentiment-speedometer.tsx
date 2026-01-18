"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";

interface Quote {
  text: string;
  sentiment: "positive" | "negative";
  source: string;
  movie?: string;
}

interface SentimentSpeedometerProps {
  value: number; // 0-100, where 50 is neutral
  quotes?: Quote[];
  title?: string;
}

export function SentimentSpeedometer({
  value,
  quotes = [],
  title = "Sentiment-метр",
}: SentimentSpeedometerProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animate the needle
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate needle rotation (-90 to 90 degrees)
  const rotation = (animatedValue / 100) * 180 - 90;

  // Determine sentiment label and color
  const getSentimentInfo = (val: number) => {
    if (val >= 70) return { label: "Позитивный", color: "text-green-500" };
    if (val >= 55) return { label: "Скорее позитивный", color: "text-lime-500" };
    if (val >= 45) return { label: "Нейтральный", color: "text-yellow-500" };
    if (val >= 30) return { label: "Скорее негативный", color: "text-orange-500" };
    return { label: "Негативный", color: "text-red-500" };
  };

  const sentimentInfo = getSentimentInfo(value);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Speedometer */}
        <div className="relative mx-auto" style={{ width: 200, height: 120 }}>
          {/* Background arc */}
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {/* Arc background */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#sentimentGradient)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Tick marks */}
            {[0, 25, 50, 75, 100].map((tick) => {
              const angle = (tick / 100) * 180 - 90;
              const radians = (angle * Math.PI) / 180;
              const innerR = 70;
              const outerR = 85;
              const x1 = 100 + innerR * Math.cos(radians);
              const y1 = 100 + innerR * Math.sin(radians);
              const x2 = 100 + outerR * Math.cos(radians);
              const y2 = 100 + outerR * Math.sin(radians);
              return (
                <line
                  key={tick}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2"
                  opacity="0.5"
                />
              );
            })}

            {/* Needle */}
            <g
              transform={`rotate(${rotation}, 100, 100)`}
              style={{ transition: "transform 1s ease-out" }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="35"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="100"
                r="8"
                fill="hsl(var(--background))"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
              />
            </g>
          </svg>

          {/* Value display */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <div className="text-3xl font-bold">{value}%</div>
            <div className={cn("text-sm font-medium", sentimentInfo.color)}>
              {sentimentInfo.label}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
          <span>Негатив</span>
          <span>Нейтрально</span>
          <span>Позитив</span>
        </div>

        {/* Recent quotes */}
        {quotes.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Последние отзывы
            </div>
            {quotes.slice(0, 3).map((quote, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg text-sm",
                  quote.sentiment === "positive"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                )}
              >
                {quote.sentiment === "positive" ? (
                  <ThumbsUp className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <ThumbsDown className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="line-clamp-2">«{quote.text}»</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quote.source}
                    {quote.movie && ` • ${quote.movie}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
