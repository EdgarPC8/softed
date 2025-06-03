import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate en lugar de useHistory
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signin, isAuthenticated, errors } = useAuth();
  const navigate = useNavigate(); // Utiliza useNavigate para obtener la función de navegación

  const handleLogin = async (event) => {
    event.preventDefault();
    signin({ username, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Grid
      container
      component="main"
      sx={{ height: "90vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Centramos el contenedor
    >
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              Bienvenido nuevamente
            </Typography>
            <Typography variant="body1" gutterBottom>
              Ingrese sus credenciales
            </Typography>
            {errors?.message && (
              <Alert severity={errors.status}>{errors.message}</Alert>
            )}
          </Box>

          <Box component="form" sx={{ mt: 1 }} onSubmit={handleLogin}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Usuario"
              autoComplete="email"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              type="password"
              id="password"
              label="Contraseña"
              autoComplete="email"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
