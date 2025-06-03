import React from "react";
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function RecepcionCuartos() {
  const array = [
    {
      name: "201",
      description: "Simple",
      info: "Disponible",
    },
    {
      name: "202",
      description: "Doble",
      info: "Ocupada",
    },
    {
      name: "203",
      description: "Matrimonial",
      info: "Limpieza",
    },
    {
      name: "204",
      description: "Suit",
      info: "Reservada",
    },
    {
      name: "205",
      description: "Simple",
      info: "LimpiezaIntermedia",
    },
    {
      name: "206",
      description: "Doble",
      info: "ReservadaRetraso",
    },
    {
      name: "218",
      description: "Suit",
      info: "Reservada",
    },
 
    {
      name: "208",
      description: "Simple",
      info: "Disponible",
    },
    {
      name: "209",
      description: "Doble",
      info: "Ocupada",
    },
    {
      name: "210",
      description: "Matrimonial",
      info: "Limpieza",
    },
 
    {
      name: "211",
      description: "Suit",
      info: "Reservada",
    },
    {
      name: "212",
      description: "Simple",
      info: "LimpiezaIntermedia",
    },
    {
      name: "213",
      description: "Doble",
      info: "ReservadaRetraso",
    },
    {
      name: "214",
      description: "Matrimonial",
      info: "OcupadaExpirada",
    },
    {
      name: "207",
      description: "Matrimonial",
      info: "OcupadaExpirada",
    },
    {
      name: "215",
      description: "Simple",
      info: "Disponible",
    },
    {
      name: "216",
      description: "Doble",
      info: "Ocupada",
    },
    {
      name: "217",
      description: "Matrimonial",
      info: "Limpieza",
    },

    {
      name: "219",
      description: "Simple",
      info: "LimpiezaIntermedia",
    },
    {
      name: "220",
      description: "Doble",
      info: "ReservadaRetraso",
    },
  ];
  

const config = {
  Disponible: {
    icon: <LocalHotelIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Disponible</Typography>
        <ArrowCircleRightIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.green"
  },
  Ocupada: {
    icon: <AccessTimeIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Ocupada</Typography>
        <ReportProblemIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.red"
  },
  OcupadaExpirada: {
    icon: <AlarmOnIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Ocupada / Excedido</Typography>
        <ReportProblemIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.pink"
  },
  Limpieza: {
    icon: <DeleteOutlineIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Limpiar</Typography>
        <RotateRightIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.blue"
  },
  Reservada: {
    icon: <PermContactCalendarIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Reservada</Typography>
        <PermContactCalendarIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.gold"
  },
  ReservadaRetraso: {
    icon: <DateRangeIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Reservada con Retraso</Typography>
        <DateRangeIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.orange"
  },
  LimpiezaIntermedia: {
    icon: <AutoDeleteIcon sx={{ fontSize: '4rem' }} />,
    text: (
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Ocupada/En Limpieza</Typography>
        <RotateRightIcon sx={{ fontSize: '1.5rem', marginLeft: 1 }} />
      </Box>
    ),
    backgroundColor: "colors.cyan"
  },
};


  return (
    <Grid container sx={{ justifyContent: 'center'}}spacing={1}>
      {array.map((valor, index) => (
        <Grid key={index} item xs={12} sm={6} md={2}>
            <Paper elevation={5} sx={{ backgroundColor: config[valor.info].backgroundColor, marginBottom: 1 }}>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    height={"100%"}
                    padding={1}
                    sx={{ backgroundColor: config[valor.info].backgroundColor, overflow: "hidden" }}
                  >
                    <Typography variant="h5" noWrap color={"text.accent"}>
                      {valor.name}
                    </Typography>
                    <Box sx={{ marginTop: 1 }} />
                    <Typography variant="h7" noWrap color={"text.accent"}>
                      {valor.description}
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
                    sx={{ backgroundColor: config[valor.info].backgroundColor, overflow: "hidden" }}
                  >
                    <Box sx={{ color: 'rgba(0, 0, 0, 0.1)',filter: 'brightness(0.9)' }}>
                      {config[valor.info].icon}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    position="relative"
                    padding={1}
                    sx={{
                      backgroundColor: config[valor.info].backgroundColor,
                      filter: 'brightness(0.9)',
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="h5" noWrap color={"text.accent"}>
                      {config[valor.info].text}
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

export default RecepcionCuartos;
