import { Request, Response } from "express";
import { prisma } from "../index";

const TYPES = ["تجنيد","ترفيع","نقل","تحويل","طيران","طباخين","تجديد عقد"];

export async function listExamTypes(_req: Request, res: Response) { res.json(TYPES); }

export async function setVisitorExam(req: Request, res: Response) {
  const { identifier, examType } = req.body as { identifier: string; examType: string };
  if (!TYPES.includes(examType)) return res.status(400).json({ error: "Invalid examType" });
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = new Date(todayStr);
  const visitor = await prisma.visitor.findFirst({ where: { identifier, visitDate: today }});
  if (!visitor) return res.status(404).json({ error: "Visitor not found for today" });
  const first = await prisma.visit.findFirst({ where: { visitorId: visitor.id, visitDate: today }, orderBy: { id: "asc" }});
  if (first) {
    await prisma.visit.update({ where: { id: first.id }, data: { examType } });
  } else {
    await prisma.visit.create({ data: { visitorId: visitor.id, clinicId: visitor.assignedClinic ?? 1, examType, codeEntryTime: new Date(), assignedTime: new Date(), visitDate: today }});
  }
  res.json({ ok: true });
}
