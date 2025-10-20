import { createTheme } from "@mui/material/styles";

const crema100 = "#fff6de";
const crema200 = "#f9e8c7";
const dorado300 = "#f6c445";
const dorado500 = "#ffe7a1";
const marron900 = "#2d1c05";
const fondo900  = "#0b0703";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: dorado300 },
    secondary: { main: dorado500 },
    text: { primary: crema200 },
    background: { default: fondo900, paper: "rgba(255,224,180,.02)" },
    eddeli: { crema100, crema200, dorado300, dorado500, marron900, fondo900 },
  },
  typography: {
    fontFamily: `system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial,sans-serif`,
    h6: { fontWeight: 800, letterSpacing: ".4px", textTransform: "uppercase" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(1200px 700px at 60% 30%, #1a1308 0%, #120d05 40%, #0b0703 100%)",
          minHeight: "100dvh",
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "panel" },
          style: {
            background: "linear-gradient(180deg, rgba(255,224,180,.06), rgba(255,255,255,.02))",
            border: "1px solid rgba(255,224,180,.18)",
            boxShadow: "0 8px 26px rgba(0,0,0,.35)",
          },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "ctrl" },
          style: {
            borderColor: "rgba(255,224,180,.25)",
            color: dorado500,
            background: "rgba(255,224,180,.08)",
            fontWeight: 800,
            textTransform: "none",
          },
        },
      ],
    },
  },
});

export default theme;
