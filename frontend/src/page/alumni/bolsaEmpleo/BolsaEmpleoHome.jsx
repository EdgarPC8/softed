import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";
import { getOfertasPublicas, getCareersForBolsa } from "../../../api/alumni/bolsaRequest";
import { buildImageUrl } from "../../../api/axios";

export default function BolsaEmpleoHome() {
  const [ofertas, setOfertas] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroModalidad, setFiltroModalidad] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [resOfertas, resCareers] = await Promise.all([
          getOfertasPublicas({ modalidad: filtroModalidad || undefined, idCareer: filtroCarrera || undefined }),
          getCareersForBolsa(),
        ]);
        setOfertas(resOfertas.data || []);
        setCareers(resCareers.data || []);
      } catch (err) {
        console.error(err);
        setOfertas([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filtroModalidad, filtroCarrera]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <WorkIcon sx={{ fontSize: 40 }} color="primary" />
        <Box>
          <Typography variant="h4" fontWeight="bold">Bolsa de Empleo</Typography>
          <Typography color="text.secondary">
            Ofertas laborales para graduados y egresados
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Modalidad</InputLabel>
            <Select
              value={filtroModalidad}
              label="Modalidad"
              onChange={(e) => setFiltroModalidad(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
              <MenuItem value="remoto">Remoto</MenuItem>
              <MenuItem value="hibrido">Híbrido</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Carrera</InputLabel>
            <Select
              value={filtroCarrera}
              label="Carrera"
              onChange={(e) => setFiltroCarrera(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {careers.map((c) => (
                <MenuItem key={c.idCareer} value={c.idCareer}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <SkeletonLoader variant="cardGrid" count={6} />
      ) : ofertas.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={6}>
          No hay ofertas publicadas en este momento.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {ofertas.map((oferta) => (
            <Grid item xs={12} md={6} lg={4} key={oferta.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                    {oferta.empresa?.logo && (
                      <Box
                        component="img"
                        src={buildImageUrl(oferta.empresa.logo)}
                        alt=""
                        sx={{ width: 48, height: 48, borderRadius: 1, objectFit: "cover" }}
                      />
                    )}
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="600">
                        {oferta.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {oferta.empresa?.razonSocial}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {oferta.descripcion}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label={oferta.modalidad || "presencial"} size="small" />
                    {oferta.career?.name && (
                      <Chip label={oferta.career.name} size="small" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/bolsa-empleo/oferta/${oferta.id}`)}>
                    Ver detalle
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
