import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default function Reports() {
  const [startDate, setStart] = useState<string>(new Date().toISOString().slice(0,10));
  const [endDate, setEnd] = useState<string>(new Date().toISOString().slice(0,10));
  const [preview, setPreview] = useState<any>(null);

  const downloadCsv = async () => {
    const res = await axios.get(`/api/admin/reports/csv?startDate=${startDate}&endDate=${endDate}`, { responseType: "blob", headers: { Authorization: `Bearer ${localStorage.getItem("token")||""}` } });
    const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `report_${startDate}_${endDate}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const loadPreview = async () => {
    const { data } = await axios.get(`/api/admin/reports/preview?startDate=${startDate}&endDate=${endDate}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")||""}` } });
    setPreview(data);
  };

  const exportXlsx = () => {
    if (!preview) return;
    const wb = XLSX.utils.book_new();
    const vs = XLSX.utils.json_to_sheet(preview.visitors || []);
    const vi = XLSX.utils.json_to_sheet(preview.visits || []);
    XLSX.utils.book_append_sheet(wb, vs, "Visitors");
    XLSX.utils.book_append_sheet(wb, vi, "Visits");
    XLSX.writeFile(wb, `report_${startDate}_${endDate}.xlsx`);
  };

  const exportPdf = () => {
    if (!preview) return;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(12);
    doc.text(`Report ${startDate} - ${endDate}`, 14, 14);
    let y = 24;
    const rows = (preview.visitors||[]).slice(0,25).map((r:any)=> `${r.identifier} | ${new Date(r.visitDate).toLocaleString()} | Q:${r.queueNumber}`);
    for (const line of rows) { doc.text(line, 14, y); y+=6; if (y>190) { doc.addPage(); y=20; } }
    doc.save(`report_${startDate}_${endDate}.pdf`);
  };

  return (
    <div>
      <h2>التقارير</h2>
      <input type="date" value={startDate} onChange={e=>setStart(e.target.value)} />
      <input type="date" value={endDate} onChange={e=>setEnd(e.target.value)} />
      <button onClick={loadPreview}>عرض</button>
      <button onClick={downloadCsv}>CSV</button>
      <button onClick={exportXlsx}>XLSX</button>
      <button onClick={exportPdf}>PDF</button>

      {preview ? (
        <div style={{display:"flex", gap:16, marginTop:12}}>
          <div style={{flex:1}}>
            <h4>Visitors</h4>
            <pre style={{maxHeight:300, overflow:"auto"}}>{JSON.stringify(preview.visitors, null, 2)}</pre>
          </div>
          <div style={{flex:1}}>
            <h4>Visits</h4>
            <pre style={{maxHeight:300, overflow:"auto"}}>{JSON.stringify(preview.visits, null, 2)}</pre>
          </div>
        </div>
      ) : <div>—</div>}
    </div>
  );
}
