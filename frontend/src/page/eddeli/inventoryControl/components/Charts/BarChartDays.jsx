import * as React from 'react';
import { Box, useTheme } from '@mui/material';
import { useAnimate } from '@mui/x-charts/hooks';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import ChartBlockHeader from '../../../../../Components/Charts/ChartBlockHeader';
import { getChartSeriesColors } from '../../../../../theme/chartPalette';

export default function BarChartDays({
  dataDays = ['L', 'M', 'W', 'J', 'V', 'S', 'D'],
  dataValues = [0, 0, 0, 0, 0, 0, 0],
  title = 'Ventas diarias (semana actual)',
  subtitle = 'Suma en dólares de pedidos con estado «pagado» por día, de lunes a domingo (según datos del servidor).',
}) {
  const theme = useTheme();
  const barColor = getChartSeriesColors(theme)[0];

  return (
    <Box>
      <ChartBlockHeader title={title} subtitle={subtitle} />
      <ChartContainer
        xAxis={[{ scaleType: 'band', data: dataDays }]}
        series={[{ type: 'bar', id: 'base', data: dataValues, color: barColor }]}
        height={160}
        yAxis={[{ width: 36 }]}
        margin={{ left: 4, right: 10, top: 8, bottom: 4 }}
      >
        <BarPlot barLabel="value" slots={{ barLabel: BarLabel }} />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Box>
  );
}

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

function BarLabel(props) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: x + width / 2, y: y - 8 },
    {
      initialProps: { x: x + width / 2, y: yOrigin },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element, p) => {
        element.setAttribute('x', p.x.toString());
        element.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    }
  );

  return <Text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />;
}
