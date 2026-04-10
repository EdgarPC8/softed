import React from "react";
import { Box, Container, Typography, alpha } from "@mui/material";
import MusicaWelcomeCard from "./components/MusicaWelcomeCard.jsx";
import { activeApp } from "../../../appConfig.js";

const defaultGradient =
  "linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #880e4f 100%)";

export default function MusicaHome() {
  const bg = activeApp?.background || defaultGradient;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="overline"
          sx={{
            display: "block",
            textAlign: "center",
            color: alpha("#fff", 0.85),
            letterSpacing: 2,
            mb: 2,
          }}
        >
          {activeApp?.alias || "Música"}
        </Typography>
        <Box sx={{ color: "#fff" }}>
          <MusicaWelcomeCard
            title="Bienvenido"
            subtitle={
              activeApp?.description?.trim() ||
              "Gestión de usuarios, roles, cuentas y notificaciones. Amplía esta pantalla con tus módulos."
            }
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: alpha("#fff", 0.75),
            textAlign: "center",
            mt: 4,
            maxWidth: 420,
            mx: "auto",
          }}
        >
          Usa el menú lateral para acceder a usuarios, cuentas y roles cuando tengas permisos.
        </Typography>
      </Container>
    </Box>
  );
}
