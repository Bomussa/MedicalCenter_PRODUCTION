import React from "react";

export default function Protected({ children }:{children: React.ReactNode}){
  const token = typeof window!=="undefined" ? localStorage.getItem("mc_token") : null;
  if(!token) return <div>غير مصرح — يرجى تسجيل الدخول</div>;
  return <>{children}</>;
}

