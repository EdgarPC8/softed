import React from "react";
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import LocalHotelIcon from '@mui/icons-material/LocalHotel';

function InfoCuartos() {
  const array = [
    {
      title: "Total de habitaciones",
      count: "10",
      icon: <LocalHotelIcon sx={{ fontSize: '7rem' }} />, // Cambia aquí el tamaño
      backgroundColor: "colors.green"
    },
    {
      title: "Habitaciones Libres",
      count: "23",
      icon: <LocalHotelIcon sx={{ fontSize: '7rem' }} />, // Cambia aquí el tamaño
      backgroundColor: "colors.blue"
    },
    {
      title: "Habitaciones Ocupadas",
      count: "3",
      icon: <LocalHotelIcon sx={{ fontSize: '7rem' }} />, // Cambia aquí el tamaño
      backgroundColor: "colors.red"
    },
    {
      title: "Habitaciones Reservadas",
      count: "24",
      icon: <LocalHotelIcon sx={{ fontSize: '7rem' }} />, // Cambia aquí el tamaño
      backgroundColor: "colors.gold"
    },
  ];

  return (
    <Grid container sx={{ justifyContent: 'center'}}spacing={1}>
      {array.map((valor, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
            <Paper elevation={5} sx={{ backgroundColor: valor.backgroundColor, marginBottom: 1 }}>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    height={"100%"}
                    padding={1}
                    sx={{ backgroundColor: valor.backgroundColor, overflow: "hidden" }}
                  >
                    <Typography variant="h2" noWrap color={"text.accent"}>
                      {valor.count}
                    </Typography>
                    <Box sx={{ marginTop: 1 }} />
                    <Typography variant="h7" noWrap color={"text.accent"}>
                      {valor.title}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    height={"100%"}
                    padding={2}
                    sx={{ backgroundColor: valor.backgroundColor, overflow: "hidden" }}
                  >
                    <Box sx={{ color: 'rgba(0, 0, 0, 0.1)',filter: 'brightness(0.9)' }}>
                      {valor.icon}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    position="relative"
                    padding={1}
                    sx={{
                      backgroundColor: valor.backgroundColor,
                      filter: 'brightness(0.9)',
                      marginTop: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="h6" noWrap color={"text.accent"}>
                      Más Información...
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default InfoCuartos;
