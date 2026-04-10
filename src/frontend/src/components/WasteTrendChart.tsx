import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Building, WasteTrendEntry } from "../types";

const LINE_COLORS = [
  "oklch(0.75 0.15 190)",
  "oklch(0.65 0.18 145)",
  "oklch(0.75 0.15 85)",
  "oklch(0.55 0.2 25)",
  "oklch(0.7 0.17 162)",
  "oklch(0.6 0.18 270)",
  "oklch(0.72 0.14 220)",
  "oklch(0.68 0.16 50)",
  "oklch(0.62 0.18 300)",
  "oklch(0.78 0.12 170)",
];

interface WasteTrendChartProps {
  trends: WasteTrendEntry[];
  buildings: Building[];
  isLoading?: boolean;
  /** Limit visible buildings to top N by total kg */
  topN?: number;
  title?: string;
  height?: number;
}

export function WasteTrendChart({
  trends,
  buildings,
  isLoading,
  topN = 10,
  title = "Collected Waste (kg) — All Buildings",
  height = 320,
}: WasteTrendChartProps) {
  const buildingMap = new Map(buildings.map((b) => [b.id.toString(), b.name]));

  // Compute top N buildings by total kg
  const totals: Record<string, number> = {};
  for (const t of trends) {
    const name = buildingMap.get(t.buildingId.toString()) ?? `B${t.buildingId}`;
    totals[name] = (totals[name] ?? 0) + Number(t.collectedKg);
  }
  const topBuildings = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);

  // Pivot: dayOffset → { day, buildingName: kg, ... }
  const pivoted: Record<string, Record<string, number>> = {};
  for (const t of trends) {
    const bName =
      buildingMap.get(t.buildingId.toString()) ?? `B${t.buildingId}`;
    if (!topBuildings.includes(bName)) continue;
    const key = t.dayOffset.toString();
    if (!pivoted[key]) pivoted[key] = { day: Number(t.dayOffset) };
    pivoted[key][bName] = Number(t.collectedKg);
  }

  const chartData = Object.values(pivoted).sort(
    (a, b) => (a.day as number) - (b.day as number),
  );

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton style={{ height }} className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border" data-ocid="waste-trend-chart">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary shrink-0" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{ height }}
            data-ocid="trend-chart-empty"
          >
            <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium text-foreground">
              No trend data available
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Data will appear once collections are recorded
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 16, left: -8, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tickFormatter={(v) => `D${v}`}
                tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}kg`}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.014 260)",
                  border: "1px solid oklch(0.28 0.02 260)",
                  borderRadius: "6px",
                  color: "oklch(0.95 0.01 260)",
                  fontSize: "11px",
                }}
                formatter={(v: number, name: string) => [`${v} kg`, name]}
                labelFormatter={(v) => `Day ${v}`}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "12px" }} />
              {topBuildings.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
