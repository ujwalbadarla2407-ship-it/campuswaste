import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Clock,
  History,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useCollectionHistory } from "../hooks/useBackend";
import type { BinInfo, Building } from "../types";
import { formatRelativeTime, formatTimestamp, getBinUrgency } from "../types";
import { DispatchForm } from "./DispatchForm";

interface BinDetailModalProps {
  bin: BinInfo | null;
  buildings?: Building[];
  open: boolean;
  onClose: () => void;
}

function FillHistoryChart({ binId }: { binId: bigint }) {
  const { data: history, isLoading } = useCollectionHistory(binId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {["h1", "h2", "h3"].map((k) => (
          <Skeleton key={k} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <History className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No collection history yet.
        </p>
      </div>
    );
  }

  const recent = [...history].slice(0, 5);
  const maxFill = Math.max(
    ...recent.map((r) => Number(r.fillPercentAtCollection)),
  );

  return (
    <div className="space-y-3" data-ocid="fill-history-chart">
      {/* Mini bar chart */}
      <div className="space-y-1.5">
        {recent.map((record) => {
          const pct = Number(record.fillPercentAtCollection);
          const barPct = maxFill > 0 ? (pct / maxFill) * 100 : 0;
          const isHigh = pct >= 85;
          return (
            <div
              key={record.collectedAt.toString()}
              className="flex items-center gap-3"
            >
              <span className="w-24 text-[11px] text-muted-foreground shrink-0 truncate">
                {formatRelativeTime(record.collectedAt)}
              </span>
              <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded flex items-center justify-end px-1.5 transition-smooth",
                    isHigh
                      ? "bg-red-500/70"
                      : pct >= 60
                        ? "bg-yellow-500/70"
                        : "bg-green-500/70",
                  )}
                  style={{ width: `${barPct}%`, minWidth: "2rem" }}
                >
                  <span className="text-[10px] font-semibold text-white">
                    {pct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Separator className="bg-border/50" />
      {/* History list */}
      <div className="space-y-2">
        {recent.map((record) => (
          <div
            key={record.collectedAt.toString()}
            className="flex items-center justify-between text-xs py-1.5 border-b border-border/40 last:border-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
              <span className="text-muted-foreground truncate">
                {formatTimestamp(record.collectedAt)}
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] shrink-0",
                Number(record.fillPercentAtCollection) >= 85
                  ? "border-red-500/30 text-red-400"
                  : Number(record.fillPercentAtCollection) >= 60
                    ? "border-yellow-500/30 text-yellow-400"
                    : "border-green-500/30 text-green-400",
              )}
            >
              {record.fillPercentAtCollection.toString()}% at collection
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BinDetailModal({
  bin,
  buildings,
  open,
  onClose,
}: BinDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"history" | "dispatch">("history");

  if (!bin) return null;

  const pct = Number(bin.fillPercent);
  const urgency = getBinUrgency(bin.fillPercent);
  const building = buildings?.find((b) => b.id === bin.buildingId);

  const urgencyConfig = {
    critical: {
      icon: AlertTriangle,
      iconClass: "text-red-400",
      barClass: "bg-red-500",
      textClass: "text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      iconClass: "text-yellow-400",
      barClass: "bg-yellow-500",
      textClass: "text-yellow-400",
    },
    safe: {
      icon: CheckCircle2,
      iconClass: "text-green-400",
      barClass: "bg-green-500",
      textClass: "text-green-400",
    },
  };
  const config = urgencyConfig[urgency];
  const UrgencyIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md w-full"
        data-ocid="bin-detail-modal"
      >
        <DialogHeader className="pb-0">
          <DialogTitle className="font-display text-base flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <span className="truncate block">{bin.binLabel}</span>
              {building && (
                <span className="text-xs font-normal text-muted-foreground block">
                  {building.name} — {building.zone}
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Fill status banner */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UrgencyIcon
                className={cn("h-4 w-4 shrink-0", config.iconClass)}
              />
              <span className="text-sm font-medium text-foreground">
                Current fill level
              </span>
            </div>
            <span
              className={cn(
                "font-display text-lg font-bold tabular-nums",
                config.textClass,
              )}
            >
              {pct}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-smooth",
                config.barClass,
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Last collected: {formatRelativeTime(bin.lastCollectedAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart2 className="h-3 w-3" />
              Next due: {formatRelativeTime(bin.predictedNextCollectionAt)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "history" | "dispatch")}
        >
          <TabsList className="w-full bg-muted/50">
            <TabsTrigger
              value="history"
              className="flex-1"
              data-ocid="tab-history"
            >
              <History className="h-3.5 w-3.5 mr-1.5" />
              Fill History
            </TabsTrigger>
            <TabsTrigger
              value="dispatch"
              className="flex-1"
              data-ocid="tab-dispatch"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Dispatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-3">
            <FillHistoryChart binId={bin.id} />
          </TabsContent>

          <TabsContent value="dispatch" className="mt-3">
            {urgency === "safe" && (
              <div className="flex flex-col items-center gap-2 pb-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
                <p className="text-xs text-muted-foreground">
                  Bin is within normal levels ({pct}% full). You can still
                  dispatch below.
                </p>
              </div>
            )}
            <DispatchForm
              bin={bin}
              buildingName={building?.name}
              onSuccess={onClose}
              onCancel={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
