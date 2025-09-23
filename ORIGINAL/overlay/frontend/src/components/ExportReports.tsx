import React from "react";

export default function ExportReports() {
  const exportCSV = () => {
    window.open("/api/reports/export", "_blank");
  };
  return <button onClick={exportCSV}>⬇️ تصدير التقارير CSV</button>;
}