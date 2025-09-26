/* New file – Settings Center – 2025-09-26 */
import React, { useEffect, useState } from "react";
import { API, safe } from "../../utils/safe";

type Row = { key: string; value: any; updatedat?: string };

export default function SettingsCenter() {
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => {
    const r = await safe<Row[]>(fetch(`${API}/api/admin2/settings`));
    if (r.ok) setRows(r.data!);
  };
  const save = async (key: string, txt: string) => {
    try {
      const value = JSON.parse(txt);
      await fetch(`${API}/api/admin2/settings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
      load();
    } catch { alert("Invalid JSON"); }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="card">
      <h2>System Settings</h2>
      <table className="table">
        <thead><tr><th>Key</th><th>Value (JSON)</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map(row => {
            const id = `val-${row.key}`;
            const def = JSON.stringify(row.value, null, 2);
            return (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td><textarea id={id} defaultValue={def} rows={4} style={{ width: "100%" }} /></td>
                <td><button onClick={() => save(row.key, (document.getElementById(id) as HTMLTextAreaElement).value)}>Save</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

