import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { PieChart } from "@mui/x-charts/PieChart";

/* ---------------- Utils ---------------- */
const toNum = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};
const round2 = (n) => Number.parseFloat(toNum(n).toFixed(2));

const COLORS = [
  "#4e79a7", // azul suave
  "#f28e2b", // naranja cálido
  "#e15759", // rojo coral
  "#76b7b2", // turquesa
  "#59a14f", // verde medio
  "#edc948", // amarillo mostaza
  "#b07aa1", // morado pastel
  "#ff9da7", // rosado claro
  "#9c755f", // marrón suave
  "#bab0ac", // gris neutro
];

/* ---------------- Componente ---------------- */
/**
 * Props esperadas:
 * - data: {
 *     platforms: [{ label: "Ingresos", value: 123.45 }, { label: "Gastos", value: 67.89 }],
 *     groups: { Ingresos: [{label, value},...], Gastos: [{label, value},...] },
 *     meta?: { ... }
 *   }
 * - displayMode: "value" | "percent" | "both" (default: "value")
 */
export default function DoblePieChart({ data, displayMode = "value" }) {
  if (!data || !data.platforms || !data.groups) {
    return (
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { platforms, groups } = data;

  // Totales (para %)
  const totalPlatforms = React.useMemo(
    () => round2(platforms.reduce((s, p) => s + toNum(p.value, 0), 0)),
    [platforms]
  );

  // Datos del anillo externo (montos crudos combinados)
  const outerRawData = React.useMemo(() => {
    let combined = [];
    platforms.forEach((p) => {
      const sub = groups[p.label] || [];
      combined = combined.concat(
        sub.map((v) => ({
          label: v.label === "Other" ? `Other (${p.label})` : v.label,
          value: round2(v.value || 0),
          _platform: p.label,
        }))
      );
    });
    return combined;
  }, [platforms, groups]);

  const totalOuter = React.useMemo(
    () => round2(outerRawData.reduce((s, it) => s + toNum(it.value, 0), 0)),
    [outerRawData]
  );

  // Factory de formatter según modo
  const makeFormatter = React.useCallback(
    (total) => (item) => {
      if (!item) return "";
      const amount = round2(item.value);
      const pct = total > 0 ? round2((toNum(item.value, 0) / total) * 100) : 0;

      switch (displayMode) {
        case "percent":
          return `${pct}%`;
        case "both":
          return `${amount} (${pct}%)`;
        case "value":
        default:
          return `${amount}`;
      }
    },
    [displayMode]
  );

  const platformFormatter = React.useMemo(
    () => makeFormatter(totalPlatforms),
    [makeFormatter, totalPlatforms]
  );

  const outerFormatter = React.useMemo(
    () => makeFormatter(totalOuter),
    [makeFormatter, totalOuter]
  );

  // Series
  const platformSeries = React.useMemo(
    () => ({
      innerRadius: 0,
      outerRadius: 80,
      id: "platform-series",
      data: platforms, // montos crudos
      valueFormatter: platformFormatter,
      arcLabel: (d) => `${d.label}`,
      arcLabelMinAngle: 10,
    }),
    [platforms, platformFormatter]
  );

  const groupSeries = React.useMemo(
    () => ({
      innerRadius: 100,
      outerRadius: 120,
      id: "group-series",
      data: outerRawData, // montos crudos
      valueFormatter: outerFormatter,
      arcLabel: (d) => `${d.label}`,
      arcLabelMinAngle: 10,
    }),
    [outerRawData, outerFormatter]
  );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <PieChart
        series={[platformSeries, groupSeries]}
        colors={COLORS}
        width={360}
        height={340}
        slotProps={{
          legend: { position: { vertical: "middle", horizontal: "right" } },
        }}
      />
    </Box>
  );
}
