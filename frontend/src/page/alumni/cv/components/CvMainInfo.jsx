import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Stack,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Bloodtype as BloodtypeIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getProfessional, updateProfessional, updateProfessionalPhoto } from "../../../../api/alumni/cvRequest.js";
import { getMyUserData } from "../../../../api/userDataRequest.js";
import { pathImg } from "../../../../api/axios.js";
import { useAuth } from "../../../../context/AuthContext.jsx";

const ACADEMIC_LEVELS = [
  "",
  "Tercer nivel",
  "Ingeniero",
  "Doctor",
  "Magíster",
  "Especialización",
  "Otro",
];

export default function CvMainInfo() {
  const { user, toast } = useAuth();
  const theme = useTheme();
  const [professional, setProfessional] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    personalEmail: "",
    institutionalEmail: "",
    academicLevel: "",
    professionalTitle: "",
    summary: "",
  });

  const load = async () => {
    try {
      const [proRes, userDataRes] = await Promise.all([getProfessional(), getMyUserData()]);
      const pro = proRes.data;
      const ud = userDataRes.data;
      setProfessional(pro);
      setUserData(ud);
      setForm({
        personalEmail: pro.personalEmail ?? "",
        institutionalEmail: pro.institutionalEmail ?? "",
        academicLevel: pro.academicLevel ?? "",
        professionalTitle: pro.professionalTitle ?? "",
        summary: pro.summary ?? "",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = () => {
    toast({
      promise: updateProfessional(form),
      successMessage: "Información principal actualizada",
      onSuccess: () => load(),
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    toast({
      promise: updateProfessionalPhoto(formData),
      successMessage: "Foto de hoja de vida actualizada",
      onSuccess: () => load(),
    });
  };

  const cvPhotoUrl = professional?.photo ? `${pathImg}${professional.photo}` : null;

  if (loading) {
    return (
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: "hidden",
        }}
      >
        <CardHeader
          title="Información principal de la hoja de vida"
          titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
          subheader={
            <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
          }
          subheaderTypographyProps={{ variant: "body2" }}
          sx={{ pb: 0 }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Skeleton variant="text" width={180} height={20} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width={120} height={16} />
                      <Skeleton variant="text" width="70%" height={22} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={7}>
              <Skeleton variant="text" width={220} height={20} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="text" width={200} height={16} sx={{ alignSelf: "center" }} />
                </Box>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={220} height={40} sx={{ borderRadius: 1 }} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
        overflow: "hidden",
      }}
    >
      <CardHeader
        title="Información principal de la hoja de vida"
        titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
        subheader="Los datos de nombre, cédula, género, fecha de nacimiento y tipo de sangre son los del perfil del sistema (solo lectura). El resto puedes editarlo aquí."
        subheaderTypographyProps={{ variant: "body2" }}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Columna izquierda: solo lectura (datos del sistema) */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Datos del perfil (no editables aquí)
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PersonIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Nombre</Typography>
                  <Typography variant="body1">
                    {user?.firstName} {user?.secondName} {user?.firstLastName} {user?.secondLastName}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <BadgeIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Cédula</Typography>
                  <Typography variant="body1">{user?.ci ?? "—"}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GenderIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Género</Typography>
                  <Typography variant="body1">{user?.gender === "M" ? "Masculino" : user?.gender === "F" ? "Femenino" : user?.gender ?? "—"}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CakeIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Fecha de nacimiento</Typography>
                  <Typography variant="body1">{user?.birthday ?? "—"}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <BloodtypeIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Tipo de sangre</Typography>
                  <Typography variant="body1">{userData?.bloodType ?? "—"}</Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Columna derecha: foto CV + datos editables */}
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Datos de la hoja de vida (editables)
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={cvPhotoUrl}
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    component="label"
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handlePhotoChange}
                    />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ alignSelf: "center" }}>
                  Foto de la hoja de vida (distinta a la foto de perfil)
                </Typography>
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Correo personal"
                type="email"
                value={form.personalEmail}
                onChange={(e) => setForm((p) => ({ ...p, personalEmail: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Correo institucional"
                type="email"
                value={form.institutionalEmail}
                onChange={(e) => setForm((p) => ({ ...p, institutionalEmail: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Nivel académico</InputLabel>
                <Select
                  value={form.academicLevel}
                  label="Nivel académico"
                  onChange={(e) => setForm((p) => ({ ...p, academicLevel: e.target.value }))}
                >
                  {ACADEMIC_LEVELS.map((opt) => (
                    <MenuItem key={opt || "v"} value={opt}>{opt || "—"}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                size="small"
                label="Título profesional"
                value={form.professionalTitle}
                onChange={(e) => setForm((p) => ({ ...p, professionalTitle: e.target.value }))}
                placeholder="Ej. Ingeniero en Sistemas"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Resumen / Perfil profesional"
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                variant="outlined"
                size="small"
              />
              <Button variant="contained" onClick={handleSave}>
                Guardar información principal
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
