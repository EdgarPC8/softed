import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectingRole, setSelectingRole] = useState(false);
  const [roles, setRoles] = useState([]);
  const [accountId, setAccountId] = useState(null);

  const { signin, isAuthenticated, errors } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginPayload = { username, password };
    const result = await signin(loginPayload);

    if (result?.selectRole) {
      setSelectingRole(true);
      setRoles(result.roles);
      setAccountId(result.accountId);
    } else if (result?.success) {
      navigate("/");
    }
  };

  const handleRoleSelect = async (roleId) => {
    const loginPayload = {
      username,
      password,
      selectedRoleId: roleId,
    };
    const result = await signin(loginPayload);
    if (result?.success) navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: "url('/home_istms.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!selectingRole ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Bienvenido nuevamente
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Ingrese sus credenciales
                </Typography>

                {errors?.message && (
                  <Alert severity={errors.status || "error"}>{errors.message}</Alert>
                )}

                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Iniciar sesión
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Seleccione con qué rol desea ingresar
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3, width: "100%" }}>
                  {roles.map((role) => (
                    <Button
                      key={role.id}
                      variant="contained"
                      fullWidth
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      {role.name}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Grid>
    </Box>
  );
}

export default Login;
