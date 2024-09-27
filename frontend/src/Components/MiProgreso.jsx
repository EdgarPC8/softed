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
import DataTableInfo from "../Components/DataTableTiemposInfo";
import { getInfo } from "../api/infoResquest.js";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataTable from "../Components/DataTable";

export default function Progreso() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [dataBar, setDataBar] = useState([]);
  const [dataPruebas, setDataPruebas] = useState([]);
  const [dataMetros, setDataMetros] = useState([]);
  const [tiempoRecord, setTiempoRecord] = useState([]);
  const [prueba, setPrueba] = useState('');
  const [metros, setMetros] = useState('');
  const [dataInfo, setDataInfo] = useState([]);
  const [times, setTimes] = useState([]);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


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
      const info = await getInfo(user.username);
      setDataInfo(info.data.Info)
      setTimes(allTime.data.minTimeByDate)
  }

  useEffect(() => {
  getAllTiempos()
  }, [data,dataInfo,times,dataBar]);
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
  const columns = [
    {
      headerName: "Metros",
      field: "metros",
      width: 250,
    },
    {
      headerName: "Prueba",
      field: "prueba",
      width: 250,
    },
    {
      headerName: "Fecha",
      field: "fecha",
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
      </Grid>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
           Tiempo Record
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Muestra el tiempo record en una grafica lineal segun los metros y pruebas que elijas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
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
                {tiempoRecord.tiempo ? `${tiempoRecord.tiempo < 24000000 ? inputsNumberToTime(tiempoRecord.tiempo) : "No hay Tiempo Record"}  (${tiempoRecord.fecha})` : "Elije los metros y la prueba!!!"}
              </Typography>
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            Tiempo record
          </Typography>
            <ChartLinealTiempos Data={data} Metros={metros} Prueba={prueba} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Historial De Tiempos</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Muestra el historial de tus tiempos por fechas y pruebas detallando si superaste o no superaste tu tiempo en ese dia
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <DataTableInfo data={dataInfo} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Tus Tiempos records
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Muestra todos tus tiempos records en cada prueba y metros desde la fecha mas antigua a la mas actual
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <DataTable data={times} columns={columns} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Grafica de tus tiempos records</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Muestra todos tus tiempos records de cada prueba desde los 25 hasta los 300 Metros en una grafica 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <ChartBarAllTiempos Data={dataBar} />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
