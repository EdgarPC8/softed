import {
  Container,
  IconButton,
  Button,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import TablePro from "../../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { getPatients } from "../../api/enfermeriaRequest";
import { Visibility, Add, Edit, PostAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import PatientFormModal from "./PatientFormModal";
import { useAuth } from "../../context/AuthContext";

export default function PacientesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const navigate = useNavigate();
  const { toast } = useAuth();

  const fetchData = async () => {
    try {
      const { data } = await getPatients();
      setRows((data || []).map((r) => ({ ...r, id: r.patientId ?? r.dni })));
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setOpenPatientModal(true);
  };

  const handleOpenEdit = (row) => {
    setEditingPatient(row);
    setOpenPatientModal(true);
  };

  const handleClosePatientModal = () => {
    setOpenPatientModal(false);
    setEditingPatient(null);
  };

  const handlePatientSuccess = () => {
    toast?.({ message: editingPatient ? "Paciente actualizado" : "Paciente creado", variant: "success" });
    fetchData();
  };

  const columns = [
    { id: "dni", label: "Cédula", getSortValue: (r) => r.dni },
    { id: "namesPatient", label: "Nombres Completos", getSortValue: (r) => (r.namesPatient || "").toLowerCase() },
    { id: "birthdate", label: "fecha de nacimiento", minWidth: 140, getSortValue: (r) => r.birthdate },
    {
      id: "estado",
      label: "Estado (completadas/total)",
      getSortValue: (r) => r.totalFichas ?? 0,
      render: (row) => {
        const comp = row.completadas ?? 0;
        const total = row.totalFichas ?? 0;
        const pend = total - comp;
        return (
          <Button
            size="small"
            variant="contained"
            color={pend > 0 ? "primary" : "success"}
            onClick={() => navigate(`/pacientes/${row.dni}/historial?tab=0`)}
            sx={{ textTransform: "none" }}
          >
            {comp}/{total}
          </Button>
        );
      },
    },
    {
      id: "actions",
      label: "Acción",
      render: (row) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Editar paciente">
            <IconButton
              size="small"
              onClick={() => handleOpenEdit(row)}
              sx={{ bgcolor: "warning.main", color: "white", "&:hover": { bgcolor: "warning.dark" } }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver detalle / Historial de fichas">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/pacientes/${row.dni}/historial`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Nueva ficha">
            <IconButton
              size="small"
              onClick={() => navigate(`/ficha/${row.dni}/1`)}
              sx={{ bgcolor: "success.main", color: "white", "&:hover": { bgcolor: "success.dark" } }}
            >
              <PostAdd fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Pacientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          color="success"
        >
          Añadir Paciente
        </Button>
      </Box>
      <TablePro
        rows={rows}
        columns={columns}
        showSearch
        showIndex
        indexHeader="#"
        tableMaxHeight={400}
        rowsPerPageOptions={[10, 25, 50]}
        defaultRowsPerPage={10}
      />

      <SimpleDialog
        open={openPatientModal}
        onClose={handleClosePatientModal}
        tittle={editingPatient ? "Editar paciente" : "Nuevo paciente"}
        maxWidth="md"
        fullWidth
      >
        <PatientFormModal
          patientRow={editingPatient}
          onClose={handleClosePatientModal}
          onSuccess={handlePatientSuccess}
          onError={(e) => toast?.({ message: e?.response?.data?.message || "Error al guardar", variant: "error" })}
          onLoadError={(msg) => msg && toast?.({ message: msg, variant: "error" })}
        />
      </SimpleDialog>
    </Container>
  );
}
