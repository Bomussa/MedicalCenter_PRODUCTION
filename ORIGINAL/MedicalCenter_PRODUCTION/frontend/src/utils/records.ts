import { store } from "./storage";
import { isoDateTime } from "./time";

export type Visit = {
  userId: string;
  idType: "military" | "personal";
  gender: "male" | "female";
  examId: string;
  assignedModel?: "A" | "B" | "C" | "D";
  clinicsVisited: { id: string; doneAt: string }[];
  startTime: string;
  endTime?: string;
  durationSec?: number;
};

export function saveVisit(v: Omit<Visit, "startTime"> & { startTime?: string }) {
  const arr = (store.get<Visit[]>("visits", []) || []);
  const startTime = v.startTime || isoDateTime();
  const end = v.endTime ? new Date(v.endTime) : undefined;
  const start = new Date(startTime);
  const durationSec = end ? Math.max(0, Math.round((+end - +start) / 1000)) : v.durationSec;
  const row: Visit = { ...v, startTime, durationSec };
  arr.push(row);
  store.set("visits", arr);
  return row;
}
export const readVisits = () => store.get<Visit[]>("visits", []);