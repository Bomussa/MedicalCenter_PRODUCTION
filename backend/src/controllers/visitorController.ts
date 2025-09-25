import { Request, Response } from "express";
import { prisma } from "../index";
import { assignClinicToVisitor } from "../services/assignClinic";

export async function registerVisitor(req: Request, res: Response) {
  try {
    const { identifier } = req.body as { identifier: string };
    const todayStr = new Date().toISOString().slice(0, 10);
    const today = new Date(todayStr);

    const exists = await prisma.visitor.findFirst({
      where: { identifier, visitDate: today }
    });
    if (exists) return res.status(400).json({ error: "Visitor already registered today" });

    const maxQueue = await prisma.visitor.aggregate({
      _max: { queueNumber: true },
      where: { visitDate: today }
    });
    const nextQueue = (maxQueue._max.queueNumber ?? 0) + 1;

    const visitor = await prisma.visitor.create({
      data: { identifier, visitDate: today, queueNumber: nextQueue }
    });

    const assignedClinicId = await assignClinicToVisitor(prisma, visitor.id);
    await prisma.visitor.update({ where: { id: visitor.id }, data: { assignedClinic: assignedClinicId } });

    return res.json({ assignedClinicId, queueNumber: nextQueue });
  } catch (e: any) {
    await prisma.errorLog.create({ data: { message: e.message, context: "registerVisitor" } });
    return res.status(500).json({ error: "Internal error" });
  }
}
