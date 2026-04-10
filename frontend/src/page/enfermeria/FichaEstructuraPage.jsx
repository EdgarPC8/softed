import React from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  Person,
  Favorite,
  MedicalInformation,
  Assignment,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const gradientBg =
  "linear-gradient(135deg, #0D47A1 0%, #1565C0 35%, #1976D2 70%, #42A5F5 100%)";

const secciones = [
  { icon: Person, title: "Datos del paciente", items: ["Identificación", "Datos personales", "Contacto", "Seguro de salud"] },
  { icon: Favorite, title: "Signos vitales", items: ["Temperatura", "Presión arterial", "Pulso", "Frecuencia respiratoria", "Peso", "Talla"] },
  { icon: MedicalInformation, title: "Antecedentes y motivo", items: ["Motivo de consulta", "Antecedentes gineco-obstétricos", "Otros antecedentes"] },
  { icon: Assignment, title: "Diagnóstico y evolución", items: ["Diagnósticos CIE-10", "Evolución", "Tratamiento", "Notas clínicas"] },
];

export default function FichaEstructuraPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", background: gradientBg, py: 4 }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ color: "#fff", mb: 2 }}>
          Volver
        </Button>
        <Paper
          sx={{
            p: 4,
            bgcolor: alpha("#fff", 0.95),
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Estructura de la ficha médica
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Esta página muestra la estructura de la ficha médica para fines de enseñanza e indicación. No se muestran datos reales de pacientes.
          </Typography>
          <List disablePadding>
            {secciones.map((sec, i) => {
              const SecIcon = sec.icon;
              return (
                <ListItem key={i} sx={{ flexDirection: "column", alignItems: "flex-start", mb: 2, p: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <SecIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {sec.title}
                    </Typography>
                  </Box>
                  <List dense disablePadding sx={{ pl: 3 }}>
                    {sec.items.map((item, j) => (
                      <ListItem key={j} disablePadding>
                        <ListItemText primary={item} primaryTypographyProps={{ variant: "body2" }} />
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
