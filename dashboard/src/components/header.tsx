"use client";

import { RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  showDemoAlert?: boolean;
}

export function Header({
  title,
  description,
  onRefresh,
  isRefreshing,
  showDemoAlert,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {showDemoAlert && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-3 py-1.5 text-sm text-yellow-500">
              <AlertCircle className="h-4 w-4" />
              <span>Демо-данные</span>
            </div>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              <span>Обновить</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
