import { ENV } from "./env";
export type Model = "A" | "B" | "C" | "D";
let rrIndex = 0;
export function pickModel(loads: Record<Model, number>): Model {
  const policy = ENV.MODELS_POLICY;
  const models: Model[] = ["A", "B", "C", "D"];
  if (policy === "ROUND_ROBIN") {
    const m = models[rrIndex % models.length];
    rrIndex++;
    return m;
  }
  // HYBRID: pick lowest load then tie-breaker by round robin
  const min = Math.min(...models.map(m => loads[m] || 0));
  const candidates = models.filter(m => (loads[m] || 0) === min);
  const choice = candidates[rrIndex % candidates.length];
  rrIndex++;
  return choice;
}