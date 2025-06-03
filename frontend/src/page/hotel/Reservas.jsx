import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

const Reservas = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const startDay = startOfMonth(currentDate);
  const endDay = endOfMonth(currentDate);
  
  // Obtener el primer día de la semana para el inicio del mes
  const startWeek = startOfWeek(startDay);
  // Obtener el último día de la semana que sigue al último día del mes
  const endWeek = endOfWeek(endDay);
  
  // Obtener todos los días desde el inicio de la semana hasta el final de la semana
  const daysToShow = eachDayOfInterval({ start: startWeek, end: endWeek });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center">
        {format(currentDate, 'MMMM yyyy')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button variant="contained" onClick={handlePrevMonth}>
          Mes Anterior
        </Button>
        <Button variant="contained" onClick={handleNextMonth}>
          Mes Siguiente
        </Button>
      </Box>
      <Grid container spacing={2}>
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">{day}</Typography>
            </Paper>
          </Grid>
        ))}
        {daysToShow.map((date) => (
          <Grid item xs={12 / 7} key={date}>
            <Paper
              elevation={3}
              sx={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: date.getMonth() !== currentDate.getMonth() ? 0.5 : 1,
              }}
            >
              <Typography variant="body1">{format(date, 'd')}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reservas;
