import React, { useState } from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Alert,
  LinearProgress,
} from "@mui/material";
import DataTable from "../Tables/DataTable.jsx";
import { getUsersRequest } from "../../api/userRequest";
import { getMatriculas, addMatriculasBulk } from "../../api/alumniRequest.js";
import SimpleDialog from "../Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BackupViewerModal({ jsonData = [],onClose }) {
  if (!jsonData || jsonData.length < 3)
    return <Typography>Backup vacío o inválido</Typography>;

  const meta = jsonData[0];
  const table = jsonData[1];
  const content = jsonData[2];

  const [dataWithIds, setDataWithIds] = useState(content.data);
  const [resumen, setResumen] = useState(null);
  const [idAsignado, setIdAsignado] = useState(false);
  const [filtrado, setFiltrado] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useAuth();
  const [showOnlyWithoutId, setShowOnlyWithoutId] = useState(false);


  const sample = content.data?.[0] || {};

  const dynamicColumns = Object.keys(sample)
    .filter((key) => key !== "id" && key !== "idUser")
    .map((key) => ({
      headerName: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      field: key,
      width: 200,
    }));

  const columns = [
    {
      headerName: "idUser",
      field: "idUser",
      width: 80,
    },
    ...dynamicColumns,
  ];

  const handleAsignarIdUser = async () => {
    const { data: users } = await getUsersRequest();
    const userMap = new Map(users.map((user) => [user.ci, user.id]));

    const updated = content.data.map((matriculado) => {
      const idUser = userMap.get(matriculado.ci) || null;
      return { ...matriculado, idUser };
    });

    setDataWithIds(updated);
    setIdAsignado(true);

    const conId = updated.filter((m) => m.idUser !== null).length;
    const sinId = updated.length - conId;

    setResumen({ conId, sinId });
  };

  const handleFiltrarMatriculasExistentes = async () => {
    const { data: matriculasExistentes } = await getMatriculas();

    const key = (m) =>
      `${m.idUser}-${m.especialidad}-${m.periodoAcademico}-${m.fechaMatricula}`;

    const setExistentes = new Set(matriculasExistentes.map((m) => key(m)));

    const totalAntes = dataWithIds.length;
    const filtrados = dataWithIds.filter((m) => !setExistentes.has(key(m)));
    const eliminados = totalAntes - filtrados.length;

    setFiltrado({
      total: totalAntes,
      eliminados,
      restantes: filtrados.length,
    });

    setDataWithIds(filtrados);
  };

  const enviarEnLotes = async (matriculas, lote = 50) => {
    let exitosos = 0;
    let errores = 0;
    setLoading(true);   // ya lo tienes bien
setProgress(0);     // inicializa al 0%


    for (let i = 0; i < matriculas.length; i += lote) {
      const bloque = matriculas.slice(i, i + lote);
      try {
        const { data } = await addMatriculasBulk(bloque);
        exitosos += data.insertados || 0;
      } catch (error) {
        console.error("Error en lote:", i / lote + 1, error);
        errores += bloque.length;
      }
      setProgress(((i + lote) / matriculas.length) * 100);
    }
    if (onClose) onClose();
    setLoading(false);
    return { exitosos, errores };
  };

  return (
    <Box>
 <SimpleDialog
  open={openConfirm}
  onClose={() => setOpenConfirm(false)}
  tittle="Confirmar guardado"
  onClickAccept={async () => {
    const { exitosos, errores } = await enviarEnLotes(dataWithIds);
    toast({
      successMessage: `Guardado completo. Insertados: ${exitosos}, Errores: ${errores}`,
    });
    // Cierra el diálogo y resetea progreso
    setOpenConfirm(false);
    setProgress(0);
  }}
>
  {loading ? (
    <Box mt={2}>
      <LinearProgress variant="determinate" value={progress} />
      <Box mt={1} textAlign="right">{progress.toFixed(0)}%</Box>
    </Box>
  ) : (
    <Typography>¿Deseas guardar {dataWithIds.length} matrículas nuevas?</Typography>
  )}
</SimpleDialog>


      <Box display="flex" gap={4} mb={3}>
        <Box flex={1}>
          <Typography variant="h6" gutterBottom>Metadatos</Typography>
          <List dense>
            {Object.entries(meta).map(([key, value]) => (
              <ListItem key={key} disablePadding>
                <ListItemText primary={`${key}: ${value}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex={1}>
          <Typography variant="h6" gutterBottom>Tabla</Typography>
          <List dense>
            {Object.entries(table).map(([key, value]) => (
              <ListItem key={key} disablePadding>
                <ListItemText primary={`${key}: ${value}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>Datos de Matriculados</Typography>

      <Box display="flex" gap={2} mb={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAsignarIdUser}
        >
          Asignar ID de Usuario por Cédula
        </Button>
        {idAsignado && resumen?.sinId > 0 && (
  <Button
    variant="outlined"
    color="error"
    onClick={() => setShowOnlyWithoutId(!showOnlyWithoutId)}
  >
    {showOnlyWithoutId ? "Ver todos los usuarios" : "Ver usuarios sin coincidencia"}
  </Button>
)}


        {idAsignado && (
          <Button
            variant="contained"
            color="warning"
            onClick={handleFiltrarMatriculasExistentes}
          >
            Filtrar Matrículas ya Existentes
          </Button>
        )}

        {filtrado && filtrado.restantes > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenConfirm(true)}
          >
            Guardar Nuevas Matrículas
          </Button>
        )}
      </Box>

      {resumen && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {
            resumen.conId + resumen.sinId === 0
              ? "No se encontraron usuarios registrados en el sistema."
              : <>
                  <strong>{resumen.conId}</strong> registros con ID asignado —{" "}
                  <strong>{resumen.sinId}</strong> sin coincidencia.
                </>
          }
        </Alert>
      )}

      {filtrado && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {
            filtrado.total === 0
              ? "No hay registros para comparar con las matrículas existentes."
              : filtrado.eliminados === 0
              ? "Todos los registros son nuevos."
              : <>
                  Filtradas <strong>{filtrado.eliminados}</strong> matrículas existentes. Restan <strong>{filtrado.restantes}</strong> por registrar.
                </>
          }
        </Alert>
      )}
<Box>
  <DataTable
    columns={columns}
    data={showOnlyWithoutId ? dataWithIds.filter(d => d.idUser === null) : dataWithIds}
  />
</Box>

      {/* <Box>
        <DataTable columns={columns} data={dataWithIds} />
      </Box> */}
    </Box>
  );
}
