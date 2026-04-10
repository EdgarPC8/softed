import { Container, IconButton, Button, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TablePro from "../../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { getClientes, createCliente, updateCliente, deleteCliente } from "../../api/turnosRequest";
import { Add, Edit, Delete } from "@mui/icons-material";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext";

export default function ClientesPage() {
  const [rows, setRows] = useState([]);
  const [openDel, setOpenDel] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", notas: "" });
  const { toast } = useAuth();

  const fetchData = async () => {
    const { data } = await getClientes();
    setRows(data);
  };

  const handleSubmit = async () => {
    try {
      if (editRow) {
        await updateCliente(editRow.id, form);
        toast?.({ message: "Cliente actualizado", variant: "success" });
      } else {
        await createCliente(form);
        toast?.({ message: "Cliente creado", variant: "success" });
      }
      setOpenForm(false);
      setEditRow(null);
      setForm({ nombre: "", telefono: "", email: "", notas: "" });
      fetchData();
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    toast?.({
      promise: deleteCliente(toDelete.id),
      successMessage: "Cliente eliminado",
      onSuccess: () => {
        setRows((prev) => prev.filter((r) => r.id !== toDelete.id));
        setOpenDel(false);
        setToDelete(null);
      },
    });
  };

  const columns = [
    { id: "id", label: "Id" },
    { id: "nombre", label: "Nombre" },
    { id: "telefono", label: "Teléfono" },
    { id: "email", label: "Email" },
    { id: "notas", label: "Notas", minWidth: 120 },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => {
                setEditRow(row);
                setForm({ nombre: row.nombre, telefono: row.telefono || "", email: row.email || "", notas: row.notas || "" });
                setOpenForm(true);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={() => { setToDelete(row); setOpenDel(true); }}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => { fetchData(); }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }} onClick={() => { setEditRow(null); setForm({ nombre: "", telefono: "", email: "", notas: "" }); setOpenForm(true); }}>
        Nuevo cliente
      </Button>
      <TablePro rows={rows} columns={columns} />

      <SimpleDialog open={openDel} onClose={() => { setOpenDel(false); setToDelete(null); }} title="¿Eliminar cliente?">
        <Button onClick={() => setOpenDel(false)}>Cancelar</Button>
        <Button color="error" onClick={handleDelete}>Eliminar</Button>
      </SimpleDialog>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} margin="normal" />
          <TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} margin="normal" />
          <TextField fullWidth label="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.nombre?.trim()}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
