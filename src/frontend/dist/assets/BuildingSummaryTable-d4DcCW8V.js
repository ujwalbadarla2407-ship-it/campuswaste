import { c as createLucideIcon, j as jsxRuntimeExports, C as Card, f as CardHeader, g as CardTitle, e as CardContent, S as Skeleton } from "./index-ktcxTq46.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
function FillBar({ pct }) {
  const barClass = pct >= 85 ? "bg-destructive" : pct >= 60 ? "bg-warning" : "bg-success";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-20 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full transition-all ${barClass}`,
        style: { width: `${Math.min(pct, 100)}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground w-8 text-right", children: [
      pct,
      "%"
    ] })
  ] });
}
function RankBadge({ rank }) {
  if (rank === 1)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-warning font-bold text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5" }),
      "1"
    ] });
  if (rank <= 3)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-primary font-semibold text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3.5 w-3.5" }),
      rank
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
    "#",
    rank
  ] });
}
function exportCsv(summaries) {
  const header = "Rank,Building,Avg Fill %,Total Collected (kg)";
  const rows = [...summaries].sort((a2, b) => Number(a2.rank - b.rank)).map(
    (s) => `${s.rank},"${s.buildingName}",${s.averageFillPercent},${s.totalCollectedKg}`
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `building-waste-summary-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function BuildingSummaryTable({
  summaries,
  isLoading,
  showExport = true
}) {
  const sorted = [...summaries].sort((a, b) => Number(a.rank - b.rank));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", "data-ocid": "building-summary-table", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4 text-primary" }),
        "Building Waste Rankings"
      ] }),
      showExport && summaries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => exportCsv(summaries),
          className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth px-2 py-1 rounded hover:bg-muted/40",
          "data-ocid": "export-csv-btn",
          title: "Export as CSV",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
            "Export CSV"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, k)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-10 text-center",
        "data-ocid": "summary-table-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-8 w-8 text-muted-foreground mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No summary data yet" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-xs text-muted-foreground font-medium w-12", children: "Rank" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-xs text-muted-foreground font-medium", children: "Building" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 px-3 text-xs text-muted-foreground font-medium hidden sm:table-cell", children: "Avg Fill" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 px-3 text-xs text-muted-foreground font-medium", children: "Collected (kg)" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 hover:bg-muted/20 transition-smooth",
          "data-ocid": `summary-row-${s.buildingId}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankBadge, { rank: Number(s.rank) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-medium text-foreground max-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: s.buildingName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FillBar, { pct: Number(s.averageFillPercent) }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3 text-right tabular-nums text-foreground font-semibold", children: [
              s.totalCollectedKg.toString(),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs ml-0.5", children: "kg" })
            ] })
          ]
        },
        s.buildingId.toString()
      )) })
    ] }) }) })
  ] });
}
export {
  Award as A,
  BuildingSummaryTable as B
};
