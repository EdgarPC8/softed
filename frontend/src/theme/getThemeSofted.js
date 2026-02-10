// src/theme/getThemeSofted.js - Tema azul para SoftEd
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

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

/** Paleta azul SoftEd */
const bluePalette = {
  light: {
    primary: { light: "#64B5F6", main: "#1976D2", dark: "#0D47A1", contrastText: "#fff" },
    secondary: { light: "#B3E5FC", main: "#03A9F4", dark: "#0288D1", contrastText: "#000" },
  },
  dark: {
    primary: { light: "#90CAF9", main: "#2196F3", dark: "#1565C0", contrastText: "#fff" },
    secondary: { light: "#81D4FA", main: "#29B6F6", dark: "#0288D1", contrastText: "#000" },
  },
  neon: {
    primary: { light: "#82B1FF", main: "#448AFF", dark: "#2962FF", contrastText: "#fff" },
    secondary: { light: "#84FFFF", main: "#18FFFF", dark: "#00B8D4", contrastText: "#000" },
  },
};

export function getTheme(mode = "light") {
  if (mode === "dark") {
    const p = bluePalette.dark;
    return createTheme({
      palette: {
        mode: "dark",
        customMode: "dark",
        background: {
          default: "#0a1628",
          paper: "#0f1d32",
        },
        primary: p.primary,
        secondary: p.secondary,
        text: {
          primary: "#E3F2FD",
          secondary: alpha("#E3F2FD", 0.78),
        },
        divider: alpha("#2196F3", 0.15),
        colors: commonColors,
      },
      shape: { borderRadius: 14 },
      typography: {
        fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        button: { letterSpacing: "0.02em" },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background:
                `radial-gradient(800px 400px at 20% -10%, rgba(33,150,243,.12), transparent 60%),
                 radial-gradient(700px 300px at 110% 10%, rgba(3,169,244,.08), transparent 60%),
                 linear-gradient(180deg, #0d1b2a 0%, #0a1628 100%)`,
            },
          },
        },
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
    const p = bluePalette.neon;
    return createTheme({
      palette: {
        mode: "dark",
        customMode: "neon",
        background: {
          default: "#060d18",
          paper: "#0a1420",
        },
        primary: p.primary,
        secondary: p.secondary,
        text: {
          primary: "#E1F5FE",
          secondary: alpha("#E1F5FE", 0.85),
        },
        divider: alpha("#18FFFF", 0.25),
        colors: { ...commonColors, neonCyan: "#18FFFF", neonBlue: "#448AFF" },
      },
      shape: { borderRadius: 18 },
      shadows: [
        "none",
        "0 0 12px rgba(68,138,255,.3)",
        "0 0 16px rgba(24,255,255,.25)",
        ...Array(22).fill("0 0 18px rgba(68,138,255,.2)"),
      ],
      typography: {
        fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        button: { letterSpacing: "0.02em" },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background:
                `radial-gradient(1200px 600px at 20% -10%, rgba(68,138,255,.12), transparent 60%),
                 radial-gradient(900px 400px at 110% 10%, rgba(24,255,255,.08), transparent 60%),
                 #060d18`,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
              border: "1px solid rgba(68,138,255,.25)",
              boxShadow: "0 0 22px rgba(68,138,255,.15)",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 14,
              fontWeight: 700,
              boxShadow: "0 0 16px rgba(68,138,255,.35)",
            },
          },
        },
      },
    });
  }

  // LIGHT (default) - tema azul SoftEd
  const p = bluePalette.light;
  return createTheme({
    palette: {
      mode: "light",
      customMode: "light",
      background: {
        default: "#f0f7ff",
        paper: "rgba(255,255,255,0.95)",
      },
      primary: p.primary,
      secondary: p.secondary,
      text: {
        primary: "#0d47a1",
        secondary: "#1565c0",
      },
      divider: alpha("#1976D2", 0.15),
      colors: commonColors,
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background:
              `radial-gradient(800px 400px at 20% -10%, rgba(25,118,210,.08), transparent 60%),
               radial-gradient(700px 300px at 110% 10%, rgba(3,169,244,.06), transparent 60%),
               linear-gradient(180deg, #e3f2fd 0%, #f0f7ff 100%)`,
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", borderRadius: 12, fontWeight: 600 },
        },
      },
    },
  });
}
