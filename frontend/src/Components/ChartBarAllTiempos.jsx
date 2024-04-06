import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import { inputsNumberToTime } from '../Helpers/functions.js';
import React, { useEffect, useState } from 'react';


// Función de formateo de valor similar a la que tienes en el otro componente
const valueFormatter = (value) => {
  // Aquí debes poner la lógica para formatear el valor según tus necesidades
  // En este ejemplo, se devuelve simplemente el valor sin formatear
  if(value===0)return "No hay Tiempo"
  if(value===null)return "No hay Tiempo"

  const resultado=inputsNumberToTime(value)
  return resultado;
};

 function ChartBarAllTiempos({Data=[]}) {
  const [seriesNb, setSeriesNb] = useState(2);
  const [itemNb, setItemNb] = useState(5);
  const [skipAnimation, setSkipAnimation] = useState(false);


  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };
  const handleSeriesNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setSeriesNb(newValue);
  };
  const highlightScope = {
    highlighted: 'Metros',
    faded: 'global',
  };

  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
        height={300}
        dataset={Data}
        series={Data
          .slice(0, seriesNb)
          .map((s) => ({ ...s, data: s.data.slice(0, itemNb),label: `${s.label}`,valueFormatter }))}
        skipAnimation={skipAnimation}
        xAxis={[{ scaleType: 'band', dataKey: 'prueba' }]} 
      />
      <FormControlLabel
        checked={skipAnimation}
        control={
          <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
        }
        label="skipAnimation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Numero de pruebas
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={12}
        aria-labelledby="input-item-number"
      />
      <Typography id="input-series-number" gutterBottom>
        Numero de Metros
      </Typography>
      <Slider
        value={seriesNb}
        onChange={handleSeriesNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={12}
        aria-labelledby="input-series-number"
      />
    </Box>
  );
}
export default ChartBarAllTiempos

