import { prisma } from "../index";

export async function buildStats(start: Date, end: Date) {
  const visitsByExam = await prisma.$queryRaw`SELECT "examType" as key, COUNT(*)::bigint as value FROM "Visit" WHERE "visitDate" BETWEEN ${start} AND ${end} GROUP BY "examType"`;
  const visitsByClinic = await prisma.$queryRaw`SELECT "clinicId" as key, COUNT(*)::bigint as value FROM "Visit" WHERE "visitDate" BETWEEN ${start} AND ${end} GROUP BY "clinicId"`;
  const perDay = await prisma.$queryRaw`SELECT "visitDate"::date as key, COUNT(*)::bigint as value FROM "Visit" WHERE "visitDate" BETWEEN ${start} AND ${end} GROUP BY key ORDER BY key`;
  return { visitsByExam, visitsByClinic, perDay };
}
