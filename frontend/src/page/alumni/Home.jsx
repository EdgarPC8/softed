import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  useTheme
} from '@mui/material';

import bannerImage from '/home_istms.png'; // Asegúrate de que esté en /public
import { getCareers } from '../../api/alumniRequest';

export default function HomePageAlumni() {
  const [careers, setCareers] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await getCareers();
        setCareers(res.data); // Asegúrate que res sea un array de objetos con idCareer y name
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };

    fetchCareers();
  }, []);

  return (
    <Box sx={{ bgcolor: '#F5F6FA', minHeight: '100vh' }}>
      
      {/* Banner con texto superpuesto */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 180, sm: 280, md: 270 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={bannerImage}
          alt="Banner"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Texto encima de la imagen */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            px: 2
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
    fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' }, // Responsive
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

      {/* Tarjetas de carreras */}
      <Box px={{ xs: 2, sm: 4, md: 8 }} mt={4} pb={6}>
        <Grid container spacing={3}>
          {careers.map((career) => (
            <Grid item xs={12} sm={6} md={3} key={career.idCareer}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.primary.main,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 4
                  }
                }}
              >
                <Typography variant="h6" fontWeight="medium" color={theme.palette.primary.contrastText}>
                  {career.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
