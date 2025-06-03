import { Navigate, Outlet } from "react-router-dom";
import * as React from 'react';
import { useAuth } from "../context/AuthContext";
import NoAcces from "../Components/NoAccess";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function ProtectedRoute({ requiredRol }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // console.log(isLoading, isAuthenticated,user);

  if (isLoading)
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Establece la altura del contenedor al 100% del viewport
      }}
    >
      <CircularProgress size={100} /> {/* Establece el tamaño del CircularProgress */}
    </Box>
  );



  if (isLoading && isAuthenticated && !requiredRol.includes(user.loginRol)) {
    return <NoAcces/>;

  }
  if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;

  // console.log(user)


  return <Outlet />;

}

export default ProtectedRoute;
