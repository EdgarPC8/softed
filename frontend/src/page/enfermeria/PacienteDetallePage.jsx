import {
  Container,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPatientByDni,
  getPatientHistory,
} from "../../api/enfermeriaRequest";
import { ArrowBack, History, Add } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const ROLES_CON_FICHA_COMPLETA = ["Doctor/a", "Moderador", "Programador"];

export default function PacienteDetallePage() {
  const { dni } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const puedeVerFichas = ROLES_CON_FICHA_COMPLETA.includes(user?.loginRol);
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isNew = dni === "nuevo";

  const fetchPatient = async () => {
    if (isNew) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getPatientByDni(dni);
      if (data?.patient === "not found") {
        setPatient(null);
        setError("Paciente no encontrado");
      } else {
        setPatient(data);
        setError(null);
        if (ROLES_CON_FICHA_COMPLETA.includes(user?.loginRol)) {
          try {
            const res = await getPatientHistory(dni);
            setHistory(res.data || []);
          } catch {
            setHistory([]);
          }
        } else {
          setHistory([]);
        }
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Error al cargar paciente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [dni, user?.loginRol]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isNew) {
    return (
      <Container sx={{ py: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/pacientes")} sx={{ mb: 2 }}>
          Volver
        </Button>
        <Typography variant="h5" gutterBottom>
          Nuevo paciente
        </Typography>
        <Typography color="text.secondary">
          Formulario de registro de paciente (en desarrollo).
        </Typography>
      </Container>
    );
  }

  if (error || !patient) {
    return (
      <Container sx={{ py: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/pacientes")} sx={{ mb: 2 }}>
          Volver
        </Button>
        <Alert severity="error">{error || "Paciente no encontrado"}</Alert>
      </Container>
    );
  }

  const fullName =
    [patient.nombres, patient.apellido_paterno, patient.apellido_materno]
      .filter(Boolean)
      .join(" ") || "Sin nombre";

  return (
    <Container sx={{ py: 2 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/pacientes")} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        {puedeVerFichas && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`/ficha/${dni}/1`)}
            color="primary"
          >
            Nueva ficha
          </Button>
        )}
        {["Enfermero/a", "Pasante"].includes(user?.loginRol) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/ficha/anadir")}
            color="primary"
          >
            Nueva ficha
          </Button>
        )}
        {puedeVerFichas && (
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => navigate(`/pacientes/${dni}/historial`)}
          >
            Historial clínico
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cédula: {patient.cedula} | Nacimiento: {patient.fecha_nacimiento || "-"} |
            Sexo: {patient.sexo || "-"}
          </Typography>
          {patient.Direccion && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Dirección: {patient.Direccion.residencia_habitual}{" "}
              {patient.Direccion.provincia || ""} | Tel:{" "}
              {patient.Direccion.telefono || "-"}
            </Typography>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Últimas consultas ({history.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ver historial completo para más detalles.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
