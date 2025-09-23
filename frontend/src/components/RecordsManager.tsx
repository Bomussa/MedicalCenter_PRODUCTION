import React from "react";
import { readVisits, Visit } from "../utils/records";

const RecordsManager: React.FC = () => {
  const all = readVisits();
  const [q, setQ] = React.useState("");
  const filtered = all.filter(v => v.userId.includes(q));

  return (
    <div className="card">
      <h3>السجلات (عرض فقط)</h3>
      <label><div>بحث بالرقم</div><input className="input" value={q} onChange={e=>setQ(e.target.value)} /></label>
      <div style={{overflowX:"auto", marginTop:8}}>
        <table className="table">
          <thead>
            <tr><th>الرقم</th><th>نوع الرقم</th><th>الجنس</th><th>الفحص</th><th>البداية</th><th>النهاية</th></tr>
          </thead>
          <tbody>
            {filtered.map((r: Visit, i)=>(
              <tr key={i}>
                <td>{r.userId}</td><td>{r.idType}</td><td>{r.gender}</td>
                <td>{r.examId}</td><td>{r.startTime}</td><td>{r.endTime ?? "-"}</td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={6} className="status">لا توجد بيانات</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RecordsManager;