// Re-export backend types for use throughout the app
export type {
  Timestamp,
  BinId,
  BuildingId,
  Building,
  BinInfo,
  CollectionRecord,
  CollectionTaskInfo,
  DailyForecast,
  BinForecast,
  BuildingWasteSummary,
  WasteTrendEntry,
  UserProfile,
} from "../backend.d.ts";

export { CollectionStatus, ConfidenceLevel, UserRole } from "../backend";

// UI-only types
export type BinUrgency = "safe" | "warning" | "critical";

export function getBinUrgency(fillPercent: bigint): BinUrgency {
  const pct = Number(fillPercent);
  if (pct >= 85) return "critical";
  if (pct >= 60) return "warning";
  return "safe";
}

export function getBinUrgencyClass(fillPercent: bigint): string {
  const urgency = getBinUrgency(fillPercent);
  if (urgency === "critical") return "bin-critical";
  if (urgency === "warning") return "bin-warning";
  return "bin-safe";
}

export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
