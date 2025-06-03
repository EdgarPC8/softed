import * as React from 'react';
import RecepcionCuartos from '../../Components/Papers/RecepcionCuartos.jsx';
import { Paper, Typography, Grid, Box, Container } from "@mui/material";


export default function Recepcion() {

  return (
    <Box margin={"2rem"}>
      <Typography variant="h3" noWrap >
        Vista General de Recepción
      </Typography>
      <RecepcionCuartos />
    </Box>
  );
}
