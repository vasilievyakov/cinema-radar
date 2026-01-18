"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignalsByTypeProps {
  data: Record<string, number>;
}

const COLORS = [
  "hsl(346, 77%, 50%)",
  "hsl(173, 58%, 39%)",
  "hsl(197, 37%, 24%)",
  "hsl(43, 74%, 66%)",
  "hsl(27, 87%, 67%)",
  "hsl(280, 65%, 60%)",
];

const typeLabels: Record<string, string> = {
  review: "Отзывы",
  rating_change: "Рейтинги",
  screening: "Сеансы",
  news: "Новости",
  promotion: "Реклама",
  box_office: "Сборы",
};

export function SignalsByType({ data }: SignalsByTypeProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: typeLabels[name] || name,
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Сигналы по типу
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222.2 84% 4.9%)",
                  border: "1px solid hsl(217.2 32.6% 17.5%)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
