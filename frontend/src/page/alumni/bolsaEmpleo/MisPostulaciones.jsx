import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useNavigate } from "react-router-dom";
import { getMisPostulaciones } from "../../../api/alumni/bolsaRequest";

const ESTADOS_COLOR = {
  postulado: "default",
  visto: "info",
  entrevista: "primary",
  seleccionado: "success",
  rechazado: "error",
};

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMisPostulaciones();
        setPostulaciones(res.data || []);
      } catch (err) {
        console.error(err);
        setPostulaciones([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <AssignmentIndIcon sx={{ fontSize: 40 }} color="primary" />
        <Box>
          <Typography variant="h4" fontWeight="bold">Mis Postulaciones</Typography>
          <Typography color="text.secondary">
            Estado de tus postulaciones a ofertas laborales
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <SkeletonLoader variant="cardList" count={4} />
      ) : postulaciones.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={6}>
          No tienes postulaciones. Explora las ofertas en la bolsa de empleo.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {postulaciones.map((p) => (
            <Grid item xs={12} md={6} key={p.id}>
              <Card
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/bolsa-empleo/oferta/${p.ofertaLaboral?.id}`)}
              >
                <CardContent>
                  <Typography variant="h6">{p.ofertaLaboral?.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {p.ofertaLaboral?.empresa?.razonSocial}
                  </Typography>
                  <Chip
                    label={p.estado}
                    size="small"
                    color={ESTADOS_COLOR[p.estado] || "default"}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Postulado: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
