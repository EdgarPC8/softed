import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BakeryDining as EdDeliIcon,
  School as AlumniIcon,
  Piano as PianoIcon,
  Storage as InventoryIcon,
  AssignmentInd as FormsIcon,
  Code as CodeIcon,
  ArrowForwardRounded,
} from "@mui/icons-material";

const MODULES = [
  {
    title: "EdDeli",
    subtitle: "Panadería & Pastelería",
    description: "Gestión de inventario, pedidos, finanzas y puntos de venta.",
    icon: EdDeliIcon,
    to: "/backery",
    color: "#E2A05B",
  },
  {
    title: "Alumni",
    subtitle: "Egresados & CV",
    description: "Hojas de vida, plantillas y gestión de egresados.",
    icon: AlumniIcon,
    to: "/cv",
    color: "#4a90e2",
  },
  {
    title: "Piano",
    subtitle: "Synthesia",
    description: "Aprende a tocar piano con notas cayendo en tiempo real.",
    icon: PianoIcon,
    to: "/piano",
    color: "#9C27B0",
  },
  {
    title: "PianoPro",
    subtitle: "Piano avanzado",
    description: "Versión Pro del piano, pensada para escalar tipo FL Studio / Synthesia.",
    icon: PianoIcon,
    to: "/pianoPro",
    color: "#AB47BC",
  },
  {
    title: "Inventory",
    subtitle: "Control total",
    description: "Finanzas, producción, movimientos y productos.",
    icon: InventoryIcon,
    to: "/inventory/orders",
    color: "#00BCD4",
  },
  {
    title: "Encuestas",
    subtitle: "Forms",
    description: "Crear, asignar y analizar encuestas y cuestionarios.",
    icon: FormsIcon,
    to: "/forms",
    color: "#4CAF50",
  },
  {
    title: "Panel",
    subtitle: "Control & Logs",
    description: "Comandos, tokens, componentes y logs del sistema.",
    icon: CodeIcon,
    to: "/panel_control",
    color: "#607D8B",
  },
];

function ModuleCard({ module }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const Icon = module.icon;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        background: theme.palette.mode === "dark"
          ? alpha(theme.palette.background.paper, 0.6)
          : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 40px ${alpha(module.color || theme.palette.primary.main, 0.2)}`,
          borderColor: alpha(module.color || theme.palette.primary.main, 0.35),
          "& .module-icon": {
            transform: "scale(1.08)",
            color: module.color || theme.palette.primary.main,
          },
          "& .arrow": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(module.to)}
        sx={{ height: "100%", p: 2 }}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Box
              className="module-icon"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: alpha(module.color || theme.palette.primary.main, 0.12),
                color: module.color || theme.palette.primary.main,
                transition: "all 0.3s ease",
              }}
            >
              <Icon sx={{ fontSize: 28 }} />
            </Box>
            <ArrowForwardRounded
              className="arrow"
              sx={{
                fontSize: 20,
                opacity: 0.5,
                transform: "translateX(-4px)",
                transition: "all 0.3s ease",
                color: theme.palette.primary.main,
              }}
            />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {module.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              display: "block",
              mb: 0.5,
            }}
          >
            {module.subtitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {module.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function SoftedHome() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? `
              radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(theme.palette.primary.main, 0.25)}, transparent),
              radial-gradient(ellipse 60% 40% at 100% 50%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent),
              radial-gradient(ellipse 50% 30% at 0% 80%, ${alpha(theme.palette.primary.main, 0.08)}, transparent),
              linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)
            `
            : `
              radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(theme.palette.primary.main, 0.12)}, transparent),
              radial-gradient(ellipse 60% 40% at 100% 50%, ${alpha(theme.palette.secondary.main, 0.08)}, transparent),
              radial-gradient(ellipse 50% 30% at 0% 80%, ${alpha(theme.palette.primary.main, 0.05)}, transparent),
              linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)
            `,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 4,
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: "block",
              mb: 1,
            }}
          >
            Entorno unificado
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1.5,
              fontSize: { xs: "2rem", md: "2.75rem" },
            }}
          >
            SoftEd
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 520,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Accede a todos los sistemas desde un solo lugar. Gestión de panadería, alumni, piano interactivo y más.
          </Typography>
        </Box>

        {/* Grid de módulos */}
        <Grid container spacing={3}>
          {MODULES.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.title}>
              <ModuleCard module={module} />
            </Grid>
          ))}
        </Grid>

        {/* Footer sutil */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            SoftEd — Entorno unificado • {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
