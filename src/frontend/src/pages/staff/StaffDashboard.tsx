import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { BinCard } from "../../components/BinCard";
import { BinDetailModal } from "../../components/BinDetailModal";
import {
  useActiveTasks,
  useBinStatuses,
  useBinsNeedingCollection,
  useBuildings,
} from "../../hooks/useBackend";
import type { BinInfo } from "../../types";
import { getBinUrgency } from "../../types";

export default function StaffDashboard() {
  const { data: bins, isLoading: binsLoading, refetch } = useBinStatuses();
  const { data: urgentBins } = useBinsNeedingCollection();
  const { data: tasks } = useActiveTasks();
  const { data: buildings } = useBuildings();
  const [selectedBin, setSelectedBin] = useState<BinInfo | null>(null);

  const critical = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "critical",
  );
  const warning = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "warning",
  );
  const safe = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "safe",
  );
  const activeTasks = (tasks ?? []).filter(
    (t) => t.status !== ("completed" as never),
  );

  const getBuildingName = (buildingId: bigint) =>
    buildings?.find((b) => b.id === buildingId)?.name;

  const stats = [
    {
      label: "Critical",
      value: critical.length,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      label: "Warning",
      value: warning.length,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      label: "Healthy",
      value: safe.length,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: "Active Tasks",
      value: activeTasks.length,
      icon: Trash2,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="staff-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Operations Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live bin status across campus — auto-refreshes every 30s
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
          data-ocid="refresh-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className={`bg-card border ${s.border} transition-smooth`}
            >
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </p>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${s.bg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                  </div>
                </div>
                {binsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className={`font-display text-3xl font-bold ${s.color}`}>
                    {s.value}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bins needing immediate action */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Needs Collection
                {urgentBins && urgentBins.length > 0 && (
                  <Badge className="bg-red-500 text-white ml-1 text-[10px]">
                    {urgentBins.length}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                asChild
              >
                <Link to="/staff/bins" data-ocid="view-all-bins-link">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {binsLoading ? (
              <>
                {["s1", "s2", "s3"].map((k) => (
                  <Skeleton key={k} className="h-16 w-full" />
                ))}
              </>
            ) : !urgentBins || urgentBins.length === 0 ? (
              <div
                className="flex items-center gap-2 text-green-400 py-3"
                data-ocid="no-urgent-bins"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p className="text-sm">All bins are within normal levels.</p>
              </div>
            ) : (
              urgentBins
                .slice(0, 5)
                .map((bin) => (
                  <BinCard
                    key={bin.id.toString()}
                    bin={bin}
                    buildingName={getBuildingName(bin.buildingId)}
                    onViewDetail={setSelectedBin}
                    onDispatch={setSelectedBin}
                    compact
                  />
                ))
            )}
          </CardContent>
        </Card>

        {/* Active tasks summary */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-sm flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-primary" />
                Active Tasks
                {activeTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    {activeTasks.length}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                asChild
              >
                <Link to="/staff/tasks" data-ocid="view-all-tasks-link">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!tasks ? (
              <div className="space-y-2">
                {["t1", "t2"].map((k) => (
                  <Skeleton key={k} className="h-12 w-full" />
                ))}
              </div>
            ) : activeTasks.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 py-6 text-center"
                data-ocid="no-active-tasks"
              >
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No active collection tasks
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Dispatch from urgent bins above
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id.toString()}
                    className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2.5"
                    data-ocid={`dashboard-task-${task.id}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          task.status === ("inProgress" as never)
                            ? "bg-primary animate-pulse"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-foreground truncate">
                        Task #{task.id.toString()} — Bin #
                        {task.binId.toString()}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        task.status === ("inProgress" as never)
                          ? "border-primary/50 text-primary text-[10px]"
                          : "border-muted-foreground/30 text-muted-foreground text-[10px]"
                      }
                    >
                      {task.status === ("inProgress" as never)
                        ? "In Progress"
                        : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Critical bins grid */}
      {critical.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Critical Bins — Immediate Action Required
            <Badge className="bg-red-500/15 text-red-400 border-red-500/30 border text-[10px]">
              {critical.length}
            </Badge>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {critical.map((bin) => (
              <BinCard
                key={bin.id.toString()}
                bin={bin}
                buildingName={getBuildingName(bin.buildingId)}
                onViewDetail={setSelectedBin}
                onDispatch={setSelectedBin}
              />
            ))}
          </div>
        </div>
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
