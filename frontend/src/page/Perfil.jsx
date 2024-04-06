import React from 'react';
import { Container, Typography, Box, Avatar, Button } from '@mui/material';
import { useAuth } from "../context/AuthContext";


function Perfil() {
  const { isAuthenticated, logout, user, isLoading } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Avatar alt={user.firstName} src="/ruta/a/imagen.jpg" sx={{ width: 100, height: 100 }} />
        <Typography variant="h5" mt={2}>{`${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`}</Typography>
        <Typography variant="subtitle1" mt={1}>{`${user.username}`}</Typography>
        {/* <Typography variant="subtitle1" mt={1}>Rol: Usuario</Typography> */}
        {/* <Button variant="contained" color="primary" mt={2}>Editar perfil</Button> */}
      </Box>
    </Container>
  );
}

export default Perfil;
