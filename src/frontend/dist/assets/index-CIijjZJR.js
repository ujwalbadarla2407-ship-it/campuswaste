import "./index-ktcxTq46.js";
function getBinUrgency(fillPercent) {
  const pct = Number(fillPercent);
  if (pct >= 85) return "critical";
  if (pct >= 60) return "warning";
  return "safe";
}
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatRelativeTime(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / (1e3 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
export {
  formatTimestamp as a,
  formatRelativeTime as f,
  getBinUrgency as g
};
