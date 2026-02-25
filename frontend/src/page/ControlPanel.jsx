// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { getUsersRequest } from "../api/userRequest";
import {
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import {
  PieChart,
  pieArcLabelClasses,
} from "@mui/x-charts/PieChart";
import TablePro from "../Components/Tables/TablePro";
import { isValidCI } from "../helpers/isValidCI";

const CHART_HEIGHT = 280;
const CHART_LEGEND_MARGIN = 140;

function ControlPanelPage() {
  const [users, setUsers] = useState([]);
  const [validas, setValidas] = useState(0);
  const [invalidas, setInvalidas] = useState(0);
  const [total, setTotal] = useState(0);
  const [documentTypeData, setDocumentTypeData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [birthYearData, setBirthYearData] = useState([]);
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(400);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const updateWidth = () => {
      const w = el.offsetWidth;
      const spacing = 32;
      const padding = 24;
      const colWidth = (w - spacing) / 2;
      const maxChart = Math.floor(colWidth - CHART_LEGEND_MARGIN - padding);
      setChartWidth(Math.min(380, Math.max(240, maxChart)));
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  const fetchUsers = async () => {
    const { data } = await getUsersRequest();

    const validUsers = data.filter((u) => isValidCI(u.ci));
    const invalidUsers = data.filter((u) => !isValidCI(u.ci));

    setUsers(data);
    setValidas(validUsers.length);
    setInvalidas(invalidUsers.length);
    setTotal(data.length);

    const docTypeMap = {};
    for (const user of data) {
      const type = user.documentType || "No especificado";
      docTypeMap[type] = (docTypeMap[type] || 0) + 1;
    }

    const docTypeArray = Object.entries(docTypeMap).map(([label, value]) => ({
      label: `${label} (${value})`,
      value,
    }));
    // Agrupación por género
const genderMap = { Masculino: 0, Femenino: 0, Otro: 0 };
for (const user of data) {
  if (user.gender === "M") genderMap.Masculino++;
  else if (user.gender === "F") genderMap.Femenino++;
  else genderMap.Otro++;
}

const genderArray = Object.entries(genderMap)
  .filter(([_, value]) => value > 0)
  .map(([label, value]) => ({
    label: `${label} (${value})`,
    value,
  }));

// ✅ Agrupar por década efectiva
const years = data
  .filter(u => u.birthday)
  .map(u => parseInt(u.birthday.slice(0, 4)))
  .filter(year => !isNaN(year));

const minYear = Math.min(...years);
const maxYear = Math.max(...years);

// Construir rangos de décadas con al menos un usuario
const decadeMap = {};

for (const year of years) {
  const decadeStart = Math.floor(year / 10) * 10;
  const label = `${decadeStart}-${decadeStart + 9}`;
  decadeMap[label] = (decadeMap[label] || 0) + 1;
}

const decadeArray = Object.entries(decadeMap)
  .sort(([a], [b]) => parseInt(a) - parseInt(b)) // ordenar por década ascendente
  .map(([label, value]) => ({
    label: `${label} (${value})`,
    value,
  }));

setBirthYearData(decadeArray);



setGenderData(genderArray);


    setDocumentTypeData(docTypeArray);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const valueFormatter = (item) =>
    `${item.label} - ${(item.value / (total || 1) * 100).toFixed(1)}%`;

  const validUsers = users.filter((u) => isValidCI(u.ci));
  const invalidUsers = users.filter((u) => !isValidCI(u.ci));

  const columns = [
    { id: "ci", label: "Cédula" },
    {
      id: "fullName",
      label: "Nombre completo",
      render: (row) =>
        `${row.firstName || ""} ${row.secondName || ""} ${row.firstLastName || ""} ${row.secondLastName || ""}`.trim(),
    },
    { id: "birthday", label: "Fecha de nacimiento" },
    { id: "gender", label: "Género" },
    { id: "documentType", label: "Tipo Documento" },
  ];

  const chartProps = {
    height: CHART_HEIGHT,
    width: chartWidth,
    margin: { right: CHART_LEGEND_MARGIN },
    slotProps: {
      legend: {
        direction: "column",
        position: { vertical: "middle", horizontal: "right" },
      },
    },
    sx: {
      [`& .${pieArcLabelClasses.root}`]: { fontWeight: "bold" },
    },
  };

  return (
    <Box ref={chartContainerRef} sx={{ padding: 4, width: "100%", overflow: "hidden" }}>
      <Typography variant="h4" gutterBottom>
        Verificación y Tipos de Documento de Usuarios
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Total de usuarios analizados: <strong>{total}</strong>
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 3, overflow: "hidden" }}>
            <Typography variant="h6" gutterBottom>
              Estado de Cédulas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: "100%", overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: [
                      { label: "Válidas", value: validas },
                      { label: "Inválidas", value: invalidas },
                    ],
                    arcLabel: (item) =>
                      `${item.value} (${((item.value / (total || 1)) * 100).toFixed(1)}%)`,
                    arcLabelMinAngle: 15,
                    arcLabelRadius: "60%",
                  },
                ]}
                {...chartProps}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 3, overflow: "hidden" }}>
            <Typography variant="h6" gutterBottom>
              Tipo de Documento
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: "100%", overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: documentTypeData,
                    arcLabel: (item) =>
                      `${((item.value / (total || 1)) * 100).toFixed(1)}%`,
                    arcLabelMinAngle: 15,
                    arcLabelRadius: "60%",
                    valueFormatter: (item) => `${item.label}`,
                  },
                ]}
                {...chartProps}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 3, overflow: "hidden" }}>
            <Typography variant="h6" gutterBottom>
              Distribución por Género
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: "100%", overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: genderData,
                    arcLabel: (item) =>
                      `${item.value} (${((item.value / (total || 1)) * 100).toFixed(1)}%)`,
                    arcLabelMinAngle: 15,
                    arcLabelRadius: "60%",
                  },
                ]}
                {...chartProps}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 3, overflow: "hidden" }}>
            <Typography variant="h6" gutterBottom>
              Nacimientos por Década
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: "100%", overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: birthYearData,
                    arcLabel: (item) =>
                      `${item.value} (${((item.value / (total || 1)) * 100).toFixed(1)}%)`,
                    arcLabelMinAngle: 15,
                    arcLabelRadius: "60%",
                  },
                ]}
                {...chartProps}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Typography variant="h6" gutterBottom>
            Usuarios con Cédula VÁLIDA ({validUsers.length})
          </Typography>
          <TablePro
            rows={validUsers.map((u, i) => ({ ...u, id: u.id ?? i }))}
            columns={columns}
            title=""
            showSearch
            showPagination
            defaultRowsPerPage={5}
            tableMaxHeight={400}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Typography variant="h6" gutterBottom color="error">
            Usuarios con Cédula INVÁLIDA ({invalidUsers.length})
          </Typography>
          <TablePro
            rows={invalidUsers.map((u, i) => ({ ...u, id: u.id ?? i }))}
            columns={columns}
            title=""
            showSearch
            showPagination
            defaultRowsPerPage={5}
            tableMaxHeight={400}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ControlPanelPage;


