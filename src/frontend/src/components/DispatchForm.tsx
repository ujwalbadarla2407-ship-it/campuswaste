import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatchCollection } from "../hooks/useBackend";
import type { BinInfo } from "../types";
import { getBinUrgency } from "../types";

const COLLECTION_TEAMS = [
  { id: "team-alpha", label: "Team Alpha", zone: "North Campus" },
  { id: "team-beta", label: "Team Beta", zone: "South Campus" },
  { id: "team-gamma", label: "Team Gamma", zone: "East Campus" },
  { id: "team-delta", label: "Team Delta", zone: "West Campus" },
  { id: "team-central", label: "Central Ops", zone: "All Zones" },
];

interface DispatchFormProps {
  bin: BinInfo;
  buildingName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DispatchForm({
  bin,
  buildingName,
  onSuccess,
  onCancel,
}: DispatchFormProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [dispatched, setDispatched] = useState(false);
  const { mutate: dispatch, isPending } = useDispatchCollection();

  const pct = Number(bin.fillPercent);
  const urgency = getBinUrgency(bin.fillPercent);

  const handleSubmit = () => {
    if (!selectedTeam) return;
    dispatch(bin.id, {
      onSuccess: () => {
        setDispatched(true);
        toast.success(
          `Collection dispatched to ${selectedTeam.replace("team-", "Team ").replace("-", " ")} for ${bin.binLabel}`,
        );
        setTimeout(() => {
          onSuccess?.();
        }, 1200);
      },
      onError: () => toast.error("Failed to dispatch collection. Try again."),
    });
  };

  if (dispatched) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-6 text-center"
        data-ocid="dispatch-success"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <p className="font-display font-semibold text-foreground">
            Collection Dispatched
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Team is now assigned to collect {bin.binLabel}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="dispatch-form">
      {/* Bin status summary */}
      <div
        className={cn(
          "rounded-lg border p-3 space-y-2",
          urgency === "critical"
            ? "border-red-500/30 bg-red-500/5"
            : "border-yellow-500/30 bg-yellow-500/5",
        )}
      >
        <div className="flex items-center gap-2">
          {urgency === "critical" ? (
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {bin.binLabel}
            </p>
            {buildingName && (
              <p className="text-xs text-muted-foreground">{buildingName}</p>
            )}
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-xs",
              urgency === "critical"
                ? "border-red-500/40 text-red-400"
                : "border-yellow-500/40 text-yellow-400",
            )}
          >
            {pct}% full
          </Badge>
        </div>
        {/* Fill bar */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-smooth",
              urgency === "critical" ? "bg-red-500" : "bg-yellow-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Team selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Assign collection team
        </Label>
        <Select
          value={selectedTeam}
          onValueChange={setSelectedTeam}
          data-ocid="team-select"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a team…" />
          </SelectTrigger>
          <SelectContent>
            {COLLECTION_TEAMS.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                <span className="font-medium">{team.label}</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  — {team.zone}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isPending}
            data-ocid="dispatch-cancel"
          >
            Cancel
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={!selectedTeam || isPending}
          data-ocid="dispatch-submit"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Dispatching…
            </>
          ) : (
            "Dispatch Collection"
          )}
        </Button>
      </div>
    </div>
  );
}
