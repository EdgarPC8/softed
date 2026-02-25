import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { getPostulantes, actualizarEstadoPostulacion } from "../../../api/alumni/bolsaRequest";
import { buildImageUrl } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

const ESTADOS = [
  { value: "postulado", label: "Postulado" },
  { value: "visto", label: "Visto" },
  { value: "entrevista", label: "Entrevista" },
  { value: "seleccionado", label: "Seleccionado" },
  { value: "rechazado", label: "Rechazado" },
];

export default function PostulantesOferta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [tituloOferta, setTituloOferta] = useState("");
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [postSeleccionada, setPostSeleccionada] = useState(null);
  const [estadoEdit, setEstadoEdit] = useState("");
  const [notasEdit, setNotasEdit] = useState("");

  const fetch = async () => {
    setErrorMsg("");
    try {
      const res = await getPostulantes(id);
      const data = res.data || [];
      setPostulaciones(data);
      const oferta = data[0]?.ofertaLaboral;
      if (oferta) {
        setTituloOferta(oferta.titulo || "");
        setEmpresaNombre(oferta.empresa?.razonSocial || "");
      }
    } catch (err) {
      console.error(err);
      setPostulaciones([]);
      setEmpresaNombre("");
      const msg = err?.response?.data?.message || "No se pudieron cargar los postulantes.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleOpenModal = (p) => {
    setPostSeleccionada(p);
    setEstadoEdit(p.estado);
    setNotasEdit(p.notasEmpresa || "");
    setOpenModal(true);
  };

  const handleGuardarEstado = () => {
    if (!postSeleccionada) return;
    toast?.({
      promise: actualizarEstadoPostulacion(postSeleccionada.id, {
        estado: estadoEdit,
        notasEmpresa: notasEdit,
      }),
      successMessage: "Estado actualizado",
      onSuccess: () => {
        setOpenModal(false);
        fetch();
      },
    });
  };

  const fullName = (u) => {
    if (!u) return "-";
    const parts = [u.firstName, u.secondName, u.firstLastName, u.secondLastName].filter(Boolean);
    return parts.join(" ") || "-";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/bolsa-empleo/empresa/ofertas")} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Postulantes
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {tituloOferta || "Oferta laboral"}
        {empresaNombre && ` · ${empresaNombre}`}
      </Typography>

      {loading ? (
        <SkeletonLoader variant="list" count={5} />
      ) : errorMsg ? (
        <Typography color="error" py={6}>
          {errorMsg}
        </Typography>
      ) : postulaciones.length === 0 ? (
        <Typography color="text.secondary" py={6}>
          No hay postulantes aún.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {postulaciones.map((p) => (
            <Card key={p.id}>
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {p.user?.photo && (
                    <Box
                      component="img"
                      src={buildImageUrl(p.user.photo)}
                      alt=""
                      sx={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                    />
                  )}
                  <Box>
                    <Typography fontWeight="600">{fullName(p.user)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.professional?.professionalTitle || p.professional?.personalEmail || p.professional?.institutionalEmail}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label={p.estado} size="small" />
                  <Button size="small" variant="outlined" onClick={() => handleOpenModal(p)}>
                    Gestionar
                  </Button>
                  <Button size="small" onClick={() => navigate(`/cv/ver`, { state: { userId: p.userId } })}>
                    Ver CV
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gestionar postulante</DialogTitle>
        <DialogContent>
          {postSeleccionada && (
            <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estadoEdit}
                  label="Estado"
                  onChange={(e) => setEstadoEdit(e.target.value)}
                >
                  {ESTADOS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Notas internas"
                value={notasEdit}
                onChange={(e) => setNotasEdit(e.target.value)}
                multiline
                rows={2}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarEstado}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
