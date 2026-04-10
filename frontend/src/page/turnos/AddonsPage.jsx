import { Container, IconButton, Button, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TablePro from "../../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { getAddons, createAddon, updateAddon, deleteAddon } from "../../api/turnosRequest";
import { Add, Edit, Delete } from "@mui/icons-material";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext";

export default function AddonsPage() {
  const [rows, setRows] = useState([]);
  const [openDel, setOpenDel] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ nombre: "", precio: 0, duracionMin: 0, descripcion: "", activo: true });
  const { toast } = useAuth();

  const fetchData = async () => {
    const { data } = await getAddons();
    setRows(data);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, precio: parseFloat(form.precio) || 0, duracionMin: parseInt(form.duracionMin) || 0 };
      if (editRow) {
        await updateAddon(editRow.id, payload);
        toast?.({ message: "Addon actualizado", variant: "success" });
      } else {
        await createAddon(payload);
        toast?.({ message: "Addon creado", variant: "success" });
      }
      setOpenForm(false);
      setEditRow(null);
      setForm({ nombre: "", precio: 0, duracionMin: 0, descripcion: "", activo: true });
      fetchData();
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    toast?.({
      promise: deleteAddon(toDelete.id),
      successMessage: "Addon eliminado",
      onSuccess: () => { setRows((prev) => prev.filter((r) => r.id !== toDelete.id)); setOpenDel(false); setToDelete(null); },
    });
  };

  const columns = [
    { id: "id", label: "Id" },
    { id: "nombre", label: "Nombre" },
    { id: "precio", label: "Precio", render: (r) => `$ ${parseFloat(r.precio || 0).toFixed(2)}` },
    { id: "duracionMin", label: "Duración (min)" },
    { id: "descripcion", label: "Descripción", minWidth: 120 },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <>
          <Tooltip title="Editar"><IconButton size="small" onClick={() => { setEditRow(row); setForm({ nombre: row.nombre, precio: row.precio || 0, duracionMin: row.duracionMin || 0, descripcion: row.descripcion || "", activo: row.activo ?? true }); setOpenForm(true); }}><Edit /></IconButton></Tooltip>
          <Tooltip title="Eliminar"><IconButton size="small" onClick={() => { setToDelete(row); setOpenDel(true); }}><Delete /></IconButton></Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => { fetchData(); }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }} onClick={() => { setEditRow(null); setForm({ nombre: "", precio: 0, duracionMin: 0, descripcion: "", activo: true }); setOpenForm(true); }}>Nuevo addon</Button>
      <TablePro rows={rows} columns={columns} />

      <SimpleDialog open={openDel} onClose={() => { setOpenDel(false); setToDelete(null); }} title="¿Eliminar addon?">
        <Button onClick={() => setOpenDel(false)}>Cancelar</Button>
        <Button color="error" onClick={handleDelete}>Eliminar</Button>
      </SimpleDialog>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Editar addon" : "Nuevo addon (extra)"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} margin="normal" required />
          <TextField type="number" fullWidth label="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} margin="normal" inputProps={{ step: 0.01 }} />
          <TextField type="number" fullWidth label="Duración extra (min)" value={form.duracionMin} onChange={(e) => setForm({ ...form, duracionMin: e.target.value })} margin="normal" />
          <TextField fullWidth label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} margin="normal" multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.nombre?.trim()}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
