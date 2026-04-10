import { Container, IconButton, Button, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import TablePro from "../../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { getEmpleados } from "../../api/turnosRequest";
import { getUsersRequest } from "../../api/userRequest.js";
import { createEmpleado, updateEmpleado, deleteEmpleado } from "../../api/turnosRequest";
import { Add, Edit, Delete } from "@mui/icons-material";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext";
const TIPOS_EMPLEADO = ["Manicurista", "Estilista", "Barbero", "Esteticista", "Otro"];

export default function EmpleadosPage() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDel, setOpenDel] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ userId: "", tipo: "", especialidad: "", activo: true });
  const { toast } = useAuth();

  const fetchData = async () => {
    try {
      const { data } = await getEmpleados();
      setRows(data);
      const usersRes = await getUsersRequest();
      setUsers(usersRes.data || []);
    } catch (e) {
      const usersRes = await getUsersRequest();
      setUsers(usersRes.data || []);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editRow) {
        await updateEmpleado(editRow.id, { ...form, userId: parseInt(form.userId) });
        toast?.({ message: "Empleado actualizado", variant: "success" });
      } else {
        await createEmpleado({ ...form, userId: parseInt(form.userId) });
        toast?.({ message: "Empleado creado", variant: "success" });
      }
      setOpenForm(false);
      setEditRow(null);
      setForm({ userId: "", tipo: "", especialidad: "", activo: true });
      fetchData();
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    toast?.({
      promise: deleteEmpleado(toDelete.id),
      successMessage: "Empleado eliminado",
      onSuccess: () => {
        setRows((prev) => prev.filter((r) => r.id !== toDelete.id));
        setOpenDel(false);
        setToDelete(null);
      },
    });
  };

  const columns = [
    { id: "id", label: "Id" },
    {
      id: "nombre",
      label: "Empleado",
      render: (row) => (row.user ? `${row.user.firstName || ""} ${row.user.firstLastName || ""}`.trim() : `Usuario #${row.userId}`),
    },
    { id: "tipo", label: "Tipo" },
    { id: "especialidad", label: "Especialidad" },
    {
      id: "activo",
      label: "Activo",
      render: (row) => (row.activo ? "Sí" : "No"),
    },
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
                setForm({
                  userId: row.userId,
                  tipo: row.tipo || "",
                  especialidad: row.especialidad || "",
                  activo: row.activo ?? true,
                });
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

  useEffect(() => {
    fetchData();
  }, []);

  const usersNotEmpleados = users.filter((u) => !rows.some((e) => e.userId === u.id));
  const userOptions = editRow ? [rows.find((r) => r.id === editRow.id)?.user].filter(Boolean).concat(usersNotEmpleados) : usersNotEmpleados;

  return (
    <Container sx={{ py: 2 }}>
      <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }} onClick={() => { setEditRow(null); setForm({ userId: "", tipo: "", especialidad: "", activo: true }); setOpenForm(true); }}>
        Nuevo empleado
      </Button>
      <TablePro rows={rows} columns={columns} />

      <SimpleDialog open={openDel} onClose={() => { setOpenDel(false); setToDelete(null); }} title="¿Eliminar empleado?">
        <Button onClick={() => setOpenDel(false)}>Cancelar</Button>
        <Button color="error" onClick={handleDelete}>Eliminar</Button>
      </SimpleDialog>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Editar empleado" : "Nuevo empleado"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={form.userId || ""}
              label="Usuario"
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              disabled={!!editRow}
            >
              {userOptions.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.firstName} {u.firstLastName}{u.ci ? ` (${u.ci})` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select value={form.tipo || ""} label="Tipo" onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <MenuItem value="">Sin especificar</MenuItem>
              {TIPOS_EMPLEADO.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="Especialidad" value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} margin="normal" placeholder="ej. Uñas, Corte de pelo" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Activo</InputLabel>
            <Select value={form.activo ? "1" : "0"} label="Activo" onChange={(e) => setForm({ ...form, activo: e.target.value === "1" })}>
              <MenuItem value="1">Sí</MenuItem>
              <MenuItem value="0">No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.userId}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
