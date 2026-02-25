import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SkeletonLoader from "../../../Components/SkeletonLoader/SkeletonLoader";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { useNavigate } from "react-router-dom";
import {
  getEmpresas,
  crearEmpresa,
  actualizarEmpresa,
  getAccountsParaVincularEmpresa,
  subirLogoEmpresa,
} from "../../../api/alumni/bolsaRequest";
import { buildImageUrl } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

const CAMPOS_EMPRESA = [
  { name: "razonSocial", label: "Nombre de empresa", required: true },
  { name: "nit", label: "NIT", required: false },
  { name: "sector", label: "Sector", required: false },
  { name: "descripcion", label: "Descripción", required: false, multiline: true },
  { name: "direccion", label: "Dirección", required: false },
  { name: "telefonoFijo", label: "Teléfono fijo", required: false },
  { name: "telefonoMovil", label: "Teléfono móvil", required: false },
  { name: "email", label: "Email", required: false },
  { name: "website", label: "Sitio web", required: false },
];

export default function AdminEmpresasBolsa() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [empresaEditar, setEmpresaEditar] = useState(null);
  const [accountsVinculables, setAccountsVinculables] = useState([]);
  const [form, setForm] = useState(
    Object.fromEntries(CAMPOS_EMPRESA.map((c) => [c.name, ""]))
  );
  const [formAccountId, setFormAccountId] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useAuth();

  const fetchEmpresas = async () => {
    try {
      const res = await getEmpresas();
      setEmpresas(res.data || []);
    } catch (err) {
      console.error(err);
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fullName = (u) => {
    if (!u) return "-";
    return [u.firstName, u.firstLastName].filter(Boolean).join(" ") || u.username || "-";
  };

  const resetForm = () => {
    setForm(Object.fromEntries(CAMPOS_EMPRESA.map((c) => [c.name, ""])));
    setFormAccountId("");
    setLogoFile(null);
  };

  const handleOpenCrear = () => {
    resetForm();
    setOpenCrear(true);
  };

  const handleCrear = () => {
    const razonSocial = (form.razonSocial || "").trim();
    if (!razonSocial) {
      toast?.({ info: { description: "El nombre de la empresa es obligatorio" } });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      razonSocial,
      accountId: formAccountId ? parseInt(formAccountId, 10) : null,
    };
    const fileToUpload = logoFile;
    const prom = crearEmpresa(payload).then(async (res) => {
      if (fileToUpload && res?.data?.id) {
        await subirLogoEmpresa(res.data.id, fileToUpload);
      }
      return res;
    });
    toast?.({
      promise: prom,
      successMessage: "Empresa creada",
      onSuccess: () => {
        setOpenCrear(false);
        resetForm();
        setSaving(false);
        fetchEmpresas();
      },
      onError: () => setSaving(false),
    });
  };

  const handleOpenEditar = async (emp) => {
    setEmpresaEditar(emp);
    setForm(
      Object.fromEntries(
        CAMPOS_EMPRESA.map((c) => [c.name, emp[c.name] ?? ""])
      )
    );
    setFormAccountId(emp.accountId ? String(emp.accountId) : "");
    setLogoFile(null);
    setOpenEditar(true);
    try {
      const res = await getAccountsParaVincularEmpresa(emp.id);
      setAccountsVinculables(res.data || []);
    } catch (err) {
      setAccountsVinculables([]);
    }
  };

  const handleEditar = () => {
    if (!empresaEditar) return;
    const razonSocial = (form.razonSocial || empresaEditar.razonSocial || "").trim();
    if (!razonSocial) {
      toast?.({ info: { description: "El nombre de la empresa es obligatorio" } });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      razonSocial,
      accountId: formAccountId ? parseInt(formAccountId, 10) : null,
    };
    const fileToUpload = logoFile;
    const empId = empresaEditar.id;
    const prom = actualizarEmpresa(empId, payload).then(async () => {
      if (fileToUpload) {
        await subirLogoEmpresa(empId, fileToUpload);
      }
    });
    toast?.({
      promise: prom,
      successMessage: "Empresa actualizada",
      onSuccess: () => {
        setOpenEditar(false);
        setEmpresaEditar(null);
        setLogoFile(null);
        setSaving(false);
        fetchEmpresas();
      },
      onError: () => setSaving(false),
    });
  };

  const loadAccountsCrear = async () => {
    try {
      const res = await getAccountsParaVincularEmpresa();
      setAccountsVinculables(res.data || []);
    } catch (err) {
      setAccountsVinculables([]);
    }
  };

  useEffect(() => {
    if (openCrear) loadAccountsCrear();
  }, [openCrear]);

  const formContent = (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {(empresaEditar?.logo || logoFile) && (
            <Box
              component="img"
              src={logoFile ? URL.createObjectURL(logoFile) : buildImageUrl(empresaEditar?.logo)}
              alt="Logo"
              sx={{ width: 56, height: 56, borderRadius: 1, objectFit: "cover", border: "1px solid #ddd" }}
            />
          )}
          <Button variant="outlined" component="label" size="small">
            {empresaEditar?.logo || logoFile ? "Cambiar logo" : "Subir logo"}
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </Button>
        </Box>
      </Grid>
      {CAMPOS_EMPRESA.map((c) => (
        <Grid item xs={12} sm={c.multiline ? 12 : 6} key={c.name}>
          <TextField
            fullWidth
            size="small"
            label={c.label}
            name={c.name}
            value={form[c.name] ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [c.name]: e.target.value }))
            }
            required={c.required}
            multiline={c.multiline}
            rows={c.multiline ? 2 : 1}
          />
        </Grid>
      ))}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Vincular usuario (opcional)</InputLabel>
          <Select
            value={formAccountId}
            label="Vincular usuario (opcional)"
            onChange={(e) => setFormAccountId(e.target.value)}
          >
            <MenuItem value="">Sin vincular</MenuItem>
            {accountsVinculables.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {fullName(acc.user)} ({acc.username})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <BusinessIcon sx={{ fontSize: 40 }} color="primary" />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Empresas - Bolsa de empleo
            </Typography>
            <Typography color="text.secondary">
              Cree empresas, vincule usuarios y gestione ofertas laborales
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenCrear}
          >
            Crear empresa
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/bolsa-empleo/empresa/oferta/nueva")}
          >
            Crear oferta
          </Button>
        </Box>
      </Box>

      {loading ? (
        <SkeletonLoader variant="cardGrid" count={4} />
      ) : empresas.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={6}>
          No hay empresas. Puede crear una desde el botón "Crear empresa" o las empresas pueden registrarse con rol Empresa.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {empresas.map((emp) => (
            <Grid item xs={12} md={6} key={emp.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {emp.logo && (
                        <Box
                          component="img"
                          src={buildImageUrl(emp.logo)}
                          alt=""
                          sx={{ width: 48, height: 48, borderRadius: 1, objectFit: "cover" }}
                        />
                      )}
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {emp.razonSocial}
                        </Typography>
                      {emp.sector && (
                        <Chip
                          label={emp.sector}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEditar(emp)}
                    >
                      Editar
                    </Button>
                  </Box>
                  {emp.descripcion && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {emp.descripcion}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {emp.nit && (
                      <Typography variant="caption">NIT: {emp.nit}</Typography>
                    )}
                    {emp.email && (
                      <Typography variant="caption">• {emp.email}</Typography>
                    )}
                    {(emp.telefonoFijo || emp.telefono || emp.telefonoMovil) && (
                      <Typography variant="caption">
                        • {[emp.telefonoFijo, emp.telefono, emp.telefonoMovil].filter(Boolean).join(" / ")}
                      </Typography>
                    )}
                  </Box>
                  {emp.account?.user ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Contacto: {fullName(emp.account.user)} (
                        {emp.account.username})
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <LinkOffIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Sin usuario vinculado
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<LinkIcon />}
                        onClick={() => handleOpenEditar(emp)}
                      >
                        Vincular
                      </Button>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      label={`${emp.ofertaLaborals?.length || 0} oferta(s)`}
                      size="small"
                      variant="outlined"
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        navigate(
                          "/bolsa-empleo/empresa/oferta/nueva",
                          { state: { empresaId: emp.id } }
                        )
                      }
                    >
                      Crear oferta
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openCrear} onClose={() => setOpenCrear(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear empresa</DialogTitle>
        <DialogContent>
          {formContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrear(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCrear}
            disabled={saving || !form.razonSocial?.trim()}
          >
            Crear empresa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditar}
        onClose={() => {
          setOpenEditar(false);
          setEmpresaEditar(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar empresa / Vincular usuario</DialogTitle>
        <DialogContent>
          {formContent}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditar(false);
              setEmpresaEditar(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleEditar}
            disabled={saving}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
