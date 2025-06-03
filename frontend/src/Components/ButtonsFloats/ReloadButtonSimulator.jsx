import React from 'react';
import { Fab } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function ReloadButtonSimulator() {
  const handleReload = () => {
    // Eliminar los datos de 'quizAnswers' del localStorage
    localStorage.removeItem("quizAnswers");

    // Recargar la página
    // window.location.reload();
  };

  return (
    <Fab
      color="primary"
      aria-label="reload"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
      onClick={handleReload}
    >
      <RefreshIcon />
    </Fab>
  );
}

export default ReloadButtonSimulator;
