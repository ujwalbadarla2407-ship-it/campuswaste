import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  Building2,
  CalendarDays,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { BuildingSummaryTable } from "../../components/BuildingSummaryTable";
import {
  useBinsNeedingCollection,
  useBuildingSummaries,
  useBuildings,
  useWasteTrends,
} from "../../hooks/useBackend";

function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
  urgent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  isLoading?: boolean;
  urgent?: boolean;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <Icon
            className={`h-4 w-4 ${urgent ? "text-destructive" : "text-primary"}`}
          />
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p
            className={`font-display text-2xl font-bold truncate ${urgent && Number(value) > 0 ? "text-destructive" : "text-foreground"}`}
          >
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ManagerOverview() {
  const { data: buildings, isLoading: bldLoading } = useBuildings();
  const { data: summaries, isLoading: sumLoading } = useBuildingSummaries();
  const { data: urgentBins, isLoading: urgentLoading } =
    useBinsNeedingCollection();
  const { data: trends } = useWasteTrends();

  const totalKg = (summaries ?? []).reduce(
    (acc, s) => acc + Number(s.totalCollectedKg),
    0,
  );

  const totalTrendKg = (trends ?? []).reduce(
    (acc, t) => acc + Number(t.collectedKg),
    0,
  );

  const stats = [
    {
      label: "Buildings",
      value: buildings?.length ?? 0,
      icon: Building2,
      isLoading: bldLoading,
    },
    {
      label: "Bins Urgent",
      value: urgentBins?.length ?? 0,
      icon: Trash2,
      isLoading: urgentLoading,
      urgent: true,
    },
    {
      label: "Total Collected",
      value: `${totalKg.toLocaleString()} kg`,
      icon: TrendingUp,
      isLoading: sumLoading,
    },
    {
      label: "30-Day Volume",
      value: `${totalTrendKg.toLocaleString()} kg`,
      icon: CalendarDays,
      isLoading: false,
    },
  ];

  return (
    <div className="space-y-6" data-ocid="manager-overview">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Campus Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aggregated waste management metrics across all buildings
          </p>
        </div>
        {(urgentBins?.length ?? 0) > 0 && (
          <Badge
            className="bg-destructive/20 text-destructive border-destructive/30 flex items-center gap-1.5"
            data-ocid="urgent-alert-badge"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {urgentBins?.length} bins need immediate collection
          </Badge>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            to: "/manager/buildings" as const,
            icon: Building2,
            label: "Building Details",
            desc: "Bin fill levels per building",
          },
          {
            to: "/manager/analytics" as const,
            icon: Award,
            label: "Analytics",
            desc: "Performance rankings & charts",
          },
          {
            to: "/manager/trends" as const,
            icon: TrendingUp,
            label: "Trends",
            desc: "30-day collection volume",
          },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted/30 transition-smooth group"
            data-ocid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-smooth shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {label}
              </p>
              <p className="text-xs text-muted-foreground truncate">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Building summaries table */}
      <BuildingSummaryTable
        summaries={summaries ?? []}
        isLoading={sumLoading}
        showExport={true}
      />
    </div>
  );
}
