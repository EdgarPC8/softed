import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Skeleton,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import BusinessIcon from "@mui/icons-material/Business";
import { getPerfilEmpresa, crearPerfilEmpresa, actualizarPerfilEmpresa, subirLogoEmpresaPerfil } from "../../../api/alumni/bolsaRequest";
import { buildImageUrl } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

export default function PerfilEmpresa() {
  const { toast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    razonSocial: "",
    nit: "",
    sector: "",
    descripcion: "",
    direccion: "",
    telefonoFijo: "",
    telefonoMovil: "",
    email: "",
    website: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [existe, setExiste] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPerfilEmpresa();
        const data = res.data;
        if (data) {
          setExiste(true);
          setForm({
            razonSocial: data.razonSocial || "",
            nit: data.nit || "",
            sector: data.sector || "",
            descripcion: data.descripcion || "",
            direccion: data.direccion || "",
            telefonoFijo: data.telefonoFijo || "",
            telefonoMovil: data.telefonoMovil || "",
            email: data.email || "",
            website: data.website || "",
          });
          setLogoUrl(data.logo ? buildImageUrl(data.logo) : null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const fileToUpload = logoFile;
    const prom = (existe ? actualizarPerfilEmpresa(form) : crearPerfilEmpresa(form)).then(async () => {
      if (fileToUpload) {
        await subirLogoEmpresaPerfil(fileToUpload);
      }
    });
    toast?.({
      promise: prom,
      successMessage: existe ? "Perfil actualizado" : "Perfil creado",
      onSuccess: async () => {
        setExiste(true);
        setLogoFile(null);
        try {
          const res = await getPerfilEmpresa();
          if (res.data?.logo) setLogoUrl(buildImageUrl(res.data.logo));
        } catch (err) {
          console.error(err);
        }
      },
      onError: () => setSaving(false),
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
          <Box>
            <Skeleton variant="text" width={200} height={36} />
            <Skeleton variant="text" width={280} height={24} />
          </Box>
        </Box>
        <SkeletonLoader variant="form" />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <BusinessIcon sx={{ fontSize: 40 }} color="primary" />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {existe ? "Editar perfil de empresa" : "Crear perfil de empresa"}
          </Typography>
          <Typography color="text.secondary">
            Complete los datos de su empresa para publicar ofertas
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de empresa"
                name="razonSocial"
                value={form.razonSocial}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIT"
                name="nit"
                value={form.nit}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sector"
                name="sector"
                value={form.sector}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                {(logoUrl || logoFile) && (
                  <Box
                    component="img"
                    src={logoFile ? URL.createObjectURL(logoFile) : logoUrl}
                    alt="Logo"
                    sx={{ width: 64, height: 64, borderRadius: 1, objectFit: "cover", border: "1px solid #ddd" }}
                  />
                )}
                <Button variant="outlined" component="label" size="small">
                  {logoUrl || logoFile ? "Cambiar logo" : "Subir logo"}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono fijo"
                name="telefonoFijo"
                value={form.telefonoFijo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono móvil"
                name="telefonoMovil"
                value={form.telefonoMovil}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sitio web"
                name="website"
                value={form.website}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Guardando..." : existe ? "Actualizar" : "Crear perfil"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
