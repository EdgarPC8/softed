import React from 'react';
import { Box, Typography } from '@mui/material';

import bannerImage from '/home_istms.png';

import { getMatrizStats } from '../../api/alumniRequest';
import AlumniEnCifras from './AlumniEnCifras';

export default function HomePageAlumni() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        color: 'text.primary',
      }}
    >
      {/* Banner con texto superpuesto */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 180, sm: 280, md: 270 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={bannerImage}
          alt="Banner"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            px: 2,
          }}
        >
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              textShadow: `
                3px 3px 8px rgba(0, 0, 0, 0.8),
                -2px -2px 4px rgba(0, 0, 0, 0.6),
                2px -2px 4px rgba(0, 0, 0, 0.6),
                -2px 2px 4px rgba(0, 0, 0, 0.6)
              `,
              fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' },
            }}
          >
            ALUMNI
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 1,
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            }}
          >
            Sistema Alumni para gestión de currículums de egresados y graduados
          </Typography>
        </Box>
      </Box>

      {/* Alumni en cifras: estadísticas desde matriz (carrera + género) */}
      <Box px={{ xs: 2, sm: 4, md: 8 }} pb={6}>
        <AlumniEnCifras getStats={getMatrizStats} />
      </Box>
    </Box>
  );
}
