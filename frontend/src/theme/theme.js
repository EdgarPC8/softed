import { createTheme } from "@mui/material";
// const theme = createTheme({
//   palette: {
//       mode: "light", // o "dark"
//       background: {
//         default: "#000",     // Fondo de toda la app
//         paper: "#ffffff",       // Fondo de elementos como Card o Paper
//       },
      
//     primary: {
//       light: "#6084a9",
//       main: "#4a6682",
//       dark: "#2C3E50",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#ffe88a",
//       main: "#F1C40F",
//       dark: "#e1b711",
//       contrastText: "#000",
//     },
//     colors: {
//       red: "#FF6F61",      // Coral Red
//       green: "#2ECC71",    // Emerald
//       orange: "#FF8C42",   // Bright Orange
//       blue: "#3498DB",     // Sky Blue
//       purple: "#9B59B6",   // Amethyst
//       yellow: "#F1C40F",   // Sunflower Yellow
//       pink: "#FF3D67",     // Hot Pink
//       teal: "#1ABC9C",     // Turquoise
//       gold: "#FFD700",     // Gold
//       lavender: "#E6E6FA", // Lavender
//       cyan: "#00BCD4",     // Bright Cyan
//       gray: "#eeeeee",     // Bright Cyan
//     },
//     text: {
//       primary: "#2C3E50",     // Dark Blue (para textos principales)
//       secondary: "#34495E",   // Grayish Blue (para textos secundarios)
//       accent: "#FFFFFF",       // Blanco (para textos sobre fondos oscuros)
//       muted: "#95A5A6",        // Gray (para textos menos importantes o deshabilitados)
//       success: "#2ECC71",     // Emerald (para mensajes de éxito)
//       warning: "#FF8C42",     // Bright Orange (para advertencias)
//       error: "#E74C3C",       // Red (para mensajes de error)
//       link: "#3498DB",        // Sky Blue (para enlaces)
//     }
    
    
//   },
// });

// export default theme;

// theme.js

const theme = createTheme({
  palette: {
    mode: "light",
    // background: {
    //   default: "#0d0c1d",
    //   paper: "#1a1a2e",
    // },
    //     background: {
    //   default: "#fff",
    //   paper: "#4a6682",
    // },
        primary: {
      light: "#6084a9",
      main: "#4a6682",
      dark: "#2C3E50",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffe88a",
      main: "#F1C40F",
      dark: "#e1b711",
      contrastText: "#000",
    },
      colors: {
      red: "#FF6F61",      // Coral Red
      green: "#2ECC71",    // Emerald
      orange: "#FF8C42",   // Bright Orange
      blue: "#3498DB",     // Sky Blue
      purple: "#9B59B6",   // Amethyst
      yellow: "#F1C40F",   // Sunflower Yellow
      pink: "#FF3D67",     // Hot Pink
      teal: "#1ABC9C",     // Turquoise
      gold: "#FFD700",     // Gold
      lavender: "#E6E6FA", // Lavender
      cyan: "#00BCD4",     // Bright Cyan
      gray: "#eeeeee",     // Bright Cyan
    },
  },
  
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: {
  //       body: {
  //         background: "linear-gradient(180deg, #0f0c29, #302b63, #24243e)",
  //         color: "#ffffff",
  //         minHeight: "100vh",
  //         margin: 0,
  //         padding: 0,
  //         fontFamily: "'Roboto', sans-serif",
  //       },
  //     },
  //   },
  // },
});

export default theme;
