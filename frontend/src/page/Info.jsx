import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import appsInfo from "../../appConfig";



export default function Info({ app = "eddeli" }) {
  const info = appsInfo[app];

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: info.background,
        mt: -8,
      }}
    >
      <Paper elevation={3} sx={{ maxWidth: 500, p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
       <img
  src={info.logo}
  alt={info.name}
  style={{
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: "50%",      // 👈 lo hace circular
    objectFit: "cover",       // 👈 evita deformación
    border: "3px solid #E2A05B", // 👈 borde dorado opcional (puedes quitarlo)
    boxShadow: "0 0 8px rgba(0,0,0,0.1)", // 👈 sutil sombra
  }}
/>


          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {info.name}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Versión {info.version}
          </Typography>

          <Divider sx={{ my: 2, width: "100%" }} />

          <Typography variant="body1" gutterBottom>
            {info.description}
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={3}>
            © {info.year} {info.author} - Todos los derechos reservados.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
