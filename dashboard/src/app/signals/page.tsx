"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Radio,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Header } from "@/components/header";
import { SignalCard } from "@/components/signal-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSignals, type Signal } from "@/lib/api";
import { realSignals, realActionItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Use real data collected from Exa search
const mockSignals = realSignals;
const mockActionItems = realActionItems;

const signalTypes = [
  { value: "", label: "Все типы" },
  { value: "review", label: "Отзывы" },
  { value: "rating_change", label: "Рейтинги" },
  { value: "screening", label: "Сеансы" },
  { value: "news", label: "Новости" },
  { value: "promotion", label: "Реклама" },
  { value: "box_office", label: "Сборы" },
];

const importanceLevels = [
  { value: "", label: "Любая важность" },
  { value: "critical", label: "Критические" },
  { value: "notable", label: "Заметные" },
  { value: "minor", label: "Обычные" },
];

function ActionItemCard({
  item,
}: {
  item: (typeof mockActionItems)[0];
}) {
  const urgencyColors = {
    high: "border-l-red-500 bg-red-500/5",
    medium: "border-l-yellow-500 bg-yellow-500/5",
    low: "border-l-green-500 bg-green-500/5",
  };

  const urgencyLabels = {
    high: "Срочно",
    medium: "В работу",
    low: "Позже",
  };

  const timeAgo = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: ru,
  });

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-l-4 transition-colors hover:bg-accent/50",
        urgencyColors[item.urgency]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium">{item.action}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            На основе: {item.signal_title}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            <Badge variant="secondary">{item.movie}</Badge>
            <span className="flex items-center gap-1 text-muted-foreground">
              <User className="h-3 w-3" />
              {item.assignee}
            </span>
            <span className="text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={
              item.urgency === "high"
                ? "critical"
                : item.urgency === "medium"
                ? "notable"
                : "minor"
            }
          >
            {urgencyLabels[item.urgency]}
          </Badge>
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            Выполнено <CheckCircle2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignalsPage() {
  const [signalType, setSignalType] = useState("");
  const [importance, setImportance] = useState("");
  const [showActions, setShowActions] = useState(true);

  const {
    data: signalsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["signals", signalType, importance],
    queryFn: () =>
      getSignals({
        signal_type: signalType || undefined,
        importance: importance || undefined,
        per_page: 20,
      }),
    placeholderData: { signals: mockSignals, total: 6, page: 1, per_page: 20 },
  });

  const displaySignals = signalsData?.signals || mockSignals;

  // Filter signals client-side for demo
  const filteredSignals = displaySignals.filter((signal) => {
    if (signalType && signal.signal_type !== signalType) return false;
    if (importance && signal.importance !== importance) return false;
    return true;
  });

  // Filter action items by importance
  const filteredActions =
    importance === "critical"
      ? mockActionItems.filter((a) => a.urgency === "high")
      : mockActionItems;

  return (
    <div className="flex flex-col">
      <Header
        title="Сигналы"
        description="Мониторинг новостей, отзывов и активности"
        onRefresh={refetch}
        isRefreshing={isLoading}
        showDemoAlert
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={signalType}
              onChange={(e) => setSignalType(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {signalTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {importanceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowActions(!showActions)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors",
              showActions
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <Zap className="h-4 w-4" />
            Action Items
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{filteredSignals.length}</div>
                  <div className="text-sm text-muted-foreground">Сигналов</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {filteredSignals.filter((s) => s.importance === "critical").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Критических</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{filteredActions.length}</div>
                  <div className="text-sm text-muted-foreground">Action Items</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">
                    {filteredActions.filter((a) => a.urgency === "high").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Срочных</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Action Items Panel */}
          {showActions && (
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Action Items
                  <Badge variant="secondary">{filteredActions.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Рекомендуемые действия на основе сигналов
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredActions.map((item) => (
                  <ActionItemCard key={item.id} item={item} />
                ))}
                {filteredActions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет action items
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Signals Feed */}
          <Card className={showActions ? "lg:col-span-2" : "lg:col-span-2"}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Лента сигналов
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
              {filteredSignals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Нет сигналов по заданным фильтрам
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
