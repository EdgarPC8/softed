import React, { useState } from 'react';
import { Container, Box, Typography, Avatar, IconButton, Menu, MenuItem, Button,Grid } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material'; // Ícono de cámara
import toast from 'react-hot-toast'; // Para mostrar notificaciones
import {
  updateUserPhotoRequest,
  deleteUserPhotoRequest
} from '../api/userRequest'; // Ajusta el import para tu backend
import { pathPhotos } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import ProfileForm from "../Components/Forms/ProfileForm";


const Profile = () => {
  const { user, isLoading, toast, setProfileImageUser, profileImageUser } = useAuth(); // Obtenemos los datos del usuario desde el contexto
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);

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
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4, mb: 4, position: 'relative'}} // Posición relativa para el botón flotante
      >
        {/* Avatar del perfil */}
        <Avatar
          src={profileImageUser} // Imagen del estado
          alt={user.firstName}
          sx={{ width: 200, height: 200, mb: 2, position: 'relative' }}
        />

        {/* Botón flotante para cambiar imagen, ahora en la parte superior derecha */}
        <IconButton
          color="primary"
          aria-label="upload picture"
          onClick={handleMenu} // Despliega el menú al hacer clic
          sx={{
            position: 'absolute',
            top: 0, // Parte superior derecha del avatar
            marginLeft: 10,
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          <PhotoCamera /> {/* Ícono de cámara */}
        </IconButton>

        {/* Menú con opciones para cambiar o eliminar la imagen */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)} // Se abre si anchorEl tiene un valor
          onClose={handleClose} // Cierra el menú
        >
          <MenuItem>
            <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
              Cambiar foto de perfil
            </label>
            <input
              hidden // Este input está oculto pero es necesario para cargar una imagen
              accept="image/*"
              id="upload-photo"
              type="file"
              onChange={handleImageChange} // Manejador de cambio de imagen
            />
          </MenuItem>

          {/* <MenuItem onClick={handleDeletePhoto}>Eliminar foto de perfil</MenuItem> */}
          <MenuItem onClick={handleDialog}>Eliminar foto de perfil</MenuItem>


        </Menu>
        <Grid container sx={{ justifyContent: 'center'}}spacing={1}>
          <Grid item xs={12} sm={12} md={12} >
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center'}}>
              {user.firstName} {user.secondName} {user.firstLastName} {user.secondLastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} >
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center'}}>
              {user.ci} 
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} >
            <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center'}}>
              {user.birthday} 
            </Typography>
          </Grid>
        </Grid>
        

        <SimpleDialog
          open={openDialog}
          onClose={handleDialogUser}
          tittle={"Editar mi Cuenta"}
        >
          <ProfileForm onClose={handleDialogUser} isEditing={true} datos={user}></ProfileForm>
        </SimpleDialog>
        <Button color="primary" variant="contained" sx={{ marginTop: 2 }} onClick={() => {handleDialogUser()}}>
          Editar Perfil
        </Button>
      </Box>

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