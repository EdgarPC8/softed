import { Container, IconButton, Button, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import TablePro from "../../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { getServicios, getCategorias, createServicio, updateServicio, deleteServicio } from "../../api/turnosRequest";
import { Add, Edit, Delete } from "@mui/icons-material";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext";

export default function ServiciosPage() {
  const [rows, setRows] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openDel, setOpenDel] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ nombre: "", categoriaId: "", duracionMin: 30, precio: 0, descripcion: "", activo: true });
  const { toast } = useAuth();

  const fetchData = async () => {
    const [serv, cat] = await Promise.all([getServicios(), getCategorias()]);
    setRows(serv.data);
    setCategorias(cat.data);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, categoriaId: form.categoriaId || null, duracionMin: parseInt(form.duracionMin) || 30, precio: parseFloat(form.precio) || 0 };
      if (editRow) {
        await updateServicio(editRow.id, payload);
        toast?.({ message: "Servicio actualizado", variant: "success" });
      } else {
        await createServicio(payload);
        toast?.({ message: "Servicio creado", variant: "success" });
      }
      setOpenForm(false);
      setEditRow(null);
      setForm({ nombre: "", categoriaId: "", duracionMin: 30, precio: 0, descripcion: "", activo: true });
      fetchData();
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    toast?.({
      promise: deleteServicio(toDelete.id),
      successMessage: "Servicio eliminado",
      onSuccess: () => { setRows((prev) => prev.filter((r) => r.id !== toDelete.id)); setOpenDel(false); setToDelete(null); },
    });
  };

  const columns = [
    { id: "id", label: "Id" },
    { id: "nombre", label: "Nombre" },
    { id: "duracionMin", label: "Duración (min)" },
    { id: "precio", label: "Precio", render: (r) => `$ ${parseFloat(r.precio || 0).toFixed(2)}` },
    { id: "categoria", label: "Categoría", render: (r) => r.categoria?.nombre || "—" },
    { id: "activo", label: "Activo", render: (r) => (r.activo ? "Sí" : "No") },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <>
          <Tooltip title="Editar"><IconButton size="small" onClick={() => { setEditRow(row); setForm({ nombre: row.nombre, categoriaId: row.categoriaId || "", duracionMin: row.duracionMin || 30, precio: row.precio || 0, descripcion: row.descripcion || "", activo: row.activo ?? true }); setOpenForm(true); }}><Edit /></IconButton></Tooltip>
          <Tooltip title="Eliminar"><IconButton size="small" onClick={() => { setToDelete(row); setOpenDel(true); }}><Delete /></IconButton></Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => { fetchData(); }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }} onClick={() => { setEditRow(null); setForm({ nombre: "", categoriaId: "", duracionMin: 30, precio: 0, descripcion: "", activo: true }); setOpenForm(true); }}>Nuevo servicio</Button>
      <TablePro rows={rows} columns={columns} />

      <SimpleDialog open={openDel} onClose={() => { setOpenDel(false); setToDelete(null); }} title="¿Eliminar servicio?">
        <Button onClick={() => setOpenDel(false)}>Cancelar</Button>
        <Button color="error" onClick={handleDelete}>Eliminar</Button>
      </SimpleDialog>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select value={form.categoriaId} label="Categoría" onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}>
              <MenuItem value="">Sin categoría</MenuItem>
              {categorias.map((c) => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField type="number" fullWidth label="Duración (min)" value={form.duracionMin} onChange={(e) => setForm({ ...form, duracionMin: e.target.value })} margin="normal" />
          <TextField type="number" fullWidth label="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} margin="normal" inputProps={{ step: 0.01 }} />
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
