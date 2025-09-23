import { store } from "./storage";
import { isoDateTime, todayQatarISO } from "./time";

export type DailyCodes = { date: string; byClinic: Record<string, string>; specialCode: string; generatedAt: string };

export function ensureTodayCodes(clinicIds: string[]): DailyCodes {
  const today = todayQatarISO();
  let codes = store.get<DailyCodes | null>("secure:dailyCodes", null);
  if (!codes || codes.date !== today) {
    const byClinic: Record<string, string> = {};
    clinicIds.forEach(id => (byClinic[id] = String(Math.floor(1000 + Math.random() * 9000))));
    codes = { date: today, byClinic, specialCode: "1", generatedAt: isoDateTime() };
    store.set("secure:dailyCodes", codes);
  }
  return codes;
}
export const readTodayCodes = () => store.get<DailyCodes>("secure:dailyCodes", ensureTodayCodes([]) as any);