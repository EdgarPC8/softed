// src/theme/getThemeTurnos.js - Tema turquesa para Turnos (agendación)
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { getChartsPalette } from "./chartPalette";

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

/** Paleta turquesa Turnos */
const turnosPalette = {
  light: {
    primary: { light: "#5CDBD3", main: "#20B2AA", dark: "#008B8B", contrastText: "#fff" },
    secondary: { light: "#B2DFDB", main: "#4DB6AC", dark: "#00897B", contrastText: "#fff" },
  },
  dark: {
    primary: { light: "#4DD0E1", main: "#00ACC1", dark: "#0097A7", contrastText: "#fff" },
    secondary: { light: "#80CBC4", main: "#26A69A", dark: "#00796B", contrastText: "#fff" },
  },
  neon: {
    primary: { light: "#6FF7F0", main: "#00F5FF", dark: "#00CED1", contrastText: "#001A1A" },
    secondary: { light: "#B2EBF2", main: "#18FFFF", dark: "#00B8D4", contrastText: "#000" },
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
                color: theme.palette.background.default,
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
  // ============= TURNOS DARK =============
  if (mode === "dark") {
    const p = turnosPalette.dark;
    return createTheme({
      palette: {
        mode: "dark",
        customMode: "dark",
        background: {
          default: "#0A1412",
          paper: "#0F1E1B",
        },
        primary: p.primary,
        secondary: p.secondary,
        text: {
          primary: "#E0F2F1",
          secondary: alpha("#E0F2F1", 0.78),
        },
        divider: alpha("#00ACC1", 0.15),
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
                `radial-gradient(800px 400px at 20% -10%, rgba(0,172,193,.10), transparent 60%),
                 radial-gradient(700px 300px at 110% 10%, rgba(38,166,154,.08), transparent 60%),
                 linear-gradient(180deg, #0D1B18 0%, #0A1412 100%)`,
            },
          },
        },
        ...componentVariants(),
      },
    });
  }

  // ============= TURNOS NEON =============
  if (mode === "neon") {
    const p = turnosPalette.neon;
    return createTheme({
      palette: {
        mode: "dark",
        customMode: "neon",
        background: {
          default: "#060D0C",
          paper: "#0A1210",
        },
        primary: p.primary,
        secondary: p.secondary,
        text: {
          primary: "#E0F7FA",
          secondary: alpha("#E0F7FA", 0.85),
        },
        divider: alpha("#00F5FF", 0.25),
        colors: { ...commonColors, neonTeal: "#00F5FF", neonCyan: "#18FFFF" },
        charts: getChartsPalette("neon"),
      },
      shape: { borderRadius: 18 },
      shadows: [
        "none",
        "0 0 12px rgba(0,245,255,.25)",
        "0 0 16px rgba(24,255,255,.22)",
        ...Array(22).fill("0 0 18px rgba(0,245,255,.18)"),
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
                `radial-gradient(1200px 600px at 20% -10%, rgba(0,245,255,.12), transparent 60%),
                 radial-gradient(900px 400px at 110% 10%, rgba(24,255,255,.08), transparent 60%),
                 #060D0C`,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
              border: "1px solid rgba(0,245,255,.22)",
              boxShadow: "0 0 22px rgba(0,245,255,.15)",
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

  // ============= TURNOS LIGHT =============
  const p = turnosPalette.light;
  return createTheme({
    palette: {
      mode: "light",
      customMode: "light",
      background: {
        default: "#F0FAF9",
        paper: "rgba(255,255,255,0.92)",
      },
      primary: p.primary,
      secondary: p.secondary,
      text: {
        primary: "#0D4038",
        secondary: "#2D6A62",
      },
      divider: alpha("#20B2AA", 0.2),
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
              radial-gradient(800px 400px at 20% -10%, rgba(32,178,170,.12), transparent 60%),
              radial-gradient(700px 300px at 110% 10%, rgba(77,182,172,.10), transparent 60%),
              linear-gradient(180deg, #E8F5F4 0%, #B2DFDB 100%)`,
            backgroundAttachment: "fixed",
          },
        },
      },
      ...componentVariants(),
    },
  });
}
