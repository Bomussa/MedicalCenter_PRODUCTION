import React from 'react';

export default function LogoComponent({ size = 60, showText = true, variant = 'default' }) {
  const logoStyle = {
    width: size,
    height: size,
    borderRadius: size * 0.2,
    background: variant === 'gradient' 
      ? 'linear-gradient(135deg, #1E88E5, #1565C0)' 
      : '#1E88E5',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(30, 136, 229, 0.3)",
    position: "relative",
    overflow: "hidden"
  };

  const imageStyle = {
    width: size * 0.8,
    height: size * 0.8,
    objectFit: "contain",
    filter: "brightness(0) invert(1)"
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: showText ? 16 : 0 }}>
      {/* الشعار */}
      <div style={logoStyle}>
        <img 
          src="/medical-logo.webp" 
          alt="شعار المركز الطبي"
          style={imageStyle}
        />
        
        {/* تأثير بصري إضافي */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          pointerEvents: "none"
        }} />
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
            المركز الطبي التخصصي العسكري
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

