import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Container,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate en lugar de useHistory
import { useAuth } from "../context/AuthContext";
import { ErrorSharp } from "@mui/icons-material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signin, isAuthenticated, errors } = useAuth();
  const navigate = useNavigate(); // Utiliza useNavigate para obtener la función de navegación
  const [showMessage, setShowMessage] = useState(false);

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
      
      sx={{ height: "calc(100vh - 64px)" }}
    >
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600965962102-9d260a71890d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
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
              // required
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
              // required
              fullWidth
              type="password"
              id="password"
              label="Contraseña"
              autoComplete="email"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              autoFocus
            />

            {/* <Button variant="contained" color="primary">
              Login
            </Button> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Inicar sesión
            </Button>
            {/* <Copyright sx={{ mt: 5 }} /> */}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
