import { d as useBuildings, r as reactExports, x as useBuildingForecast, j as jsxRuntimeExports, h as Badge, Z as Zap, y as TrendingUp, S as Skeleton, s as Separator, C as Card, f as CardHeader, g as CardTitle, k as cn, e as CardContent, z as ConfidenceLevel } from "./index-ktcxTq46.js";
import { S as Select, m as SelectTrigger, n as SelectValue, o as SelectContent, p as SelectItem } from "./select-XTBoAmYJ.js";
import { T as TriangleAlert } from "./triangle-alert-mjnkujgG.js";
import { C as CircleCheck } from "./circle-check-DtS9P5A6.js";
const DAY_LABELS = [
  "Today",
  "Tomorrow",
  "Day 3",
  "Day 4",
  "Day 5",
  "Day 6",
  "Day 7"
];
const CONFIDENCE_CONFIG = {
  [ConfidenceLevel.high]: {
    label: "High",
    class: "border-green-500/30 text-green-400"
  },
  [ConfidenceLevel.medium]: {
    label: "Med",
    class: "border-yellow-500/30 text-yellow-400"
  },
  [ConfidenceLevel.low]: {
    label: "Low",
    class: "border-muted-foreground/30 text-muted-foreground"
  }
};
function ForecastDayCell({ forecast }) {
  const pct = Number(forecast.predictedFillPercent);
  const dayLabel = DAY_LABELS[Number(forecast.dayOffset)] ?? `Day ${forecast.dayOffset}`;
  const conf = CONFIDENCE_CONFIG[forecast.confidence];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col gap-1.5 rounded-md border p-2.5",
        forecast.needsCollection ? "bg-red-500/5 border-red-500/20" : "bg-muted/20 border-border"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-foreground", children: dayLabel }),
          forecast.needsCollection ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 text-red-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-muted-foreground/40" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-full",
              pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-yellow-500" : "bg-green-500"
            ),
            style: { width: `${pct}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "text-[11px] font-semibold tabular-nums",
                pct >= 80 ? "text-red-400" : pct >= 50 ? "text-yellow-400" : "text-green-400"
              ),
              children: [
                pct,
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: cn("text-[9px] px-1 py-0 h-4", conf.class),
              children: conf.label
            }
          )
        ] })
      ]
    }
  );
}
function BinForecastCard({ bf }) {
  const needsCollectionDays = bf.forecasts.filter((f) => f.needsCollection);
  const maxPct = Math.max(
    ...bf.forecasts.map((f) => Number(f.predictedFillPercent))
  );
  const firstCollectionDay = needsCollectionDays.length > 0 ? DAY_LABELS[Number(needsCollectionDays[0].dayOffset)] ?? `Day ${needsCollectionDays[0].dayOffset}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
          "Bin #",
          bf.binId.toString()
        ] }),
        needsCollectionDays.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5 mr-1" }),
          "Due ",
          firstCollectionDay
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "ml-auto border-green-500/30 text-green-400 text-[10px] shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5 mr-1" }),
              "On track"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 flex-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-full transition-smooth",
              maxPct >= 80 ? "bg-red-500" : maxPct >= 50 ? "bg-yellow-500" : "bg-green-500"
            ),
            style: { width: `${maxPct}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground shrink-0", children: [
          "Peak: ",
          maxPct,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: bf.forecasts.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(ForecastDayCell, { forecast: f }, f.dayOffset.toString())) }) })
  ] });
}
function StaffForecasts() {
  var _a;
  const { data: buildings, isLoading: buildingsLoading } = useBuildings();
  const [selectedBuilding, setSelectedBuilding] = reactExports.useState("");
  const buildingId = selectedBuilding ? BigInt(selectedBuilding) : null;
  const { data: forecasts, isLoading: forecastsLoading } = useBuildingForecast(buildingId);
  const criticalForecasts = (forecasts == null ? void 0 : forecasts.filter((bf) => bf.forecasts.some((f) => f.needsCollection))) ?? [];
  const okForecasts = (forecasts == null ? void 0 : forecasts.filter((bf) => !bf.forecasts.some((f) => f.needsCollection))) ?? [];
  const selectedBuildingName = (_a = buildings == null ? void 0 : buildings.find(
    (b) => b.id.toString() === selectedBuilding
  )) == null ? void 0 : _a.name;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "staff-forecasts", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Collection Forecasts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "7-day predictive fill levels to plan collections ahead of time" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedBuilding, onValueChange: setSelectedBuilding, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-72", "data-ocid": "forecast-building-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a building to view forecasts…" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: buildingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "loading", disabled: true, children: "Loading buildings…" }) : (buildings ?? []).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: b.id.toString(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-2 text-xs", children: [
            "— ",
            b.zone
          ] })
        ] }, b.id.toString())) })
      ] }),
      selectedBuilding && forecasts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        criticalForecasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/15 text-red-400 border border-red-500/30 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          criticalForecasts.length,
          " bins need collection"
        ] }),
        okForecasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "border-green-500/30 text-green-400 gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              okForecasts.length,
              " on track"
            ]
          }
        )
      ] })
    ] }),
    !selectedBuilding ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "forecasts-placeholder",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg", children: "Select a building to view forecasts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-xs", children: "7-day bin fill predictions with confidence levels help you plan collections before bins overflow." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground max-w-sm", children: ["Today", "Tomorrow", "Day 3–7"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-md bg-muted/30 border border-border p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 mx-auto mb-1 text-primary" }),
                d
              ]
            },
            d
          )) })
        ]
      }
    ) : forecastsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: ["s1", "s2", "s3", "s4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 w-full" }, k)) }) : !forecasts || forecasts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
      "No forecast data available for ",
      selectedBuildingName,
      "."
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      criticalForecasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-400" }),
          "Bins Requiring Collection Soon"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: criticalForecasts.map((bf) => /* @__PURE__ */ jsxRuntimeExports.jsx(BinForecastCard, { bf }, bf.binId.toString())) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" })
      ] }),
      okForecasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-400" }),
          "On Track — No Collection Needed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: okForecasts.map((bf) => /* @__PURE__ */ jsxRuntimeExports.jsx(BinForecastCard, { bf }, bf.binId.toString())) })
      ] })
    ] })
  ] });
}
export {
  StaffForecasts as default
};
