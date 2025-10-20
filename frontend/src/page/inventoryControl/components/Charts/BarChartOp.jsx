import * as React from 'react';
import { useMemo, useState } from 'react';
import { Box, Button, Stack, Typography, Chip } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  format, startOfWeek, endOfWeek, addWeeks, isWithinInterval, parse,
} from 'date-fns';
import { es } from 'date-fns/locale';

/** === Ejemplo de datos === */
const mockOrders = [
  { id: 101, date: '07/10/2025 10:30:00', ERP_customer: { name: 'Cliente A' },
    ERP_order_items: [
      { id: 1, quantity: 2, price: 15, paidAt: '07/10/2025 11:00:00', deliveredAt: '07/10/2025 15:00:00' },
      { id: 2, quantity: 1, price: 20, paidAt: '07/10/2025 11:00:00', deliveredAt: '07/10/2025 15:10:00' },
    ],
  },
  { id: 102, date: '12/10/2025 18:15:00', ERP_customer: { name: 'Cliente B' },
    ERP_order_items: [
      { id: 3, quantity: 3, price: 12, paidAt: null, deliveredAt: '12/10/2025 20:00:00' },
    ],
  },
  { id: 103, date: '18/10/2025 20:05:00', ERP_customer: { name: 'Cliente C' },
    ERP_order_items: [
      { id: 4, quantity: 1, price: 100, paidAt: null, deliveredAt: null },
      { id: 5, quantity: 2, price: 35,  paidAt: null, deliveredAt: null },
    ],
  },
  { id: 104, date: '19/10/2025 09:00:00', ERP_customer: { name: 'Cliente D' },
    ERP_order_items: [
      { id: 6, quantity: 4, price: 8, paidAt: '19/10/2025 09:30:00', deliveredAt: '19/10/2025 12:00:00' },
    ],
  },
];

const intFmt   = (v) => new Intl.NumberFormat('es-EC', { maximumFractionDigits: 0 }).format(v ?? 0);
const moneyFmt = (v) => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v ?? 0);
const WEIGHT_COUNTS = 0.6;
const WEIGHT_MONEY  = 1.0;
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function parseOrderDate(s) {
  return parse(s, 'dd/MM/yyyy HH:mm:ss', new Date());
}

function aggregateWeek(orders, weekStart, weekEnd) {
  const rows = DAYS.map((day) => ({
    day, date: null, ordersCount: 0, ordersAmount: 0, paidOrdersCount: 0, paidAmount: 0,
  }));

  orders.forEach((o) => {
    const od = parseOrderDate(o.date);
    if (!isWithinInterval(od, { start: weekStart, end: weekEnd })) return;

    const idx = (Number(format(od, 'i')) - 1);
    rows[idx].date = od;
    rows[idx].ordersCount += 1;

    let orderTotal = 0, paidTotal = 0, hasPaid = false;
    o.ERP_order_items.forEach((it) => {
      const q = Number(it.quantity ?? 0);
      const sub = q * Number(it.price ?? 0);
      orderTotal += sub;
      if (it.paidAt) { hasPaid = true; paidTotal += sub; }
    });

    rows[idx].ordersAmount += orderTotal;
    if (hasPaid) rows[idx].paidOrdersCount += 1;
    rows[idx].paidAmount += paidTotal;
  });

  return rows;
}

function buildVisualDataset(rows) {
  const maxCount = Math.max(...rows.map(r => Math.max(r.ordersCount, r.paidOrdersCount)), 1);
  const maxMoney = Math.max(...rows.map(r => Math.max(r.ordersAmount, r.paidAmount)), 1);

  return rows.map((r) => ({
    ...r,
    s_ordersCount:  (r.ordersCount    / maxCount) * WEIGHT_COUNTS,
    s_ordersAmount: (r.ordersAmount   / maxMoney) * WEIGHT_MONEY,
    s_paidCount:    (r.paidOrdersCount/ maxCount) * WEIGHT_COUNTS,
    s_paidAmount:   (r.paidAmount     / maxMoney) * WEIGHT_MONEY,
  }));
}

export default function BarChartOp({
  orders = mockOrders,
  initialDate = new Date(),
}) {
  const [anchorDate, setAnchorDate] = useState(initialDate);

  const weekStart = startOfWeek(anchorDate, { locale: es, weekStartsOn: 1 });
  const weekEnd   = endOfWeek(weekStart, { locale: es, weekStartsOn: 1 });

  const rows = useMemo(() => aggregateWeek(orders, weekStart, weekEnd), [orders, weekStart, weekEnd]);
  const dataset = useMemo(() => buildVisualDataset(rows), [rows]);

  const totals = useMemo(() => {
    let ordersCount = 0, ordersAmount = 0, paidOrdersCount = 0, paidAmount = 0;
    rows.forEach(r => {
      ordersCount += r.ordersCount;
      ordersAmount += r.ordersAmount;
      paidOrdersCount += r.paidOrdersCount;
      paidAmount += r.paidAmount;
    });
    return { ordersCount, ordersAmount, paidOrdersCount, paidAmount };
  }, [rows]);

  const chartSetting = {
    height: 360,
    xAxis: [{ dataKey: 'day', scaleType: 'band' }],
    yAxis: [{ label: 'Escala combinada' }],
    margin: { left: 56, right: 24, top: 16, bottom: 28 },
    barCategoryGap: 12,
  };

  const title = `${format(weekStart, "d 'de' MMM", { locale: es })} – ${format(weekEnd, "d 'de' MMM, yyyy", { locale: es })}`;

  return (
    <Box>
      {/* === Header centrado con botones a los lados === */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1.5,
          position: 'relative',
        }}
      >
        {/* Botón anterior */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => setAnchorDate((d) => new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000))}
          sx={{ position: 'absolute', left: 0 }}
        >
          ◀ 
        </Button>

        {/* Fecha centrada */}
        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700 }}>
          Semana: {title}
        </Typography>

        {/* Botón siguiente */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => setAnchorDate((d) => new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000))}
          sx={{ position: 'absolute', right: 0 }}
        >
        ▶
        </Button>
      </Box>

      {/* Leyenda */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip size="small" label="Pedidos (# + $)" color="primary" />
        <Chip size="small" label="Pagados (# + $)" color="success" />
      </Stack>

      {/* === Gráfico === */}
      <BarChart
        dataset={dataset}
        {...chartSetting}
        series={[
          { dataKey: 's_ordersCount', label: 'Pedidos (#)', stack: 'orders' },
          { dataKey: 's_ordersAmount', label: 'Pedidos ($)', stack: 'orders' },
          { dataKey: 's_paidCount', label: 'Pagados (#)', stack: 'paid' },
          { dataKey: 's_paidAmount', label: 'Pagados ($)', stack: 'paid' },
        ]}
        slotProps={{
          legend: { hidden: false },
          tooltip: {
            trigger: 'axis',
            renderer: (params) => {
              if (!params?.series?.length) return '';
              const idx = params.series[0]?.dataIndex ?? 0;
              const d = rows[idx];
              return `
                <div style="padding:8px 10px">
                  <div><b>${d.day}</b></div>
                  <div style="margin-top:6px"><u>Pedidos</u></div>
                  <div>• Cantidad: ${intFmt(d.ordersCount)}</div>
                  <div>• Dinero: ${moneyFmt(d.ordersAmount)}</div>
                  <div style="margin-top:6px"><u>Pagados</u></div>
                  <div>• Cantidad: ${intFmt(d.paidOrdersCount)}</div>
                  <div>• Dinero: ${moneyFmt(d.paidAmount)}</div>
                </div>
              `;
            },
          },
        }}
      />

      {/* Totales semanales */}
      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            bgcolor: '#fff',
            border: '1px solid #e3e3e3',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <div>Total L–D · Pedidos: {intFmt(totals.ordersCount)} — {moneyFmt(totals.ordersAmount)}</div>
          <div>Pagados: {intFmt(totals.paidOrdersCount)} — {moneyFmt(totals.paidAmount)}</div>
        </Box>
      </Box>
    </Box>
  );
}
