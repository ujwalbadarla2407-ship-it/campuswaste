import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BuildingSummaryTable } from "../../components/BuildingSummaryTable";
import { useBuildingSummaries } from "../../hooks/useBackend";

const CHART_COLORS = [
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

const TOOLTIP_STYLE = {
  background: "oklch(0.18 0.014 260)",
  border: "1px solid oklch(0.28 0.02 260)",
  borderRadius: "6px",
  color: "oklch(0.95 0.01 260)",
  fontSize: "11px",
};

const AXIS_TICK = { fill: "oklch(0.55 0.01 260)", fontSize: 11 };

export default function ManagerAnalytics() {
  const { data: summaries, isLoading } = useBuildingSummaries();

  const chartData = [...(summaries ?? [])]
    .sort((a, b) => Number(b.totalCollectedKg - a.totalCollectedKg))
    .slice(0, 10)
    .map((s) => ({
      name:
        s.buildingName.length > 13
          ? `${s.buildingName.slice(0, 11)}…`
          : s.buildingName,
      kg: Number(s.totalCollectedKg),
      fill: Number(s.averageFillPercent),
      id: s.buildingId.toString(),
    }));

  const highFillBuildings = (summaries ?? []).filter(
    (s) => Number(s.averageFillPercent) >= 75,
  ).length;

  return (
    <div className="space-y-6" data-ocid="manager-analytics">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Building-level waste performance and collection rankings
          </p>
        </div>
        {highFillBuildings > 0 && (
          <Badge
            className="bg-warning/20 text-warning border-warning/30 flex items-center gap-1.5"
            data-ocid="high-fill-alert"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {highFillBuildings} buildings with high avg fill
          </Badge>
        )}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Collected kg per building */}
        <Card className="bg-card border-border" data-ocid="kg-chart">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Total Collected (kg) per Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}kg`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: "oklch(0.22 0.02 260)" }}
                    formatter={(v: number) => [`${v} kg`, "Collected"]}
                  />
                  <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={entry.id}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Average fill % per building */}
        <Card className="bg-card border-border" data-ocid="fill-chart">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Average Fill Level (%) per Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: "oklch(0.22 0.02 260)" }}
                    formatter={(v: number) => [`${v}%`, "Avg Fill"]}
                  />
                  <Bar
                    dataKey="fill"
                    radius={[4, 4, 0, 0]}
                    fill="oklch(0.75 0.15 190)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ranked table */}
      <BuildingSummaryTable
        summaries={summaries ?? []}
        isLoading={isLoading}
        showExport={true}
      />
    </div>
  );
}
