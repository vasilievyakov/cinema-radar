"use client";

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Signal } from "@/lib/api";

interface SignalCardProps {
  signal: Signal;
  compact?: boolean;
}

const signalTypeLabels: Record<string, string> = {
  review: "Отзыв",
  rating_change: "Рейтинг",
  screening: "Сеансы",
  news: "Новость",
  promotion: "Реклама",
  box_office: "Сборы",
};

const importanceVariants: Record<string, "critical" | "notable" | "minor"> = {
  critical: "critical",
  notable: "notable",
  minor: "minor",
};

const sentimentVariants: Record<string, "positive" | "negative" | "neutral"> = {
  positive: "positive",
  negative: "negative",
  neutral: "neutral",
  mixed: "neutral",
};

export function SignalCard({ signal, compact = false }: SignalCardProps) {
  const timeAgo = signal.published_at
    ? formatDistanceToNow(new Date(signal.published_at), {
        addSuffix: true,
        locale: ru,
      })
    : "Недавно";

  return (
    <div
      className={cn(
        "group flex gap-4",
        compact ? "py-2" : "p-4 rounded-lg bg-card border"
      )}
    >
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          {signal.signal_type && (
            <Badge variant="secondary" className="text-xs">
              {signalTypeLabels[signal.signal_type] || signal.signal_type}
            </Badge>
          )}
          {signal.importance && (
            <Badge variant={importanceVariants[signal.importance]}>
              {signal.importance === "critical"
                ? "Важно"
                : signal.importance === "notable"
                ? "Заметно"
                : "Обычно"}
            </Badge>
          )}
          {signal.sentiment && (
            <Badge variant={sentimentVariants[signal.sentiment]}>
              {signal.sentiment === "positive"
                ? "Позитив"
                : signal.sentiment === "negative"
                ? "Негатив"
                : "Нейтрально"}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h4
          className={cn(
            "font-medium line-clamp-2",
            compact ? "text-sm" : "text-base"
          )}
        >
          {signal.title}
        </h4>

        {/* Summary */}
        {!compact && signal.summary && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {signal.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          {signal.movie_title && (
            <span className="font-medium text-foreground">
              {signal.movie_title}
            </span>
          )}
          {signal.source_name && <span>{signal.source_name}</span>}
          <span>{timeAgo}</span>
          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
