import { prisma } from "../index";

function toCsvRow(arr: any[]) {
  return arr.map(v => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }).join(",") + "\n";
}

export async function buildCsv(start: Date, end: Date) {
  const visitors = await prisma.visitor.findMany({
    where: { visitDate: { gte: start, lte: end } },
    orderBy: { visitDate: "asc" }
  });
  const visits = await prisma.visit.findMany({
    where: { visitDate: { gte: start, lte: end } },
    orderBy: { visitDate: "asc" }
  });

  let csv = "";
  csv += "Section,Columns...\n";
  csv += "Visitors,identifier,visitDate,assignedClinic,queueNumber\n";
  for (const v of visitors) csv += toCsvRow(["Visitors", v.identifier, v.visitDate.toISOString(), v.assignedClinic ?? "", v.queueNumber]);
  csv += "Visits,visitorId,clinicId,examType,codeEntryTime,assignedTime,visitDate\n";
  for (const vi of visits) csv += toCsvRow(["Visits", vi.visitorId, vi.clinicId, vi.examType, vi.codeEntryTime.toISOString(), vi.assignedTime.toISOString(), vi.visitDate.toISOString()]);
  return csv;
}
