import * as React from 'react';
import Analisis from '../../Components/Papers/Analisis.jsx';
import { Paper, Typography, Grid, Box, Container } from "@mui/material";


export default function Analytics() {

  return (
    <Box margin={"2rem"}>
      <Typography variant="h3" noWrap >
        Pagina de Analisis
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Analisis />
        </Grid>
        <Grid item xs={3} sm={3} >
          <Typography variant="h5" noWrap sx={{ backgroundColor:"colors.green" }} paddingBottom={33}>
          Habitacion mas reservada
           </Typography>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Typography variant="h5" noWrap sx={{ backgroundColor:"colors.red" }} paddingBottom={33}>
          Habitacion menos reservada
           </Typography>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography variant="h5" noWrap sx={{ backgroundColor:"colors.gold" }} paddingBottom={33}>
          Grafica de Estadisticas de ls ventas
           </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
