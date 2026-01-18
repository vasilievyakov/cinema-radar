"use client";

import { useState } from "react";
import {
  MapPin,
  TrendingUp,
  Users,
  Building2,
  Ticket,
  BarChart3,
} from "lucide-react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { citiesBoxOffice, regionsBoxOffice, realBoxOfficeData } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Colors for regions
const REGION_COLORS: Record<string, string> = {
  "ЦФО": "#3b82f6",
  "СЗФО": "#8b5cf6",
  "ПФО": "#10b981",
  "УрФО": "#f59e0b",
  "СФО": "#ef4444",
  "ЮФО": "#06b6d4",
  "СКФО": "#ec4899",
  "ДФО": "#84cc16",
};

function CityRow({ city, index }: { city: typeof citiesBoxOffice[0]; index: number }) {
  const maxRevenue = citiesBoxOffice[0].revenue;
  const barWidth = (city.revenue / maxRevenue) * 100;

  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-0">
      <div className="w-8 text-center font-bold text-muted-foreground">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{city.city}</span>
          <Badge
            variant="secondary"
            className="text-xs"
            style={{ backgroundColor: `${REGION_COLORS[city.region]}20`, color: REGION_COLORS[city.region] }}
          >
            {city.region}
          </Badge>
        </div>
        <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
      <div className="text-right min-w-[100px]">
        <div className="font-bold">{city.revenue} млн</div>
        <div className="text-xs text-muted-foreground">{city.share}%</div>
      </div>
      <div className="text-right min-w-[80px] text-sm text-muted-foreground">
        <div>{city.viewers.toLocaleString("ru-RU")}K</div>
        <div className="text-xs">зрителей</div>
      </div>
      <div className="text-right min-w-[60px] text-sm text-muted-foreground">
        <div>{city.cinemas}</div>
        <div className="text-xs">кинотеатров</div>
      </div>
      <div className="text-right min-w-[60px] text-sm">
        <div className="font-medium">{city.avgTicket} ₽</div>
        <div className="text-xs text-muted-foreground">ср. билет</div>
      </div>
    </div>
  );
}

export default function GeographyPage() {
  const [viewMode, setViewMode] = useState<"cities" | "regions">("cities");

  const totalRevenue = citiesBoxOffice.reduce((sum, c) => sum + c.revenue, 0);
  const totalViewers = citiesBoxOffice.reduce((sum, c) => sum + c.viewers, 0);
  const totalCinemas = citiesBoxOffice.reduce((sum, c) => sum + c.cinemas, 0);

  // Data for pie chart
  const pieData = regionsBoxOffice.map((r) => ({
    name: r.region,
    value: r.share,
    revenue: r.revenue,
  }));

  // Data for bar chart
  const barData = citiesBoxOffice.slice(0, 10).map((c) => ({
    name: c.city,
    revenue: c.revenue,
    viewers: c.viewers,
  }));

  return (
    <div className="flex flex-col">
      <Header
        title="География"
        description="Распределение сборов по регионам и городам"
        showDemoAlert
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{realBoxOfficeData.totalHolidayRevenue} млрд</div>
                  <div className="text-sm text-muted-foreground">Общие сборы</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{realBoxOfficeData.ticketsSold} млн</div>
                  <div className="text-sm text-muted-foreground">Зрителей</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{realBoxOfficeData.totalCinemas.toLocaleString("ru-RU")}</div>
                  <div className="text-sm text-muted-foreground">Кинотеатров</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{realBoxOfficeData.averageTicketPrice} ₽</div>
                  <div className="text-sm text-muted-foreground">Средний билет</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Regional Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Доля по федеральным округам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={REGION_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${props.payload.revenue} млн руб`,
                        props.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {regionsBoxOffice.map((r) => (
                  <div key={r.region} className="flex items-center gap-1 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: REGION_COLORS[r.region] }}
                    />
                    <span>{r.region}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Cities Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Топ-10 городов по сборам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} млн руб`, "Сборы"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cities")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "cities"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            По городам
          </button>
          <button
            onClick={() => setViewMode("regions")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "regions"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            По регионам
          </button>
        </div>

        {/* Cities/Regions Table */}
        {viewMode === "cities" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Топ-15 городов по сборам
                <Badge variant="secondary">Январь 2026</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {citiesBoxOffice.map((city, index) => (
                <CityRow key={city.city} city={city} index={index} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Федеральные округа
                <Badge variant="secondary">Январь 2026</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Округ</th>
                      <th className="text-right py-3 px-4">Сборы (млн)</th>
                      <th className="text-right py-3 px-4">Доля</th>
                      <th className="text-right py-3 px-4">Зрители (тыс)</th>
                      <th className="text-right py-3 px-4">Кинотеатры</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionsBoxOffice.map((region) => (
                      <tr key={region.region} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: REGION_COLORS[region.region] }}
                            />
                            <span className="font-medium">{region.fullName}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {region.revenue.toLocaleString("ru-RU")}
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="secondary">{region.share}%</Badge>
                        </td>
                        <td className="text-right py-3 px-4">
                          {region.viewers.toLocaleString("ru-RU")}
                        </td>
                        <td className="text-right py-3 px-4">{region.cinemas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ключевые выводы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Москва и СПб</strong> — 40% всех сборов. Премиальные цены (средний билет 650+ руб).
            </p>
            <p className="text-sm">
              <strong>Поволжье (ПФО)</strong> — 14% сборов. Казань, Нижний Новгород, Самара, Уфа — ключевые города.
            </p>
            <p className="text-sm">
              <strong>Рост в регионах</strong> — посещаемость на 22% выше 2019 года. Региональные города растут быстрее столиц.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
