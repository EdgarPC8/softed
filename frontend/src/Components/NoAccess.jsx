import * as React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import BlockIcon from '@mui/icons-material/Block';

import {
  Typography,
  Box,
} from '@mui/material';

export default function NoAcces() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <LockIcon sx={{ fontSize: 100, color: 'primary.main' }} />
      <Typography variant="h5" align="center" mt={2}>
        Acceso denegado
      </Typography>
      <Typography variant="body1" align="center" mt={1}>
        No tienes permiso para acceder a esta página.
      </Typography>
      <BlockIcon sx={{ fontSize: 40, color: 'error.main', mt: 2 }} />
    </Box>
  );
}
