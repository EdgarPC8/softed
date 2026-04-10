import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import TablePro from "../../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
} from "../../api/enfermeriaRequest";
import { Add, Edit } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export default function InstitucionesPage() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    agregar_institucion_sistema: "",
    agregar_unidad_operativa: "",
    agregar_cod_uo: "",
    agregar_cod_localizacion: "",
  });
  const { toast } = useAuth();

  const fetchData = async () => {
    const { data } = await getInstitutions();
    setRows(data || []);
  };

  const handleSubmit = async () => {
    try {
      if (editRow) {
        await updateInstitution({
          institutionId: editRow.id,
          agregar_institucion_sistema: form.agregar_institucion_sistema,
          agregar_unidad_operativa: form.agregar_unidad_operativa,
          agregar_cod_uo: form.agregar_cod_uo,
          agregar_cod_localizacion: form.agregar_cod_localizacion,
        });
        toast?.({ message: "Institución actualizada", variant: "success" });
      } else {
        await createInstitution(form);
        toast?.({ message: "Institución creada", variant: "success" });
      }
      setOpenForm(false);
      setEditRow(null);
      setForm({
        agregar_institucion_sistema: "",
        agregar_unidad_operativa: "",
        agregar_cod_uo: "",
        agregar_cod_localizacion: "",
      });
      fetchData();
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const columns = [
    { id: "id", label: "Id" },
    { id: "institutionSystem", label: "Institución" },
    { id: "operativeUnit", label: "Unidad operativa" },
    { id: "codUO", label: "Cod. UO" },
    { id: "locationCod", label: "Cod. localización" },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <Tooltip title="Editar">
          <IconButton
            size="small"
            onClick={() => {
              setEditRow(row);
              setForm({
                agregar_institucion_sistema: row.institutionSystem || "",
                agregar_unidad_operativa: row.operativeUnit || "",
                agregar_cod_uo: row.codUO || "",
                agregar_cod_localizacion: row.locationCod || "",
              });
              setOpenForm(true);
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        color="primary"
        onClick={() => {
          setEditRow(null);
          setForm({
            agregar_institucion_sistema: "",
            agregar_unidad_operativa: "",
            agregar_cod_uo: "",
            agregar_cod_localizacion: "",
          });
          setOpenForm(true);
        }}
      >
        Nueva institución
      </Button>
      <TablePro rows={rows} columns={columns} tableMaxHeight={400} />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Editar institución" : "Nueva institución"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Institución sistema"
            value={form.agregar_institucion_sistema}
            onChange={(e) =>
              setForm({ ...form, agregar_institucion_sistema: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Unidad operativa"
            value={form.agregar_unidad_operativa}
            onChange={(e) =>
              setForm({ ...form, agregar_unidad_operativa: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Cod. UO"
            value={form.agregar_cod_uo}
            onChange={(e) => setForm({ ...form, agregar_cod_uo: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Cod. localización"
            value={form.agregar_cod_localizacion}
            onChange={(e) =>
              setForm({ ...form, agregar_cod_localizacion: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
