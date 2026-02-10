// src/theme/ThemeModeProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./getTheme";
import { getTheme as getThemeAlumni } from "./getThemeAlumni";
import { getTheme as getThemeSofted } from "./getThemeSofted";
import { activeAppId } from "../../appConfig.js";

const STORAGE_KEY = "ui-theme-mode"; // 'light' | 'dark' | 'neon' | 'system'

const ThemeModeContext = createContext({
  mode: "light",
  setMode: () => {},
  toggle: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

function getThemeForActiveApp(mode) {
  if (activeAppId === "alumni") return getThemeAlumni(mode);
  if (activeAppId === "softed") return getThemeSofted(mode);
  return getTheme(mode);
}

export function ThemeModeProvider({ children, defaultMode = "system" }) {
  const readInitial = () => {
    const saved = localStorage.getItem(STORAGE_KEY) || defaultMode;
    if (saved === "system") {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return saved;
  };

  const [mode, setMode] = useState(readInitial);

  // Persistir y reaccionar a cambios del sistema si guardaste "system"
  useEffect(() => {
    // Guarda la última elección real (light/dark/neon o system)
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // Sincroniza entre pestañas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) setMode(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Reacciona si el usuario quería "system" (opcional)
  useEffect(() => {
    const mm = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mm) return;
    const handler = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "system") setMode(mm.matches ? "dark" : "light");
    };
    mm.addEventListener?.("change", handler);
    return () => mm.removeEventListener?.("change", handler);
  }, []);

  const theme = useMemo(() => getThemeForActiveApp(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode, // setMode('light' | 'dark' | 'neon' | 'system')
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
