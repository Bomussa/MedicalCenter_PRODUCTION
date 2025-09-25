import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { theme } from "../theme";
import axios from "axios";

export default function Home() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const speak = (key: string) => {
    const utter = new SpeechSynthesisUtterance(i18n.t(`voice.${key}`) as string);
    const voices = speechSynthesis.getVoices();
    utter.voice = voices.find(v => /female|sarah|zira|mira|laila/i.test(v.name)) || voices[0];
    utter.rate = 1.05;
    utter.volume = 0.9;
    speechSynthesis.speak(utter);
  };

  const onStart = async () => {
    if (!id) return alert(i18n.t("validation.required") as string);
    try {
      const { data } = await axios.post("/api/visitor/register", { identifier: id });
      const { assignedClinicId, queueNumber } = data;
      localStorage.setItem("currentVisitor", JSON.stringify({ identifier: id, queueNumber, assignedClinicId }));
      speak("enterId");
      navigate(`/exams`, { state: { queueNumber, identifier: id } });
    } catch (e: any) {
      if (e?.response?.data?.error) alert(e.response.data.error);
      else alert("حدث خطأ أثناء التسجيل");
    }
  };

  return (
    <div style={{ fontFamily: i18n.language === "ar" ? theme.fonts.ar : theme.fonts.en, padding: 16 }}>
      <h1>{i18n.t("voice.enterId")}</h1>
      <input value={id} onChange={e => setId(e.target.value)} placeholder={i18n.t("voice.enterId") as string} />
      <button onClick={onStart}>موافق</button>
      <p>{i18n.t("banner.womenNotice")}</p>
    </div>
  );
}
