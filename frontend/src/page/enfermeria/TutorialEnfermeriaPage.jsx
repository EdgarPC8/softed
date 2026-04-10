import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  alpha,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import {
  LocalHospital,
  MedicalServices,
  School,
  PersonSearch,
  AdminPanelSettings,
  People,
  Assignment,
  MedicalInformation,
  Business,
  AccountTree,
  List as ListIcon,
  Block as BlockIcon,
  ArrowForward,
  CheckCircle,
  Add,
  Description,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";
import { activeApp } from "../../../appConfig.js";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const gradientBg =
  "linear-gradient(135deg, #0D47A1 0%, #1565C0 35%, #1976D2 70%, #42A5F5 100%)";

// Orden jerárquico: Admin → Doctor → Enfermero → Pasante
const roles = [
  {
    id: "admin",
    title: "Administrador",
    icon: AdminPanelSettings,
    color: "#AB47BC",
    description:
      "Gestiona el sistema: usuarios, roles, instituciones, logs y configuraciones. Por ética no puede ver el contenido de las fichas médicas de los pacientes, pero sí la estructura para indicarla y enseñar cómo funciona.",
    accesses: [
      { icon: People, text: "Pacientes — Ver listado, buscar, editar y gestionar pacientes" },
      { icon: Assignment, text: "Estructura de ficha — Ver la estructura para indicarla y enseñar su funcionamiento (sin ver datos clínicos)" },
      { icon: Business, text: "Instituciones — Configurar y mantener instituciones de salud" },
      { icon: MedicalInformation, text: "CIE-10 — Acceso al catálogo de diagnósticos" },
      { icon: AccountTree, text: "Entidades — Usuarios, cuentas y roles del sistema" },
      { icon: ListIcon, text: "Logs — Revisar actividad y auditoría del sistema" },
    ],
  },
  {
    id: "doctor",
    title: "Doctor/a",
    icon: PersonSearch,
    color: "#FFA726",
    description:
      "Médico con acceso completo a datos clínicos: pacientes, fichas médicas, historial clínico y estadísticas. Puede ver todo el contenido clínico pero no tiene acceso a usuarios, roles ni cuentas del sistema.",
    accesses: [
      { icon: People, text: "Pacientes — Ver listado, buscar, editar y gestionar pacientes" },
      { icon: Assignment, text: "Fichas médicas — Crear, ver contenido completo, estadísticas e historial clínico" },
      { icon: MedicalInformation, text: "CIE-10 — Buscar y aplicar diagnósticos en las fichas" },
      { icon: null, text: "No tiene acceso a: Usuarios, roles, cuentas del sistema" },
    ],
  },
  {
    id: "enfermero",
    title: "Enfermero/a",
    icon: MedicalServices,
    color: "#42A5F5",
    description:
      "Profesional de enfermería que realiza atención directa al paciente, registra datos y colabora en el flujo clínico. Por ética, no puede ver el contenido de las fichas médicas ni los historiales clínicos, pero puede indicar la estructura y crear fichas.",
    accesses: [
      { icon: People, text: "Pacientes — Ver listado, buscar, editar y gestionar pacientes" },
      { icon: Assignment, text: "Estructura de ficha — Conocer la estructura para indicarla y enseñar su funcionamiento" },
      { icon: Assignment, text: "Añadir ficha — Crear nuevas fichas (sin ver el contenido de fichas existentes)" },
      { icon: MedicalInformation, text: "CIE-10 — Buscar diagnósticos y códigos" },
      { icon: null, text: "No tiene acceso a: Usuarios, roles, cuentas, estadísticas ni historial clínico" },
    ],
  },
  {
    id: "pasante",
    title: "Pasante",
    icon: School,
    color: "#66BB6A",
    description:
      "Estudiante o profesional en prácticas con tareas supervisadas. Puede ver y editar pacientes y crear fichas, pero por ética no puede ver el contenido de las fichas médicas ni los historiales clínicos.",
    accesses: [
      { icon: People, text: "Pacientes — Ver listado, buscar, editar y gestionar pacientes" },
      { icon: Assignment, text: "Estructura de ficha — Conocer la estructura para indicarla" },
      { icon: Assignment, text: "Añadir ficha — Crear nuevas fichas (sin ver el contenido de fichas existentes)" },
      { icon: MedicalInformation, text: "CIE-10 — Buscar diagnósticos y códigos" },
      { icon: null, text: "No tiene acceso a: Usuarios, roles, cuentas, estadísticas ni historial clínico" },
    ],
  },
];

const FLOW_LINKS = [
  { label: "Pacientes", path: "/pacientes", icon: People },
  { label: "Agregar paciente", path: "/pacientes", icon: Add },
  { label: "Nueva ficha", path: "/ficha/anadir", icon: Assignment },
  { label: "Estructura de ficha", path: "/ficha/estructura", icon: Description },
  { label: "CIE-10", path: "/cie10", icon: MedicalInformation },
];

export default function TutorialEnfermeriaPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [pendingLabel, setPendingLabel] = useState("");

  const handleNavClick = (path, label) => {
    setPendingNav(path);
    setPendingLabel(label);
    setDialogOpen(true);
  };

  const handleConfirmNav = () => {
    if (pendingNav) navigate(pendingNav);
    setDialogOpen(false);
    setPendingNav(null);
    setPendingLabel("");
  };

  const handleStay = () => {
    setDialogOpen(false);
    setPendingNav(null);
    setPendingLabel("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: gradientBg,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: alpha("#fff", 0.15),
              backdropFilter: "blur(12px)",
              mb: 2,
            }}
          >
            <LocalHospital sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Tutorial del sistema
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: alpha("#fff", 0.9), maxWidth: 560, mx: "auto" }}
          >
            Conozca las funciones y el flujo de trabajo según el rol de cada usuario en el Sistema Clínico de Enfermería.
          </Typography>
        </Box>

        {/* Sección: Tutorial - Flujo de funcionamiento (pirámide) */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ color: "#fff", fontWeight: 700, mb: 3, textAlign: "center" }}
          >
            Flujo de funcionamiento
          </Typography>
          <Card
            sx={{
              bgcolor: alpha("#fff", 0.12),
              backdropFilter: "blur(12px)",
              border: `1px solid ${alpha("#fff", 0.2)}`,
              borderRadius: 2,
              p: 4,
            }}
          >
            {/* Nivel 1: Enfermero / Pasante */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: `${fadeInUp} 0.5s ease-out`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  mb: 2,
                  animation: `${pulse} 2s ease-in-out infinite`,
                }}
              >
                <MedicalServices sx={{ color: "#42A5F5", fontSize: 36 }} />
                <School sx={{ color: "#66BB6A", fontSize: 36 }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                    Enfermero/a y Pasante
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha("#fff", 0.9) }}>
                    Crean la ficha, llenan signos vitales, reporte de ingreso/egreso y datos del paciente
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
                <Chip label="Ficha" sx={{ bgcolor: alpha("#42A5F5", 0.3), color: "#fff" }} size="small" />
                <Chip label="Signos vitales" sx={{ bgcolor: alpha("#42A5F5", 0.3), color: "#fff" }} size="small" />
                <Chip label="Reporte ingreso/egreso" sx={{ bgcolor: alpha("#42A5F5", 0.3), color: "#fff" }} size="small" />
                <Chip label="Datos del paciente" sx={{ bgcolor: alpha("#42A5F5", 0.3), color: "#fff" }} size="small" />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <ArrowForward sx={{ color: alpha("#fff", 0.8), fontSize: 36, transform: { xs: "rotate(90deg)", md: "none" } }} />
            </Box>

            {/* Nivel 2: Doctor analiza y completa */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: `${fadeInUp} 0.5s ease-out 0.2s both`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center", mb: 2 }}>
                <PersonSearch sx={{ color: "#FFA726", fontSize: 36 }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                    Doctor/a analiza y completa
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha("#fff", 0.9) }}>
                    Si es mujer: antecedentes gineco-obstétricos. Diagnósticos CIE-10, evolución, plan de tratamiento, examen físico
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
                <Chip label="Gineco (si mujer)" sx={{ bgcolor: alpha("#FFA726", 0.3), color: "#fff" }} size="small" />
                <Chip label="Diagnósticos CIE-10" sx={{ bgcolor: alpha("#FFA726", 0.3), color: "#fff" }} size="small" />
                <Chip label="Evolución" sx={{ bgcolor: alpha("#FFA726", 0.3), color: "#fff" }} size="small" />
                <Chip label="Plan tratamiento" sx={{ bgcolor: alpha("#FFA726", 0.3), color: "#fff" }} size="small" />
                <Chip label="Examen físico" sx={{ bgcolor: alpha("#FFA726", 0.3), color: "#fff" }} size="small" />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <ArrowForward sx={{ color: alpha("#fff", 0.8), fontSize: 36, transform: { xs: "rotate(90deg)", md: "none" } }} />
            </Box>

            {/* Nivel 3: Finalización */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                animation: `${fadeInUp} 0.5s ease-out 0.4s both`,
              }}
            >
              <CheckCircle sx={{ color: "#66BB6A", fontSize: 32 }} />
              <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700 }}>
                Envía y finaliza el llenado de la ficha
              </Typography>
            </Box>

            {/* Botones de navegación */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${alpha("#fff", 0.2)}`,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                animation: `${fadeInUp} 0.5s ease-out 0.6s both`,
              }}
            >
              {FLOW_LINKS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={i}
                    variant="outlined"
                    startIcon={<Icon />}
                    onClick={() => handleNavClick(item.path, item.label)}
                    sx={{
                      borderColor: alpha("#fff", 0.5),
                      color: "#fff",
                      "&:hover": {
                        borderColor: "#fff",
                        bgcolor: alpha("#fff", 0.1),
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Card>
        </Box>

        {/* Diálogo de confirmación */}
        <Dialog open={dialogOpen} onClose={handleStay} maxWidth="sm" fullWidth>
          <DialogTitle>¿Ir al módulo o seguir viendo?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Desea ir a {pendingLabel} o continuar viendo el tutorial?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleStay} color="inherit">
              Seguir viendo tutorial
            </Button>
            <Button onClick={handleConfirmNav} variant="contained" autoFocus>
              Ir a {pendingLabel}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Sección: Información de los roles */}
        <Typography
          variant="h5"
          sx={{ color: "#fff", fontWeight: 700, mb: 3, textAlign: "center" }}
        >
          Información de los roles
        </Typography>
        <Grid container spacing={3}>
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Grid item xs={12} md={6} key={role.id}>
                <Card
                  sx={{
                    bgcolor: alpha("#fff", 0.12),
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${alpha("#fff", 0.2)}`,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          bgcolor: alpha(role.color, 0.3),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: role.color }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                          {role.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha("#fff", 0.9), mb: 2, lineHeight: 1.6 }}
                    >
                      {role.description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: alpha("#fff", 0.85), fontWeight: 600, mb: 1 }}
                    >
                      Accesos y funciones:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, color: alpha("#fff", 0.85) }}>
                      {role.accesses.map((acc, i) => {
                        const AccIcon = acc.icon || BlockIcon;
                        return (
                          <Box
                            component="li"
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                              mb: 0.75,
                              fontSize: "0.875rem",
                              ...(acc.icon === null && { "& svg": { color: "#f44336" } }),
                            }}
                          >
                            <AccIcon sx={{ fontSize: 18, color: acc.icon ? role.color : "#f44336", mt: 0.25, flexShrink: 0 }} />
                            <span>{acc.text}</span>
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Pie de página */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: `1px solid ${alpha("#fff", 0.2)}`,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: alpha("#fff", 0.75) }}>
            © {activeApp?.year ?? new Date().getFullYear()} — {activeApp?.author ?? "SoftEd"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
