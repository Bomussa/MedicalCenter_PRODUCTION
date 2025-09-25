import { PrismaClient } from "@prisma/client";

export async function assignClinicToVisitor(prisma: PrismaClient, visitorId: number) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = new Date(todayStr);

  const loads = await prisma.$queryRaw<Array<{ clinicId: number; cnt: bigint }>>`
    SELECT "clinicId", COUNT(*)::bigint as cnt FROM "Visit" WHERE "visitDate" = ${today}
    GROUP BY "clinicId" ORDER BY cnt ASC LIMIT 1;
  `;

  const clinicId = loads.length ? Number((loads as any)[0].clinicId) : 1;
  await prisma.visit.create({
    data: { visitorId, clinicId, examType: "default", codeEntryTime: new Date(), assignedTime: new Date(), visitDate: today }
  });
  return clinicId;
}
