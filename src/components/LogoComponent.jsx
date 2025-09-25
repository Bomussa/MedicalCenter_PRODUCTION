import React from 'react';

export default function LogoComponent({ size = 60, showText = true, variant = 'default' }) {
  const logoStyle = {
    width: size,
    height: size,
    borderRadius: size * 0.1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden"
  };

  const imageStyle = {
    width: size,
    height: size,
    objectFit: "contain",
    borderRadius: size * 0.1
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: showText ? 16 : 0 }}>
      {/* الشعار الحقيقي */}
      <div style={logoStyle}>
        <img 
          src="/medical-center-logo.jpg" 
          alt="شعار المركز الطبي التخصصي العسكري - الخدمات الطبية"
          style={imageStyle}
        />
      </div>
      
      {/* النص */}
      {showText && (
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: size > 50 ? "18px" : "16px",
            color: "#1E293B",
            fontFamily: "Cairo, sans-serif",
            lineHeight: 1.2
          }}>
            المركز الطبي التخصصي العسكري – العطار
          </div>
          <div style={{
            fontSize: size > 50 ? 14 : 12,
            opacity: 0.8,
            color: "#64748B",
            fontFamily: "Cairo, sans-serif"
          }}>
            قسم اللجنة الطبية العسكرية
          </div>
          <div style={{
            fontSize: size > 50 ? 12 : 10,
            opacity: 0.6,
            color: "#1E88E5",
            fontFamily: "Cairo, sans-serif",
            marginTop: 2
          }}>
            الخدمات الطبية
          </div>
        </div>
      )}
    </div>
  );
}

