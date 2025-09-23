import React from "react";
import { useApp } from "../context/AppContext";
import { readVisits, Visit } from "../utils/records";
import { todayQatarISO } from "../utils/time";
import { exportVisitsCSV, exportVisitsExcel, exportVisitsPDF } from "../utils/exports";

function countVisitorsPerClinic(visits: Visit[]) {
  const counts: Record<string, number> = {};
  visits.forEach(v => (v.clinicsVisited || []).forEach(c => { counts[c.id] = (counts[c.id] || 0) + 1; }));
  return counts;
}
function monthlySummary(visits: Visit[], monthISO: string) {
  const rows = visits.filter(v => (v.startTime||"").slice(0,7) === monthISO.slice(0,7));
  const byExam: Record<string, number> = {};
  rows.forEach(v => { byExam[v.examId] = (byExam[v.examId] || 0) + 1; });
  return { total: rows.length, byExam };
}

const Reports: React.FC = () => {
  const { settings } = useApp();
  const all = readVisits();
  const [dateFrom, setDateFrom] = React.useState(todayQatarISO());
  const [dateTo, setDateTo] = React.useState(todayQatarISO());
  const [exam, setExam] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [model, setModel] = React.useState("");
  const [monthISO, setMonthISO] = React.useState(todayQatarISO().slice(0,7));

  const filtered = React.useMemo(()=>{
    const inRange = (ts?: string) => {
      const d = (ts || "").slice(0,10);
      return (!dateFrom || d >= dateFrom) && (!dateTo || d <= dateTo);
    };
    return all.filter(v =>
      (!exam || v.examId === exam) &&
      (!gender || v.gender === gender) &&
      (!model || v.assignedModel === model) &&
      inRange(v.startTime)
    );
  }, [all, dateFrom, dateTo, exam, gender, model]);

  const clinicCounts = countVisitorsPerClinic(filtered);
  const month = monthlySummary(all, monthISO);

  return (
    <div className="card">
      <h3>التقارير (عرض فقط)</h3>
      <div className="grid grid-3" style={{marginTop:8}}>
        <label><div>من تاريخ</div><input className="input" type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} /></label>
        <label><div>إلى تاريخ</div><input className="input" type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} /></label>
        <label><div>نوع الفحص</div>
          <select className="select" value={exam} onChange={e=>setExam(e.target.value)}>
            <option value="">الكل</option>
            <option value="exam.recruit">التجنيد/الترفيع/النقل/التحويل/التجديد</option>
            <option value="exam.courses">فحص الدورات</option>
            <option value="exam.aviation">الفحص السنوي للطيران</option>
            <option value="exam.cooks">فحص الطباخين</option>
            <option value="exam.fullmap">الفحص الشامل – خريطة العيادات</option>
          </select>
        </label>
        <label><div>الجنس</div>
          <select className="select" value={gender} onChange={e=>setGender(e.target.value)}>
            <option value="">الكل</option><option value="male">ذكر</option><option value="female">أنثى</option>
          </select>
        </label>
        <label><div>النموذج</div>
          <select className="select" value={model} onChange={e=>setModel(e.target.value)}>
            <option value="">الكل</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
          </select>
        </label>
      </div>

      <div style={{display:"flex", gap:8, margin:"8px 0"}}>
        <button className="btn btn-ghost" onClick={()=>exportVisitsCSV(filtered)}>تصدير CSV</button>
        <button className="btn btn-ghost" onClick={()=>exportVisitsExcel(filtered)}>تصدير Excel</button>
        <button className="btn btn-ghost" onClick={()=>exportVisitsPDF(filtered, { clinicCounts, monthSummary: month })}>تصدير PDF/طباعة</button>
      </div>

      <div className="card" style={{overflowX:"auto", marginTop:8}}>
        <table className="table">
          <thead>
            <tr>
              <th>الرقم</th><th>نوع الرقم</th><th>الجنس</th><th>نوع الفحص</th><th>النموذج</th><th>البداية</th><th>النهاية</th><th>المدة (ث)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: Visit, i)=>(
              <tr key={i}>
                <td>{r.userId}</td><td>{r.idType}</td><td>{r.gender}</td><td>{r.examId}</td>
                <td>{r.assignedModel ?? "-"}</td><td>{r.startTime}</td><td>{r.endTime ?? "-"}</td>
                <td>{r.durationSec ?? 0}</td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={8} className="status">لا توجد بيانات ضمن الفلاتر</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h4>عدد المراجعين لكل عيادة</h4>
        <table className="table">
          <thead><tr><th>العيادة</th><th>عدد المراجعين</th></tr></thead>
          <tbody>
            {Object.entries(clinicCounts).map(([id,c])=>(
              <tr key={id}><td>{id}</td><td>{c}</td></tr>
            ))}
            {Object.keys(clinicCounts).length===0 && <tr><td colSpan={2} className="status">لا توجد بيانات</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h4>التقرير الشهري</h4>
        <label><div>الشهر</div><input className="input" type="month" value={monthISO} onChange={e=>setMonthISO(e.target.value)} /></label>
        <div style={{marginTop:8}}>الإجمالي: {month.total}</div>
        <table className="table" style={{marginTop:8}}>
          <thead><tr><th>نوع الفحص</th><th>العدد</th></tr></thead>
          <tbody>
            {Object.entries(month.byExam).map(([k,v])=>(
              <tr key={k}><td>{k}</td><td>{v}</td></tr>
            ))}
            {Object.keys(month.byExam).length===0 && <tr><td colSpan={2} className="status">لا توجد بيانات</td></tr>}
          </tbody>
        </table>
      </div>

      {settings.readOnlyReports && <div className="status" style={{marginTop:8}}>التقارير والسجلات مقفلة للعرض فقط</div>}
    </div>
  );
};
export default Reports;