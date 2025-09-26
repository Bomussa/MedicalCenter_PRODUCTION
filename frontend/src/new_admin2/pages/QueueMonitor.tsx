/* New file – Queue Monitor – 2025-09-26 */
import React, { useEffect, useState } from "react";
import { API } from "../../utils/safe";

export default function QueueMonitor() {
  const [clinicId, setClinicId] = useState<number>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<any>(null);

  const load = async () => {
    const r = await fetch(`${API}/api/admin2/queue/clinic?clinicId=${clinicId}&date=${date}`);
    if (r.ok) setData(await r.json());
  };

  useEffect(() => { load(); const t = setInterval(load, 10_000); return () => clearInterval(t); }, [clinicId, date]);

  return (
    <div className="card">
      <h2>Queue Monitor</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="number" value={clinicId} onChange={e => setClinicId(Number(e.target.value))} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button className="primary" onClick={load}>Refresh</button>
      </div>
      {data ? (
        <div style={{ marginTop: 12 }}>
          <p>Clinic: <b>{data.clinicId}</b> | Date: <b>{data.date}</b> | Current: <b>{data.currentNumber}</b> | Avg: <b>{data.avgDurationSec}</b>s</p>
          <table className="table">
            <thead><tr><th>Visitor</th><th>Since</th><th>Waited (sec)</th></tr></thead>
            <tbody>
              {data.waiting?.map((w: any) => (
                <tr key={w.visitorid}>
                  <td>{w.visitorid}</td>
                  <td>{w.since ? new Date(w.since).toLocaleString() : "-"}</td>
                  <td>{w.waitedsec ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div>Loading…</div>}
    </div>
  );
}

