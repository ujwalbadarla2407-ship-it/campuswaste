import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search } from "lucide-react";
import { useState } from "react";
import { ForecastChart } from "../../components/ForecastChart";
import {
  useBinsForBuilding,
  useBuildingForecast,
  useBuildings,
} from "../../hooks/useBackend";
import { getBinUrgency } from "../../types";
import type { Building } from "../../types";

function BinRow({
  label,
  fillPercent,
  binId,
}: {
  label: string;
  fillPercent: bigint;
  binId: bigint;
}) {
  const urgency = getBinUrgency(fillPercent);
  const pct = Number(fillPercent);
  const barClass =
    urgency === "critical"
      ? "bg-destructive"
      : urgency === "warning"
        ? "bg-warning"
        : "bg-success";

  return (
    <div
      className="flex items-center gap-3 rounded bg-muted/25 px-3 py-2 hover:bg-muted/40 transition-smooth"
      data-ocid={`bin-row-${binId}`}
    >
      <div
        className={`h-2 w-2 rounded-full shrink-0 ${urgency === "critical" ? "bg-destructive" : urgency === "warning" ? "bg-warning" : "bg-success"}`}
      />
      <span className="text-xs text-foreground flex-1 truncate min-w-0">
        {label}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground w-9 text-right">
          {pct}%
        </span>
        <Badge
          className={`text-[9px] px-1.5 ${urgency === "critical" ? "bin-critical" : urgency === "warning" ? "bin-warning" : "bg-success/20 text-success border-success/30"}`}
        >
          {urgency}
        </Badge>
      </div>
    </div>
  );
}

function BuildingCard({ building }: { building: Building }) {
  const [expanded, setExpanded] = useState(false);
  const { data: bins, isLoading: binsLoading } = useBinsForBuilding(
    expanded ? building.id : null,
  );
  const { data: forecasts, isLoading: forecastLoading } = useBuildingForecast(
    expanded ? building.id : null,
  );

  const criticalCount =
    bins?.filter((b) => getBinUrgency(b.fillPercent) === "critical").length ??
    0;
  const warningCount =
    bins?.filter((b) => getBinUrgency(b.fillPercent) === "warning").length ?? 0;

  return (
    <Card
      className="bg-card border-border"
      data-ocid={`building-card-${building.id}`}
    >
      <CardHeader
        className="pb-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`building-expand-${building.id}`}
      >
        <CardTitle className="font-display text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{building.name}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {criticalCount > 0 && (
              <Badge className="bin-critical text-[10px] px-1.5">
                {criticalCount}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bin-warning text-[10px] px-1.5">
                {warningCount}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] px-1.5">
              {building.zone}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-4">
          {/* 7-day forecast chart */}
          <ForecastChart
            building={building}
            forecasts={forecasts ?? []}
            isLoading={forecastLoading}
          />

          {/* Bin list */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
              Current Bin Status
            </p>
            {binsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((k) => (
                  <Skeleton key={k} className="h-8 w-full" />
                ))}
              </div>
            ) : !bins || bins.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No bins in this building.
              </p>
            ) : (
              <div className="space-y-1.5">
                {bins.map((bin) => (
                  <BinRow
                    key={bin.id.toString()}
                    label={bin.binLabel}
                    fillPercent={bin.fillPercent}
                    binId={bin.id}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function ManagerBuildings() {
  const { data: buildings, isLoading } = useBuildings();
  const [search, setSearch] = useState("");

  const filtered = (buildings ?? []).filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.zone.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5" data-ocid="manager-buildings">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Buildings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Expand a building to view bin statuses and 7-day forecasts
          </p>
        </div>
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-xs"
            placeholder="Search buildings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="building-search"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <Skeleton key={k} className="h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="buildings-empty"
        >
          <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No buildings found</p>
          {search && (
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <BuildingCard key={b.id.toString()} building={b} />
          ))}
        </div>
      )}
    </div>
  );
}
