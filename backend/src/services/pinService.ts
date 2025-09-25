import { prisma } from "../index";

function twoDigit(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function rnd01_99() { return twoDigit(Math.max(1, Math.min(99, Math.floor(Math.random() * 99) + 1))); }

export async function ensureTodayPins(force = false) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = new Date(todayStr);
  const clinics = await prisma.clinic.findMany();

  if (force) await prisma.pinCode.deleteMany({ where: { date: today } });

  const existing = await prisma.pinCode.findMany({ where: { date: today } });
  const byClinic = new Map(existing.map((p: any) => [p.clinicId, p]));

  const out: Array<{ clinicId: number; code: string }> = [];
  for (const c of clinics) {
    if (!byClinic.has(c.id)) {
      const code = rnd01_99();
      const created = await prisma.pinCode.create({ data: { clinicId: c.id, date: today, code } });
      out.push({ clinicId: created.clinicId, code: created.code });
    } else {
      const pin = byClinic.get(c.id) as any;
      out.push({ clinicId: pin.clinicId, code: pin.code });
    }
  }
  return out;
}

export async function verifyClinicPin(clinicId: number, code: string) {
  if (!/^\d{1,2}$/.test(code)) return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = new Date(todayStr);
  const pin = await prisma.pinCode.findFirst({ where: { clinicId, date: today } });
  if (!pin) return false;
  const entered = code.length === 1 ? `0${code}` : code;
  return pin.code === entered;
}
