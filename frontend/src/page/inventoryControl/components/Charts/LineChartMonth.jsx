import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const defaultColors = ['#3366cc', '#ffbb33', '#ff4444', '#66bb6a', '#ab47bc'];

export default function StackedAreas({ data = [], seriesName = [] }) {
  const preparedData = data.map((point) => {
    const newPoint = { ...point, date: new Date(point.date) };
    seriesName.forEach(({ id }) => {
      const key = String(id);
      if (typeof newPoint[key] !== 'number' || isNaN(newPoint[key])) {
        newPoint[key] = 0;
      }
    });
    return newPoint;
  });

  return (
    <div style={{ width: '100%' }}>
      <LineChart
        dataset={preparedData}
        xAxis={[
          {
            id: 'Días',
            dataKey: 'date',
            scaleType: 'time',
            valueFormatter: (date) =>
              new Date(date).toLocaleDateString('es-EC', {
                day: '2-digit',
                month: 'short',
              }),
          },
        ]}
        yAxis={[{ width: 70 }]}
        series={seriesName.map((item, index) => ({
          id: String(item.id),
          label: item.name,
          dataKey: String(item.id),
          stack: 'total',
          area: true,
          showMark: false,
          color: defaultColors[index % defaultColors.length],
        }))}
        height={250}
        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
      />
    </div>
  );
}
