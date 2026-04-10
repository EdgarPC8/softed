import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  alpha,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  LocalHospital,
  People,
  Assignment,
  MedicalInformation,
  Business,
  AddCircle,
  Group,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStatsPublic } from "../../api/enfermeriaRequest";
import { activeApp } from "../../../appConfig.js";

const gradientBg =
  "linear-gradient(135deg, #0D47A1 0%, #1565C0 35%, #1976D2 70%, #42A5F5 100%)";

export default function EnfermeriaHome() {
  const navigate = useNavigate();
  const { isAuthenticated, toast } = useAuth();
  const [stats, setStats] = useState({
    pacientes: 0,
    totalFichas: 0,
    instituciones: 0,
    usuarios: 0,
    cie10: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getStatsPublic();
        const d = res?.data || {};
        setStats({
          pacientes: Number(d.pacientes) || 0,
          totalFichas: Number(d.totalFichas) || 0,
          instituciones: Number(d.instituciones) || 0,
          usuarios: Number(d.usuarios) || 0,
          cie10: Number(d.cie10) || 0,
        });
      } catch (e) {
        setError(e?.message || "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAccess = (path) => {
    if (!isAuthenticated) {
      toast?.({ message: "Debe iniciar sesión primero para acceder", variant: "warning" });
      return;
    }
    navigate(path);
  };

  const cardSx = (iconColor = "#fff") => ({
    bgcolor: alpha("#fff", 0.12),
    backdropFilter: "blur(12px)",
    border: `1px solid ${alpha("#fff", 0.2)}`,
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      bgcolor: alpha("#fff", 0.18),
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    },
  });

  // Dimensiones fijas responsivas para cards (mismo tamaño en cada breakpoint)
  const statCardSizes = {
    minHeight: { xs: 140, sm: 150, md: 160, lg: 170 },
    width: "100%",
  };
  const accesoCardSizes = {
    minHeight: { xs: 100, sm: 110, md: 120 },
    height: "100%",
    width: "100%",
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "#fff", onClick }) => {
    const content = (
      <CardContent
        sx={{
          textAlign: "center",
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          boxSizing: "border-box",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1, flexShrink: 0 }}>
          <Icon sx={{ fontSize: 44, color }} />
        </Box>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5, flexShrink: 0 }}>
          {loading ? <Skeleton width={48} height={40} sx={{ mx: "auto", bgcolor: alpha("#fff", 0.3) }} /> : value}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600, flexShrink: 0 }} noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: alpha("#fff", 0.85), flexShrink: 0 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    );
    const wrapper = onClick ? (
      <CardActionArea onClick={onClick} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%", minHeight: 0 }}>
        {content}
      </CardActionArea>
    ) : (
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>{content}</Box>
    );
    return (
      <Card sx={{ ...cardSx(color), ...statCardSizes, display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        {wrapper}
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: gradientBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: alpha("#fff", 0.15),
              backdropFilter: "blur(12px)",
              mb: 2,
            }}
          >
            <LocalHospital sx={{ fontSize: 48, color: "#fff" }} />
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
              mb: 1,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {activeApp?.name || "Sistema Clínico"}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: alpha("#fff", 0.9), maxWidth: 480, mx: "auto" }}
          >
            Gestión de fichas médicas, pacientes e instituciones para el área clínica.
          </Typography>
        </Box>

        {/* Cuadros de información */}
        <Typography variant="h6" sx={{ color: alpha("#fff", 0.95), mb: 2, fontWeight: 600, textAlign: "center" }}>
          Resumen del sistema
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4, justifyContent: "center", alignItems: "stretch" }}>
          <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: "flex", minWidth: 0 }}>
            <StatCard
              icon={People}
              title="Pacientes"
              value={stats.pacientes}
              subtitle="Registrados"
              onClick={() => handleAccess("/pacientes")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: "flex", minWidth: 0 }}>
            <StatCard
              icon={Assignment}
              title="Fichas totales"
              value={stats.totalFichas}
              subtitle="Consultas"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: "flex", minWidth: 0 }}>
            <StatCard
              icon={Business}
              title="Instituciones"
              value={stats.instituciones}
              subtitle="Configuradas"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: "flex", minWidth: 0 }}>
            <StatCard
              icon={MedicalInformation}
              title="CIE-10"
              value={stats.cie10}
              subtitle="Catálogo de diagnósticos"
              onClick={() => handleAccess("/cie10")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: "flex", minWidth: 0 }}>
            <StatCard
              icon={Group}
              title="Usuarios"
              value={stats.usuarios}
              subtitle="En el sistema"
              onClick={() => handleAccess("/cuentas")}
            />
          </Grid>
        </Grid>

        {/* Accesos rápidos */}
        <Typography variant="h6" sx={{ color: alpha("#fff", 0.95), mb: 2, fontWeight: 600, textAlign: "center" }}>
          Accesos rápidos
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", minWidth: 0 }}>
            <Card sx={{ ...cardSx(), ...accesoCardSizes, display: "flex", flex: 1, minWidth: 0 }}>
              <CardActionArea onClick={() => handleAccess("/pacientes")} sx={{ flex: 1, display: "flex", py: 2, height: "100%" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", flex: 1 }}>
                  <People sx={{ fontSize: 40, color: "#fff" }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }} noWrap>
                      Pacientes
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#fff", 0.85) }}>
                      Listado y búsqueda de pacientes
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", minWidth: 0 }}>
            <Card sx={{ ...cardSx(), ...accesoCardSizes, display: "flex", flex: 1, minWidth: 0 }}>
              <CardActionArea onClick={() => handleAccess("/ficha/anadir")} sx={{ flex: 1, display: "flex", py: 2, height: "100%" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", flex: 1 }}>
                  <AddCircle sx={{ fontSize: 40, color: "#fff" }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }} noWrap>
                      Nueva ficha
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#fff", 0.85) }}>
                      Crear nueva ficha médica
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", minWidth: 0 }}>
            <Card sx={{ ...cardSx(), ...accesoCardSizes, display: "flex", flex: 1, minWidth: 0 }}>
              <CardActionArea onClick={() => handleAccess("/cie10")} sx={{ flex: 1, display: "flex", py: 2, height: "100%" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", flex: 1 }}>
                  <MedicalInformation sx={{ fontSize: 40, color: "#fff" }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }} noWrap>
                      CIE-10
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#fff", 0.85) }}>
                      Buscar diagnósticos y códigos
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", minWidth: 0 }}>
            <Card sx={{ ...cardSx(), ...accesoCardSizes, display: "flex", flex: 1, minWidth: 0 }}>
              <CardActionArea onClick={() => handleAccess("/cuentas")} sx={{ flex: 1, display: "flex", py: 2, height: "100%" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", flex: 1 }}>
                  <Group sx={{ fontSize: 40, color: "#fff" }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }} noWrap>
                      Usuarios
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#fff", 0.85) }}>
                      Cuentas y roles del sistema
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        {/* Pie de página: año y autor */}
        <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${alpha("#fff", 0.2)}`, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: alpha("#fff", 0.75) }}>
            © {activeApp?.year ?? new Date().getFullYear()} — {activeApp?.author ?? "SoftEd"}
          </Typography>
        </Box>

        {error && (
          <Typography variant="body2" sx={{ color: "#ffcdd2", textAlign: "center", mt: 2 }}>
            {error}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
