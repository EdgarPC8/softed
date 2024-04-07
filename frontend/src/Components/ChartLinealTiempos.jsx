import * as React from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import { inputsNumberToTime } from '../helpers/functions';




const otherSetting = {
  height: 300,
  yAxis: [{ label: 'tiempo (hh:mm:ss,ms)' }],
  grid: { horizontal: true },
  sx: {
    [`& .${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translateX(40px)',
    },
  },
};

const valueFormatter = (value) => {
  return inputsNumberToTime(value);
};


export default function ChartLinealTiempos({Data,Metros,Prueba}) {
  return (
    <LineChart
      dataset={Data}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'fecha',
          valueFormatter: (date, context) =>
            context.location === 'tick'
              ? `${date.slice(0, 6)} \n${date.slice(7, 11)}`
              : `${date}`,
        },
      ]}
      series={[{ dataKey: 'tiempo', label: `${Metros} ${Prueba}`, valueFormatter }]}
      {...otherSetting}
    />
  );
}
