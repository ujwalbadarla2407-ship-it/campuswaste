import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Download, Trophy } from "lucide-react";
import type { BuildingWasteSummary } from "../types";

function FillBar({ pct }: { pct: number }) {
  const barClass =
    pct >= 85 ? "bg-destructive" : pct >= 60 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center gap-1 text-warning font-bold text-xs">
        <Trophy className="h-3.5 w-3.5" />1
      </span>
    );
  if (rank <= 3)
    return (
      <span className="flex items-center gap-1 text-primary font-semibold text-xs">
        <Award className="h-3.5 w-3.5" />
        {rank}
      </span>
    );
  return (
    <span className="text-xs text-muted-foreground tabular-nums">#{rank}</span>
  );
}

function exportCsv(summaries: BuildingWasteSummary[]) {
  const header = "Rank,Building,Avg Fill %,Total Collected (kg)";
  const rows = [...summaries]
    .sort((a, b) => Number(a.rank - b.rank))
    .map(
      (s) =>
        `${s.rank},"${s.buildingName}",${s.averageFillPercent},${s.totalCollectedKg}`,
    );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `building-waste-summary-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface BuildingSummaryTableProps {
  summaries: BuildingWasteSummary[];
  isLoading?: boolean;
  showExport?: boolean;
}

export function BuildingSummaryTable({
  summaries,
  isLoading,
  showExport = true,
}: BuildingSummaryTableProps) {
  const sorted = [...summaries].sort((a, b) => Number(a.rank - b.rank));

  return (
    <Card className="bg-card border-border" data-ocid="building-summary-table">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Building Waste Rankings
          </CardTitle>
          {showExport && summaries.length > 0 && (
            <button
              type="button"
              onClick={() => exportCsv(summaries)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth px-2 py-1 rounded hover:bg-muted/40"
              data-ocid="export-csv-btn"
              title="Export as CSV"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            data-ocid="summary-table-empty"
          >
            <Award className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No summary data yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium w-12">
                    Rank
                  </th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                    Building
                  </th>
                  <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">
                    Avg Fill
                  </th>
                  <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                    Collected (kg)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.buildingId.toString()}
                    className="border-b border-border/40 hover:bg-muted/20 transition-smooth"
                    data-ocid={`summary-row-${s.buildingId}`}
                  >
                    <td className="py-3 px-3">
                      <RankBadge rank={Number(s.rank)} />
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground max-w-[180px]">
                      <span className="truncate block">{s.buildingName}</span>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <div className="flex justify-end">
                        <FillBar pct={Number(s.averageFillPercent)} />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-foreground font-semibold">
                      {s.totalCollectedKg.toString()}
                      <span className="text-muted-foreground font-normal text-xs ml-0.5">
                        kg
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
