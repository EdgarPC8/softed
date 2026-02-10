import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Stack,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PhotoCamera,
  Edit as EditIcon,
  Close as CloseIcon,
  LocationOn,
  Home,
  Phone,
  PhoneAndroid,
  Bloodtype,
  Email,
  Business,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
} from '@mui/icons-material';
import {
  updateUserPhotoRequest,
  deleteUserPhotoRequest
} from '../api/userRequest';
import { getMyUserData, updateMyUserData } from '../api/userDataRequest';
import { pathPhotos } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import ProfileForm from "../Components/Forms/ProfileForm";


const Profile = () => {
  const { user, isLoading, toast, setProfileImageUser, profileImageUser } = useAuth(); // Obtenemos los datos del usuario desde el contexto
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditingData, setIsEditingData] = useState(false);
  const [dataForm, setDataForm] = useState({
    direction: "",
    placeResidence: "",
    phone: "",
    cellPhone: "",
    bloodType: "",
    personalEmail: "",
    institutionalEmail: "",
  });

  const loadUserData = async () => {
    try {
      const { data } = await getMyUserData();
      setUserData(data);
      setDataForm({
        direction: data.direction ?? "",
        placeResidence: data.placeResidence ?? "",
        phone: data.phone ?? "",
        cellPhone: data.cellPhone ?? "",
        bloodType: data.bloodType ?? "",
        personalEmail: data.personalEmail ?? "",
        institutionalEmail: data.institutionalEmail ?? "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSaveUserData = () => {
    toast({
      promise: updateMyUserData(dataForm),
      successMessage: "Datos actualizados",
      onSuccess: () => {
        loadUserData();
        setIsEditingData(false);
      },
    });
  };

  const handleCancelEditData = () => {
    if (userData) {
      setDataForm({
        direction: userData.direction ?? "",
        placeResidence: userData.placeResidence ?? "",
        phone: userData.phone ?? "",
        cellPhone: userData.cellPhone ?? "",
        bloodType: userData.bloodType ?? "",
        personalEmail: userData.personalEmail ?? "",
        institutionalEmail: userData.institutionalEmail ?? "",
      });
    }
    setIsEditingData(false);
  };

  const theme = useTheme();
  const hasAnyData = userData && (
    userData.direction ||
    userData.placeResidence ||
    userData.phone ||
    userData.cellPhone ||
    userData.bloodType ||
    userData.personalEmail ||
    userData.institutionalEmail
  );

  const handleDialog = () => {
    setOpen(!open);
  };
  // Maneja la apertura del menú
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogUser = () => {
    setOpenDialog(!openDialog);
  };
  // Maneja la previsualización y la subida de la imagen seleccionada
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Previsualizar la imagen seleccionada
      const imageURL = URL.createObjectURL(file);

      // Preparar la imagen para enviar al backend
      const formData = new FormData();
      formData.append('photo', file);

      // Subir la imagen al servidor

      toast({
        promise:
          updateUserPhotoRequest(user.userId, formData),
        successMessage: "Foto de Perfil cambiada con éxito",
        onSuccess: (data) => {
          setProfileImageUser(imageURL)
          handleClose()

        }
      });
    }
  };

  // Maneja la eliminación de la imagen de perfil
  const handleDeletePhoto = async () => {
    toast({
      promise:
        deleteUserPhotoRequest(user.userId),
      successMessage: "Foto de Perfil eliminada con éxito",
      onSuccess: (data) => {
        setProfileImageUser("/")
        handleDialog()
        handleClose()

      },
      onError: (error) => {
        handleDialog()
        handleClose()

        return {
          title: "Error al editar",
          description: error.response.data.message // Puedes usar error.message para el mensaje de error
        };
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} alignItems="flex-start">
        {/* Columna izquierda: imagen, nombre, cédula, cumpleaños */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
              overflow: "hidden",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <Avatar
                src={profileImageUser}
                alt={user.firstName}
                sx={{ width: 160, height: 160, mb: 2 }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                onClick={handleMenu}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: "50%",
                  transform: "translate(60px, 0)",
                  backgroundColor: "white",
                  boxShadow: 1,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <PhotoCamera />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <label htmlFor="upload-photo" style={{ cursor: "pointer" }}>
                    Cambiar foto de perfil
                  </label>
                  <input
                    hidden
                    accept="image/*"
                    id="upload-photo"
                    type="file"
                    onChange={handleImageChange}
                  />
                </MenuItem>
                <MenuItem onClick={handleDialog}>Eliminar foto de perfil</MenuItem>
              </Menu>

              <Stack spacing={2} sx={{ width: "100%", mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Nombre</Typography>
                    <Typography variant="h6" noWrap>
                      {user.firstName} {user.secondName} {user.firstLastName} {user.secondLastName}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <BadgeIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Cédula</Typography>
                    <Typography variant="h6">{user.ci || "—"}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <GenderIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Género</Typography>
                    <Typography variant="h6">{user.gender === "M" ? "Masculino" : user.gender === "F" ? "Femenino" : user.gender || "—"}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CakeIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Cumpleaños</Typography>
                    <Typography variant="h6">{user.birthday || "—"}</Typography>
                  </Box>
                </Box>
              </Stack>

              <SimpleDialog open={openDialog} onClose={handleDialogUser} tittle="Editar mi Cuenta">
                <ProfileForm onClose={handleDialogUser} isEditing={true} datos={user} />
              </SimpleDialog>
              <Button color="primary" variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleDialogUser}>
                Editar Perfil
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Columna derecha: Información de contacto */}
        <Grid item xs={12} md={7}>
        <Card
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          <CardHeader
            title="Información de contacto"
            titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
            action={
              !isEditingData ? (
                <IconButton size="small" onClick={() => setIsEditingData(true)} aria-label="Editar">
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={handleCancelEditData} aria-label="Cancelar">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 0 }}>
            {!isEditingData ? (
              <Stack spacing={2}>
                {userData && (
                  <>
                    {userData.direction && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <LocationOn sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Dirección</Typography>
                          <Typography variant="body1">{userData.direction}</Typography>
                        </Box>
                      </Box>
                    )}
                    {userData.placeResidence && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Home sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Lugar de residencia</Typography>
                          <Typography variant="body1">{userData.placeResidence}</Typography>
                        </Box>
                      </Box>
                    )}
                    {userData.phone && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Phone sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Teléfono</Typography>
                          <Typography variant="body1">{userData.phone}</Typography>
                        </Box>
                      </Box>
                    )}
                    {userData.cellPhone && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <PhoneAndroid sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Celular</Typography>
                          <Typography variant="body1">{userData.cellPhone}</Typography>
                        </Box>
                      </Box>
                    )}
                    {userData.bloodType && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Bloodtype sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Tipo de sangre</Typography>
                          <Typography variant="body1">{userData.bloodType}</Typography>
                        </Box>
                      </Box>
                    )}
                    {userData.personalEmail && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Email sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Correo personal</Typography>
                          <Typography variant="body1">{userData.personalEmail}</Typography>
                        </Box>
                      </Box>
                    )}
                    {userData.institutionalEmail && (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Business sx={{ color: "text.secondary", mt: 0.25, fontSize: 22 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Correo institucional</Typography>
                          <Typography variant="body1">{userData.institutionalEmail}</Typography>
                        </Box>
                      </Box>
                    )}
                    {!hasAnyData && (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                        Agregue su dirección, teléfonos, tipo de sangre o correos. Use el ícono de lápiz para editar.
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            ) : (
              <Stack spacing={2} component="form">
                <TextField
                  fullWidth
                  size="small"
                  label="Dirección"
                  value={dataForm.direction}
                  onChange={(e) => setDataForm((p) => ({ ...p, direction: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Lugar de residencia"
                  value={dataForm.placeResidence}
                  onChange={(e) => setDataForm((p) => ({ ...p, placeResidence: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Teléfono fijo"
                  value={dataForm.phone}
                  onChange={(e) => setDataForm((p) => ({ ...p, phone: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Celular"
                  value={dataForm.cellPhone}
                  onChange={(e) => setDataForm((p) => ({ ...p, cellPhone: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneAndroid fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Tipo de sangre"
                  placeholder="Ej. O+"
                  value={dataForm.bloodType}
                  onChange={(e) => setDataForm((p) => ({ ...p, bloodType: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Bloodtype fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Correo personal"
                  type="email"
                  value={dataForm.personalEmail}
                  onChange={(e) => setDataForm((p) => ({ ...p, personalEmail: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Correo institucional"
                  type="email"
                  value={dataForm.institutionalEmail}
                  onChange={(e) => setDataForm((p) => ({ ...p, institutionalEmail: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
                  <Button variant="outlined" size="medium" onClick={handleCancelEditData}>
                    Cancelar
                  </Button>
                  <Button variant="contained" size="medium" onClick={handleSaveUserData}>
                    Guardar
                  </Button>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>
        </Grid>
      </Grid>

      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Usuario"
        onClickAccept={handleDeletePhoto}
      >
            ¿Está seguro de eliminar su foto de perfil?
      </SimpleDialog>
    </Container>
  );
};

export default Profile;