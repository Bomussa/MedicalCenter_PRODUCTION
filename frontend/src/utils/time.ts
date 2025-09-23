export function fmtQatar(ts?: string | number | Date) {
  const d = ts ? new Date(ts) : new Date();
  return d.toLocaleString("ar-QA", { hour12: false });
}
export function todayQatarISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function isoDateTime(d: Date = new Date()) {
  return d.toISOString().slice(0, 19).replace("T", " ");
}