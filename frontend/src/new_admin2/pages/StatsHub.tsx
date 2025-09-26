/* New file – Stats Hub – 2025-09-26 */
import React, { useEffect, useState } from "react";
import { API } from "../../utils/safe";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const toXY = (rows: any[]) => ({
  labels: rows.map(r => String(r.key)),
  datasets: [{ label: "count", data: rows.map(r => Number(r.value)) }]
});

export default function StatsHub() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);
  const [data, setData] = useState<any>(null);

  const load = async () => {
    const r = await fetch(`${API}/api/admin2/stats/overview?from=${from}&to=${to}`);
    if (r.ok) setData(await r.json());
  };

  useEffect(() => { load(); }, [from, to]);

  if (!data) return <div className="card">Loading stats…</div>;
  return (
    <div className="card">
      <h2>Statistics</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button className="primary" onClick={load}>Refresh</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div><h4>Visits by Exam</h4><Bar data={toXY(data.visitsByExam)} /></div>
        <div><h4>Visits by Clinic</h4><Bar data={toXY(data.visitsByClinic)} /></div>
        <div><h4>Visits per Hour</h4><Line data={toXY(data.visitsPerHour)} /></div>
        <div><h4>Distribution (Exam)</h4><Pie data={toXY(data.visitsByExam)} /></div>
      </div>

      <p style={{ marginTop: 12 }}>Average Wait (sec): <b>{data.avgWaitSec}</b></p>
    </div>
  );
}

