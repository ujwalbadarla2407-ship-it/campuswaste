import { d as useBuildings, H as useBuildingSummaries, a as useBinsNeedingCollection, J as useWasteTrends, i as Building2, T as Trash2, y as TrendingUp, j as jsxRuntimeExports, h as Badge, L as Link, C as Card, e as CardContent, S as Skeleton } from "./index-ktcxTq46.js";
import { A as Award, B as BuildingSummaryTable } from "./BuildingSummaryTable-d4DcCW8V.js";
import { C as CalendarDays } from "./calendar-days-BFLVBNEy.js";
import { T as TriangleAlert } from "./triangle-alert-mjnkujgG.js";
function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
  urgent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 pb-4 px-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon,
        {
          className: `h-4 w-4 ${urgent ? "text-destructive" : "text-primary"}`
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: `font-display text-2xl font-bold truncate ${urgent && Number(value) > 0 ? "text-destructive" : "text-foreground"}`,
        children: value
      }
    )
  ] }) });
}
function ManagerOverview() {
  const { data: buildings, isLoading: bldLoading } = useBuildings();
  const { data: summaries, isLoading: sumLoading } = useBuildingSummaries();
  const { data: urgentBins, isLoading: urgentLoading } = useBinsNeedingCollection();
  const { data: trends } = useWasteTrends();
  const totalKg = (summaries ?? []).reduce(
    (acc, s) => acc + Number(s.totalCollectedKg),
    0
  );
  const totalTrendKg = (trends ?? []).reduce(
    (acc, t) => acc + Number(t.collectedKg),
    0
  );
  const stats = [
    {
      label: "Buildings",
      value: (buildings == null ? void 0 : buildings.length) ?? 0,
      icon: Building2,
      isLoading: bldLoading
    },
    {
      label: "Bins Urgent",
      value: (urgentBins == null ? void 0 : urgentBins.length) ?? 0,
      icon: Trash2,
      isLoading: urgentLoading,
      urgent: true
    },
    {
      label: "Total Collected",
      value: `${totalKg.toLocaleString()} kg`,
      icon: TrendingUp,
      isLoading: sumLoading
    },
    {
      label: "30-Day Volume",
      value: `${totalTrendKg.toLocaleString()} kg`,
      icon: CalendarDays,
      isLoading: false
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "manager-overview", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Campus Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Aggregated waste management metrics across all buildings" })
      ] }),
      ((urgentBins == null ? void 0 : urgentBins.length) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          className: "bg-destructive/20 text-destructive border-destructive/30 flex items-center gap-1.5",
          "data-ocid": "urgent-alert-badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
            urgentBins == null ? void 0 : urgentBins.length,
            " bins need immediate collection"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...s }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      {
        to: "/manager/buildings",
        icon: Building2,
        label: "Building Details",
        desc: "Bin fill levels per building"
      },
      {
        to: "/manager/analytics",
        icon: Award,
        label: "Analytics",
        desc: "Performance rankings & charts"
      },
      {
        to: "/manager/trends",
        icon: TrendingUp,
        label: "Trends",
        desc: "30-day collection volume"
      }
    ].map(({ to, icon: Icon, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: "flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted/30 transition-smooth group",
        "data-ocid": `nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-smooth shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: desc })
          ] })
        ]
      },
      to
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BuildingSummaryTable,
      {
        summaries: summaries ?? [],
        isLoading: sumLoading,
        showExport: true
      }
    )
  ] });
}
export {
  ManagerOverview as default
};
