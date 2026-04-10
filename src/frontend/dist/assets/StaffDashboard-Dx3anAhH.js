import { c as createLucideIcon, u as useBinStatuses, a as useBinsNeedingCollection, b as useActiveTasks, d as useBuildings, r as reactExports, T as Trash2, j as jsxRuntimeExports, B as Button, C as Card, e as CardContent, S as Skeleton, f as CardHeader, g as CardTitle, h as Badge, L as Link, A as ArrowRight } from "./index-ktcxTq46.js";
import { B as BinCard, a as BinDetailModal } from "./BinDetailModal-DFJFiV0m.js";
import { g as getBinUrgency } from "./index-CIijjZJR.js";
import { T as TriangleAlert } from "./triangle-alert-mjnkujgG.js";
import { C as Clock } from "./clock-CmPipekC.js";
import { C as CircleCheck } from "./circle-check-DtS9P5A6.js";
import "./select-XTBoAmYJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function StaffDashboard() {
  const { data: bins, isLoading: binsLoading, refetch } = useBinStatuses();
  const { data: urgentBins } = useBinsNeedingCollection();
  const { data: tasks } = useActiveTasks();
  const { data: buildings } = useBuildings();
  const [selectedBin, setSelectedBin] = reactExports.useState(null);
  const critical = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "critical"
  );
  const warning = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "warning"
  );
  const safe = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "safe"
  );
  const activeTasks = (tasks ?? []).filter(
    (t) => t.status !== "completed"
  );
  const getBuildingName = (buildingId) => {
    var _a;
    return (_a = buildings == null ? void 0 : buildings.find((b) => b.id === buildingId)) == null ? void 0 : _a.name;
  };
  const stats = [
    {
      label: "Critical",
      value: critical.length,
      icon: TriangleAlert,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      label: "Warning",
      value: warning.length,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
    {
      label: "Healthy",
      value: safe.length,
      icon: CircleCheck,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      label: "Active Tasks",
      value: activeTasks.length,
      icon: Trash2,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "staff-dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Operations Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Live bin status across campus — auto-refreshes every 30s" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => refetch(),
          className: "gap-2",
          "data-ocid": "refresh-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((s) => {
      const Icon = s.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: `bg-card border ${s.border} transition-smooth`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 pb-4 px-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: s.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-7 w-7 items-center justify-center rounded-md ${s.bg}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-3.5 w-3.5 ${s.color}` })
                }
              )
            ] }),
            binsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-12" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display text-3xl font-bold ${s.color}`, children: s.value })
          ] })
        },
        s.label
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-400" }),
            "Needs Collection",
            urgentBins && urgentBins.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500 text-white ml-1 text-[10px]", children: urgentBins.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 text-xs gap-1",
              asChild: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/staff/bins", "data-ocid": "view-all-bins-link", children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: binsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, k)) }) : !urgentBins || urgentBins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-green-400 py-3",
            "data-ocid": "no-urgent-bins",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "All bins are within normal levels." })
            ]
          }
        ) : urgentBins.slice(0, 5).map((bin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BinCard,
          {
            bin,
            buildingName: getBuildingName(bin.buildingId),
            onViewDetail: setSelectedBin,
            onDispatch: setSelectedBin,
            compact: true
          },
          bin.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-primary" }),
            "Active Tasks",
            activeTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-[10px]", children: activeTasks.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 text-xs gap-1",
              asChild: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/staff/tasks", "data-ocid": "view-all-tasks-link", children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !tasks ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["t1", "t2"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, k)) }) : activeTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-2 py-6 text-center",
            "data-ocid": "no-active-tasks",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No active collection tasks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Dispatch from urgent bins above" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: activeTasks.slice(0, 5).map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-md bg-muted/30 px-3 py-2.5",
            "data-ocid": `dashboard-task-${task.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-2 w-2 rounded-full shrink-0 ${task.status === "inProgress" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground truncate", children: [
                  "Task #",
                  task.id.toString(),
                  " — Bin #",
                  task.binId.toString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: task.status === "inProgress" ? "border-primary/50 text-primary text-[10px]" : "border-muted-foreground/30 text-muted-foreground text-[10px]",
                  children: task.status === "inProgress" ? "In Progress" : "Pending"
                }
              )
            ]
          },
          task.id.toString()
        )) }) })
      ] })
    ] }),
    critical.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-red-500 animate-pulse" }),
        "Critical Bins — Immediate Action Required",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500/15 text-red-400 border-red-500/30 border text-[10px]", children: critical.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: critical.map((bin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        BinCard,
        {
          bin,
          buildingName: getBuildingName(bin.buildingId),
          onViewDetail: setSelectedBin,
          onDispatch: setSelectedBin
        },
        bin.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BinDetailModal,
      {
        bin: selectedBin,
        buildings,
        open: !!selectedBin,
        onClose: () => setSelectedBin(null)
      }
    )
  ] });
}
export {
  StaffDashboard as default
};
