import { Container, Box, Typography, Paper } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function FichaEstadisticasPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <BarChartIcon color="primary" />
        <Typography variant="h5">Estadísticas de fichas médicas</Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Módulo en desarrollo. Aquí se mostrarán las estadísticas de fichas médicas.
        </Typography>
      </Paper>
    </Container>
  );
}
