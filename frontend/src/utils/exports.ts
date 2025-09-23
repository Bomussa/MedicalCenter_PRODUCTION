import { Visit } from "./records";
import { AppConfig } from "../app.config";

function toCSV(rows: Visit[]) {
  const header = ["userId","idType","gender","examId","assignedModel","startTime","endTime","durationSec"];
  const lines = rows.map(r => [
    r.userId, r.idType, r.gender, r.examId, r.assignedModel ?? "",
    r.startTime, r.endTime ?? "", String(r.durationSec ?? 0)
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","));
  return [header.join(","), ...lines].join("\n");
}

export function downloadBlob(data: Blob, name: string) {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function exportVisitsCSV(rows: Visit[]) {
  const csv = toCSV(rows);
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `visits_${new Date().toISOString().slice(0,10)}.csv`);
}

export function exportVisitsExcel(rows: Visit[]) {
  // Excel يقبل CSV مباشرة
  exportVisitsCSV(rows);
}

export function exportVisitsPDF(rows: Visit[], extras?: { clinicCounts?: Record<string, number>, monthSummary?: { total: number, byExam: Record<string, number> } }) {
  const logoUrl = AppConfig.branding.logo;
  const head = `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
    <img src="${logoUrl}" style="height:60px;width:auto" />
    <div>
      <div style="font-size:20px;font-weight:700">${AppConfig.branding.title.ar}</div>
      <div style="font-size:14px;color:#374151">${AppConfig.branding.subtitle.ar}</div>
    </div>
  </div>`;
  const table = `
  <table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">الرقم</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">نوع الرقم</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">الجنس</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">نوع الفحص</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">النموذج</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">البداية</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">النهاية</th>
        <th style="border:1px solid #ddd;padding:6px;text-align:start">المدة (ث)</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(r=>`<tr>
        <td style="border:1px solid #eee;padding:6px">${r.userId}</td>
        <td style="border:1px solid #eee;padding:6px">${r.idType}</td>
        <td style="border:1px solid #eee;padding:6px">${r.gender}</td>
        <td style="border:1px solid #eee;padding:6px">${r.examId}</td>
        <td style="border:1px solid #eee;padding:6px">${r.assignedModel ?? "-"}</td>
        <td style="border:1px solid #eee;padding:6px">${r.startTime}</td>
        <td style="border:1px solid #eee;padding:6px">${r.endTime ?? "-"}</td>
        <td style="border:1px solid #eee;padding:6px">${r.durationSec ?? 0}</td>
      </tr>`).join("")}
    </tbody>
  </table>`;

  const clinicsHtml = extras?.clinicCounts ? `
    <h3 style="margin:16px 0 8px">عدد المراجعين لكل عيادة</h3>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr><th style="border:1px solid #ddd;padding:6px">العيادة</th><th style="border:1px solid #ddd;padding:6px">عدد المراجعين</th></tr></thead>
      <tbody>
        ${Object.entries(extras.clinicCounts).map(([id,c])=>`<tr>
          <td style="border:1px solid #eee;padding:6px">${id}</td>
          <td style="border:1px solid #eee;padding:6px">${c}</td>
        </tr>`).join("")}
      </tbody>
    </table>` : "";

  const monthHtml = extras?.monthSummary ? `
    <h3 style="margin:16px 0 8px">التقرير الشهري</h3>
    <div style="margin-bottom:6px">الإجمالي: ${extras.monthSummary.total}</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr><th style="border:1px solid #ddd;padding:6px">نوع الفحص</th><th style="border:1px solid #ddd;padding:6px">العدد</th></tr></thead>
      <tbody>
        ${Object.entries(extras.monthSummary.byExam).map(([k,v])=>`<tr>
          <td style="border:1px solid #eee;padding:6px">${k}</td>
          <td style="border:1px solid #eee;padding:6px">${v}</td>
        </tr>`).join("")}
      </tbody>
    </table>` : "";

  const html = `
    <html><head><meta charset="utf-8" /><title>تقارير الفحوص</title></head>
    <body style="font-family:Arial,system-ui,-apple-system,Segoe UI,Roboto;padding:16px">
      ${head}
      ${table}
      ${clinicsHtml}
      ${monthHtml}
      <script>window.print()</script>
    </body></html>
  `;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}