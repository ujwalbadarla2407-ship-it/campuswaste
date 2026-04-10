import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, Trash2 } from "lucide-react";
import type { BinInfo } from "../types";
import { formatRelativeTime, getBinUrgency } from "../types";

interface BinCardProps {
  bin: BinInfo;
  buildingName?: string;
  onViewDetail: (bin: BinInfo) => void;
  onDispatch?: (bin: BinInfo) => void;
  compact?: boolean;
}

export function BinCard({
  bin,
  buildingName,
  onViewDetail,
  onDispatch,
  compact = false,
}: BinCardProps) {
  const pct = Number(bin.fillPercent);
  const urgency = getBinUrgency(bin.fillPercent);

  const urgencyConfig = {
    critical: {
      bar: "bg-red-500",
      badge: "bg-red-500/15 text-red-400 border-red-500/30",
      ring: "border-red-500/40",
      dot: "bg-red-500",
      label: "Critical",
    },
    warning: {
      bar: "bg-yellow-500",
      badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      ring: "border-yellow-500/30",
      dot: "bg-yellow-500",
      label: "Warning",
    },
    safe: {
      bar: "bg-green-500",
      badge: "bg-green-500/15 text-green-400 border-green-500/30",
      ring: "border-border",
      dot: "bg-green-500",
      label: "OK",
    },
  };

  const config = urgencyConfig[urgency];

  return (
    <Card
      className={cn(
        "bg-card border transition-smooth hover:shadow-md cursor-pointer group",
        config.ring,
        urgency === "critical" && "hover:border-red-400/60",
      )}
      onClick={() => onViewDetail(bin)}
      data-ocid={`bin-card-${bin.id}`}
    >
      <CardContent className={cn("p-4 space-y-3", compact && "p-3 space-y-2")}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0 animate-pulse",
                urgency === "critical" ? "bg-red-500" : "hidden",
              )}
            />
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm text-foreground truncate">
                {bin.binLabel}
              </p>
              {buildingName && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {buildingName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0 h-5", config.badge)}
            >
              {config.label}
            </Badge>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </div>

        {/* Fill bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Fill level</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                urgency === "critical"
                  ? "text-red-400"
                  : urgency === "warning"
                    ? "text-yellow-400"
                    : "text-green-400",
              )}
            >
              {pct}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-smooth",
                config.bar,
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Footer metadata */}
        {!compact && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last: {formatRelativeTime(bin.lastCollectedAt)}</span>
            </div>
            {urgency !== "safe" && onDispatch && (
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-6 text-[11px] px-2 py-0",
                  urgency === "critical"
                    ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                    : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onDispatch(bin);
                }}
                data-ocid={`quick-dispatch-${bin.id}`}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Dispatch
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
