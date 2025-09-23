import { store } from "./storage";
export type Audit = { ts: string; user: string; action: string; payload?: unknown };
export function logAudit(user: string, action: string, payload?: unknown) {
  const arr = store.get<Audit[]>("secure:audit", []);
  arr.push({ ts: new Date().toISOString(), user, action, payload });
  store.set("secure:audit", arr);
}
export const readAudit = () => store.get<Audit[]>("secure:audit", []);