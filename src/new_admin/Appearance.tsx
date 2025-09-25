import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Appearance(){
  const { setTheme, setFonts, theme } = useTheme();
  const [ar, setAr] = useState(theme.fonts.ar);
  const [en, setEn] = useState(theme.fonts.en);
  
  return (
    <section style={{display:"grid", gap:16}}>
      <h2>الإعدادات › المظهر</h2>
      <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
        <button 
          onClick={()=>setTheme("themeMedical")} 
          style={{
            padding:"10px 14px", 
            borderRadius:10, 
            border:"none", 
            background:"#1E88E5", 
            color:"#fff"
          }}
        >
          🎨 طبي هادئ
        </button>
        <button 
          onClick={()=>setTheme("themeDark")} 
          style={{
            padding:"10px 14px", 
            borderRadius:10, 
            border:"none", 
            background:"#151820", 
            color:"#fff"
          }}
        >
          🌑 داكن
        </button>
        <button 
          onClick={()=>setTheme("themeFlat")} 
          style={{
            padding:"10px 14px", 
            borderRadius:10, 
            border:"none", 
            background:"#1976D2", 
            color:"#fff"
          }}
        >
          🟦 مسطح
        </button>
        <button 
          onClick={()=>setTheme("themeGradient")} 
          style={{
            padding:"10px 14px", 
            borderRadius:10, 
            border:"none", 
            background:"linear-gradient(135deg,#42A5F5,#478ED1)", 
            color:"#fff"
          }}
        >
          🌈 متدرج
        </button>
      </div>
      <div style={{display:"flex", gap:12, alignItems:"center", flexWrap:"wrap"}}>
        <div>
          <label>العربية:</label>{" "}
          <select value={ar} onChange={e=>setAr(e.target.value)}>
            {["Cairo","Noto Kufi Arabic","Amiri","Tajawal"].map(x=> 
              <option key={x} value={x}>{x}</option>
            )}
          </select>
        </div>
        <div>
          <label>English:</label>{" "}
          <select value={en} onChange={e=>setEn(e.target.value)}>
            {["Inter","Roboto","Poppins","Open Sans"].map(x=> 
              <option key={x} value={x}>{x}</option>
            )}
          </select>
        </div>
        <button 
          onClick={()=>setFonts({ar, en})} 
          style={{
            padding:"8px 12px", 
            borderRadius:8, 
            border:"1px solid #ddd"
          }}
        >
          تطبيق الخطوط
        </button>
      </div>
    </section>
  );
}

