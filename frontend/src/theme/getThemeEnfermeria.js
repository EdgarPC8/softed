// src/theme/getThemeEnfermeria.js - Tema clínico azul para Enfermería
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { getChartsPalette } from "./chartPalette";

const commonColors = {
  red: "#E53935",
  green: "#43A047",
  orange: "#FB8C00",
  blue: "#1976D2",
  purple: "#7B1FA2",
  yellow: "#FDD835",
  pink: "#EC407A",
  teal: "#00897B",
  cyan: "#00ACC1",
  gray: "#eeeeee",
};

/** Paleta clínica azul Enfermería */
const enfermeriaPalette = {
  light: {
    primary: { light: "#5C9EED", main: "#1976D2", dark: "#0D47A1", contrastText: "#fff" },
    secondary: { light: "#B3E5FC", main: "#03A9F4", dark: "#0277BD", contrastText: "#fff" },
  },
  dark: {
    primary: { light: "#42A5F5", main: "#1976D2", dark: "#1565C0", contrastText: "#fff" },
    secondary: { light: "#80DEEA", main: "#00BCD4", dark: "#0097A7", contrastText: "#fff" },
  },
  neon: {
    primary: { light: "#82B1FF", main: "#448AFF", dark: "#2962FF", contrastText: "#fff" },
    secondary: { light: "#84FFFF", main: "#18FFFF", dark: "#00E5FF", contrastText: "#001A1A" },
  },
};

function componentVariants() {
  return {
    MuiPaper: {
      variants: [
        {
          props: { variant: "panel" },
          style: ({ theme }) => {
            const isNeon = theme.palette.customMode === "neon";
            return {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.9)
                  : "rgba(255,255,255,0.85)",
              borderRadius: 12,
              border: isNeon
                ? `1px solid ${alpha(theme.palette.primary.main, 0.35)}`
                : `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
              boxShadow: isNeon
                ? `0 0 18px ${alpha(theme.palette.primary.main, 0.18)}`
                : "0 3px 12px rgba(0,0,0,.08)",
              backdropFilter: theme.palette.mode === "light" || isNeon ? "blur(6px)" : "none",
            };
          },
        },
      ],
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none", borderRadius: 12, fontWeight: 600 } },
      variants: [
        {
          props: { variant: "ctrl" },
          style: ({ theme }) => {
            const isNeon = theme.palette.customMode === "neon";
            const isLight = theme.palette.mode === "light";
            if (isNeon) {
              return {
                borderRadius: 14,
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.primary.contrastText,
                boxShadow: `0 0 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                "&:hover": {
                  filter: "brightness(1.06)",
                  boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.45)}`,
                },
              };
            }
            if (isLight) {
              return {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.9)})`,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  background: `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.95)}, ${theme.palette.primary.main})`,
                },
              };
            }
            return {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            };
          },
        },
      ],
    },
  };
}

export function getTheme(mode = "light") {
  // ============= ENFERMERÍA DARK =============
  if (mode === "dark") {
    const p = enfermeriaPalette.dark;
    return createTheme({
      palette: {
        mode: "dark",
        customMode: "dark",
        background: {
          default: "#0A1929",
          paper: "#0D2137",
        },
        primary: p.primary,
        secondary: p.secondary,
        text: {
          primary: "#E3F2FD",
          secondary: alpha("#E3F2FD", 0.78),
        },
        divider: alpha("#42A5F5", 0.15),
        colors: commonColors,
        charts: getChartsPalette("dark"),
      },
      shape: { borderRadius: 14 },
      typography: {
        fontFamily: `'Inter', 'Poppins', system-ui, sans-serif`,
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        button: { letterSpacing: "0.02em" },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background:
                `radial-gradient(800px 400px at 20% -10%, rgba(25,118,210,.10), transparent 60%),
                 radial-gradient(700px 300px at 110% 10%, rgba(3,169,244,.08), transparent 60%),
                 linear-gradient(180deg, #0D2137 0%, #0A1929 100%)`,
            },
          },
        },
        ...componentVariants(),
      },
    });
  }

  // ============= ENFERMERÍA NEON =============
  if (mode === "neon") {
    const p = enfermeriaPalette.neon;
    return createTheme({
      palette: {
        mode: "dark",
        customMode: "neon",
        background: {
          default: "#050D18",
          paper: "#0A1525",
        },
        primary: p.primary,
        secondary: p.secondary,
        text: {
          primary: "#E3F2FD",
          secondary: alpha("#E3F2FD", 0.85),
        },
        divider: alpha("#448AFF", 0.25),
        colors: { ...commonColors, neonBlue: "#448AFF", neonCyan: "#18FFFF" },
        charts: getChartsPalette("neon"),
      },
      shape: { borderRadius: 18 },
      shadows: [
        "none",
        "0 0 12px rgba(68,138,255,.25)",
        "0 0 16px rgba(24,255,255,.22)",
        ...Array(22).fill("0 0 18px rgba(68,138,255,.18)"),
      ],
      typography: {
        fontFamily: `'Inter', system-ui, sans-serif`,
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
                 #050D18`,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
              border: "1px solid rgba(68,138,255,.22)",
              boxShadow: "0 0 22px rgba(68,138,255,.15)",
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              border: "1px solid rgba(24,255,255,.35)",
              boxShadow: "0 0 12px rgba(24,255,255,.25)",
            },
          },
        },
        ...componentVariants(),
      },
    });
  }

  // ============= ENFERMERÍA LIGHT (clínico) =============
  const p = enfermeriaPalette.light;
  return createTheme({
    palette: {
      mode: "light",
      customMode: "light",
      background: {
        default: "#E8F4FD",
        paper: "rgba(255,255,255,0.92)",
      },
      primary: p.primary,
      secondary: p.secondary,
      text: {
        primary: "#0D47A1",
        secondary: "#1565C0",
      },
      divider: alpha("#1976D2", 0.2),
      colors: commonColors,
      charts: getChartsPalette("light"),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: `'Inter', 'Poppins', sans-serif`,
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: `
              radial-gradient(800px 400px at 20% -10%, rgba(25,118,210,.12), transparent 60%),
              radial-gradient(700px 300px at 110% 10%, rgba(3,169,244,.10), transparent 60%),
              linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)`,
            backgroundAttachment: "fixed",
          },
        },
      },
      ...componentVariants(),
    },
  });
}
