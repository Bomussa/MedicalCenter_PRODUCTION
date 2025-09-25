import { Request, Response } from "express";
import { prisma } from "../index";

export async function overview(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const [visitsByExam, visitsByClinic, perDay, avgWait] = await Promise.all([
      prisma.$queryRaw`SELECT "examType" as key, COUNT(*)::bigint as value FROM "Visit" WHERE "visitDate" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)} GROUP BY "examType";`,
      prisma.$queryRaw`SELECT "clinicId" as key, COUNT(*)::bigint as value FROM "Visit" WHERE "visitDate" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)} GROUP BY "clinicId";`,
      prisma.$queryRaw`SELECT "visitDate"::date as key, COUNT(*)::bigint as value FROM "Visit" WHERE "visitDate" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)} GROUP BY key ORDER BY key;`,
      prisma.$queryRaw`SELECT AVG(EXTRACT(EPOCH FROM ("assignedTime" - "codeEntryTime"))) as value FROM "Visit" WHERE "visitDate" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)};`
    ]);
    res.json({ visitsByExam, visitsByClinic, perDay, avgWait: (avgWait as any)[0]?.value ?? 0 });
  } catch (e: any) {
    await prisma.errorLog.create({ data: { message: e.message, context: "overview" } });
    res.status(500).json({ error: "Internal error" });
  }
}
