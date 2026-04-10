import React from "react";
import { Paper, Typography, Box, alpha } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

/**
 * Tarjeta de bienvenida reutilizable en el home de la app Música.
 */
export default function MusicaWelcomeCard({ title = "Música", subtitle }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        maxWidth: 560,
        mx: "auto",
        textAlign: "center",
        borderRadius: 3,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.primary.main, 0.06),
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 72,
          height: 72,
          borderRadius: "50%",
          mb: 2,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
        }}
      >
        <MusicNoteIcon sx={{ fontSize: 40, color: "primary.main" }} />
      </Box>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}
