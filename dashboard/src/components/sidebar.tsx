"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  LayoutDashboard,
  Radio,
  BarChart3,
  Settings,
  Bell,
  MapPin,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Дэшборд", href: "/", icon: LayoutDashboard },
  { name: "Фильмы", href: "/movies", icon: Film },
  { name: "Сигналы", href: "/signals", icon: Radio },
  { name: "Аналитика", href: "/analytics", icon: BarChart3 },
  { name: "География", href: "/geography", icon: MapPin },
  { name: "Кинотеатры", href: "/cinemas", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Film className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Cinema Radar</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span>Демо-режим</span>
        </div>
      </div>
    </aside>
  );
}
