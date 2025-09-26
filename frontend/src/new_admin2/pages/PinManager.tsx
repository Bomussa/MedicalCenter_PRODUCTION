/* New file – PIN Manager – 2025-09-26 */
import React, { useEffect, useState } from "react";
import { API } from "../../utils/safe";

export default function PinManager() {
  const [clinicId, setClinicId] = useState<number>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [pinCode, setPinCode] = useState<string>("");
  const [redirectClinicId, setRedirectClinicId] = useState<number | undefined>(undefined);
  const [pins, setPins] = useState<any[]>([]);

  const load = async () => {
    const r = await fetch(`${API}/api/admin2/pin/list?clinicId=${clinicId}&date=${date}`);
    if (r.ok) setPins(await r.json());
  };
  const add = async () => {
    await fetch(`${API}/api/admin2/pin/add`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinicId, date, pinCode }) });
    setPinCode("");
    load();
  };
  const toggle = async (pinId: number, isActive: boolean) => {
    await fetch(`${API}/api/admin2/pin/toggle`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinId, isActive }) });
    load();
  };
  const redirect = async (pinId: number) => {
    if (!redirectClinicId) { alert("Set redirect clinic id"); return; }
    await fetch(`${API}/api/admin2/pin/redirect`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinId, redirectClinicId }) });
    load();
  };

  useEffect(() => { load(); }, [clinicId, date]);
  return (
    <div className="card">
      <h2>PIN Manager</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input type="number" value={clinicId} onChange={e => setClinicId(Number(e.target.value))} placeholder="Clinic ID" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input value={pinCode} onChange={e => setPinCode(e.target.value)} placeholder="PIN (01-99)" maxLength={2} />
        <button className="primary" onClick={add}>Add PIN</button>
        <input type="number" value={redirectClinicId ?? ""} onChange={e => setRedirectClinicId(Number(e.target.value) || undefined)} placeholder="Redirect Clinic ID" />
      </div>
      <table className="table" style={{ marginTop: 12 }}>
        <thead><tr><th>ID</th><th>PIN</th><th>Active</th><th>Date</th><th>Redirect</th><th>Actions</th></tr></thead>
        <tbody>
          {pins.map((p: any) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.pincode}</td><td>{String(p.isactive)}</td>
              <td>{(p.validdate || "").slice(0, 10)}</td><td>{p.redirectclinicid ?? "-"}</td>
              <td>
                <button onClick={() => toggle(p.id, !p.isactive)}>{p.isactive ? "Deactivate" : "Activate"}</button>
                <button onClick={() => redirect(p.id)}>Set Redirect</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

