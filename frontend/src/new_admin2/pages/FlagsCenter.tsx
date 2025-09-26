/* New file – Flags Center – 2025-09-26 */
import React, { useEffect, useState } from "react";
import { API, safe } from "../../utils/safe";

type Flag = { key: string; enabled: boolean; updatedat?: string };

export default function FlagsCenter() {
  const [rows, setRows] = useState<Flag[]>([]);
  const load = async () => {
    const r = await safe<Flag[]>(fetch(`${API}/api/admin2/flags`));
    if (r.ok) setRows(r.data!);
  };
  const toggle = async (f: Flag) => {
    await fetch(`${API}/api/admin2/flags`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: f.key, enabled: !f.enabled })
    });
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="card">
      <h2>Feature Flags</h2>
      <table className="table">
        <thead><tr><th>Key</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.key}>
              <td>{r.key}</td>
              <td>{r.enabled ? "ENABLED" : "DISABLED"}</td>
              <td><button onClick={() => toggle(r)}>{r.enabled ? "Disable" : "Enable"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

