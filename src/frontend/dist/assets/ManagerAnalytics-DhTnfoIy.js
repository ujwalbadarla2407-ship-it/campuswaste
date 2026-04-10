import { H as useBuildingSummaries, j as jsxRuntimeExports, h as Badge, y as TrendingUp, C as Card, f as CardHeader, g as CardTitle, M as ChartColumn, e as CardContent, S as Skeleton } from "./index-ktcxTq46.js";
import { B as BuildingSummaryTable } from "./BuildingSummaryTable-d4DcCW8V.js";
import { R as ResponsiveContainer, X as XAxis, Y as YAxis, T as Tooltip, B as Bar, C as Cell } from "./generateCategoricalChart-LJcI4FyO.js";
import { B as BarChart } from "./BarChart-Br4QWP8A.js";
const CHART_COLORS = [
  "oklch(0.75 0.15 190)",
  "oklch(0.65 0.18 145)",
  "oklch(0.75 0.15 85)",
  "oklch(0.55 0.2 25)",
  "oklch(0.7 0.17 162)",
  "oklch(0.6 0.18 270)",
  "oklch(0.72 0.14 220)",
  "oklch(0.68 0.16 50)",
  "oklch(0.62 0.18 300)",
  "oklch(0.78 0.12 170)"
];
const TOOLTIP_STYLE = {
  background: "oklch(0.18 0.014 260)",
  border: "1px solid oklch(0.28 0.02 260)",
  borderRadius: "6px",
  color: "oklch(0.95 0.01 260)",
  fontSize: "11px"
};
const AXIS_TICK = { fill: "oklch(0.55 0.01 260)", fontSize: 11 };
function ManagerAnalytics() {
  const { data: summaries, isLoading } = useBuildingSummaries();
  const chartData = [...summaries ?? []].sort((a, b) => Number(b.totalCollectedKg - a.totalCollectedKg)).slice(0, 10).map((s) => ({
    name: s.buildingName.length > 13 ? `${s.buildingName.slice(0, 11)}…` : s.buildingName,
    kg: Number(s.totalCollectedKg),
    fill: Number(s.averageFillPercent),
    id: s.buildingId.toString()
  }));
  const highFillBuildings = (summaries ?? []).filter(
    (s) => Number(s.averageFillPercent) >= 75
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "manager-analytics", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Building-level waste performance and collection rankings" })
      ] }),
      highFillBuildings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          className: "bg-warning/20 text-warning border-warning/30 flex items-center gap-1.5",
          "data-ocid": "high-fill-alert",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
            highFillBuildings,
            " buildings with high avg fill"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", "data-ocid": "kg-chart", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
          "Total Collected (kg) per Building"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: chartData,
            margin: { top: 4, right: 4, left: -10, bottom: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "name",
                  tick: AXIS_TICK,
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tick: AXIS_TICK,
                  axisLine: false,
                  tickLine: false,
                  tickFormatter: (v) => `${v}kg`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: TOOLTIP_STYLE,
                  cursor: { fill: "oklch(0.22 0.02 260)" },
                  formatter: (v) => [`${v} kg`, "Collected"]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "kg", radius: [4, 4, 0, 0], children: chartData.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cell,
                {
                  fill: CHART_COLORS[i % CHART_COLORS.length]
                },
                entry.id
              )) })
            ]
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", "data-ocid": "fill-chart", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
          "Average Fill Level (%) per Building"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: chartData,
            margin: { top: 4, right: 4, left: -10, bottom: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "name",
                  tick: AXIS_TICK,
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  domain: [0, 100],
                  tick: AXIS_TICK,
                  axisLine: false,
                  tickLine: false,
                  tickFormatter: (v) => `${v}%`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: TOOLTIP_STYLE,
                  cursor: { fill: "oklch(0.22 0.02 260)" },
                  formatter: (v) => [`${v}%`, "Avg Fill"]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "fill",
                  radius: [4, 4, 0, 0],
                  fill: "oklch(0.75 0.15 190)"
                }
              )
            ]
          }
        ) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BuildingSummaryTable,
      {
        summaries: summaries ?? [],
        isLoading,
        showExport: true
      }
    )
  ] });
}
export {
  ManagerAnalytics as default
};
