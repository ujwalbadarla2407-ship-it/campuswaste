import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { useBuildingForecast, useBuildings } from "../../hooks/useBackend";
import { ConfidenceLevel } from "../../types";
import type { BinForecast, DailyForecast } from "../../types";

const DAY_LABELS = [
  "Today",
  "Tomorrow",
  "Day 3",
  "Day 4",
  "Day 5",
  "Day 6",
  "Day 7",
];

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { label: string; class: string }
> = {
  [ConfidenceLevel.high]: {
    label: "High",
    class: "border-green-500/30 text-green-400",
  },
  [ConfidenceLevel.medium]: {
    label: "Med",
    class: "border-yellow-500/30 text-yellow-400",
  },
  [ConfidenceLevel.low]: {
    label: "Low",
    class: "border-muted-foreground/30 text-muted-foreground",
  },
};

function ForecastDayCell({ forecast }: { forecast: DailyForecast }) {
  const pct = Number(forecast.predictedFillPercent);
  const dayLabel =
    DAY_LABELS[Number(forecast.dayOffset)] ?? `Day ${forecast.dayOffset}`;
  const conf = CONFIDENCE_CONFIG[forecast.confidence];

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-md border p-2.5",
        forecast.needsCollection
          ? "bg-red-500/5 border-red-500/20"
          : "bg-muted/20 border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-foreground">
          {dayLabel}
        </span>
        {forecast.needsCollection ? (
          <AlertTriangle className="h-3 w-3 text-red-400" />
        ) : (
          <CheckCircle2 className="h-3 w-3 text-muted-foreground/40" />
        )}
      </div>

      {/* Mini fill bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            pct >= 80
              ? "bg-red-500"
              : pct >= 50
                ? "bg-yellow-500"
                : "bg-green-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            pct >= 80
              ? "text-red-400"
              : pct >= 50
                ? "text-yellow-400"
                : "text-green-400",
          )}
        >
          {pct}%
        </span>
        <Badge
          variant="outline"
          className={cn("text-[9px] px-1 py-0 h-4", conf.class)}
        >
          {conf.label}
        </Badge>
      </div>
    </div>
  );
}

function BinForecastCard({ bf }: { bf: BinForecast }) {
  const needsCollectionDays = bf.forecasts.filter((f) => f.needsCollection);
  const maxPct = Math.max(
    ...bf.forecasts.map((f) => Number(f.predictedFillPercent)),
  );
  const firstCollectionDay =
    needsCollectionDays.length > 0
      ? (DAY_LABELS[Number(needsCollectionDays[0].dayOffset)] ??
        `Day ${needsCollectionDays[0].dayOffset}`)
      : null;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary shrink-0" />
          <span className="truncate">Bin #{bf.binId.toString()}</span>
          {needsCollectionDays.length > 0 ? (
            <Badge className="ml-auto bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] shrink-0">
              <AlertTriangle className="h-2.5 w-2.5 mr-1" />
              Due {firstCollectionDay}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="ml-auto border-green-500/30 text-green-400 text-[10px] shrink-0"
            >
              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
              On track
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-smooth",
                maxPct >= 80
                  ? "bg-red-500"
                  : maxPct >= 50
                    ? "bg-yellow-500"
                    : "bg-green-500",
              )}
              style={{ width: `${maxPct}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground shrink-0">
            Peak: {maxPct}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {bf.forecasts.map((f) => (
            <ForecastDayCell key={f.dayOffset.toString()} forecast={f} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StaffForecasts() {
  const { data: buildings, isLoading: buildingsLoading } = useBuildings();
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const buildingId = selectedBuilding ? BigInt(selectedBuilding) : null;
  const { data: forecasts, isLoading: forecastsLoading } =
    useBuildingForecast(buildingId);

  const criticalForecasts =
    forecasts?.filter((bf) => bf.forecasts.some((f) => f.needsCollection)) ??
    [];
  const okForecasts =
    forecasts?.filter((bf) => !bf.forecasts.some((f) => f.needsCollection)) ??
    [];

  const selectedBuildingName = buildings?.find(
    (b) => b.id.toString() === selectedBuilding,
  )?.name;

  return (
    <div className="space-y-5" data-ocid="staff-forecasts">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Collection Forecasts
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          7-day predictive fill levels to plan collections ahead of time
        </p>
      </div>

      {/* Building selector */}
      <div className="flex items-center gap-3">
        <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
          <SelectTrigger className="w-72" data-ocid="forecast-building-select">
            <SelectValue placeholder="Select a building to view forecasts…" />
          </SelectTrigger>
          <SelectContent>
            {buildingsLoading ? (
              <SelectItem value="loading" disabled>
                Loading buildings…
              </SelectItem>
            ) : (
              (buildings ?? []).map((b) => (
                <SelectItem key={b.id.toString()} value={b.id.toString()}>
                  <span className="font-medium">{b.name}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    — {b.zone}
                  </span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedBuilding && forecasts && (
          <div className="flex gap-2">
            {criticalForecasts.length > 0 && (
              <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 gap-1">
                <AlertTriangle className="h-3 w-3" />
                {criticalForecasts.length} bins need collection
              </Badge>
            )}
            {okForecasts.length > 0 && (
              <Badge
                variant="outline"
                className="border-green-500/30 text-green-400 gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                {okForecasts.length} on track
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {!selectedBuilding ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="forecasts-placeholder"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <p className="font-display font-semibold text-foreground text-lg">
            Select a building to view forecasts
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            7-day bin fill predictions with confidence levels help you plan
            collections before bins overflow.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground max-w-sm">
            {["Today", "Tomorrow", "Day 3–7"].map((d) => (
              <div
                key={d}
                className="rounded-md bg-muted/30 border border-border p-3"
              >
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary" />
                {d}
              </div>
            ))}
          </div>
        </div>
      ) : forecastsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["s1", "s2", "s3", "s4"].map((k) => (
            <Skeleton key={k} className="h-52 w-full" />
          ))}
        </div>
      ) : !forecasts || forecasts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            No forecast data available for {selectedBuildingName}.
          </p>
        </div>
      ) : (
        <>
          {criticalForecasts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Bins Requiring Collection Soon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalForecasts.map((bf) => (
                  <BinForecastCard key={bf.binId.toString()} bf={bf} />
                ))}
              </div>
              <Separator className="bg-border/50" />
            </div>
          )}

          {okForecasts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                On Track — No Collection Needed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {okForecasts.map((bf) => (
                  <BinForecastCard key={bf.binId.toString()} bf={bf} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
