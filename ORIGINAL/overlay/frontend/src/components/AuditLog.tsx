import React, { useEffect, useState } from "react";

interface Log {
  _id: string;
  action: string;
  user: string;
  createdAt: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/audit/logs")
      .then((res) => res.json())
      .then((data) => { if (data.ok !== false && data.logs) setLogs(data.logs); });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📜 سجل التدقيق</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>المستخدم</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>العملية</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>الوقت</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td style={{ borderBottom: "1px solid #f0f0f0" }}>{log.user}</td>
              <td style={{ borderBottom: "1px solid #f0f0f0" }}>{log.action}</td>
              <td style={{ borderBottom: "1px solid #f0f0f0" }}>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}