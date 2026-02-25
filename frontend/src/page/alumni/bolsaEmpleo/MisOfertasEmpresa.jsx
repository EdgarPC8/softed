import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { getMisOfertas } from "../../../api/alumni/bolsaRequest";
import { useAuth } from "../../../context/AuthContext";

const ROLES_ADMIN = ["Administrador", "Programador"];

export default function MisOfertasEmpresa() {
  const { user } = useAuth();
  const isAdmin = user && ROLES_ADMIN.includes(user.loginRol);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMisOfertas();
        setOfertas(res.data || []);
      } catch (err) {
        console.error(err);
        setOfertas([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isAdmin ? "Todas las ofertas" : "Mis Ofertas"}
          </Typography>
          <Typography color="text.secondary">
            {isAdmin ? "Ofertas de todas las empresas - puede crear en nombre de cualquiera" : "Gestiona tus ofertas laborales"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isAdmin && (
            <Button variant="outlined" onClick={() => navigate("/bolsa-empleo/admin/empresas")}>
              Ver empresas
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/bolsa-empleo/empresa/oferta/nueva")}
          >
            {isAdmin ? "Crear oferta para empresa" : "Nueva oferta"}
          </Button>
        </Box>
      </Box>

      {loading ? (
        <SkeletonLoader variant="cardGrid" count={4} />
      ) : ofertas.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={6}>
          {isAdmin ? "No hay ofertas. Cree una oferta para alguna empresa." : "No tienes ofertas. Crea una nueva oferta para empezar."}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {ofertas.map((oferta) => {
            const nPostulantes = oferta.postulacions?.length || 0;
            return (
              <Grid item xs={12} md={6} key={oferta.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{oferta.titulo}</Typography>
                    {isAdmin && oferta.empresa && (
                      <Typography variant="caption" color="primary" display="block">
                        {oferta.empresa.razonSocial}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {oferta.modalidad} · {oferta.tipoContrato}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        label={oferta.estado}
                        size="small"
                        color={oferta.estado === "publicada" ? "success" : "default"}
                      />
                      <Chip
                        icon={<PeopleIcon sx={{ fontSize: 16 }} />}
                        label={`${nPostulantes} postulante${nPostulantes !== 1 ? "s" : ""}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate(`/bolsa-empleo/empresa/oferta/${oferta.id}/postulantes`)}
                    >
                      Postulantes
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/bolsa-empleo/empresa/oferta/${oferta.id}/editar`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
