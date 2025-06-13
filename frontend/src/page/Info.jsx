import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

export default function Info() {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        mt:-8
      }}
    >
      <Paper elevation={3} sx={{ maxWidth: 500, p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <img
            src="/android-chrome-512x512.png"
            alt="Logo SoftEd"
            style={{ width: 100, height: 100, marginBottom: 16 }}
          />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            SoftEd Sistema Alumni
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Versión 1.2.0
          </Typography>

          <Divider sx={{ my: 2, width: "100%" }} />

          <Typography variant="body1" gutterBottom>
            Este sistema ha sido desarrollado para la gestión de usuarios, encuestas y currículums
            de egresados y graduados. Permite administrar roles, acceder a estadísticas y manejar
            información educativa de manera eficiente y segura.
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={3}>
            © {new Date().getFullYear()} SoftEd - Todos los derechos reservados.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
