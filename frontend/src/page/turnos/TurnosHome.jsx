import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Spa } from "@mui/icons-material";

const gradientBg = "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";

export default function TurnosHome() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: gradientBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center", py: 6 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: alpha("#fff", 0.2),
            backdropFilter: "blur(12px)",
            mb: 4,
          }}
        >
          <Spa sx={{ fontSize: 56, color: "#fff" }} />
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.2)",
            mb: 2,
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          Turnos - Agendación
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: alpha("#fff", 0.95),
            fontWeight: 500,
            maxWidth: 480,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Sistema de agendación para estética: uñas, pelo, tintes y más.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: alpha("#fff", 0.8),
            mt: 4,
          }}
        >
          Bienvenido al panel de administración
        </Typography>
      </Container>
    </Box>
  );
}
