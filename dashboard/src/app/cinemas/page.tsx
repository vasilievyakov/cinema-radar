"use client";

import { useState } from "react";
import {
  Building2,
  Film,
  Monitor,
  MapPin,
  Users,
  Ticket,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cinemaChains, realMovies } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Prepare data for stacked bar chart
const screeningsData = cinemaChains.map((chain) => ({
  name: chain.name,
  "Чебурашка 2": chain.screeningsCheburashka,
  "Буратино": chain.screeningsBuratino,
  "Простоквашино": chain.screeningsProstokvashino,
  total: chain.screeningsTotal,
}));

function ChainCard({ chain }: { chain: typeof cinemaChains[0] }) {
  const occupancyColor =
    chain.avgOccupancy >= 70
      ? "text-green-500"
      : chain.avgOccupancy >= 60
      ? "text-yellow-500"
      : "text-orange-500";

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{chain.logo}</div>
            <div>
              <h3 className="font-semibold text-lg">{chain.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{chain.cinemas} кинотеатров</span>
                <span>•</span>
                <Monitor className="h-4 w-4" />
                <span>{chain.screens} залов</span>
                <span>•</span>
                <MapPin className="h-4 w-4" />
                <span>{chain.cities} городов</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {chain.imax > 0 && (
              <Badge variant="secondary">IMAX: {chain.imax}</Badge>
            )}
            {chain.dolbyAtmos > 0 && (
              <Badge variant="secondary">Dolby Atmos: {chain.dolbyAtmos}</Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <div className="text-2xl font-bold">{chain.screeningsTotal.toLocaleString("ru-RU")}</div>
            <div className="text-sm text-muted-foreground">Всего сеансов</div>
          </div>
          <div>
            <div className={cn("text-2xl font-bold", occupancyColor)}>
              {chain.avgOccupancy}%
            </div>
            <div className="text-sm text-muted-foreground">Заполняемость</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{chain.avgTicketPrice} ₽</div>
            <div className="text-sm text-muted-foreground">Ср. билет</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.round((chain.screeningsCheburashka / chain.screeningsTotal) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Чебурашка 2</div>
          </div>
        </div>

        {/* Movie Distribution */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm font-medium mb-2">Распределение сеансов</div>
          <div className="flex gap-2 h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary"
              style={{
                width: `${(chain.screeningsCheburashka / chain.screeningsTotal) * 100}%`,
              }}
              title="Чебурашка 2"
            />
            <div
              className="bg-yellow-500"
              style={{
                width: `${(chain.screeningsBuratino / chain.screeningsTotal) * 100}%`,
              }}
              title="Буратино"
            />
            <div
              className="bg-green-500"
              style={{
                width: `${(chain.screeningsProstokvashino / chain.screeningsTotal) * 100}%`,
              }}
              title="Простоквашино"
            />
            <div
              className="bg-muted"
              style={{
                width: `${
                  ((chain.screeningsTotal -
                    chain.screeningsCheburashka -
                    chain.screeningsBuratino -
                    chain.screeningsProstokvashino) /
                    chain.screeningsTotal) *
                  100
                }%`,
              }}
              title="Другие"
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Чебурашка 2
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              Буратино
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Простоквашино
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted" />
              Другие
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CinemasPage() {
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);

  const totalScreens = cinemaChains.reduce((sum, c) => sum + c.screens, 0);
  const totalCinemas = cinemaChains.reduce((sum, c) => sum + c.cinemas, 0);
  const totalScreenings = cinemaChains.reduce((sum, c) => sum + c.screeningsTotal, 0);
  const avgOccupancy = Math.round(
    cinemaChains.reduce((sum, c) => sum + c.avgOccupancy, 0) / cinemaChains.length
  );

  return (
    <div className="flex flex-col">
      <Header
        title="Кинотеатры"
        description="Сравнение киносетей и распределение сеансов"
        showDemoAlert
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{totalCinemas}</div>
                  <div className="text-sm text-muted-foreground">Кинотеатров (топ-6 сетей)</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{totalScreens}</div>
                  <div className="text-sm text-muted-foreground">Залов</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{totalScreenings.toLocaleString("ru-RU")}</div>
                  <div className="text-sm text-muted-foreground">Сеансов (праздники)</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{avgOccupancy}%</div>
                  <div className="text-sm text-muted-foreground">Ср. заполняемость</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Screenings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Сеансы по сетям: топ-3 фильма
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={screeningsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Чебурашка 2" fill="hsl(var(--primary))" stackId="a" />
                  <Bar dataKey="Буратино" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="Простоквашино" fill="#22c55e" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Сравнение киносетей
              <Badge variant="secondary">Январь 2026</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Сеть</th>
                    <th className="text-right py-3 px-4">Кинотеатры</th>
                    <th className="text-right py-3 px-4">Залы</th>
                    <th className="text-right py-3 px-4">Города</th>
                    <th className="text-right py-3 px-4">Сеансы</th>
                    <th className="text-right py-3 px-4">Заполняемость</th>
                    <th className="text-right py-3 px-4">Ср. билет</th>
                    <th className="text-right py-3 px-4">IMAX</th>
                    <th className="text-right py-3 px-4">Dolby</th>
                  </tr>
                </thead>
                <tbody>
                  {cinemaChains.map((chain) => (
                    <tr key={chain.name} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{chain.logo}</span>
                          <span className="font-medium">{chain.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">{chain.cinemas}</td>
                      <td className="text-right py-3 px-4">{chain.screens}</td>
                      <td className="text-right py-3 px-4">{chain.cities}</td>
                      <td className="text-right py-3 px-4 font-medium">
                        {chain.screeningsTotal.toLocaleString("ru-RU")}
                      </td>
                      <td className="text-right py-3 px-4">
                        <span
                          className={cn(
                            "font-medium",
                            chain.avgOccupancy >= 70
                              ? "text-green-500"
                              : chain.avgOccupancy >= 60
                              ? "text-yellow-500"
                              : "text-orange-500"
                          )}
                        >
                          {chain.avgOccupancy}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{chain.avgTicketPrice} ₽</td>
                      <td className="text-right py-3 px-4">{chain.imax}</td>
                      <td className="text-right py-3 px-4">{chain.dolbyAtmos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Chain Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Детали по сетям</h2>
          {cinemaChains.map((chain) => (
            <ChainCard key={chain.name} chain={chain} />
          ))}
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ключевые выводы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>КАРО</strong> — лидер по заполняемости (72%) и премиальным форматам (8 IMAX, 12 Dolby Atmos).
            </p>
            <p className="text-sm">
              <strong>Чебурашка 2</strong> занимает ~34% всех сеансов во всех сетях — максимальная доля.
            </p>
            <p className="text-sm">
              <strong>Формула Кино</strong> — высокая заполняемость (70%) при меньшем количестве залов.
            </p>
            <p className="text-sm">
              <strong>Люксор</strong> — самые доступные цены (450 ₽), но ниже заполняемость (58%).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
