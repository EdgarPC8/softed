import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowBack, Assignment, CheckCircle, Edit, PostAdd, Visibility } from "@mui/icons-material";
import { getPatientByDni, getPatientHistory } from "../../api/enfermeriaRequest";
import TablePro from "../../Components/Tables/TablePro";

export default function HistorialClinicoPage() {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [patient, setPatient] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(() => (tabParam === "1" ? "completadas" : tabParam === "0" ? "noCompletadas" : "todas"));

  useEffect(() => {
    if (tabParam === "1") setFilter("completadas");
    else if (tabParam === "0") setFilter("noCompletadas");
  }, [tabParam]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [patRes, histRes] = await Promise.all([
          getPatientByDni(dni),
          getPatientHistory(dni).catch(() => ({ data: [] })),
        ]);
        if (patRes.data?.patient === "not found") {
          setPatient(null);
          setError("Paciente no encontrado");
        } else {
          setPatient(patRes.data);
        }
        setFichas(Array.isArray(histRes.data) ? histRes.data : []);
      } catch (e) {
        setError(e?.response?.data?.message || "Error al cargar");
      } finally {
        setLoading(false);
      }
    };
    if (dni) load();
  }, [dni]);

  const filteredRows = useMemo(() => {
    const list = fichas.map((f, idx) => ({
      ...f,
      id: f.id_ficha ?? f.id_consulta_ext ?? idx,
    }));
    if (filter === "completadas") return list.filter((f) => f.completado === 1);
    if (filter === "noCompletadas") return list.filter((f) => f.completado === 0 || f.completado == null);
    return list;
  }, [fichas, filter]);

  const getPageForFicha = (row) => {
    const list = row.completado ? fichas.filter((f) => f.completado) : fichas.filter((f) => !f.completado);
    const idx = list.findIndex((f) => (f.id_ficha && f.id_ficha === row.id_ficha) || (f.id_consulta_ext && f.id_consulta_ext === row.id_consulta_ext));
    return idx >= 0 ? idx + 1 : 1;
  };

  const columns = [
    { id: "fecha_admision", label: "Fecha", getSortValue: (r) => r.fecha_admision || r.fecha || "", render: (r) => r.fecha_admision || r.fecha || "-" },
    { id: "motivo_consulta", label: "Motivo consulta", getSortValue: (r) => (r.motivo_consulta || "").toLowerCase(), render: (r) => (r.motivo_consulta || "-").slice(0, 80) },
    { id: "diagnostico", label: "Diagnóstico", getSortValue: (r) => (r.diagnostico || "").toLowerCase(), render: (r) => ((r.diagnostico || "-").length > 80 ? `${(r.diagnostico || "").slice(0, 80)}…` : (r.diagnostico || "-")) },
    { id: "nombre_profesional", label: "Profesional", getSortValue: (r) => (r.nombre_profesional || "").toLowerCase(), render: (r) => r.nombre_profesional || "-" },
    {
      id: "completado",
      label: "Estado",
      getSortValue: (r) => (r.completado ? 1 : 0),
      render: (r) => (r.completado ? <CheckCircle color="success" fontSize="small" /> : <Edit color="action" fontSize="small" />),
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (r) => {
        const pageNum = getPageForFicha(r);
        const completada = r.completado ? "1" : "0";
        return (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => navigate(`/ficha/${dni}/${pageNum}?view=1&completada=${completada}`)}
            >
              Ver
            </Button>
            {!r.completado && (
              <Button
                size="small"
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate(`/ficha/${dni}/${pageNum}?completada=0`)}
              >
                Completar
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
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

  const fullName = [patient.nombres, patient.apellido_paterno, patient.apellido_materno]
    .filter(Boolean)
    .join(" ") || "Sin nombre";

  const countNoComp = fichas.filter((f) => !f.completado).length;
  const countComp = fichas.filter((f) => f.completado).length;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/pacientes")} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cédula: {patient.cedula} | Nacimiento: {patient.fecha_nacimiento || "-"} | Sexo: {patient.sexo || "-"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              startIcon={<PostAdd />}
              onClick={() => navigate(`/ficha/${dni}/1`)}
            >
              Nueva ficha
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Filtrar:
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v != null && setFilter(v)}
          size="small"
        >
          <ToggleButton value="todas">
            Todas ({fichas.length})
          </ToggleButton>
          <ToggleButton value="noCompletadas" sx={{ color: "warning.main" }}>
            <Edit fontSize="small" sx={{ mr: 0.5 }} /> No completadas ({countNoComp})
          </ToggleButton>
          <ToggleButton value="completadas" sx={{ color: "success.main" }}>
            <CheckCircle fontSize="small" sx={{ mr: 0.5 }} /> Completadas ({countComp})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TablePro
        rows={filteredRows}
        columns={columns}
        showSearch
        showIndex
        indexHeader="#"
        tableMaxHeight={400}
        rowsPerPageOptions={[10, 25, 50]}
        defaultRowsPerPage={10}
      />
    </Container>
  );
}
