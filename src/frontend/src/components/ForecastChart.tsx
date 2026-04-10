import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CalendarDays, CheckCircle2 } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ConfidenceLevel } from "../types";
import type { BinForecast, Building } from "../types";

const DAY_LABELS = ["Today", "+1d", "+2d", "+3d", "+4d", "+5d", "+6d"];

const CONFIDENCE_CONFIG = {
  [ConfidenceLevel.high]: {
    label: "High",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  [ConfidenceLevel.medium]: {
    label: "Medium",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  [ConfidenceLevel.low]: {
    label: "Low",
    className: "bg-muted-foreground/20 text-muted-foreground border-border",
  },
};

function getFillColor(pct: number, needsCollection: boolean): string {
  if (needsCollection || pct >= 85) return "oklch(0.55 0.2 25)";
  if (pct >= 60) return "oklch(0.75 0.15 85)";
  return "oklch(0.65 0.18 145)";
}

function getOverallDayConfidence(
  forecasts: BinForecast[],
  dayOffset: number,
): ConfidenceLevel {
  const dayForecasts = forecasts.flatMap((bf) =>
    bf.forecasts.filter((f) => Number(f.dayOffset) === dayOffset),
  );
  if (dayForecasts.some((f) => f.confidence === ConfidenceLevel.low))
    return ConfidenceLevel.low;
  if (dayForecasts.some((f) => f.confidence === ConfidenceLevel.medium))
    return ConfidenceLevel.medium;
  return ConfidenceLevel.high;
}

interface ForecastChartProps {
  building: Building;
  forecasts: BinForecast[];
  isLoading?: boolean;
}

export function ForecastChart({
  building,
  forecasts,
  isLoading,
}: ForecastChartProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Aggregate: per dayOffset, compute avg predictedFillPercent and count needing collection
  const dayData = Array.from({ length: 7 }, (_, i) => {
    const dayForecasts = forecasts.flatMap((bf) =>
      bf.forecasts.filter((f) => Number(f.dayOffset) === i),
    );
    const avgFill =
      dayForecasts.length > 0
        ? Math.round(
            dayForecasts.reduce(
              (sum, f) => sum + Number(f.predictedFillPercent),
              0,
            ) / dayForecasts.length,
          )
        : 0;
    const needsCollection = dayForecasts.some((f) => f.needsCollection);
    const confidence = getOverallDayConfidence(forecasts, i);
    return {
      day: DAY_LABELS[i] ?? `+${i}d`,
      avgFill,
      needsCollection,
      confidence,
    };
  });

  const criticalDays = dayData.filter((d) => d.needsCollection).length;
  const overallConfidence =
    dayData.find((d) => d.confidence === ConfidenceLevel.low)?.confidence ??
    dayData.find((d) => d.confidence === ConfidenceLevel.medium)?.confidence ??
    ConfidenceLevel.high;

  const confCfg = CONFIDENCE_CONFIG[overallConfidence];

  return (
    <Card
      className="bg-card border-border"
      data-ocid={`forecast-card-${building.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{building.name}</span>
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {criticalDays > 0 ? (
              <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] px-2">
                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                {criticalDays} alert{criticalDays !== 1 ? "s" : ""}
              </Badge>
            ) : (
              <Badge className="bg-success/20 text-success border-success/30 text-[10px] px-2">
                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                Clear
              </Badge>
            )}
            <Badge
              className={`text-[10px] px-2 border ${confCfg.className}`}
              data-ocid={`confidence-${building.id}`}
            >
              {confCfg.label} confidence
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {building.zone} · 7-day predicted fill levels
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={dayData}
            margin={{ top: 8, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.18 0.014 260)",
                border: "1px solid oklch(0.28 0.02 260)",
                borderRadius: "6px",
                color: "oklch(0.95 0.01 260)",
                fontSize: "11px",
              }}
              formatter={(
                value: number,
                _name: string,
                props: {
                  payload?: {
                    needsCollection?: boolean;
                    confidence?: ConfidenceLevel;
                  };
                },
              ) => [
                `${value}% fill${props.payload?.needsCollection ? " ⚠ needs collection" : ""}`,
                "Predicted",
              ]}
            />
            <ReferenceLine
              y={85}
              stroke="oklch(0.55 0.2 25)"
              strokeDasharray="4 3"
              strokeWidth={1}
            />
            <ReferenceLine
              y={60}
              stroke="oklch(0.75 0.15 85)"
              strokeDasharray="4 3"
              strokeWidth={1}
            />
            <Bar dataKey="avgFill" radius={[3, 3, 0, 0]}>
              {dayData.map((entry) => (
                <Cell
                  key={`cell-${entry.day}`}
                  fill={getFillColor(entry.avgFill, entry.needsCollection)}
                  opacity={entry.needsCollection ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Day-level confidence indicators */}
        <div className="flex gap-1 mt-2">
          {dayData.map((d) => {
            const dotColor =
              d.confidence === ConfidenceLevel.high
                ? "bg-success"
                : d.confidence === ConfidenceLevel.medium
                  ? "bg-warning"
                  : "bg-muted-foreground";
            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-0.5"
                title={`${d.day}: ${CONFIDENCE_CONFIG[d.confidence].label} confidence`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Dots = prediction confidence per day
        </p>
      </CardContent>
    </Card>
  );
}
