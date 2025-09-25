import { Request, Response } from "express";
import { prisma } from "../index";
import { ensureTodayPins, verifyClinicPin } from "../services/pinService";
import { buildCsv } from "../services/reportService";
import { buildStats } from "../services/statService";

export async function getFeatureFlags(_req: Request, res: Response) {
  const flags = await prisma.featureFlag.findMany();
  res.json(flags);
}
export async function setFeatureFlag(req: Request, res: Response) {
  const { key, enabled, label } = req.body as { key: string; enabled: boolean; label?: string };
  const flag = await prisma.featureFlag.upsert({ where: { key }, update: { enabled, label }, create: { key, enabled, label } });
  res.json(flag);
}
export async function listNotes(req: Request, res: Response) {
  const { clinicId } = req.query;
  const notes = await prisma.note.findMany({ where: clinicId ? { clinicId: Number(clinicId) } : {} });
  res.json(notes);
}
export async function addNote(req: Request, res: Response) {
  const { clinicId, text } = req.body as { clinicId: number; text: string };
  const note = await prisma.note.create({ data: { clinicId, text } });
  res.json(note);
}
export async function listNotifications(_req: Request, res: Response) {
  const items = await prisma.notification.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
}
export async function upsertNotification(req: Request, res: Response) {
  const { id, name, text, enabled } = req.body as { id?: number; name: string; text: string; enabled: boolean };
  const n = id ? await prisma.notification.update({ where: { id }, data: { name, text, enabled } })
               : await prisma.notification.create({ data: { name, text, enabled } });
  res.json(n);
}
export async function listTodayPins(_req: Request, res: Response) {
  const pins = await ensureTodayPins();
  res.json(pins);
}
export async function regenTodayPins(_req: Request, res: Response) {
  const pins = await ensureTodayPins(true);
  res.json(pins);
}
export async function verifyPin(req: Request, res: Response) {
  const { clinicId, code } = req.body as { clinicId: number; code: string };
  const ok = await verifyClinicPin(clinicId, code);
  res.json({ ok });
}
export async function reportsCsv(req: Request, res: Response) {
  const { startDate, endDate } = req.query as any;
  const csv = await buildCsv(new Date(startDate), new Date(endDate));
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="report_${startDate}_${endDate}.csv"`);
  res.send(csv);
}
export async function statsOverview(req: Request, res: Response) {
  const { startDate, endDate } = req.query as any;
  const data = await buildStats(new Date(startDate), new Date(endDate));
  res.json(data);
}
export async function reportsPreview(req: Request, res: Response) {
  const { startDate, endDate } = req.query as any;
  const start = new Date(startDate), end = new Date(endDate);
  const visitors = await prisma.visitor.findMany({ where: { visitDate: { gte: start, lte: end } }, orderBy: { visitDate: "asc" }, take: 500 });
  const visits = await prisma.visit.findMany({ where: { visitDate: { gte: start, lte: end } }, orderBy: { visitDate: "asc" }, take: 500 });
  res.json({ visitors, visits });
}
