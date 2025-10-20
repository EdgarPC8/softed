import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeModeProvider } from "./theme/ThemeModeProvider.jsx";
import { activeApp } from "../appConfig.js"; // tu config global de la app

// 🪄 Aplicar branding antes de montar React
(function applyBranding() {
  try {
    // 🏷️ Título de la pestaña
    document.title = activeApp.alias || activeApp.name || "App";

    // 🖼️ Favicon (usa icon > logo > default)
    const link =
      document.querySelector("link[rel='icon']") ||
      (() => {
        const l = document.createElement("link");
        l.setAttribute("rel", "icon");
        document.head.appendChild(l);
        return l;
      })();
    link.setAttribute("href", activeApp.icon || activeApp.logo || "/favicon.ico");

    // 📝 Meta descripción opcional
    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", activeApp.description?.trim() || document.title);
  } catch (e) {
    console.warn("⚠️ Error aplicando branding:", e);
  }
})();

// 🚀 Render principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeModeProvider defaultMode="system">
      <App />
    </ThemeModeProvider>
  </React.StrictMode>
);
