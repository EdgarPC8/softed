import { getTiemposByMetrosPrueba } from "../api/tiemposResquest.js";
import { getMetros,getPruebas } from "../api/metrosPruebaResquest.js";
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid,Typography } from '@mui/material'; // Importa los componentes de Material-UI que necesitas
import { useAuth } from '../context/AuthContext';
import ChartLinealTiempos from '../Components/ChartLinealTiempos';
import SelectData from '../Components/SelectData';
import { inputsNumberToTime } from '../helpers/functions.js';
import StarIcon from '@mui/icons-material/Star';
import ChartBarAllTiempos from "../Components/ChartBarAllTiempos.jsx";
import { getAllTiemposRecordsById } from '../api/tiemposResquest.js';
import {
  getAllNadadores,
} from "../api/nadadoresResquest.js";
import DataTable from "../Components/DataTable";



export default function Progreso() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [dataBar, setDataBar] = useState([]);
  const [dataPruebas, setDataPruebas] = useState([]);
  const [dataMetros, setDataMetros] = useState([]);
  const [dataNadadores, setDataNadadores] = useState([]);
  const [tiempoRecord, setTiempoRecord] = useState([]);
  const [times, setTimes] = useState([]);
  const [prueba, setPrueba] = useState('');
  const [metros, setMetros] = useState('');
  const [nadadores, setNadadores] = useState('');

  async function getData() {
    try {
      const resMetros = await getMetros();
      const resPruebas = await getPruebas();
      const resNadadores = await getAllNadadores();
      const nadadoresData = resNadadores.data.map(nad => ({
        name: nad.nadador,
        value: nad.cedula
      }));
      setDataNadadores(nadadoresData);


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
      const allTime = await getAllTiemposRecordsById(nadadores);
      setDataBar(allTime.data.array)
      setTimes(allTime.data.minTimeByDate)

  }

  useEffect(() => {
  getAllTiempos()
  }, [data]);
  useEffect(() => {
    getData();
    }, []);

  

  useEffect(() => {
    if (metros !== '' && prueba !== ''& nadadores !== '') {
      const fetchData = async () => {
        try {
          const res = await getTiemposByMetrosPrueba(nadadores, metros, prueba);
          setData(res.data.obj);
          setTiempoRecord(res.data.tiempoRecord);
         
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      fetchData();
    }
  }, [metros, prueba,nadadores]);
  const columns = [
    {
      headerName: "Metros",
      field: "Metros",
      width: 250,
    },
    {
      headerName: "Prueba",
      field: "Prueba",
      width: 250,
    },
    {
      headerName: "Fecha",
      field: "Fecha",
      width: 250,
    },
    {
      headerName: "Tiempo",
      field: "tiempo",
      width: 250,
    },
  ];

  return (
    <Container style={{ textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <SelectData Data={dataMetros} Label="Metros" onChange={setMetros} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectData Data={dataPruebas} Label="Pruebas" onChange={setPrueba} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectData Data={dataNadadores} Label="Nadadores" onChange={setNadadores} />
        </Grid>
      </Grid>
      <DataTable data={times} columns={columns} />


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
