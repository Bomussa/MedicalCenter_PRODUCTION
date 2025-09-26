/* New file – Global ThemeProvider (4 themes + fonts) – 2025-09-26 */
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { featureFlags } from "../config/featureFlags";

type ThemeKey = "classic" | "navy" | "emerald" | "mono";
type LangKey = "ar" | "en";
type FontPair = { ar: string; en: string };

const THEMES: Record<ThemeKey, any> = {
  classic: {
    name: "classic",
    colors: { bg: "#F6F8FB", card: "#FFFFFF", primary: "#1A3E7A", accent: "#00BFBF", text: "#0F172A" },
  },
  navy: {
    name: "navy",
    colors: { bg: "#0B1220", card: "#0F172A", primary: "#60A5FA", accent: "#34D399", text: "#E5E7EB" },
  },
  emerald: {
    name: "emerald",
    colors: { bg: "#F0FDF4", card: "#FFFFFF", primary: "#065F46", accent: "#10B981", text: "#064E3B" },
  },
  mono: {
    name: "mono",
    colors: { bg: "#FAFAFA", card: "#FFFFFF", primary: "#111827", accent: "#6B7280", text: "#111827" },
  },
};

const FONTS: FontPair[] = [
  { ar: "Cairo, Noto Kufi Arabic, system-ui, sans-serif", en: "Inter, Roboto, Arial, system-ui, sans-serif" },
  { ar: "Noto Sans Arabic, system-ui, sans-serif", en: "Manrope, system-ui, sans-serif" },
  { ar: "Tajawal, system-ui, sans-serif", en: "Poppins, system-ui, sans-serif" },
  { ar: "IBM Plex Sans Arabic, system-ui, sans-serif", en: "IBM Plex Sans, system-ui, sans-serif" }
];

type ThemeContextType = {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  lang: LangKey;
  setLang: (l: LangKey) => void;
  fontPair: FontPair;
  setFontIndex: (i: number) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeKey>("classic");
  const [lang, setLang] = useState<LangKey>("ar");
  const [fontIndex, setFontIndex] = useState(0);

  const fontPair = FONTS[Math.max(0, Math.min(FONTS.length - 1, fontIndex))];

  useEffect(() => {
    const root = document.documentElement;
    const t = THEMES[theme];
    root.style.setProperty("--bg", t.colors.bg);
    root.style.setProperty("--card", t.colors.card);
    root.style.setProperty("--primary", t.colors.primary);
    root.style.setProperty("--accent", t.colors.accent);
    root.style.setProperty("--text", t.colors.text);
    root.style.setProperty("--font-ar", fontPair.ar);
    root.style.setProperty("--font-en", fontPair.en);
    document.body.style.background = t.colors.bg;
    document.body.style.color = t.colors.text;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  }, [theme, lang, fontPair]);

  const value = useMemo(() => ({ theme, setTheme, lang, setLang, fontPair, setFontIndex }), [theme, lang, fontPair]);

  return (
    <ThemeContext.Provider value={value}>
      {/* شريط صغير لتبديل الثيم والخط واللغة (يظهر فقط إن كان مفعلًا) */}
      {featureFlags.themeSwitcher && (
        <div style={{
          position: "fixed", top: 8, insetInlineEnd: 8, zIndex: 9999,
          background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,.08)", borderRadius: 12, padding: 8, display: "flex", gap: 8
        }}>
          <select value={theme} onChange={e => setTheme(e.target.value as ThemeKey)}>
            <option value="classic">Classic</option>
            <option value="navy">Navy</option>
            <option value="emerald">Emerald</option>
            <option value="mono">Mono</option>
          </select>
          {featureFlags.fontsSwitcher && (
            <select value={fontIndex} onChange={e => setFontIndex(parseInt(e.target.value))}>
              <option value={0}>Fonts #1</option>
              <option value={1}>Fonts #2</option>
              <option value={2}>Fonts #3</option>
              <option value={3}>Fonts #4</option>
            </select>
          )}
          <select value={lang} onChange={e => setLang(e.target.value as LangKey)}>
            <option value="ar">AR</option>
            <option value="en">EN</option>
          </select>
        </div>
      )}
      <div style={{ fontFamily: lang === "ar" ? "var(--font-ar)" : "var(--font-en)" }}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeContext missing");
  return ctx;
};

