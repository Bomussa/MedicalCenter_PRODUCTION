import React, { useEffect, useState } from "react";

export default function JobsControl() {
  const [status, setStatus] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const loadStatus = () => {
    fetch("/api/jobs/status")
      .then((res) => res.json())
      .then((data) => setStatus(data));
  };

  const runNow = async () => {
    setRunning(true);
    try {
      await fetch("/api/jobs-control/run", { method: "POST" });
      await new Promise(r => setTimeout(r, 400)); // انتظار قصير
      loadStatus();
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => { loadStatus(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>⚙️ تشغيل التقارير يدويًا</h2>
      <button onClick={runNow} disabled={running}>
        {running ? "جاري التشغيل..." : "تشغيل الآن"}
      </button>
      <pre style={{ background: "#f7f7f7", padding: 10, marginTop: 10 }}>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
