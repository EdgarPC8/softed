import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  alpha,
  useTheme,
} from "@mui/material";
import { Spa, Search } from "@mui/icons-material";
import { consultarTurnoPorTelefono } from "../../api/turnosRequest";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const gradientBgLight = "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";
const gradientBgDark = "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";

export default function TurnosHomeLogout() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const gradientBg = isDark ? gradientBgDark : gradientBgLight;

  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleConsultar = async () => {
    if (!telefono?.trim()) {
      setError("Ingrese su número de teléfono");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await consultarTurnoPorTelefono(telefono.trim());
      setResult(data);
    } catch (e) {
      setError(e?.response?.data?.message || "No encontramos turnos con ese teléfono");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        background: gradientBg,
        py: 6,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: isDark ? alpha(theme.palette.background.paper, 0.95) : alpha("#fff", 0.95),
            color: theme.palette.text.primary,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Spa sx={{ fontSize: 36, color: isDark ? theme.palette.primary.main : "#667eea" }} />
            <Typography variant="h5" fontWeight={700}>
              Consultar mi turno
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ingrese su número de teléfono para ver sus turnos programados.
          </Typography>
          <TextField
            fullWidth
            label="Teléfono"
            placeholder="Ej: 0991234567"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            sx={{ mb: 2 }}
            onKeyDown={(e) => e.key === "Enter" && handleConsultar()}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Search />}
            onClick={handleConsultar}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Buscando..." : "Consultar"}
          </Button>

          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && result.turnos?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Hola, {result.cliente?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tus turnos próximos:
              </Typography>
              <List disablePadding>
                {result.turnos.map((t) => (
                  <ListItem
                    key={t.id}
                    sx={{
                      bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : alpha("#667eea", 0.08),
                      borderRadius: 2,
                      mb: 1,
                      border: `1px solid ${isDark ? alpha(theme.palette.primary.main, 0.3) : alpha("#667eea", 0.2)}`,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>
                          {t.servicio?.nombre} — {format(new Date(t.fechaHora), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                        </Typography>
                      }
                      secondary={
                        t.empleado?.user
                          ? `Con ${t.empleado.user.firstName} ${t.empleado.user.firstLastName}`
                          : null
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {result && result.turnos?.length === 0 && !error && (
            <Alert severity="info">
              No tienes turnos programados con este teléfono.
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
