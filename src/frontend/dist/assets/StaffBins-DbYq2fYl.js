import { u as useBinStatuses, d as useBuildings, r as reactExports, j as jsxRuntimeExports, h as Badge, I as Input, B as Button, i as Building2, S as Skeleton, T as Trash2 } from "./index-ktcxTq46.js";
import { B as BinCard, a as BinDetailModal } from "./BinDetailModal-DFJFiV0m.js";
import { g as getBinUrgency } from "./index-CIijjZJR.js";
import { S as Search } from "./search-CHa2a69R.js";
import "./clock-CmPipekC.js";
import "./select-XTBoAmYJ.js";
import "./circle-check-DtS9P5A6.js";
import "./triangle-alert-mjnkujgG.js";
const FILTERS = [
  { value: "all", label: "All Bins", color: "" },
  {
    value: "critical",
    label: "Critical",
    color: "border-red-500/40 text-red-400 data-[active=true]:bg-red-500 data-[active=true]:text-white data-[active=true]:border-red-500"
  },
  {
    value: "warning",
    label: "Warning",
    color: "border-yellow-500/40 text-yellow-400 data-[active=true]:bg-yellow-500 data-[active=true]:text-gray-900 data-[active=true]:border-yellow-500"
  },
  {
    value: "safe",
    label: "Healthy",
    color: "border-green-500/40 text-green-400 data-[active=true]:bg-green-500 data-[active=true]:text-gray-900 data-[active=true]:border-green-500"
  }
];
function StaffBins() {
  const { data: bins, isLoading } = useBinStatuses();
  const { data: buildings } = useBuildings();
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [selectedBuilding, setSelectedBuilding] = reactExports.useState("all");
  const [selectedBin, setSelectedBin] = reactExports.useState(null);
  const filtered = (bins ?? []).filter((b) => {
    const matchSearch = b.binLabel.toLowerCase().includes(search.toLowerCase());
    const urgency = getBinUrgency(b.fillPercent);
    const matchFilter = filter === "all" || urgency === filter;
    const matchBuilding = selectedBuilding === "all" || b.buildingId.toString() === selectedBuilding;
    return matchSearch && matchFilter && matchBuilding;
  });
  const getBuildingName = (buildingId) => {
    var _a;
    return (_a = buildings == null ? void 0 : buildings.find((b) => b.id === buildingId)) == null ? void 0 : _a.name;
  };
  const criticalCount = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "critical"
  ).length;
  const warningCount = (bins ?? []).filter(
    (b) => getBinUrgency(b.fillPercent) === "warning"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "staff-bins", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Bin Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Monitor and dispatch collections for all",
          " ",
          bins ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: bins.length }) : "—",
          " ",
          "campus bins"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
        criticalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/15 text-red-400 border border-red-500/30 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" }),
          criticalCount,
          " critical"
        ] }),
        warningCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30", children: [
          warningCount,
          " warning"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "pl-9",
            placeholder: "Search bins by name…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "bins-search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          "data-active": filter === f.value,
          className: filter === f.value ? "bg-primary text-primary-foreground border-primary" : f.color || "",
          onClick: () => setFilter(f.value),
          "data-ocid": `filter-${f.value}`,
          children: f.label
        },
        f.value
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: selectedBuilding === "all" ? "secondary" : "ghost",
            size: "sm",
            className: "gap-1.5 text-xs",
            onClick: () => setSelectedBuilding("all"),
            "data-ocid": "building-filter-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
              "All Buildings"
            ]
          }
        ),
        (buildings ?? []).slice(0, 4).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: selectedBuilding === b.id.toString() ? "secondary" : "ghost",
            size: "sm",
            className: "text-xs",
            onClick: () => setSelectedBuilding(
              selectedBuilding === b.id.toString() ? "all" : b.id.toString()
            ),
            "data-ocid": `building-filter-${b.id}`,
            children: b.name
          },
          b.id.toString()
        ))
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full" }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "bins-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No bins match your filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Try adjusting the search or urgency filter." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "mt-4",
              onClick: () => {
                setSearch("");
                setFilter("all");
                setSelectedBuilding("all");
              },
              children: "Clear filters"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Showing ",
        filtered.length,
        " bin",
        filtered.length !== 1 ? "s" : "",
        filter !== "all" && ` — ${filter} only`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((bin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
  StaffBins as default
};
