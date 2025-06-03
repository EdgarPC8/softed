import * as React from 'react';
import InfoCuartos from '../../Components/Papers/InfoCuartos.jsx';
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import HotelForm from '../../Components/Forms/HotelForm.jsx';
import { getHotel } from "../../api/hotelRequest";
import { useEffect, useState } from "react";




export default function InfoHotel() {
  const [hotel, setHotel] = useState([]);

  const fecth = async () => {
    const { data } = await getHotel();
    setHotel(data)
  };

  useEffect(() => {
    fecth();
  }, []);

  return (
    <Box margin={"2rem"}>
      <Typography variant="h3" noWrap >
        Informacion del Hotel
      </Typography>
      <Grid container spacing={4} marginTop={2}>

        <Grid item xs={6} sm={6} sx={{ backgroundColor: "colors.gray" }}>
        {hotel.length > 0 && (
          <HotelForm datos={hotel[0]} isEditing={true} reload={setHotel}/>
          )}

        </Grid>
        <Grid item xs={6} sm={6} sx={{ backgroundColor: "colors.gray" }}>
          {hotel.length == 0 && (
            <Typography variant="h5">
              No Hay Ningun Hotel Registrado, Porfavor Registre uno para empezar a usar el Programa
            </Typography>
          )}
          {hotel.length > 0 && (
            <Grid spacing={2} container textAlign={"center"}>
              <Grid item xs={12}>
                <Typography variant="h2">
                  {hotel[0].name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4">
                  {hotel[0].description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {hotel[0].ubication}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {hotel[0].phone}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {hotel[0].typeCoin}
                </Typography>
              </Grid>

            </Grid>
            
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
