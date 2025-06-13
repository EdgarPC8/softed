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
} from "@mui/material";
import DataTable from "../Tables/DataTable.jsx";
import { addUserRequest, addUsersBulk, getUsersRequest } from "../../api/userRequest.js";
import { isValidCI } from "../../helpers/isValidCI.js"; // asegúrate que esta función exista
import SimpleDialog from "../Dialogs/SimpleDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";


export default function StudentViewerModal({ jsonData = [] }) {
  if (!jsonData || jsonData.length < 3) {
    return <Typography>Backup vacío o inválido</Typography>;
  }

  const [verificado, setVerificado] = useState(false);
  const [coinciden, setCoinciden] = useState(0);
  const [faltantes, setFaltantes] = useState(0);
  const [noRegistrados, setNoRegistrados] = useState([]);
  const { toast } = useAuth();


  const [validacionActiva, setValidacionActiva] = useState(false);
  const [validas, setValidas] = useState(0);
  const [invalidas, setInvalidas] = useState(0);
  const [noValidas, setNoValidas] = useState([]);

  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [openDialogGuardar, setOpenDialogGuardar] = useState(false);


  const meta = jsonData[0];
  const table = jsonData[1];
  const content = jsonData[2];

  const sample = content.data?.[0] || {};

  const dynamicColumns = Object.keys(sample)
    .filter((key) => key !== "id")
    .map((key) => ({
      headerName: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      field: key,
      width: 120,
    }));

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 50,
    },
    ...dynamicColumns,
  ];

  const handleFiltrarNoRegistrados = async () => {
    const { data: users } = await getUsersRequest();
    const cedulasRegistradas = users.map((user) => user.ci);

    const filtrados = content.data
      .map((est, i) => ({
        ...est,
        "#": i + 1,
        id: i,
      }))
      .filter((est) => !cedulasRegistradas.includes(est.ci));

    setNoRegistrados(filtrados);
    setCoinciden(content.data.length - filtrados.length);
    setFaltantes(filtrados.length);
    setVerificado(true);
    setValidacionActiva(false); // Desactiva otra validación si estaba activa
    setPuedeGuardar(true);

  };

  const handleValidarCedulas = () => {
    const validadas = content.data.map((est, i) => ({
      ...est,
      "#": i + 1,
      id: i,
    }));

    const invalidos = validadas.filter((e) => !isValidCI(e.ci));
    setValidas(validadas.length - invalidos.length);
    setInvalidas(invalidos.length);
    setNoValidas(invalidos);
    setValidacionActiva(true);
    setVerificado(false); // Desactiva otro filtro si estaba activo
    setPuedeGuardar(false);

  };

  return (
    <Box>
      <SimpleDialog
        open={openDialogGuardar}
        onClose={() => setOpenDialogGuardar(false)}
        tittle="Confirmar guardado"
        message={`¿Deseas guardar ${noRegistrados.length} estudiantes como usuarios?`}
        onClickAccept={async () => {
          setOpenDialogGuardar(false);
          let exitosos = 0;
          let errores = 0;

          toast({
            promise:
              addUsersBulk(noRegistrados),
            successMessage: "Estudiantes agregados como users correctamente",
            onSuccess: (data) => {
              setNoRegistrados([]);
              setPuedeGuardar(false);
              setVerificado(false);
            },
          });


        }}
      />

      <Typography variant="h6" gutterBottom>
        Estudiantes
      </Typography>

      {/* BOTONES */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleFiltrarNoRegistrados}>
          Ver estudiantes no registrados
        </Button>
        <Button variant="contained" color="warning" onClick={handleValidarCedulas}>
          Validar formato de cédulas
        </Button>
        {puedeGuardar && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenDialogGuardar(true)}
          >
            Guardar como usuarios
          </Button>
        )}
      </Box>



      {/* RESÚMENES */}
      {verificado && (
        <Box mt={2}>
          <Alert severity="info">
            Estudiantes registrados: <strong>{coinciden}</strong> — No registrados:{" "}
            <strong>{faltantes}</strong>
          </Alert>
        </Box>
      )}

      {validacionActiva && (
        <Box mt={2}>
          <Alert severity="warning">
            Cédulas válidas: <strong>{validas}</strong> — Cédulas inválidas:{" "}
            <strong>{invalidas}</strong>
          </Alert>
        </Box>
      )}

      {/* TABLA FINAL */}
      <DataTable
        columns={columns}
        data={
          validacionActiva
            ? noValidas
            : verificado
              ? noRegistrados
              : content.data
        }
      />
    </Box>
  );
}
