import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Skeleton,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getCareersForBolsa, crearOferta, actualizarOferta, getMisOfertas, getEmpresas } from "../../../api/alumni/bolsaRequest";
import { useAuth } from "../../../context/AuthContext";

const ROLES_ADMIN = ["Administrador", "Programador"];

export default function FormOfertaEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname || "";
  const empresaIdFromState = location.state?.empresaId;
  const { toast, user } = useAuth();
  const isAdmin = user && ROLES_ADMIN.includes(user.loginRol);
  // Crear: ruta /oferta/nueva (no tiene :id). Editar: ruta /oferta/:id/editar
  const isNew = pathname.includes("/oferta/nueva") || !id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [careers, setCareers] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    empresaId: empresaIdFromState || "",
    titulo: "",
    descripcion: "",
    requisitos: "",
    modalidad: "presencial",
    tipoContrato: "indefinido",
    salarioMin: "",
    salarioMax: "",
    mostrarSalario: false,
    ubicacion: "",
    cantidadVacantes: 1,
    idCareer: "",
  });

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await getCareersForBolsa();
        setCareers(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCareers();
  }, []);

  useEffect(() => {
    if (isAdmin && isNew) {
      const fetchEmpresas = async () => {
        try {
          const res = await getEmpresas();
          setEmpresas(res.data || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchEmpresas();
    }
  }, [isAdmin, isNew]);

  useEffect(() => {
    if (empresaIdFromState) {
      setForm((prev) => ({ ...prev, empresaId: empresaIdFromState }));
    }
  }, [empresaIdFromState]);

  useEffect(() => {
    if (!isNew && id) {
      const fetch = async () => {
        try {
          const res = await getMisOfertas(isAdmin ? {} : undefined);
          const oferta = (res.data || []).find((o) => o.id === parseInt(id, 10));
          if (oferta) {
            setForm({
              titulo: oferta.titulo || "",
              descripcion: oferta.descripcion || "",
              requisitos: oferta.requisitos || "",
              modalidad: oferta.modalidad || "presencial",
              tipoContrato: oferta.tipoContrato || "indefinido",
              salarioMin: oferta.salarioMin?.toString() || "",
              salarioMax: oferta.salarioMax?.toString() || "",
              mostrarSalario: oferta.mostrarSalario || false,
              ubicacion: oferta.ubicacion || "",
              cantidadVacantes: oferta.cantidadVacantes || 1,
              idCareer: oferta.idCareer || "",
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetch();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNew && isAdmin && !form.empresaId) {
      toast?.({ info: "Seleccione una empresa" });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      empresaId: isAdmin && form.empresaId ? form.empresaId : undefined,
      salarioMin: form.salarioMin ? parseFloat(form.salarioMin) : null,
      salarioMax: form.salarioMax ? parseFloat(form.salarioMax) : null,
      idCareer: form.idCareer || null,
    };
    const fn = isNew ? crearOferta(payload) : actualizarOferta(id, payload);
    toast?.({
      promise: fn,
      successMessage: isNew ? "Oferta creada" : "Oferta actualizada",
      onSuccess: () => navigate(isAdmin ? "/bolsa-empleo/admin/empresas" : "/bolsa-empleo/empresa/ofertas"),
      onError: () => setSaving(false),
    });
  };

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rounded" width={80} height={36} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={280} height={40} sx={{ mb: 4 }} />
        <SkeletonLoader variant="form" />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(isAdmin ? "/bolsa-empleo/admin/empresas" : "/bolsa-empleo/empresa/ofertas")} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        {isNew ? (isAdmin ? "Crear oferta para empresa" : "Nueva oferta laboral") : "Editar oferta"}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isNew && isAdmin && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Empresa</InputLabel>
                  <Select
                    name="empresaId"
                    value={form.empresaId}
                    label="Empresa"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Seleccione una empresa</MenuItem>
                    {empresas.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.razonSocial} {emp.sector ? `- ${emp.sector}` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Desarrollador web / Analista de sistemas / Docente de matemáticas"
                helperText="Nombre del puesto o cargo a ofertar"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ej: Buscamos profesional para integrarse al equipo de desarrollo. Responsabilidades: diseño de módulos, revisión de código, reuniones semanales..."
                helperText="Detalle las funciones, responsabilidades y qué ofrecemos"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requisitos"
                name="requisitos"
                value={form.requisitos}
                onChange={handleChange}
                placeholder="Ej: Título tercer nivel en Ingeniería / 2 años de experiencia / Manejo de React y Node.js / Inglés intermedio"
                helperText="Liste requisitos académicos, experiencia y habilidades"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Modalidad</InputLabel>
                <Select
                  name="modalidad"
                  value={form.modalidad}
                  label="Modalidad"
                  onChange={handleChange}
                >
                  <MenuItem value="presencial">Presencial</MenuItem>
                  <MenuItem value="remoto">Remoto</MenuItem>
                  <MenuItem value="hibrido">Híbrido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de contrato</InputLabel>
                <Select
                  name="tipoContrato"
                  value={form.tipoContrato}
                  label="Tipo de contrato"
                  onChange={handleChange}
                >
                  <MenuItem value="indefinido">Indefinido</MenuItem>
                  <MenuItem value="temporal">Temporal</MenuItem>
                  <MenuItem value="pasantia">Pasantía</MenuItem>
                  <MenuItem value="practicas">Prácticas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Carrera</InputLabel>
                <Select
                  name="idCareer"
                  value={form.idCareer}
                  label="Carrera"
                  onChange={handleChange}
                >
                  <MenuItem value="">Cualquiera</MenuItem>
                  {careers.map((c) => (
                    <MenuItem key={c.idCareer} value={c.idCareer}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Guayaquil, Ecuador / Quito - sector norte / Remoto"
                helperText="Ciudad, zona o indica si es remoto"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Vacantes"
                name="cantidadVacantes"
                type="number"
                value={form.cantidadVacantes}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                helperText="Nº de plazas disponibles"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Salario mínimo"
                name="salarioMin"
                type="number"
                value={form.salarioMin}
                onChange={handleChange}
                placeholder="Ej: 800"
                helperText="USD (opcional)"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Salario máximo"
                name="salarioMax"
                type="number"
                value={form.salarioMax}
                onChange={handleChange}
                placeholder="Ej: 1200"
                helperText="USD (opcional)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="mostrarSalario"
                    checked={form.mostrarSalario}
                    onChange={handleChange}
                  />
                }
                label="Mostrar salario en la oferta"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Guardando..." : isNew ? "Crear oferta" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
