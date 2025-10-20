// src/theme/getTheme.js
import { createTheme } from "@mui/material/styles";

const commonColors = {
  red: "#FF6F61",
  green: "#2ECC71",
  orange: "#FF8C42",
  blue: "#3498DB",
  purple: "#9B59B6",
  yellow: "#F1C40F",
  pink: "#FF3D67",
  teal: "#1ABC9C",
  gold: "#FFD700",
  lavender: "#E6E6FA",
  cyan: "#00BCD4",
  gray: "#eeeeee",
};

export function getTheme(mode = "light") {
  if (mode === "dark") {
    return createTheme({
      palette: {
        mode: "dark",
        background: {
          default: "#0b0f14",
          paper: "#11161d",
        },
        primary: { light: "#6ca0dc", main: "#4a90e2", dark: "#2a5f9e", contrastText: "#fff" },
        secondary: { light: "#ffd86b", main: "#f1c40f", dark: "#b58d00", contrastText: "#000" },
        colors: commonColors,
      },
      shape: { borderRadius: 14 },
      components: {
        MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        MuiButton: {
          styleOverrides: {
            root: { textTransform: "none", borderRadius: 12, fontWeight: 600 },
          },
        },
      },
    });
  }

  if (mode === "neon") {
    // Estilo “Tron”: fondos oscuros, acentos cian/dorado y brillo en botones/cards
    return createTheme({
      palette: {
        mode: "dark",
        background: {
          default: "#05070b",
          paper: "#080b12",
        },
        primary: { light: "#6ee7ff", main: "#19d3ff", dark: "#0aa6cc", contrastText: "#001018" },
        secondary: { light: "#ffeaa3", main: "#ffd166", dark: "#c69b2d", contrastText: "#1a1200" },
        colors: {
          ...commonColors,
          neonCyan: "#19d3ff",
          neonGold: "#ffd166",
          neonViolet: "#8a2be2",
        },
      },
      shape: { borderRadius: 18 },
      shadows: [
        "none",
        "0 0 12px rgba(25,211,255,.25)",
        "0 0 16px rgba(255,209,102,.22)",
        ...Array(22).fill("0 0 18px rgba(25,211,255,.16)"),
      ],
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background:
                "radial-gradient(1200px 600px at 20% -10%, rgba(25,211,255,.10), transparent 60%), radial-gradient(800px 400px at 110% 10%, rgba(255,209,102,.10), transparent 60%), #05070b",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
              border: "1px solid rgba(25,211,255,.18)",
              boxShadow: "0 0 22px rgba(25,211,255,.15)",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 14,
              fontWeight: 700,
              position: "relative",
              boxShadow: "0 0 16px rgba(25,211,255,.35)",
            },
            containedPrimary: {
              background:
                "linear-gradient(90deg, rgba(25,211,255,1) 0%, rgba(255,209,102,1) 100%)",
              color: "#081017",
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              border: "1px solid rgba(25,211,255,.4)",
              boxShadow: "0 0 12px rgba(25,211,255,.25)",
            },
          },
        },
      },
      typography: {
        fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        button: { letterSpacing: "0.02em" },
      },
    });
  }

  // LIGHT por defecto
  return createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#fafafa",
        paper: "#ffffff",
      },
      primary: { light: "#6084a9", main: "#4a6682", dark: "#2C3E50", contrastText: "#fff" },
      secondary: { light: "#ffe88a", main: "#F1C40F", dark: "#e1b711", contrastText: "#000" },
      colors: commonColors,
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 10 } } },
    },
  });
}
