// src/pages/Home.jsx
import { useEffect, useState } from "react";
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
import DataTable from "../Components/Tables/DataTable";
import { isValidCI } from "../helpers/isValidCI";

const chartSize = {
  width: 420,
  height: 320,
};

function Home() {
  const [users, setUsers] = useState([]);
  const [validas, setValidas] = useState(0);
  const [invalidas, setInvalidas] = useState(0);
  const [total, setTotal] = useState(0);
  const [documentTypeData, setDocumentTypeData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [birthYearData, setBirthYearData] = useState([]);


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
    {
      headerName: "Cédula",
      field: "ci",
      width: 90,
    },
    {
      headerName: "Nombre completo",
      field: "fullName",
      width: 200,
      renderCell: (params) => {
        const u = params.row;
        return `${u.firstName} ${u.secondName || ""} ${u.firstLastName} ${u.secondLastName || ""}`;
      },
    },
    {
      headerName: "Fecha de nacimiento",
      field: "birthday",
      width: 120,
    },
    {
      headerName: "Género",
      field: "gender",
      width: 50,
    },
    {
      headerName: "Tipo Documento",
      field: "documentType",
      width: 150,
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Verificación y Tipos de Documento de Usuarios
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Total de usuarios analizados: <strong>{total}</strong>
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estado de Cédulas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
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
                  width={500} // Espacio total para gráfico + leyenda
                  height={320}
                  margin={{ right: 150 }} // Espacio para leyenda a la derecha
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' }, // Centrado vertical y a la derecha
                    },
                  }}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fontWeight: "bold",
                    },
                  }}
                />

              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tipo de Documento
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
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
                  width={500}
                  height={320}
                  margin={{ right: 150 }}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                    },
                  }}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fontWeight: "bold",
                    },
                  }}
                />

              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
  <Paper elevation={3} sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Distribución por Género
    </Typography>
    <Divider sx={{ mb: 2 }} />
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
      width={500}
      height={320}
      margin={{ right: 150 }}
      slotProps={{
        legend: {
          direction: "column",
          position: { vertical: "middle", horizontal: "right" },
        },
      }}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: "bold",
        },
      }}
    />
  </Paper>
</Grid>

<Grid item xs={12} md={6}>
  <Paper elevation={3} sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Nacimientos por Década
    </Typography>
    <Divider sx={{ mb: 2 }} />
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
      width={500}
      height={320}
      margin={{ right: 150 }}
      slotProps={{
        legend: {
          direction: "column",
          position: { vertical: "middle", horizontal: "right" },
        },
      }}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: "bold",
        },
      }}
    />
  </Paper>
</Grid>



      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Usuarios con Cédula VÁLIDA ({validUsers.length})
          </Typography>
          <DataTable data={validUsers} columns={columns} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom color="error">
            Usuarios con Cédula INVÁLIDA ({invalidUsers.length})
          </Typography>
          <DataTable data={invalidUsers} columns={columns} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
