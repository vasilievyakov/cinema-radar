"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Target,
  Megaphone,
  Ticket,
  CircleDot,
  ChevronRight,
} from "lucide-react";
import { format, subDays, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { moviesComparison, realBoxOfficeData, upcomingCPMovies } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Role-based digest types (из транскрипта: "дайджест для CEO ЦПШ, дайджест для продюсера фильма, дайджест для диджитал-команды")
type UserRole = "ceo" | "producer" | "digital";

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: "ceo",
    label: "CEO / Руководитель",
    description: "Высокоуровневая аналитика, ключевые метрики, тренды рынка",
  },
  {
    value: "producer",
    label: "Продюсер",
    description: "Данные по конкретному фильму, отзывы, позиционирование",
  },
  {
    value: "digital",
    label: "Диджитал-команда",
    description: "Размещения, охваты, engagement, эффективность каналов",
  },
];

// Real campaign timeline for Чебурашка 2
const campaignTimeline = [
  {
    date: "2025-06-15",
    event: "Анонс проекта",
    type: "milestone",
    description: "Централ Партнершип анонсировал «Чебурашку 2»",
  },
  {
    date: "2025-09-20",
    event: "Тизер-трейлер",
    type: "milestone",
    description: "Первый тизер, 5M просмотров за неделю",
  },
  {
    date: "2025-10-15",
    event: "Полный трейлер",
    type: "milestone",
    description: "Финальный трейлер, рекорд просмотров",
  },
  {
    date: "2025-11-20",
    event: "Старт посевов",
    type: "campaign",
    description: "Размещения в 100+ ТГ-каналах",
  },
  {
    date: "2025-12-15",
    event: "Предпродажи",
    type: "milestone",
    description: "Рекорд предпродаж на новогодние праздники",
  },
  {
    date: "2026-01-01",
    event: "Премьера",
    type: "release",
    description: "Старт проката, 990 млн руб. в первый день",
  },
  {
    date: "2026-01-05",
    event: "5 дней проката",
    type: "milestone",
    description: "3 млрд руб., 5 млн зрителей",
  },
  {
    date: "2026-01-11",
    event: "Рекорд праздников",
    type: "milestone",
    description: "4.9 млрд руб., 9.2 млн зрителей — 48% от всех сборов",
  },
];

// Mock sentiment over time
const sentimentData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 30 - i), "dd.MM"),
  positive: Math.floor(Math.random() * 40) + 40,
  negative: Math.floor(Math.random() * 20) + 10,
  neutral: Math.floor(Math.random() * 30) + 20,
}));

// Mock screenings vs ads correlation (из транскрипта: "взаимосвязь между рекламной кампанией и продажей билетов")
const correlationData = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(new Date(), 14 - i), "dd.MM"),
  ads: Math.floor(Math.random() * 50) + (i > 7 ? 80 : 30),
  tickets: Math.floor(Math.random() * 1000) + (i > 7 ? 3000 : 1000),
}));

// Real digest content by role - based on January 2026 data
const digestsByRole: Record<UserRole, { title: string; items: string[] }> = {
  ceo: {
    title: "Дайджест для руководителя",
    items: [
      `Рекорд новогодних каникул: ${realBoxOfficeData.totalHolidayRevenue} млрд руб (+${Math.round((realBoxOfficeData.totalHolidayRevenue / realBoxOfficeData.previousYearRevenue - 1) * 100)}% vs 2025)`,
      "Топ-3: Чебурашка 2 (4.9 млрд), Простоквашино (2.08 млрд), Буратино (2.06 млрд)",
      `Доля российского кино: ${realBoxOfficeData.russianFilmsShare}% — почти весь рынок`,
      "Конкуренты: «Аватар 3» стартует 15 января — мониторить влияние на сборы",
      "Фонд кино: только 4 из 35 субсидированных фильмов окупились в 2025",
    ],
  },
  producer: {
    title: "Дайджест для продюсера — Чебурашка 2",
    items: [
      "Сборы: 4.9 млрд руб (48% от всех праздничных сборов), 9.2 млн зрителей",
      "Рейтинг КП: 7.1 (ниже первой части 8.0), 89K голосов",
      "Отзывы: детям нравится, взрослые критикуют «слабый сюжет» и «нанизанные истории»",
      "Заполняемость: 78% (выше среднего), 2324 кинотеатра, 36% всех сеансов",
      "Рекомендация: увеличить сеансы в регионах, подготовить ответы на критику сюжета",
    ],
  },
  digital: {
    title: "Дайджест для диджитал-команды",
    items: [
      "Негативные отзывы: «взрослым лучше не смотреть», «бюджет ушел на апельсины»",
      "Позитив: «непошлый юмор», «красивый визуал», «дети в восторге»",
      "Буратино: мрачный тон вызывает вопросы — «пожалейте детей», возраст 6+ спорный",
      "Простоквашино: «почти покадровая копия мультика» — работает на ностальгию",
      `Средняя цена билета: ${realBoxOfficeData.averageTicketPrice} руб — жалобы на дороговизну`,
    ],
  },
};

// Campaign phase indicator
function CampaignPhase({ phase }: { phase: string }) {
  const phaseColors: Record<string, string> = {
    "pre-campaign": "bg-blue-500",
    "in-campaign": "bg-green-500",
    "post-campaign": "bg-gray-500",
  };

  const phaseLabels: Record<string, string> = {
    "pre-campaign": "Подготовка",
    "in-campaign": "Активная кампания",
    "post-campaign": "Пост-кампейн",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", phaseColors[phase])} />
      <span className="text-sm font-medium">{phaseLabels[phase]}</span>
    </div>
  );
}

function TimelineEvent({
  event,
  isLast,
}: {
  event: (typeof campaignTimeline)[0];
  isLast: boolean;
}) {
  const typeColors: Record<string, string> = {
    milestone: "bg-blue-500",
    campaign: "bg-yellow-500",
    release: "bg-green-500",
  };

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isToday =
    format(eventDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2",
            isPast || isToday
              ? typeColors[event.type]
              : "bg-muted border-muted-foreground"
          )}
        />
        {!isLast && (
          <div
            className={cn(
              "w-0.5 h-16",
              isPast ? "bg-primary" : "bg-muted"
            )}
          />
        )}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2">
          <span className="font-medium">{event.event}</span>
          {isToday && <Badge variant="positive">Сегодня</Badge>}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(eventDate, "d MMMM yyyy", { locale: ru })}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {event.description}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("ceo");
  const [selectedMovie, setSelectedMovie] = useState("Чебурашка 2");

  const currentDigest = digestsByRole[selectedRole];

  return (
    <div className="flex flex-col">
      <Header
        title="Аналитика"
        description="Дайджесты, тренды и корреляции"
        showDemoAlert
      />

      <div className="p-6 space-y-6">
        {/* Role Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              Выберите роль для персонализированного дайджеста
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    selectedRole === role.value
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  )}
                >
                  <div className="font-medium">{role.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Digest by Role */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {currentDigest.title}
            </CardTitle>
            <Badge variant="secondary">Неделя 3, Январь 2026</Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentDigest.items.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t">
              <button className="text-sm text-primary hover:underline">
                Скачать полный дайджест (PDF) →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline кампании: {selectedMovie}
            </CardTitle>
            <CampaignPhase phase="in-campaign" />
          </CardHeader>
          <CardContent>
            <div className="pl-2">
              {campaignTimeline.map((event, index) => (
                <TimelineEvent
                  key={event.date}
                  event={event}
                  isLast={index === campaignTimeline.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sentiment Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Динамика сентимента
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      name="Позитив"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="negative"
                      name="Негатив"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="neutral"
                      name="Нейтрально"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ads vs Tickets Correlation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5" />
                Корреляция: реклама → билеты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="ads"
                      name="Размещения"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="tickets"
                      name="Билеты"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Корреляция между рекламными размещениями и продажей билетов.
                Данные за последние 2 недели.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Post-Campaign Comparison - Real data from January 2026 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Новогодняя битва 2026: сравнение релизов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Фильм</th>
                    <th className="text-right py-3 px-4">Сборы (млрд)</th>
                    <th className="text-right py-3 px-4">Зрители (млн)</th>
                    <th className="text-right py-3 px-4">Ср. билет (₽)</th>
                    <th className="text-right py-3 px-4">Кинотеатры</th>
                    <th className="text-right py-3 px-4">% сеансов</th>
                    <th className="text-right py-3 px-4">Рейтинг КП</th>
                    <th className="text-right py-3 px-4">Сентимент</th>
                    <th className="text-right py-3 px-4">Позиция</th>
                  </tr>
                </thead>
                <tbody>
                  {moviesComparison.map((movie) => (
                    <tr key={movie.title} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{movie.title}</td>
                      <td className="text-right py-3 px-4">{movie.revenue}</td>
                      <td className="text-right py-3 px-4">{movie.viewers}</td>
                      <td className="text-right py-3 px-4">{movie.avgTicket}</td>
                      <td className="text-right py-3 px-4">{movie.cinemas.toLocaleString("ru-RU")}</td>
                      <td className="text-right py-3 px-4">{movie.shareOfScreenings}%</td>
                      <td className="text-right py-3 px-4">{movie.rating}</td>
                      <td className={cn(
                        "text-right py-3 px-4",
                        movie.sentiment >= 65 ? "text-green-500" : movie.sentiment >= 55 ? "text-yellow-500" : "text-orange-500"
                      )}>
                        {movie.sentiment}%
                      </td>
                      <td className="text-right py-3 px-4">
                        <Badge variant={movie.position === 1 ? "positive" : movie.position === 2 ? "notable" : "secondary"}>
                          #{movie.position}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Данные по итогам новогодних праздников 1-11 января 2026. Общие сборы: {realBoxOfficeData.totalHolidayRevenue} млрд руб. Источник: ЕАИС Фонд кино.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
