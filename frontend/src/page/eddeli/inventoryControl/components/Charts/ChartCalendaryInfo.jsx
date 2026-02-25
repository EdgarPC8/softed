import React, { useState, useMemo } from 'react';
import {
  Box, Button, Typography, Grid, Paper, Stack, Chip,
} from '@mui/material';
import {
  format, addMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, startOfWeek, endOfWeek,
  isSameDay, parse, isSameMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';




/* ========= Paleta ========= */
const COLORS = {
  ordersCount:     '#5A9BD5', // azul suave
  deliveredCount:  '#A56CC1', // lila medio
  deliveredAmount: '#6BBF59', // verde menta
  ordersAmount:    '#F4C95D', // dorado pastel
};

/* ========= Mock (reemplaza con tus datos) ========= */
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

/* ========= Utils ========= */
function chunkArray(arr, size) {
  const r = [];
  for (let i = 0; i < arr.length; i += size) r.push(arr.slice(i, i + size));
  return r;
}

/** Métricas por día */
function calcDayMetrics(orders) {
  const ordersCount = orders.length;
  let deliveredCount = 0;
  let ordersAmount = 0;
  let deliveredAmount = 0;

  orders.forEach((o) => {
    o.ERP_order_items.forEach((it) => {
      const q = Number(it.quantity ?? 0);
      const sub = q * Number(it.price ?? 0);
      ordersAmount += sub;
      if (it.deliveredAt) deliveredCount += q;
      if (it.paidAt) deliveredAmount += sub;
    });
  });

  return { ordersCount, deliveredCount, ordersAmount, deliveredAmount };
}

/* ========= Helpers SVG ========= */
function ringArcPath(cx, cy, rOuter, rInner, a0, a1) {
  const x0o = cx + rOuter * Math.cos(a0);
  const y0o = cy + rOuter * Math.sin(a0);
  const x1o = cx + rOuter * Math.cos(a1);
  const y1o = cy + rOuter * Math.sin(a1);

  const x1i = cx + rInner * Math.cos(a1);
  const y1i = cy + rInner * Math.sin(a1);
  const x0i = cx + rInner * Math.cos(a0);
  const y0i = cy + rInner * Math.sin(a0);

  const large = a1 - a0 > Math.PI ? 1 : 0;

  return `
    M ${x0o} ${y0o}
    A ${rOuter} ${rOuter} 0 ${large} 1 ${x1o} ${y1o}
    L ${x1i} ${y1i}
    A ${rInner} ${rInner} 0 ${large} 0 ${x0i} ${y0i}
    Z
  `;
}

/* ========= Donut concéntrico más grueso ========= */
function SquareDonutBackground({
  borderRadius = 14,
  ringCounts = [], // [{label, value, color}]
  ringMoney = [],  // [{label, value, color}]
  labelFormatter = (v) =>
    typeof v === 'number' ? (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v)) : String(v ?? ''),
}) {
  const clipId = React.useId();
  const cx = 50, cy = 50;

  // Anchos más gruesos
  const outerR = 48, outerRInner = 26; // grosor 22
  const innerR = 22, innerRInner = 6;  // grosor 16

  const buildSegs = (segments) => {
    const total = Math.max(0.0001, segments.reduce((a, s) => a + (s.value || 0), 0));
    let acc = 0;
    return segments.map((s) => {
      const a0 = (acc / total) * 2 * Math.PI;
      acc += (s.value || 0);
      const a1 = (acc / total) * 2 * Math.PI;
      return { ...s, a0, a1, amid: (a0 + a1) / 2 };
    });
  };

  const segCounts = buildSegs(ringCounts);
  const segMoney  = buildSegs(ringMoney);

  return (
    <Box sx={{ position: 'absolute', inset: 0, borderRadius, overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="100" height="100" rx={borderRadius} ry={borderRadius} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="100" height="100" fill="#ffffff" />

          {/* Anillo exterior: dinero */}
          {segMoney.map((s, i) => (
            <path
              key={`m-${i}`}
              d={ringArcPath(cx, cy, outerR, outerRInner, s.a0, s.a1)}
              fill={s.color}
              stroke="rgba(0,0,0,0.20)"
              strokeWidth="0.45"
            />
          ))}

          {/* Anillo interior: conteos */}
          {segCounts.map((s, i) => (
            <path
              key={`c-${i}`}
              d={ringArcPath(cx, cy, innerR, innerRInner, s.a0, s.a1)}
              fill={s.color}
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="0.4"
            />
          ))}

          {/* Labels exteriores (dinero) */}
          {segMoney.map((s, i) => {
            const rText = (outerR + outerRInner) / 2;
            const x = cx + rText * Math.cos(s.amid);
            const y = cy + rText * Math.sin(s.amid);
            const v = Number(s.value || 0);
            if (v <= 0) return null;
            return (
              <text key={`tm-${i}`} x={x} y={y + 2} fontSize="8" textAnchor="middle"
                    fill="#fcfcfc" fontWeight="700" stroke="#000" strokeWidth="0.22">
                {labelFormatter(v)}
              </text>
            );
          })}

          {/* Labels interiores (conteos) */}
          {segCounts.map((s, i) => {
            const rText = (innerR + innerRInner) / 2;
            const x = cx + rText * Math.cos(s.amid);
            const y = cy + rText * Math.sin(s.amid);
            const v = Number(s.value || 0);
            if (v <= 0) return null;
            return (
              <text key={`tc-${i}`} x={x} y={y + 2} fontSize="8" textAnchor="middle"
                    fill="#fcfcfc" fontWeight="700" stroke="#000" strokeWidth="0.22">
                {labelFormatter(v)}
              </text>
            );
          })}
        </g>
      </svg>
    </Box>
  );
}

/* ========= Componente visual ========= */
export default function ChartCalendaryInfo({
  initialDate = new Date(),
  cellMinHeight = 86, // un poco más alto por el donut más grueso
  orders = mockOrders,
}) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // Fechas del mes visible
  const startDay = startOfMonth(currentDate);
  const endDay = endOfMonth(currentDate);
  const startWeek = startOfWeek(startDay, { weekStartsOn: 1 }); // lunes
  const endWeek = endOfWeek(endDay, { weekStartsOn: 1 });
  const daysToShow = eachDayOfInterval({ start: startWeek, end: endWeek });
  const weeks = useMemo(() => chunkArray(daysToShow, 7), [daysToShow]);

  // Helpers
  const moneyFmt = (v) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v ?? 0);

  // Total mensual ($ Entregado) — solo días del mes actual
  const monthDeliveredTotal = useMemo(() => {
    let total = 0;
    daysToShow.forEach((date) => {
      if (!isSameMonth(date, currentDate)) return;
      const dayOrders = orders.filter((o) =>
        isSameDay(parse(o.date, 'dd/MM/yyyy HH:mm:ss', new Date()), date),
      );
      const { deliveredAmount } = calcDayMetrics(dayOrders);
      total += deliveredAmount;
    });
    return total;
  }, [daysToShow, currentDate, orders]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
          Mes Anterior
        </Button>

        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </Typography>

        <Button size="small" variant="outlined" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          Mes Siguiente
        </Button>
      </Box>

      {/* Leyenda */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
        {/* Conteos */}
        <Chip size="small" label="Pedidos"    sx={{ bgcolor: COLORS.ordersCount,     color: '#fff' }} />
        <Chip size="small" label="Entregados" sx={{ bgcolor: COLORS.deliveredCount,  color: '#fff' }} />
        {/* Dinero */}
        <Chip size="small" label="$ Pedidos"  sx={{ bgcolor: COLORS.ordersAmount,    color: '#5B4636', fontWeight: 600 }} />
        <Chip size="small" label="$ Cobrado"  sx={{ bgcolor: COLORS.deliveredAmount, color: '#fff' }} />
      </Stack>

      {/* Cabecera de días (8 columnas: 7 días + L–D) */}
      <Grid container spacing={0.5} columns={8} sx={{ mb: 0.5 }}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
          <Grid item xs={1} key={d}>
            <Typography variant="caption" align="center" sx={{ display: 'block', color: 'text.secondary' }}>
              {d}
            </Typography>
          </Grid>
        ))}
        <Grid item xs={1}>
          <Typography variant="caption" align="center" sx={{ display: 'block', color: 'text.secondary', fontWeight: 700 }}>
            L–D
          </Typography>
        </Grid>
      </Grid>

      {/* Grilla por semanas (8 columnas) */}
      {weeks.map((week, idx) => {
        // Totales semanales (solo días del mes actual)
        let weekOrdersCount = 0;
        let weekDeliveredAmount = 0;

        return (
          <Grid container spacing={0.5} columns={8} key={idx} alignItems="stretch">
            {week.map((date) => {
              const dayOrders = orders.filter((o) =>
                isSameDay(parse(o.date, 'dd/MM/yyyy HH:mm:ss', new Date()), date),
              );
              const { ordersCount, deliveredCount, ordersAmount, deliveredAmount } = calcDayMetrics(dayOrders);

              const isCurrentMonth = isSameMonth(date, currentDate);
              if (isCurrentMonth) {
                // Sumamos pedidos (cantidad de pedidos) y $ cobrado de L–D (toda la semana)
                weekOrdersCount += ordersCount;
                weekDeliveredAmount += deliveredAmount;
              }

              const hasData = isCurrentMonth && dayOrders.length > 0;

              const ringCounts = hasData
                ? [
                    { label: 'Pedidos',    value: ordersCount,    color: COLORS.ordersCount },
                    { label: 'Entregados', value: deliveredCount, color: COLORS.deliveredCount },
                  ]
                : [];

              const ringMoney = hasData
                ? [
                    { label: '$ Pedidos',   value: Math.round(ordersAmount),    color: COLORS.ordersAmount },
                    { label: '$ Cobrado',   value: Math.round(deliveredAmount), color: COLORS.deliveredAmount },
                  ]
                : [];

              const tip =
                `Día: ${format(date, 'dd/MM/yyyy')}\n` +
                `Pedidos: ${ordersCount}\nEntregados(ítems): ${deliveredCount}\n` +
                `$ Pedidos: ${moneyFmt(ordersAmount)}\n$ Cobrado: ${moneyFmt(deliveredAmount)}`;

              return (
                <Grid item xs={1} key={date.toISOString()}>
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'relative',
                      p: 0,
                      minHeight: cellMinHeight,
                      cursor: 'default',
                      borderRadius: 3,
                      overflow: 'hidden',
                      bgcolor: isCurrentMonth ? 'transparent' : '#f5f5f5',
                    }}
                    title={tip}
                  >
                    {/* Donut solo si hay datos */}
                    {hasData && (
                      <SquareDonutBackground
                        borderRadius={14}
                        ringCounts={ringCounts}
                        ringMoney={ringMoney}
                        labelFormatter={(v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)}
                      />
                    )}

                    {/* Número de día centrado */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#2b2b2b',
                          fontWeight: 800,
                          textShadow: '0 1px 2px rgba(255,255,255,0.7)',
                        }}
                      >
                        {format(date, 'd')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}

            {/* Columna extra tipo "día": total L–D de la semana */}
            <Grid item xs={1}>
              <Paper
                elevation={3}
                sx={{
                  position: 'relative',
                  p: 0,
                  minHeight: cellMinHeight,
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: '#ffffff',
                  border: '1px solid #e3e3e3',
                }}
                title={`Semana (L–D)\nPedidos: ${weekOrdersCount}\n$ Cobrado: ${moneyFmt(weekDeliveredAmount)}`}
              >
                {/* Centro con etiqueta y totales */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.25,
                    textAlign: 'center',
                    px: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#4a4a4a', letterSpacing: 0.4 }}>
                    L–D
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#2b2b2b', lineHeight: 1.1 }}>
                    Pedidos: {weekOrdersCount}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2b2b2b', lineHeight: 1.1 }}>
                    {moneyFmt(weekDeliveredAmount)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
      })}

      {/* Total mensual abajo a la derecha */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: 1.5,
            bgcolor: '#ffffff',
            border: '1px solid #e3e3e3',
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          Total del mes · $ Cobrado: {moneyFmt(monthDeliveredTotal)}
        </Box>
      </Box>
    </Box>
  );
}
