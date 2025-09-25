import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import i18n from "../i18n";

export default function AdminDashboard() {
  const [flags, setFlags] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [pins, setPins] = useState<any[]>([]);
  const [range, setRange] = useState({ start: new Date().toISOString().slice(0,10), end: new Date().toISOString().slice(0,10) });
  const [stats, setStats] = useState<any>(null);

  const auth = { headers: { Authorization: `Bearer ${localStorage.getItem("token")||""}` } };

  const loadAll = async () => {
    const [f, n, no, p] = await Promise.all([
      axios.get("/api/admin/features", auth),
      axios.get("/api/admin/notes", auth),
      axios.get("/api/admin/notifications", auth),
      axios.get("/api/admin/pins/today", auth)
    ]);
    setFlags(f.data); setNotes(n.data); setNotifs(no.data); setPins(p.data);
  };

  useEffect(()=>{ loadAll(); }, []);

  const toggleFlag = async (key: string, enabled: boolean, label?: string) => {
    const { data } = await axios.post("/api/admin/features", { key, enabled, label }, auth);
    setFlags(prev => prev.map(f => f.key === data.key ? data : f));
  };

  const regenPins = async () => {
    const { data } = await axios.post("/api/admin/pins/regen", {}, auth);
    setPins(data);
  };

  const loadStats = async () => {
    const { data } = await axios.get(`/api/admin/stats/overview?startDate=${range.start}&endDate=${range.end}`, auth);
    setStats(data);
  };

  const preview = async () => {
    const { data } = await axios.get(`/api/admin/reports/preview?startDate=${range.start}&endDate=${range.end}`, auth);
    setStats((prev:any)=>({...prev, preview: data }));
  };

  const chartData = {
    labels: (stats?.perDay || []).map((d:any)=>d.key?.toString().slice(0,10)),
    datasets: [{ label: "زيارات/يوم", data: (stats?.perDay || []).map((d:any)=>Number(d.value||0)) }]
  };

  return (
    <div>
      <h2>لوحة الإدارة</h2>

      <section>
        <h3>{i18n.t("admin.features")}</h3>
        {flags.map(f => (
          <div key={f.key}>
            <label>{f.label || f.key}</label>
            <input type="checkbox" checked={!!f.enabled} onChange={e=>toggleFlag(f.key, e.target.checked, f.label)} />
          </div>
        ))}
      </section>

      <section>
        <h3>{i18n.t("admin.pins")}</h3>
        <button onClick={regenPins}>إعادة توليد PIN لليوم (01–99)</button>
        <ul>{pins.map((p:any)=> <li key={p.clinicId}>Clinic #{p.clinicId}: {p.code}</li>)}</ul>
      </section>

      <section>
        <h3>{i18n.t("admin.stats")}</h3>
        <input type="date" value={range.start} onChange={e=>setRange(r=>({...r, start:e.target.value}))}/>
        <input type="date" value={range.end} onChange={e=>setRange(r=>({...r, end:e.target.value}))}/>
        <button onClick={loadStats}>تحديث</button>
        <button onClick={preview}>معاينة التقارير</button>
        {stats?.perDay?.length ? <Line data={chartData} /> : <div>لا توجد بيانات للرسم</div>}
      </section>

      <section>
        <h3>معاينة التقارير (أول 500 صف)</h3>
        {stats?.preview ? (
          <div style={{display:"flex", gap:16}}>
            <div style={{flex:1}}>
              <h4>Visitors</h4>
              <table border={1} cellPadding={4}>
                <thead><tr><th>identifier</th><th>visitDate</th><th>assignedClinic</th><th>queueNumber</th></tr></thead>
                <tbody>
                  {stats.preview.visitors.map((v:any, i:number)=>(
                    <tr key={i}><td>{v.identifier}</td><td>{new Date(v.visitDate).toLocaleString()}</td><td>{v.assignedClinic||""}</td><td>{v.queueNumber}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{flex:1}}>
              <h4>Visits</h4>
              <table border={1} cellPadding={4}>
                <thead><tr><th>visitorId</th><th>clinicId</th><th>examType</th><th>codeEntryTime</th><th>assignedTime</th><th>visitDate</th></tr></thead>
                <tbody>
                  {stats.preview.visits.map((r:any, i:number)=>(
                    <tr key={i}><td>{r.visitorId}</td><td>{r.clinicId}</td><td>{r.examType}</td><td>{new Date(r.codeEntryTime).toLocaleString()}</td><td>{new Date(r.assignedTime).toLocaleString()}</td><td>{new Date(r.visitDate).toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : <div>—</div>}
      </section>
    </div>
  );
}
