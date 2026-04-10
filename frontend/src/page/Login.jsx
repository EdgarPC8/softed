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
import { activeAppId, activeApp } from "../../appConfig.js";
import bannerImageEddeli from "/home_edDeli.png";
import bannerImageAlumni from "/home_istms.png";



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

  const loginBackground =
    activeAppId === "alumni" ? bannerImageAlumni : activeAppId === "eddeli" ? bannerImageEddeli : bannerImageAlumni;

  const isTurnos = activeAppId === "turnos";
  const isEnfermeriaBg = activeAppId === "enfermeria";
  const isMusicaBg = activeAppId === "musica";
  const boxSx = isTurnos || isEnfermeriaBg || isMusicaBg
    ? {
        height: "100vh",
        background: isEnfermeriaBg
          ? "linear-gradient(135deg, #1976D2 0%, #0D47A1 50%, #42A5F5 100%)"
          : isMusicaBg
          ? (activeApp?.background ||
              "linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #880e4f 100%)")
          : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }
    : {
        height: "100vh",
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

  return (
    <Box sx={boxSx}>
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
