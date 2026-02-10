import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const formatNumber = (n) => n?.toLocaleString("es-EC") ?? "0";

/** Paleta compartida: mismo índice = mismo color en el pie y en la tabla */
const CHART_COLORS = [
  "#1976d2", "#ed6c02", "#d32f2f", "#0288d1", "#388e3c", "#7b1fa2", "#00796b", "#5d4037", "#455a64", "#c2185b",
];

const emptyData = {
  title: "ALUMNI EN CIFRAS",
  subtitle: "Títulos emitidos",
  source: "Sistema de Gestión de Títulos",
  cutOffDate: new Date().toISOString().slice(0, 10),
  total: 0,
  masculino: 0,
  femenino: 0,
  byCareer: [],
};

export default function AlumniEnCifras({ data: dataProp, getStats }) {
  const theme = useTheme();
  const [data, setData] = useState(dataProp ?? emptyData);
  const [loading, setLoading] = useState(!!getStats);
  const [error, setError] = useState(null);

  const headerBg = theme.palette.primary.main;
  const totalCardBg = theme.palette.error.main;
  const genderCardBg = theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[600];
  const sectionTitleColor = theme.palette.error.main;
  const contentBg = theme.palette.background.paper;
  const tableHeaderBg = theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200];

  useEffect(() => {
    if (dataProp) {
      setData(dataProp);
      setError(null);
      return;
    }
    if (getStats && typeof getStats === "function") {
      setLoading(true);
      setError(null);
      getStats()
        .then((res) => {
          if (res?.data) setData(res.data);
        })
        .catch((err) => {
          setError(err?.response?.data?.message || "Error al cargar estadísticas");
          setData(emptyData);
        })
        .finally(() => setLoading(false));
    }
  }, [dataProp, getStats]);

  const { title, subtitle, source, cutOffDate, total, masculino, femenino, byCareer = [] } = data;
  // Solo id y value: el pie muestra colores y porcentaje; las carreras van solo en la tabla
  const pieData = byCareer.map((row, i) => ({ id: i, value: row.total }));
  const totalFromCareer = byCareer.reduce((s, r) => s + r.total, 0);

  return (
    <Box sx={{ mt: 4 }}>
      {/* Encabezado: usa primary del tema */}
      <Box
        sx={{
          bgcolor: headerBg,
          color: theme.palette.primary.contrastText,
          py: 3,
          px: { xs: 2, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: 1 }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.95 }}>
          {subtitle}
        </Typography>
      </Box>

      {/* Contenido: fondo según tema, centrado y contenido */}
      <Box sx={{ bgcolor: contentBg, px: { xs: 2, md: 4 }, py: 3 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Universidad Nacional de Loja
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              Fuente: {source} · Fecha de corte: {cutOffDate}
            </Typography>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* Cajas de resumen: colores del tema */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: totalCardBg,
                color: theme.palette.error.contrastText,
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.9 }}>
                TOTAL
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {loading ? "—" : formatNumber(total)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: genderCardBg,
                color: "white",
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.9 }}>
                MASCULINO
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {loading ? "—" : formatNumber(masculino)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: genderCardBg,
                color: "white",
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.9 }}>
                FEMENINO
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {loading ? "—" : formatNumber(femenino)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Títulos por carrera */}
        <Typography variant="h6" sx={{ color: sectionTitleColor, fontWeight: 600, mb: 2 }}>
          Títulos emitidos por carrera
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} direction="row">
            {/* Izquierda: pie chart con porcentaje y color por carrera */}
            <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 1 }, display: "flex", justifyContent: "center" }}>
              {pieData.length > 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minHeight: 320,
                    width: "100%",
                    maxWidth: 380,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <Box sx={{ width: 340, height: 300, flexShrink: 0, overflow: "hidden" }}>
                    <PieChart
                      colors={CHART_COLORS}
                      series={[
                        {
                          data: pieData,
                          arcLabel: (item) => {
                            const pct = totalFromCareer ? ((item.value / totalFromCareer) * 100).toFixed(1) : 0;
                            return `${pct}%`;
                          },
                          arcLabelMinAngle: 20,
                          arcLabelRadius: "65%",
                          valueFormatter: (v) =>
                            `${totalFromCareer ? ((v.value / totalFromCareer) * 100).toFixed(1) : 0}%`,
                        },
                      ]}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: { fontWeight: "bold", fill: theme.palette.text.primary },
                        "& .MuiChartsLegend-root": { display: "none" },
                        "& .MuiChartsLegend-root text": { display: "none" },
                      }}
                      width={340}
                      height={300}
                    />
                  </Box>
                </Paper>
              ) : (
                <Typography color="text.secondary">No hay datos para mostrar el gráfico.</Typography>
              )}
            </Grid>
            {/* Derecha: tabla de carreras con color de referencia */}
            <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 2 } }}>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: tableHeaderBg }}>
                      <TableCell><strong>CARRERA</strong></TableCell>
                      <TableCell align="right"><strong>MASCULINO</strong></TableCell>
                      <TableCell align="right"><strong>FEMENINO</strong></TableCell>
                      <TableCell align="right"><strong>TOTAL</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {byCareer.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: CHART_COLORS[i % CHART_COLORS.length],
                                flexShrink: 0,
                              }}
                            />
                            <span>{row.carrera ?? row.facultad}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatNumber(row.masculino)}</TableCell>
                        <TableCell align="right">{formatNumber(row.femenino)}</TableCell>
                        <TableCell align="right">{formatNumber(row.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: tableHeaderBg, fontWeight: "bold" }}>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>{formatNumber(masculino)}</strong></TableCell>
                      <TableCell align="right"><strong>{formatNumber(femenino)}</strong></TableCell>
                      <TableCell align="right"><strong>{formatNumber(total)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
        </Box>
      </Box>
    </Box>
  );
}
