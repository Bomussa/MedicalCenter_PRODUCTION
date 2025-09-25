import React, { useState } from "react";
import LogoComponent from "../components/LogoComponent";

export default function Login({ onSuccess }:{ onSuccess:()=>void }){
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const submit = async ()=>{
    setError("");
    setLoading(true);
    try{
      const res = await fetch("/api/auth2/login", {
        method:"POST", 
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data?.error || "فشل في تسجيل الدخول");
      localStorage.setItem("mc_token", data.token); 
      onSuccess();
    }catch(e:any){ 
      setError(e.message === "invalid" ? "اسم المستخدم أو كلمة المرور غير صحيحة" : e.message); 
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit();
    }
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Cairo, sans-serif"
    }}>
      {/* خلفية متحركة */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
        `,
        animation: "float 6s ease-in-out infinite"
      }} />

      {/* بطاقة تسجيل الدخول */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.2)
        `,
        position: "relative",
        zIndex: 1
      }}>
        {/* الرأس */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <LogoComponent size={70} showText={false} variant="gradient" />
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
            lineHeight: 1.2
          }}>
            تسجيل دخول الإدارة
          </h1>
          <p style={{
            color: "#64748B",
            fontSize: "16px",
            margin: 0
          }}>
            المركز الطبي التخصصي العسكري – العطار
          </p>
        </div>

        {/* النموذج */}
        <div style={{ display: "grid", gap: "20px" }}>
          {/* حقل اسم المستخدم */}
          <div style={{ position: "relative" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px"
            }}>
              اسم المستخدم
            </label>
            <input 
              placeholder="أدخل اسم المستخدم" 
              value={username} 
              onChange={e=>setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "2px solid #E5E7EB",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "Cairo, sans-serif",
                transition: "all 0.3s ease",
                background: "#FAFBFC",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.background = "#FAFBFC";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* حقل كلمة المرور */}
          <div style={{ position: "relative" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px"
            }}>
              كلمة المرور
            </label>
            <input 
              placeholder="أدخل كلمة المرور" 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "2px solid #E5E7EB",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "Cairo, sans-serif",
                transition: "all 0.3s ease",
                background: "#FAFBFC",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.background = "#FAFBFC";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #fee2e2, #fecaca)",
              border: "1px solid #fca5a5",
              borderRadius: "8px",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: 500,
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {/* زر الدخول */}
          <button 
            onClick={submit}
            disabled={loading || !username || !password}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#9CA3AF" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Cairo, sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
              transform: loading ? "none" : "translateY(0)",
              opacity: (!username || !password) ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading && username && password) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? "جاري تسجيل الدخول..." : "دخول"}
          </button>
        </div>

        {/* معلومات إضافية */}
        <div style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#9CA3AF"
        }}>
          <p style={{ margin: 0 }}>
            نظام إدارة المراجعين والفحوصات الطبية
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            © 2025 المركز الطبي التخصصي العسكري
          </p>
        </div>
      </div>

      {/* إضافة الأنيميشن */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

