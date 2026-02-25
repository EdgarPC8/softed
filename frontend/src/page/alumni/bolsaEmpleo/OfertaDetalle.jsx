import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  Divider,
  Skeleton,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { useParams, useNavigate } from "react-router-dom";
import { getOfertaById, postularse } from "../../../api/alumni/bolsaRequest";
import { buildImageUrl } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

const ROLES_POSTULAR = ["Estudiante", "Profesional"];

export default function OfertaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toast } = useAuth();
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postulando, setPostulando] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOfertaById(id);
        setOferta(res.data);
      } catch (err) {
        console.error(err);
        setOferta(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const puedePostular = user && ROLES_POSTULAR.includes(user.loginRol);

  const handlePostular = () => {
    if (!puedePostular) {
      toast?.({ info: "Debe iniciar sesión con rol Profesional o Estudiante para postularse" });
      return;
    }
    setPostulando(true);
    toast?.({
      promise: postularse(id),
      successMessage: "Postulación enviada correctamente",
      onSuccess: () => navigate("/bolsa-empleo/mis-postulaciones"),
      onError: () => setPostulando(false),
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rounded" width={80} height={36} sx={{ mb: 2 }} />
        <SkeletonLoader variant="detail" />
      </Container>
    );
  }

  if (!oferta) {
    return (
      <Container>
        <Typography color="error">Oferta no encontrada</Typography>
        <Button onClick={() => navigate("/bolsa-empleo")}>Volver</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/bolsa-empleo")} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          {oferta.empresa?.logo && (
            <Box
              component="img"
              src={buildImageUrl(oferta.empresa.logo)}
              alt=""
              sx={{ width: 64, height: 64, borderRadius: 1, objectFit: "cover" }}
            />
          )}
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold">{oferta.titulo}</Typography>
            <Typography variant="h6" color="text.secondary">{oferta.empresa?.razonSocial}</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip label={oferta.modalidad || "presencial"} size="small" />
              <Chip label={oferta.tipoContrato || "indefinido"} size="small" />
              {oferta.career?.name && (
                <Chip label={oferta.career.name} size="small" variant="outlined" />
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
        <Typography sx={{ mb: 2, whiteSpace: "pre-wrap" }}>{oferta.descripcion}</Typography>

        {oferta.requisitos && (
          <>
            <Typography variant="subtitle2" color="text.secondary">Requisitos</Typography>
            <Typography sx={{ mb: 2, whiteSpace: "pre-wrap" }}>{oferta.requisitos}</Typography>
          </>
        )}

        {oferta.mostrarSalario && (oferta.salarioMin || oferta.salarioMax) && (
          <Typography variant="body2" color="text.secondary">
            Salario: {oferta.salarioMin && oferta.salarioMax
              ? `$${oferta.salarioMin} - $${oferta.salarioMax}`
              : oferta.salarioMin
                ? `Desde $${oferta.salarioMin}`
                : `Hasta $${oferta.salarioMax}`}
          </Typography>
        )}

        {oferta.ubicacion && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ubicación: {oferta.ubicacion}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {puedePostular && (
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handlePostular}
            disabled={postulando}
          >
            Postularme
          </Button>
        )}

        {user && !puedePostular && user.loginRol === "Empresa" && (
          <Typography variant="body2" color="text.secondary">
            Las empresas no pueden postularse a ofertas.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
