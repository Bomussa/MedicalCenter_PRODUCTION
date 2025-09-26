/* New file – Reports Hub – 2025-09-26 */
import React, { useEffect, useState } from "react";
import { API } from "../../utils/safe";

export default function ReportsHub() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);
  const [type, setType] = useState<"csv" | "xlsx" | "pdf">("csv");
  const [scope, setScope] = useState<"visitors" | "clinics" | "exams">("visitors");
  const [archive, setArchive] = useState<any[]>([]);

  const load = async () => {
    const r = await fetch(`${API}/api/admin2/reports/archive`);
    if (r.ok) setArchive(await r.json());
  };
  const generate = async () => {
    await fetch(`${API}/api/admin2/reports/generate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, from, to, scope })
    });
    load();
  };
  const download = (id: number) => window.open(`${API}/api/admin2/reports/download/${id}`, "_blank");

  useEffect(() => { load(); }, []);
  return (
    <div className="card">
      <h2>Reports</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="csv">CSV</option>
          <option value="xlsx">XLSX</option>
          <option value="pdf">PDF</option>
        </select>
        <select value={scope} onChange={e => setScope(e.target.value as any)}>
          <option value="visitors">Visitors</option>
          <option value="clinics">Clinics</option>
          <option value="exams">Exams</option>
        </select>
        <button className="primary" onClick={generate}>Generate</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Archive</h3>
      <table className="table">
        <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>From</th><th>To</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>
          {archive.map((r: any) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.title}</td><td>{r.type}</td>
              <td>{(r.period_from || "").slice(0, 10)}</td>
              <td>{(r.period_to || "").slice(0, 10)}</td>
              <td>{r.generated_at}</td>
              <td><button onClick={() => download(r.id)}>Download</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

