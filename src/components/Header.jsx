import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme } = useTheme();

  return (
    <header 
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: theme.colors.card,
        borderBottom: `1px solid ${theme.colors.primary}20`,
        boxShadow: theme.shadow
      }}
    >
      <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
        {/* الشعار */}
        <div style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${theme.colors.primary}, #1565C0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          <img 
            src="/medical-logo.webp" 
            alt="شعار المركز الطبي"
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
              filter: "brightness(0) invert(1)" // جعل الشعار أبيض
            }}
          />
        </div>
        
        {/* معلومات المركز */}
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: "18px",
            color: theme.colors.text,
            fontFamily: theme.fonts.ar
          }}>
            المركز الطبي التخصصي العسكري – العطار
          </div>
          <div style={{
            fontSize: 14,
            opacity: 0.8,
            color: theme.colors.text,
            fontFamily: theme.fonts.ar
          }}>
            قسم اللجنة الطبية العسكرية
          </div>
          <div style={{
            fontSize: 12,
            opacity: 0.6,
            color: theme.colors.primary,
            fontFamily: theme.fonts.ar,
            marginTop: 2
          }}>
            الخدمات الطبية
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div style={{
        textAlign: "right",
        fontSize: 12,
        color: theme.colors.text,
        opacity: 0.7
      }}>
        <div>نظام إدارة المراجعين</div>
        <div>{new Date().toLocaleDateString('ar-SA')}</div>
      </div>
    </header>
  );
}

