import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material';

import bannerImage from '/home_istms.png'; // Ajusta esta ruta


const courses = [
  { title: 'UX Design Program', category: 'Design', date: '8th September', color: '#E0F7FA' },
  { title: 'Data Science Professional', category: 'Big data', date: '13th September', color: '#E8EAF6' },
  { title: 'Prompt Engineering', category: 'AI Management', date: '22th September', color: '#FCE4EC' },
  { title: 'Full Stack Web Dev', category: 'Development', date: '29th September', color: '#E3F2FD' },
  { title: 'Digital Marketing', category: 'Marketing', date: '2nd October', color: '#FFF3E0' },
  { title: 'Cybersecurity', category: 'Security', date: '10th October', color: '#E8F5E9' }
];

export default function HomeCourses() {
  return (
    <Box sx={{ bgcolor: '#F5F6FA', minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: 180, sm: 280, md: 360 },
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
      </Box>

      {/* Tarjetas de cursos */}
      <Box px={{ xs: 2, sm: 4, md: 8 }} mt={2} pb={6}>
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ bgcolor: course.color, borderRadius: 3, height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://via.placeholder.com/400x140"
                  alt={course.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.category} • {course.date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
