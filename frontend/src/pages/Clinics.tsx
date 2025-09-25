import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

type LocationState = { queueNumber?: number };

export default function Clinics() {
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [clinics, setClinics] = useState<Array<{id:number; name:string}>>([{ id: 1, name: "المختبر" }]);
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (state.queueNumber != null) setQueueNumber(state.queueNumber);
    else {
      const cv = localStorage.getItem("currentVisitor");
      if (cv) { try { setQueueNumber(JSON.parse(cv).queueNumber ?? null); } catch {} }
    }
  }, []);

  const verify = async (clinicId: number) => {
    if (!/^\d{1,2}$/.test(pin)) return alert(i18n.t("pin.invalid") as string);
    const { data } = await axios.post("/api/admin/pins/verify", { clinicId, code: pin });
    if (data.ok) alert("✅ تم فتح العيادة التالية"); else alert("❌ PIN خاطئ");
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 18, marginBottom: 10 }}><b>رقم المراجع:</b> {queueNumber ?? "—"}</div>
      <h2>المسار الطبي للمراجع {id}</h2>
      <input value={pin} onChange={e => setPin(e.target.value)} maxLength={2} placeholder="PIN (01–99)"/>
      {clinics.map(c => (
        <div key={c.id} style={{ marginTop: 8 }}>
          <b>{c.name}</b>
          <button onClick={() => verify(c.id)} style={{ marginInlineStart: 8 }}>تحقق من PIN</button>
        </div>
      ))}
    </div>
  );
}
