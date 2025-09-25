import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Exams(){
  const [types, setTypes] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const nav = useNavigate();
  const visitor = JSON.parse(localStorage.getItem("currentVisitor") || "{}");

  useEffect(()=>{ axios.get("/api/exams/types").then(r=> setTypes(r.data)); },[]);

  const choose = async () => {
    if (!selected) return alert("اختر نوع الفحص");
    try {
      await axios.post("/api/exams/set", { identifier: visitor.identifier, examType: selected });
      nav(`/clinic/${visitor.identifier}`, { state: { queueNumber: visitor.queueNumber } });
    } catch { alert("تعذر حفظ نوع الفحص"); }
  };

  return (
    <div style={{padding:16}}>
      <h2>اختر نوع الفحص</h2>
      <select value={selected} onChange={e=>setSelected(e.target.value)}>
        <option value="">— اختر —</option>
        {types.map(t=> <option key={t} value={t}>{t}</option>)}
      </select>
      <button onClick={choose} style={{marginInlineStart:8}}>موافق</button>
    </div>
  );
}
