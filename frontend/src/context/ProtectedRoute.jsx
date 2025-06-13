import { Navigate, Outlet } from "react-router-dom";
import * as React from 'react';
import { useAuth } from "../context/AuthContext";
import NoAcces from "../Components/NoAccess";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function ProtectedRoute({ requiredRol }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mostrar cargando mientras se verifica la sesión
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado pero no tiene el rol requerido, mostrar acceso denegado
  if (requiredRol && !requiredRol.includes(user.loginRol)) {
    return <NoAcces />;
  }

  // Si todo está bien, renderiza la ruta protegida
  return <Outlet />;
}

export default ProtectedRoute;
