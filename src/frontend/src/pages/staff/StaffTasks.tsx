import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useActiveTasks,
  useBinStatuses,
  useBuildings,
  useUpdateCollectionStatus,
} from "../../hooks/useBackend";
import { CollectionStatus } from "../../types";
import type { CollectionTaskInfo } from "../../types";

const TEAMS = [
  "Team Alpha",
  "Team Beta",
  "Team Gamma",
  "Team Delta",
  "Central Ops",
];

function getSimulatedTeam(taskId: bigint): string {
  return TEAMS[Number(taskId) % TEAMS.length];
}

function TaskCard({
  task,
  binLabel,
  buildingName,
}: {
  task: CollectionTaskInfo;
  binLabel?: string;
  buildingName?: string;
}) {
  const { mutate: updateStatus, isPending } = useUpdateCollectionStatus();
  const team = getSimulatedTeam(task.id);

  const advance = () => {
    const next =
      task.status === CollectionStatus.pending
        ? CollectionStatus.inProgress
        : CollectionStatus.completed;
    updateStatus(
      { taskId: task.id, status: next },
      {
        onSuccess: () =>
          toast.success(
            next === CollectionStatus.inProgress
              ? `Collection started by ${team}`
              : `Collection completed by ${team}`,
          ),
        onError: () => toast.error("Failed to update task status"),
      },
    );
  };

  const nextLabel =
    task.status === CollectionStatus.pending
      ? "Start Collection"
      : "Mark Complete";
  const canAdvance = task.status !== CollectionStatus.completed;

  const statusConfig = {
    [CollectionStatus.pending]: {
      icon: Clock,
      iconClass: "text-muted-foreground",
      badge: "border-muted-foreground/30 text-muted-foreground",
      label: "Pending",
      bg: "bg-muted/20",
    },
    [CollectionStatus.inProgress]: {
      icon: Loader2,
      iconClass: "text-primary animate-spin",
      badge: "border-primary/50 text-primary",
      label: "In Progress",
      bg: "bg-primary/5",
    },
    [CollectionStatus.completed]: {
      icon: CheckCircle2,
      iconClass: "text-green-400",
      badge: "border-green-500/30 text-green-400",
      label: "Completed",
      bg: "bg-green-500/5",
    },
  };

  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <Card
      className={cn("bg-card border-border transition-smooth", config.bg)}
      data-ocid={`task-card-${task.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Status icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className={cn("h-4 w-4 shrink-0", config.iconClass)} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-foreground">
                {binLabel ?? `Bin #${task.binId.toString()}`}
              </p>
              {buildingName && (
                <span className="text-[11px] text-muted-foreground">
                  — {buildingName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant="outline"
                className={cn("text-[10px] h-4 px-1.5", config.badge)}
              >
                {config.label}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                <Trash2 className="h-2.5 w-2.5 inline mr-0.5" />
                {team}
              </span>
            </div>
          </div>

          {/* Actions */}
          {canAdvance && (
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 text-xs"
              onClick={advance}
              disabled={isPending}
              data-ocid={`task-advance-${task.id}`}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                nextLabel
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StaffTasks() {
  const { data: tasks, isLoading } = useActiveTasks();
  const { data: bins } = useBinStatuses();
  const { data: buildings } = useBuildings();

  const getBinLabel = (binId: bigint) =>
    bins?.find((b) => b.id === binId)?.binLabel;
  const getBuildingName = (binId: bigint) => {
    const bin = bins?.find((b) => b.id === binId);
    if (!bin) return undefined;
    return buildings?.find((b) => b.id === bin.buildingId)?.name;
  };

  const pending = (tasks ?? []).filter(
    (t) => t.status === CollectionStatus.pending,
  );
  const inProgress = (tasks ?? []).filter(
    (t) => t.status === CollectionStatus.inProgress,
  );
  const completed = (tasks ?? []).filter(
    (t) => t.status === CollectionStatus.completed,
  );

  const columns = [
    {
      title: "Pending",
      items: pending,
      icon: Clock,
      emptyMsg: "No pending tasks",
      count: pending.length,
      headerClass: "border-muted-foreground/20",
    },
    {
      title: "In Progress",
      items: inProgress,
      icon: Loader2,
      emptyMsg: "No active collections",
      count: inProgress.length,
      headerClass: "border-primary/30",
    },
    {
      title: "Completed",
      items: completed,
      icon: CheckCircle2,
      emptyMsg: "No completed tasks",
      count: completed.length,
      headerClass: "border-green-500/20",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="staff-tasks">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Collection Tasks
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track collection assignments and update their status in real time
        </p>
      </div>

      {/* Summary badges */}
      {!isLoading && tasks && tasks.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground gap-1.5"
          >
            <Clock className="h-3 w-3" />
            {pending.length} pending
          </Badge>
          <Badge
            variant="outline"
            className="border-primary/40 text-primary gap-1.5"
          >
            <Loader2 className="h-3 w-3" />
            {inProgress.length} in progress
          </Badge>
          <Badge
            variant="outline"
            className="border-green-500/30 text-green-400 gap-1.5"
          >
            <CheckCircle2 className="h-3 w-3" />
            {completed.length} completed
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {["s1", "s2", "s3", "s4"].map((k) => (
            <Skeleton key={k} className="h-16 w-full" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="tasks-empty"
        >
          <ClipboardList className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No active tasks</p>
          <p className="text-sm text-muted-foreground mt-1">
            Dispatch collections from the Bin Status page to create tasks.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {columns.map(
            ({ title, items, icon: Icon, emptyMsg, count, headerClass }) => (
              <div key={title} className="space-y-3">
                <Card className={cn("bg-muted/20 border", headerClass)}>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="font-display text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {title}
                      <Badge
                        variant="secondary"
                        className="ml-auto text-[10px] h-5"
                      >
                        {count}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    {emptyMsg}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((task) => (
                      <TaskCard
                        key={task.id.toString()}
                        task={task}
                        binLabel={getBinLabel(task.binId)}
                        buildingName={getBuildingName(task.binId)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
