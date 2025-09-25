import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const nav = useNavigate();
  const doLogin = async () => {
    try {
      const { data } = await axios.post("/api/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      nav("/admin");
    } catch { alert("بيانات الدخول غير صحيحة"); }
  };
  return (
    <div style={{ padding: 16 }}>
      <h2>تسجيل الدخول</h2>
      <input placeholder="اسم المستخدم" value={username} onChange={e=>setU(e.target.value)} />
      <input placeholder="كلمة المرور" type="password" value={password} onChange={e=>setP(e.target.value)} />
      <button onClick={doLogin}>دخول</button>
    </div>
  );
}
