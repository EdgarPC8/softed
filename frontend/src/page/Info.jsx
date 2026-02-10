import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import appsInfo, { activeAppId } from "../../appConfig";

export default function Info() {
  const info = appsInfo[activeAppId] || appsInfo.softed;

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        mt: -8,
      }}
    >
      <Paper elevation={3} sx={{ maxWidth: 500, p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Box
            component="img"
            src={info.logo}
            alt={info.name}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              borderRadius: "50%",
              objectFit: "cover",
              border: 3,
              borderColor: "primary.main",
              boxShadow: 2,
            }}
          />


          <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
            {info.name}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Versión {info.version}
          </Typography>

          <Divider sx={{ my: 2, width: "100%" }} />

          <Typography variant="body1" gutterBottom color="text.primary">
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
