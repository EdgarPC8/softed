


import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, TextField, Button, Container, Box,Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate en lugar de useHistory
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signin, isAuthenticated, message,status } = useAuth();
  const navigate = useNavigate(); // Utiliza useNavigate para obtener la función de navegación
  const [showMessage, setShowMessage] = useState(false);

  const handleLogin = async () => {
    try {
      await signin({ username, password });
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Ocultar el mensaje después de 5 segundos
      navigate('/');
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // dcd

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Utiliza navigate para redirigir a la página de dashboard o la que desees
    }
  }, [isAuthenticated]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          {showMessage && (
          <Box mt={2}>
            <Alert severity={status}>{message}</Alert>
          </Box>
        )}
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Usuario"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
       
      </Box>
    </Container>
  );
}

export default Login;
