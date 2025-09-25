import React, { useState } from "react";
import Appearance from "./Appearance";
import Users from "./Users";
import Login from "./Login";
import LogoComponent from "../components/LogoComponent";

function Protected({ children }:{children: React.ReactNode}){
  const token = typeof window!=="undefined" ? localStorage.getItem("mc_token") : null;
  if(!token) return <div>غير مصرح — يرجى تسجيل الدخول</div>;
  return <>{children}</>;
}

export default function AdminApp(){
  const [logged, setLogged] = useState(!!localStorage.getItem("mc_token"));
  
  if(!logged) return <Login onSuccess={()=>setLogged(true)} />;
  
  return (
    <Protected>
      <div style={{display:"grid", gap:16, padding:"20px"}}>
        <header style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          padding:"16px 24px",
          borderBottom:"1px solid #ddd",
          background:"#fff",
          borderRadius:"12px",
          boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <LogoComponent size={50} showText={true} variant="gradient" />
          
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right", fontSize: 14 }}>
              <div style={{ fontWeight: 600, color: "#1E293B" }}>لوحة الإدارة</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>إدارة النظام والمظهر</div>
            </div>
            <button 
              onClick={()=>{
                localStorage.removeItem("mc_token");
                setLogged(false);
              }}
              style={{
                padding:"8px 16px",
                borderRadius:8,
                border:"1px solid #ddd",
                background:"#fff",
                color:"#dc2626",
                fontSize:14,
                cursor:"pointer"
              }}
            >
              تسجيل خروج
            </button>
          </div>
        </header>
        <Appearance/>
        <Users/>
      </div>
    </Protected>
  );
}

