import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { BinCard } from "../../components/BinCard";
import { BinDetailModal } from "../../components/BinDetailModal";
import { useBinStatuses, useBuildings } from "../../hooks/useBackend";
import type { BinInfo } from "../../types";
import { getBinUrgency } from "../../types";

type FilterType = "all" | "critical" | "warning" | "safe";

const FILTERS: { value: FilterType; label: string; color: string }[] = [
  { value: "all", label: "All Bins", color: "" },
  {
    value: "critical",
    label: "Critical",
    color:
      "border-red-500/40 text-red-400 data-[active=true]:bg-red-500 data-[active=true]:text-white data-[active=true]:border-red-500",
  },
  {
    value: "warning",
    label: "Warning",
    color:
      "border-yellow-500/40 text-yellow-400 data-[active=true]:bg-yellow-500 data-[active=true]:text-gray-900 data-[active=true]:border-yellow-500",
  },
  {
    value: "safe",
    label: "Healthy",
    color:
      "border-green-500/40 text-green-400 data-[active=true]:bg-green-500 data-[active=true]:text-gray-900 data-[active=true]:border-green-500",
  },
];

export default function StaffBins() {
  const { data: bins, isLoading } = useBinStatuses();
  const { data: buildings } = useBuildings();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [selectedBin, setSelectedBin] = useState<BinInfo | null>(null);

  const filtered = (bins ?? []).filter((b) => {
    const matchSearch = b.binLabel.toLowerCase().includes(search.toLowerCase());
    const urgency = getBinUrgency(b.fillPercent);
    const matchFilter = filter === "all" || urgency === filter;
    const matchBuilding =
      selectedBuilding === "all" ||
      b.buildingId.toString() === selectedBuilding;
    return matchSearch && matchFilter && matchBuilding;
  });

  const getBuildingName = (buildingId: bigint) =>
    buildings?.find((b) => b.id === buildingId)?.name;

  const criticalCount = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "critical",
  ).length;
  const warningCount = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "warning",
  ).length;

  return (
    <div className="space-y-5" data-ocid="staff-bins">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Bin Status
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and dispatch collections for all{" "}
            {bins ? (
              <span className="text-foreground font-medium">{bins.length}</span>
            ) : (
              "—"
            )}{" "}
            campus bins
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {criticalCount > 0 && (
            <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              {criticalCount} critical
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              {warningCount} warning
            </Badge>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search bins by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="bins-search"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant="outline"
              size="sm"
              data-active={filter === f.value}
              className={
                filter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : f.color || ""
              }
              onClick={() => setFilter(f.value)}
              data-ocid={`filter-${f.value}`}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Building filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedBuilding === "all" ? "secondary" : "ghost"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setSelectedBuilding("all")}
            data-ocid="building-filter-all"
          >
            <Building2 className="h-3.5 w-3.5" />
            All Buildings
          </Button>
          {(buildings ?? []).slice(0, 4).map((b) => (
            <Button
              key={b.id.toString()}
              variant={
                selectedBuilding === b.id.toString() ? "secondary" : "ghost"
              }
              size="sm"
              className="text-xs"
              onClick={() =>
                setSelectedBuilding(
                  selectedBuilding === b.id.toString()
                    ? "all"
                    : b.id.toString(),
                )
              }
              data-ocid={`building-filter-${b.id}`}
            >
              {b.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Bin grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
            <Skeleton key={k} className="h-36 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="bins-empty"
        >
          <Trash2 className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">
            No bins match your filters
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting the search or urgency filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setFilter("all");
              setSelectedBuilding("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} bin{filtered.length !== 1 ? "s" : ""}
            {filter !== "all" && ` — ${filter} only`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((bin) => (
              <BinCard
                key={bin.id.toString()}
                bin={bin}
                buildingName={getBuildingName(bin.buildingId)}
                onViewDetail={setSelectedBin}
                onDispatch={setSelectedBin}
              />
            ))}
          </div>
        </>
      )}

      <BinDetailModal
        bin={selectedBin}
        buildings={buildings}
        open={!!selectedBin}
        onClose={() => setSelectedBin(null)}
      />
    </div>
  );
}
