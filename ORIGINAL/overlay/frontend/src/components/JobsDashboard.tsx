import React, { useEffect, useState } from "react";

interface JobStatus {
  name: string;
  lastRun: string | null;
  status: string;
  output?: string | null;
}

export default function JobsDashboard() {
  const [jobs, setJobs] = useState<JobStatus[]>([]);

  useEffect(() => {
    fetch("/api/jobs/status")
      .then((res) => res.json())
      .then((data) => { if (data.ok !== false && data.jobs) setJobs(data.jobs); });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🗂️ متابعة المهام</h2>
      <ul>
        {jobs.map((job, idx) => (
          <li key={idx}>
            <strong>{job.name}</strong> – {job.status} {job.lastRun ? `(آخر تشغيل: ${new Date(job.lastRun).toLocaleString()})` : ""}
            {job.output ? <> – ملف: <code>{job.output}</code></> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}