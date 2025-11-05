// ExpenseByDateLine.jsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Stack, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

const moneyFmt = (v) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    .format(Number(v || 0));
const intFmt = (v) =>
  new Intl.NumberFormat('es-EC', { maximumFractionDigits: 0 }).format(Number(v || 0));

const COLORS = [
  '#1976d2', // Azul
  '#9c27b0', // Violeta
  '#2e7d32', // Verde
  '#ef6c00', // Naranja
  '#d32f2f', // Rojo
  '#455a64', // Gris azulado
  '#6d4c41', // Café
  '#00796b', // Turquesa
  '#c2185b', // Fucsia
  '#512da8', // Púrpura fuerte
  '#0288d1', // Celeste fuerte
  '#7cb342', // Verde lima
  '#f9a825', // Amarillo oscuro
  '#5d4037', // Café oscuro
  '#616161', // Gris neutral
  '#00838f', // Cyan oscuro
  '#8e24aa', // Violeta vibrante
  '#43a047', // Verde medio
  '#fb8c00', // Naranja medio
  '#e53935', // Rojo vivo
];


export default function ExpenseByDateLine({ sampleExpenses = [] }) {
  const [mode, setMode] = React.useState('amount'); // 'amount' | 'count'

  // ⚠️ Depende de sampleExpenses
  const dates = React.useMemo(() => {
    const uniq = Array.from(
      new Set(
        sampleExpenses
          .map(e => e?.date)
          .filter(Boolean)
      )
    ).sort((a, b) => new Date(a) - new Date(b));
    return uniq;
  }, [sampleExpenses]);

  // ⚠️ Depende de sampleExpenses
  const products = React.useMemo(() => {
    const map = new Map();
    for (const e of sampleExpenses) {
      // opcional: ignora gastos sin producto asociado
      if (e?.referenceId == null) continue;
      if (!map.has(e.referenceId)) {
        map.set(e.referenceId, {
          id: e.referenceId,
          name: e.productName || `Producto #${e.referenceId}`,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  }, [sampleExpenses]);

  // ⚠️ Depende también de sampleExpenses
  const matrices = React.useMemo(() => {
    const init = {};
    for (const p of products) {
      init[p.id] = {
        amount: Array(dates.length).fill(null),
        count: Array(dates.length).fill(null),
      };
    }
    const dayKeyToIndex = new Map(dates.map((d, i) => [d, i]));

    const acc = {};
    for (const p of products) acc[p.id] = {};

    for (const e of sampleExpenses) {
      if (e?.referenceId == null) continue; // ignora sin producto
      const idx = dayKeyToIndex.get(e.date);
      if (idx == null) continue;
      const pid = e.referenceId;
      if (!acc[pid][idx]) acc[pid][idx] = { amount: 0, count: 0 };
      acc[pid][idx].amount += Number(e.amount || 0);
      acc[pid][idx].count += 1;
    }

    for (const p of products) {
      for (let i = 0; i < dates.length; i++) {
        const v = acc[p.id][i];
        init[p.id].amount[i] = v ? v.amount : null;
        init[p.id].count[i]  = v ? v.count  : null;
      }
    }
    return init;
  }, [products, dates, sampleExpenses]);

  const series = React.useMemo(() => {
    return products.map((p, i) => ({
      id: `prod-${p.id}`,
      label: p.name,
      data: matrices[p.id][mode],
      color: COLORS[i % COLORS.length],
      curve: 'monotoneX',
      connectNulls: true,
      showMark: true,
      valueFormatter: (value) => {
        if (value == null) return '';
        return mode === 'amount' ? moneyFmt(value) : intFmt(value);
      },
    }));
  }, [products, matrices, mode]);

  const tooltipRenderer = React.useCallback((params) => {
    if (!params?.series?.length) return '';
    const index = params.series[0]?.dataIndex ?? 0;
    const date = dates[index];
    if (!date) return '';
    const d = parseISO(date);
    const dateStr = isValid(d)
      ? format(d, "EEEE, d 'de' MMMM yyyy", { locale: es })
      : date;

    const rows = products.map((p, i) => {
      const a = matrices[p.id].amount[index] ?? 0;
      const c = matrices[p.id].count[index] ?? 0;
      const color = COLORS[i % COLORS.length];
      return `
        <div style="display:flex; align-items:center; gap:8px; margin:2px 0;">
          <span style="display:inline-block; width:10px; height:10px; background:${color}; border-radius:2px;"></span>
          <div style="flex:1;">${p.name}</div>
          <div style="text-align:right;">
            <div><span style="opacity:${mode==='amount'?1:0.7}">Monto:</span> <b>${moneyFmt(a)}</b></div>
            <div><span style="opacity:${mode==='count'?1:0.7}">Cant.:</span> <b>${intFmt(c)}</b></div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="padding:10px 12px">
        <div style="font-weight:700; margin-bottom:6px;">${dateStr}</div>
        ${rows}
      </div>
    `;
  }, [dates, products, matrices, mode]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>
          Gastos por fecha — líneas por producto
        </Typography>
        <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value)} name="mode-chart">
          <FormControlLabel value="amount" control={<Radio />} label="Amount ($)" />
          <FormControlLabel value="count"  control={<Radio />} label="Cantidad (#)" />
        </RadioGroup>
      </Stack>

      <LineChart
        height={380}
        xAxis={[{
          scaleType: 'time',
          data: dates.map(d => parseISO(d)),
          valueFormatter: (v) => format(v, 'd MMM', { locale: es }),
        }]}
        series={series}
        margin={{ left: 56, right: 24, top: 16, bottom: 28 }}
        slotProps={{
          tooltip: { trigger: 'axis', renderer: tooltipRenderer },
          legend: { hidden: false },
        }}
      />
    </Box>
  );
}
