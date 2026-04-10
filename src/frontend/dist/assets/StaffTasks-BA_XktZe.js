import { b as useActiveTasks, u as useBinStatuses, d as useBuildings, t as CollectionStatus, o as LoaderCircle, j as jsxRuntimeExports, h as Badge, S as Skeleton, v as ClipboardList, C as Card, f as CardHeader, g as CardTitle, k as cn, w as useUpdateCollectionStatus, e as CardContent, T as Trash2, B as Button, p as ue } from "./index-ktcxTq46.js";
import { C as Clock } from "./clock-CmPipekC.js";
import { C as CircleCheck } from "./circle-check-DtS9P5A6.js";
const TEAMS = [
  "Team Alpha",
  "Team Beta",
  "Team Gamma",
  "Team Delta",
  "Central Ops"
];
function getSimulatedTeam(taskId) {
  return TEAMS[Number(taskId) % TEAMS.length];
}
function TaskCard({
  task,
  binLabel,
  buildingName
}) {
  const { mutate: updateStatus, isPending } = useUpdateCollectionStatus();
  const team = getSimulatedTeam(task.id);
  const advance = () => {
    const next = task.status === CollectionStatus.pending ? CollectionStatus.inProgress : CollectionStatus.completed;
    updateStatus(
      { taskId: task.id, status: next },
      {
        onSuccess: () => ue.success(
          next === CollectionStatus.inProgress ? `Collection started by ${team}` : `Collection completed by ${team}`
        ),
        onError: () => ue.error("Failed to update task status")
      }
    );
  };
  const nextLabel = task.status === CollectionStatus.pending ? "Start Collection" : "Mark Complete";
  const canAdvance = task.status !== CollectionStatus.completed;
  const statusConfig = {
    [CollectionStatus.pending]: {
      icon: Clock,
      iconClass: "text-muted-foreground",
      badge: "border-muted-foreground/30 text-muted-foreground",
      label: "Pending",
      bg: "bg-muted/20"
    },
    [CollectionStatus.inProgress]: {
      icon: LoaderCircle,
      iconClass: "text-primary animate-spin",
      badge: "border-primary/50 text-primary",
      label: "In Progress",
      bg: "bg-primary/5"
    },
    [CollectionStatus.completed]: {
      icon: CircleCheck,
      iconClass: "text-green-400",
      badge: "border-green-500/30 text-green-400",
      label: "Completed",
      bg: "bg-green-500/5"
    }
  };
  const config = statusConfig[task.status];
  const Icon = config.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: cn("bg-card border-border transition-smooth", config.bg),
      "data-ocid": `task-card-${task.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4 shrink-0", config.iconClass) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: binLabel ?? `Bin #${task.binId.toString()}` }),
            buildingName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
              "— ",
              buildingName
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: cn("text-[10px] h-4 px-1.5", config.badge),
                children: config.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-2.5 w-2.5 inline mr-0.5" }),
              team
            ] })
          ] })
        ] }),
        canAdvance && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "shrink-0 text-xs",
            onClick: advance,
            disabled: isPending,
            "data-ocid": `task-advance-${task.id}`,
            children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : nextLabel
          }
        )
      ] }) })
    }
  );
}
function StaffTasks() {
  const { data: tasks, isLoading } = useActiveTasks();
  const { data: bins } = useBinStatuses();
  const { data: buildings } = useBuildings();
  const getBinLabel = (binId) => {
    var _a;
    return (_a = bins == null ? void 0 : bins.find((b) => b.id === binId)) == null ? void 0 : _a.binLabel;
  };
  const getBuildingName = (binId) => {
    var _a;
    const bin = bins == null ? void 0 : bins.find((b) => b.id === binId);
    if (!bin) return void 0;
    return (_a = buildings == null ? void 0 : buildings.find((b) => b.id === bin.buildingId)) == null ? void 0 : _a.name;
  };
  const pending = (tasks ?? []).filter(
    (t) => t.status === CollectionStatus.pending
  );
  const inProgress = (tasks ?? []).filter(
    (t) => t.status === CollectionStatus.inProgress
  );
  const completed = (tasks ?? []).filter(
    (t) => t.status === CollectionStatus.completed
  );
  const columns = [
    {
      title: "Pending",
      items: pending,
      icon: Clock,
      emptyMsg: "No pending tasks",
      count: pending.length,
      headerClass: "border-muted-foreground/20"
    },
    {
      title: "In Progress",
      items: inProgress,
      icon: LoaderCircle,
      emptyMsg: "No active collections",
      count: inProgress.length,
      headerClass: "border-primary/30"
    },
    {
      title: "Completed",
      items: completed,
      icon: CircleCheck,
      emptyMsg: "No completed tasks",
      count: completed.length,
      headerClass: "border-green-500/20"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "staff-tasks", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Collection Tasks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Track collection assignments and update their status in real time" })
    ] }),
    !isLoading && tasks && tasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "border-muted-foreground/30 text-muted-foreground gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            pending.length,
            " pending"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "border-primary/40 text-primary gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3" }),
            inProgress.length,
            " in progress"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "border-green-500/30 text-green-400 gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            completed.length,
            " completed"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["s1", "s2", "s3", "s4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, k)) }) : !tasks || tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "tasks-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No active tasks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Dispatch collections from the Bin Status page to create tasks." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 lg:grid-cols-3", children: columns.map(
      ({ title, items, icon: Icon, emptyMsg, count, headerClass }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: cn("bg-muted/20 border", headerClass), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }),
          title,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "ml-auto text-[10px] h-5",
              children: count
            }
          )
        ] }) }) }),
        items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4", children: emptyMsg }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TaskCard,
          {
            task,
            binLabel: getBinLabel(task.binId),
            buildingName: getBuildingName(task.binId)
          },
          task.id.toString()
        )) })
      ] }, title)
    ) })
  ] });
}
export {
  StaffTasks as default
};
