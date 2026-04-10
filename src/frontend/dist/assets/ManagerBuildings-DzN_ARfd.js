import { j as jsxRuntimeExports, C as Card, f as CardHeader, S as Skeleton, e as CardContent, z as ConfidenceLevel, g as CardTitle, h as Badge, d as useBuildings, r as reactExports, I as Input, i as Building2, K as useBinsForBuilding, x as useBuildingForecast } from "./index-ktcxTq46.js";
import { C as CalendarDays } from "./calendar-days-BFLVBNEy.js";
import { T as TriangleAlert } from "./triangle-alert-mjnkujgG.js";
import { C as CircleCheck } from "./circle-check-DtS9P5A6.js";
import { R as ResponsiveContainer, X as XAxis, Y as YAxis, T as Tooltip, a as ReferenceLine, B as Bar, C as Cell } from "./generateCategoricalChart-LJcI4FyO.js";
import { B as BarChart } from "./BarChart-Br4QWP8A.js";
import { g as getBinUrgency } from "./index-CIijjZJR.js";
import { S as Search } from "./search-CHa2a69R.js";
const DAY_LABELS = ["Today", "+1d", "+2d", "+3d", "+4d", "+5d", "+6d"];
const CONFIDENCE_CONFIG = {
  [ConfidenceLevel.high]: {
    label: "High",
    className: "bg-primary/20 text-primary border-primary/30"
  },
  [ConfidenceLevel.medium]: {
    label: "Medium",
    className: "bg-warning/20 text-warning border-warning/30"
  },
  [ConfidenceLevel.low]: {
    label: "Low",
    className: "bg-muted-foreground/20 text-muted-foreground border-border"
  }
};
function getFillColor(pct, needsCollection) {
  if (needsCollection || pct >= 85) return "oklch(0.55 0.2 25)";
  if (pct >= 60) return "oklch(0.75 0.15 85)";
  return "oklch(0.65 0.18 145)";
}
function getOverallDayConfidence(forecasts, dayOffset) {
  const dayForecasts = forecasts.flatMap(
    (bf) => bf.forecasts.filter((f) => Number(f.dayOffset) === dayOffset)
  );
  if (dayForecasts.some((f) => f.confidence === ConfidenceLevel.low))
    return ConfidenceLevel.low;
  if (dayForecasts.some((f) => f.confidence === ConfidenceLevel.medium))
    return ConfidenceLevel.medium;
  return ConfidenceLevel.high;
}
function ForecastChart({
  building,
  forecasts,
  isLoading
}) {
  var _a, _b;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }) })
    ] });
  }
  const dayData = Array.from({ length: 7 }, (_, i) => {
    const dayForecasts = forecasts.flatMap(
      (bf) => bf.forecasts.filter((f) => Number(f.dayOffset) === i)
    );
    const avgFill = dayForecasts.length > 0 ? Math.round(
      dayForecasts.reduce(
        (sum, f) => sum + Number(f.predictedFillPercent),
        0
      ) / dayForecasts.length
    ) : 0;
    const needsCollection = dayForecasts.some((f) => f.needsCollection);
    const confidence = getOverallDayConfidence(forecasts, i);
    return {
      day: DAY_LABELS[i] ?? `+${i}d`,
      avgFill,
      needsCollection,
      confidence
    };
  });
  const criticalDays = dayData.filter((d) => d.needsCollection).length;
  const overallConfidence = ((_a = dayData.find((d) => d.confidence === ConfidenceLevel.low)) == null ? void 0 : _a.confidence) ?? ((_b = dayData.find((d) => d.confidence === ConfidenceLevel.medium)) == null ? void 0 : _b.confidence) ?? ConfidenceLevel.high;
  const confCfg = CONFIDENCE_CONFIG[overallConfidence];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "bg-card border-border",
      "data-ocid": `forecast-card-${building.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: building.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              criticalDays > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-destructive/20 text-destructive border-destructive/30 text-[10px] px-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5 mr-1" }),
                criticalDays,
                " alert",
                criticalDays !== 1 ? "s" : ""
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-success/20 text-success border-success/30 text-[10px] px-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5 mr-1" }),
                "Clear"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: `text-[10px] px-2 border ${confCfg.className}`,
                  "data-ocid": `confidence-${building.id}`,
                  children: [
                    confCfg.label,
                    " confidence"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            building.zone,
            " · 7-day predicted fill levels"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 160, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BarChart,
            {
              data: dayData,
              margin: { top: 8, right: 0, left: -20, bottom: 0 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "day",
                    tick: { fill: "oklch(0.55 0.01 260)", fontSize: 10 },
                    axisLine: false,
                    tickLine: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    domain: [0, 100],
                    tick: { fill: "oklch(0.55 0.01 260)", fontSize: 10 },
                    axisLine: false,
                    tickLine: false,
                    tickFormatter: (v) => `${v}%`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    contentStyle: {
                      background: "oklch(0.18 0.014 260)",
                      border: "1px solid oklch(0.28 0.02 260)",
                      borderRadius: "6px",
                      color: "oklch(0.95 0.01 260)",
                      fontSize: "11px"
                    },
                    formatter: (value, _name, props) => {
                      var _a2;
                      return [
                        `${value}% fill${((_a2 = props.payload) == null ? void 0 : _a2.needsCollection) ? " ⚠ needs collection" : ""}`,
                        "Predicted"
                      ];
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ReferenceLine,
                  {
                    y: 85,
                    stroke: "oklch(0.55 0.2 25)",
                    strokeDasharray: "4 3",
                    strokeWidth: 1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ReferenceLine,
                  {
                    y: 60,
                    stroke: "oklch(0.75 0.15 85)",
                    strokeDasharray: "4 3",
                    strokeWidth: 1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "avgFill", radius: [3, 3, 0, 0], children: dayData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Cell,
                  {
                    fill: getFillColor(entry.avgFill, entry.needsCollection),
                    opacity: entry.needsCollection ? 1 : 0.85
                  },
                  `cell-${entry.day}`
                )) })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-2", children: dayData.map((d) => {
            const dotColor = d.confidence === ConfidenceLevel.high ? "bg-success" : d.confidence === ConfidenceLevel.medium ? "bg-warning" : "bg-muted-foreground";
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 flex flex-col items-center gap-0.5",
                title: `${d.day}: ${CONFIDENCE_CONFIG[d.confidence].label} confidence`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 w-1.5 rounded-full ${dotColor}` })
              },
              d.day
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Dots = prediction confidence per day" })
        ] })
      ]
    }
  );
}
function BinRow({
  label,
  fillPercent,
  binId
}) {
  const urgency = getBinUrgency(fillPercent);
  const pct = Number(fillPercent);
  const barClass = urgency === "critical" ? "bg-destructive" : urgency === "warning" ? "bg-warning" : "bg-success";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 rounded bg-muted/25 px-3 py-2 hover:bg-muted/40 transition-smooth",
      "data-ocid": `bin-row-${binId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-2 w-2 rounded-full shrink-0 ${urgency === "critical" ? "bg-destructive" : urgency === "warning" ? "bg-warning" : "bg-success"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground flex-1 truncate min-w-0", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-16 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all ${barClass}`,
              style: { width: `${pct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground w-9 text-right", children: [
            pct,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-[9px] px-1.5 ${urgency === "critical" ? "bin-critical" : urgency === "warning" ? "bin-warning" : "bg-success/20 text-success border-success/30"}`,
              children: urgency
            }
          )
        ] })
      ]
    }
  );
}
function BuildingCard({ building }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const { data: bins, isLoading: binsLoading } = useBinsForBuilding(
    expanded ? building.id : null
  );
  const { data: forecasts, isLoading: forecastLoading } = useBuildingForecast(
    expanded ? building.id : null
  );
  const criticalCount = (bins == null ? void 0 : bins.filter((b) => getBinUrgency(b.fillPercent) === "critical").length) ?? 0;
  const warningCount = (bins == null ? void 0 : bins.filter((b) => getBinUrgency(b.fillPercent) === "warning").length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "bg-card border-border",
      "data-ocid": `building-card-${building.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardHeader,
          {
            className: "pb-3 cursor-pointer select-none",
            onClick: () => setExpanded((v) => !v),
            "data-ocid": `building-expand-${building.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4 text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: building.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                criticalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bin-critical text-[10px] px-1.5", children: criticalCount }),
                warningCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bin-warning text-[10px] px-1.5", children: warningCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5", children: building.zone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: expanded ? "▲" : "▼" })
              ] })
            ] })
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForecastChart,
            {
              building,
              forecasts: forecasts ?? [],
              isLoading: forecastLoading
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider", children: "Current Bin Status" }),
            binsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k)) }) : !bins || bins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-2", children: "No bins in this building." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: bins.map((bin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              BinRow,
              {
                label: bin.binLabel,
                fillPercent: bin.fillPercent,
                binId: bin.id
              },
              bin.id.toString()
            )) })
          ] })
        ] })
      ]
    }
  );
}
function ManagerBuildings() {
  const { data: buildings, isLoading } = useBuildings();
  const [search, setSearch] = reactExports.useState("");
  const filtered = (buildings ?? []).filter(
    (b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.zone.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "manager-buildings", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Buildings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Expand a building to view bin statuses and 7-day forecasts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-56", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "pl-8 h-8 text-xs",
            placeholder: "Search buildings...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "building-search"
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [1, 2, 3, 4, 5, 6].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "buildings-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No buildings found" }),
          search && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Try a different search term" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(BuildingCard, { building: b }, b.id.toString())) })
  ] });
}
export {
  ManagerBuildings as default
};
