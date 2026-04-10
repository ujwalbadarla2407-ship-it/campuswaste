import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WasteTrendChart } from "../../components/WasteTrendChart";
import { useBuildings, useWasteTrends } from "../../hooks/useBackend";

const TOOLTIP_STYLE = {
  background: "oklch(0.18 0.014 260)",
  border: "1px solid oklch(0.28 0.02 260)",
  borderRadius: "6px",
  color: "oklch(0.95 0.01 260)",
  fontSize: "11px",
};

const AXIS_TICK = { fill: "oklch(0.55 0.01 260)", fontSize: 11 };

const AREA_COLORS = [
  "oklch(0.75 0.15 190)",
  "oklch(0.65 0.18 145)",
  "oklch(0.75 0.15 85)",
  "oklch(0.55 0.2 25)",
  "oklch(0.7 0.17 162)",
];

type ViewMode = "all" | "top5";

export default function ManagerTrends() {
  const { data: trends, isLoading: trendsLoading } = useWasteTrends();
  const { data: buildings, isLoading: buildingsLoading } = useBuildings();
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const buildingMap = new Map(
    (buildings ?? []).map((b) => [b.id.toString(), b.name]),
  );

  // Total kg per day (aggregate all buildings)
  const totalPerDay: Record<string, number> = {};
  for (const t of trends ?? []) {
    const key = t.dayOffset.toString();
    totalPerDay[key] = (totalPerDay[key] ?? 0) + Number(t.collectedKg);
  }

  const aggregateData = Object.entries(totalPerDay)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([day, total]) => ({ day: Number(day), total }));

  // Top 5 buildings by total kg
  const totals: Record<string, number> = {};
  for (const t of trends ?? []) {
    const name = buildingMap.get(t.buildingId.toString()) ?? `B${t.buildingId}`;
    totals[name] = (totals[name] ?? 0) + Number(t.collectedKg);
  }
  const top5 = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  // Pivot top-5
  const pivotedTop5: Record<string, Record<string, number>> = {};
  for (const t of trends ?? []) {
    const bName =
      buildingMap.get(t.buildingId.toString()) ?? `B${t.buildingId}`;
    if (!top5.includes(bName)) continue;
    const key = t.dayOffset.toString();
    if (!pivotedTop5[key]) pivotedTop5[key] = { day: Number(t.dayOffset) };
    pivotedTop5[key][bName] = Number(t.collectedKg);
  }
  const top5Data = Object.values(pivotedTop5).sort(
    (a, b) => (a.day as number) - (b.day as number),
  );

  const totalKg30d = aggregateData.reduce((acc, d) => acc + d.total, 0);
  const peakDay = aggregateData.reduce(
    (max, d) => (d.total > (max?.total ?? 0) ? d : max),
    aggregateData[0],
  );

  const isLoading = trendsLoading || buildingsLoading;

  return (
    <div className="space-y-6" data-ocid="manager-trends">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Waste Trends
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Historical collection volume across all buildings — past 30 days
          </p>
        </div>
        <div className="flex gap-1.5" data-ocid="view-mode-tabs">
          {(["all", "top5"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-smooth ${
                viewMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`view-mode-${mode}`}
            >
              {mode === "all" ? "All Buildings" : "Top 5"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "30-Day Total",
            value: isLoading ? null : `${totalKg30d.toLocaleString()} kg`,
            icon: TrendingUp,
          },
          {
            label: "Peak Day",
            value: isLoading ? null : peakDay ? `Day ${peakDay.day}` : "—",
            icon: CalendarDays,
          },
          {
            label: "Buildings Tracked",
            value: isLoading ? null : (buildings?.length ?? 0),
            icon: TrendingUp,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {label}
                </p>
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="font-display text-xl font-bold text-foreground">
                  {value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campus-aggregate area chart */}
      <Card className="bg-card border-border" data-ocid="aggregate-trend-chart">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Total Campus Collection Volume (kg)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : aggregateData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={aggregateData}
                margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.75 0.15 190)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.75 0.15 190)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) => `D${v}`}
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
                  formatter={(v: number) => [`${v} kg`, "Total"]}
                  labelFormatter={(v) => `Day ${v}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="oklch(0.75 0.15 190)"
                  strokeWidth={2}
                  fill="url(#totalGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Per-building breakdown */}
      {viewMode === "top5" ? (
        <Card className="bg-card border-border" data-ocid="top5-trend-chart">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="font-display text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Top 5 Buildings by Volume
              </CardTitle>
              <div className="flex gap-1">
                {top5.map((name, i) => (
                  <Badge
                    key={name}
                    className="text-[9px] px-1.5"
                    style={{
                      background: `${AREA_COLORS[i % AREA_COLORS.length]}33`,
                      color: AREA_COLORS[i % AREA_COLORS.length],
                      borderColor: `${AREA_COLORS[i % AREA_COLORS.length]}66`,
                    }}
                  >
                    {name.length > 10 ? `${name.slice(0, 9)}…` : name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : top5Data.length === 0 ? (
              <div className="flex items-center justify-center h-72 text-muted-foreground">
                No data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={top5Data}
                  margin={{ top: 4, right: 16, left: -8, bottom: 0 }}
                >
                  {top5.map((name, i) => (
                    <defs key={`grad-${name}`}>
                      <linearGradient
                        id={`grad-${name}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={AREA_COLORS[i % AREA_COLORS.length]}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={AREA_COLORS[i % AREA_COLORS.length]}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  ))}
                  <XAxis
                    dataKey="day"
                    tickFormatter={(v) => `D${v}`}
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
                    formatter={(v: number, name: string) => [`${v} kg`, name]}
                    labelFormatter={(v) => `Day ${v}`}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                  />
                  {top5.map((name, i) => (
                    <Area
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={AREA_COLORS[i % AREA_COLORS.length]}
                      strokeWidth={2}
                      fill={`url(#grad-${name})`}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      ) : (
        <WasteTrendChart
          trends={trends ?? []}
          buildings={buildings ?? []}
          isLoading={isLoading}
          topN={10}
          title="Collection Volume by Building — All (top 10)"
          height={320}
        />
      )}
    </div>
  );
}
