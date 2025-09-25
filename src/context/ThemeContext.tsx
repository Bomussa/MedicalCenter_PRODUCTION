import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import themeMedical from "../themes/theme-medical";
import themeDark from "../themes/theme-dark";
import themeFlat from "../themes/theme-flat";
import themeGradient from "../themes/theme-gradient";

const themes = { themeMedical, themeDark, themeFlat, themeGradient };

type Fonts = { ar: string; en: string };
type Ctx = {
  theme: any;
  setTheme: (name: keyof typeof themes) => void;
  setFonts: (f: Fonts) => void;
};

const ThemeContext = createContext<Ctx>({
  theme: themeMedical,
  setTheme: () => {},
  setFonts: () => {}
});

export const ThemeProvider = ({ children }:{children: React.ReactNode}) => {
  const [current, setCurrent] = useState<keyof typeof themes>("themeMedical");
  const [fonts, setFonts] = useState<Fonts>({ ar: "Cairo", en: "Inter" });

  const theme = useMemo(()=>{
    const base = themes[current];
    return {
      ...base,
      fonts,
      colors: { ...base.colors, onPrimary: "#fff", card: (base.colors as any).card || "#fff" },
      shadow: "0 4px 10px rgba(0,0,0,.08)"
    };
  }, [current, fonts]);

  useEffect(()=>{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.en)}:wght@300;400;600;700&family=${encodeURIComponent(fonts.ar)}:wght@300;400;600;700&display=swap`;
    document.head.appendChild(link);
    return ()=>{ document.head.removeChild(link); };
  }, [fonts]);

  // خلفية ونص عام للتطبيق
  useEffect(()=>{
    document.body.style.background = (theme.colors as any).background || "#fff";
    document.body.style.color = (theme.colors as any).text || "#111";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setCurrent, setFonts }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = ()=> useContext(ThemeContext);

