import { getTiemposByMetrosPrueba } from "../api/tiemposResquest.js";
import { getMetros,getPruebas } from "../api/metrosPruebaResquest.js";
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid,Typography } from '@mui/material'; // Importa los componentes de Material-UI que necesitas
import { useAuth } from '../context/AuthContext';
import ChartLinealTiempos from '../Components/ChartLinealTiempos';
import SelectData from '../Components/SelectData';
import { inputsNumberToTime } from '../Helpers/functions.js';
import StarIcon from '@mui/icons-material/Star';
import ChartBarAllTiempos from "../Components/ChartBarAllTiempos.jsx";
import { getAllTiemposRecordsById } from '../api/tiemposResquest.js';



export default function Progreso() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [dataBar, setDataBar] = useState([]);
  const [dataPruebas, setDataPruebas] = useState([]);
  const [dataMetros, setDataMetros] = useState([]);
  const [tiempoRecord, setTiempoRecord] = useState([]);
  const [prueba, setPrueba] = useState('');
  const [metros, setMetros] = useState('');

  async function getData() {
    try {
      const resMetros = await getMetros();
      const resPruebas = await getPruebas();


      const pruebasData = resPruebas.data.map(prueba => ({
        name: prueba.name,
        value: prueba.name
      }));
      setDataPruebas(pruebasData);

      const metrosData = resMetros.data.map(metros => ({
        name: metros.name,
        value: metros.name
      }));
      setDataMetros(metrosData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  async function getAllTiempos() {
    // try {
    
      const allTime = await getAllTiemposRecordsById(user.username);
      setDataBar(allTime.data.array)
      // console.log(allTime.data)
    // } catch (error) {
    //   console.error('Error al obtener datos:', error);
    // }
  }

  useEffect(() => {
  getAllTiempos()
  }, [data]);
  useEffect(() => {
    getData();
    }, []);

  

  useEffect(() => {
    if (metros !== '' && prueba !== '') {
      const fetchData = async () => {
        try {
          const res = await getTiemposByMetrosPrueba(user.username, metros, prueba);
          setData(res.data.obj);
          setTiempoRecord(res.data.tiempoRecord);
         
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      fetchData();
    }
  }, [metros, prueba]);

  return (
    <Container style={{ textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <SelectData Data={dataMetros} Label="Metros" onChange={setMetros} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectData Data={dataPruebas} Label="Pruebas" onChange={setPrueba} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Box mt={4}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            Tiempo record
          </Typography>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              <StarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {tiempoRecord.tiempo?`${tiempoRecord.tiempo<24000000?inputsNumberToTime(tiempoRecord.tiempo):"No hay Tiempo Record"}  (${tiempoRecord.fecha})`:""}
            </Typography>
          </Box>
          <ChartLinealTiempos Data={data} Metros={metros} Prueba={prueba} />
          <ChartBarAllTiempos Data={dataBar}/>
        </Box>
      </Box>
    </Container>
  );
}
