import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Box, IconButton, Typography, Tooltip, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TurnoCalendaryTable from "./components/TurnoCalendaryTable";
import SearchableSelect from "../../Components/SearchableSelect";
import { getTurnos, getClientes, getEmpleados, getEmpleadoMe, getServicios, getAddons, getCategorias, createCliente, createServicio, createAddon, createTurno, updateTurno, deleteTurno } from "../../api/turnosRequest";
import { Add, Delete } from "@mui/icons-material";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext";

export default function TurnosPage() {
  const [rows, setRows] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [addonsList, setAddonsList] = useState([]);
  const [empleadoMe, setEmpleadoMe] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [openServicioModal, setOpenServicioModal] = useState(false);
  const [openAddonModal, setOpenAddonModal] = useState(false);
  const [clienteForm, setClienteForm] = useState({ nombre: "", telefono: "", email: "", notas: "" });
  const [servicioForm, setServicioForm] = useState({ nombre: "", categoriaId: "", duracionMin: 30, precio: 0, descripcion: "" });
  const [addonForm, setAddonForm] = useState({ nombre: "", precio: 0, duracionMin: 0, descripcion: "" });
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    clienteId: "",
    empleadoId: "",
    servicioId: "",
    fechaHora: "",
    duracionMin: 30,
    precioTotal: 0,
    estado: "pendiente",
    metodoPago: "efectivo",
    montoAdelantado: 0,
    notas: "",
    addons: [],
    recordarAntes: 60,
  });
  const { toast, user } = useAuth();
  const isEmpleado = user?.loginRol === "Empleado";

  const fetchData = async () => {
    const promises = [getTurnos(), getClientes(), getServicios(), getAddons(), getCategorias()];
    if (isEmpleado) {
      promises.push(getEmpleadoMe());
    } else {
      promises.push(getEmpleados());
    }
    const results = await Promise.all(promises);
    setRows(results[0].data);
    setClientes(results[1].data);
    setServicios(results[2].data);
    setAddonsList(results[3].data);
    setCategorias(results[4]?.data || []);
    if (isEmpleado) setEmpleadoMe(results[5]?.data || null);
    else setEmpleados(results[5]?.data || []);
  };

  const handleSubmit = async () => {
    try {
      const empId = isEmpleado && empleadoMe ? empleadoMe.id : parseInt(form.empleadoId);
      const payload = {
        ...form,
        clienteId: parseInt(form.clienteId),
        empleadoId: empId,
        servicioId: parseInt(form.servicioId),
        duracionMin: parseInt(form.duracionMin) || 30,
        precioTotal: parseFloat(form.precioTotal) || 0,
        montoAdelantado: parseFloat(form.montoAdelantado) || 0,
        addons: form.addons || [],
        recordarAntes: parseInt(form.recordarAntes, 10) || 0,
      };
      if (editRow) {
        await updateTurno(editRow.id, payload);
        toast?.({ message: "Turno actualizado", variant: "success" });
      } else {
        await createTurno(payload);
        toast?.({ message: "Turno creado", variant: "success" });
      }
      setOpenForm(false);
      setEditRow(null);
      fetchData();
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const onServicioChange = (servicioId) => {
    const s = servicios.find((x) => x.id === parseInt(servicioId));
    const addons = form.addons || [];
    const addonsTotal = addons.reduce((acc, a) => acc + parseFloat(a.precio || 0), 0);
    const addonsDur = addons.reduce((acc, a) => acc + parseInt(a.duracionMin || 0, 10), 0);
    if (s) {
      const precioBase = parseFloat(s.precio) || 0;
      const durBase = s.duracionMin || 30;
      setForm((f) => ({
        ...f,
        servicioId: servicioId,
        duracionMin: durBase + addonsDur,
        precioTotal: precioBase + addonsTotal,
      }));
    }
  };

  const addAddon = (addonId) => {
    const addon = addonsList.find((a) => a.id === parseInt(addonId));
    if (!addon || (form.addons || []).some((a) => a.addonId === addon.id)) return;
    const newAddon = {
      addonId: addon.id,
      precio: parseFloat(addon.precio) || 0,
      duracionMin: parseInt(addon.duracionMin, 10) || 0,
      minutoInicio: 0,
    };
    const addons = [...(form.addons || []), newAddon];
    const s = servicios.find((x) => x.id === parseInt(form.servicioId));
    const precioBase = s ? parseFloat(s.precio) || 0 : 0;
    const durBase = s ? (s.duracionMin || 30) : 30;
    const addonsTotal = addons.reduce((acc, a) => acc + parseFloat(a.precio || 0), 0);
    const addonsDur = addons.reduce((acc, a) => acc + parseInt(a.duracionMin || 0, 10), 0);
    setForm((f) => ({
      ...f,
      addons,
      duracionMin: durBase + addonsDur,
      precioTotal: precioBase + addonsTotal,
    }));
  };

  const removeAddon = (idx) => {
    const addons = (form.addons || []).filter((_, i) => i !== idx);
    const s = servicios.find((x) => x.id === parseInt(form.servicioId));
    const precioBase = s ? parseFloat(s.precio) || 0 : 0;
    const durBase = s ? (s.duracionMin || 30) : 30;
    const addonsTotal = addons.reduce((acc, a) => acc + parseFloat(a.precio || 0), 0);
    const addonsDur = addons.reduce((acc, a) => acc + parseInt(a.duracionMin || 0, 10), 0);
    setForm((f) => ({
      ...f,
      addons,
      duracionMin: durBase + addonsDur,
      precioTotal: precioBase + addonsTotal,
    }));
  };

  const updateAddonMinuto = (idx, minutoInicio) => {
    const addons = [...(form.addons || [])];
    if (addons[idx]) addons[idx] = { ...addons[idx], minutoInicio: parseInt(minutoInicio, 10) || 0 };
    setForm((f) => ({ ...f, addons }));
  };

  const estadoLabels = { pendiente: "Pendiente", confirmado: "Confirmado", en_curso: "En curso", completado: "Completado", cancelado: "Cancelado", no_asistio: "No asistió" };
  const RECORDAR_OPCIONES = [
    { value: 0, label: "Sin recordatorio" },
    { value: 15, label: "15 min antes" },
    { value: 30, label: "30 min antes" },
    { value: 60, label: "1 hora antes" },
    { value: 120, label: "2 horas antes" },
    { value: 1440, label: "1 día antes" },
  ];

  const handleEdit = (turno) => {
    if (isEmpleado && empleadoMe && turno.empleadoId !== empleadoMe.id) return;
    const d = new Date(turno.fechaHora);
    const fechaHora = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const addons = (turno.addons || []).map((ta) => ({
      addonId: ta.addonId ?? ta.addon?.id,
      precio: parseFloat(ta.precio) || 0,
      duracionMin: parseInt(ta.duracionMin, 10) || 0,
      minutoInicio: parseInt(ta.minutoInicio, 10) || 0,
    }));
    setForm({
      clienteId: turno.clienteId,
      empleadoId: turno.empleadoId,
      servicioId: turno.servicioId,
      fechaHora,
      duracionMin: turno.duracionMin,
      precioTotal: turno.precioTotal,
      estado: turno.estado,
      metodoPago: turno.metodoPago || "efectivo",
      montoAdelantado: turno.montoAdelantado || 0,
      notas: turno.notas || "",
      addons,
      recordarAntes: turno.recordarAntes ?? 0,
    });
    setEditRow(turno);
    setOpenForm(true);
  };

  useEffect(() => {
    fetchData();
  }, [isEmpleado]);

  const resetForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const fh = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}T10:00`;
    const baseForm = { clienteId: "", empleadoId: isEmpleado && empleadoMe ? empleadoMe.id : "", servicioId: "", fechaHora: fh, duracionMin: 30, precioTotal: 0, estado: "pendiente", metodoPago: "efectivo", montoAdelantado: 0, notas: "", addons: [], recordarAntes: 60 };
    setForm(baseForm);
  };

  const handleOpenNewTurno = () => {
    setEditRow(null);
    resetForm();
    setOpenForm(true);
  };

  const handleCrearCliente = async () => {
    try {
      const nuevo = await createCliente(clienteForm);
      toast?.({ message: "Cliente creado", variant: "success" });
      setClientes((prev) => [...prev, nuevo.data]);
      setForm((f) => ({ ...f, clienteId: nuevo.data.id }));
      setClienteForm({ nombre: "", telefono: "", email: "", notas: "" });
      setOpenClienteModal(false);
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const handleCrearServicio = async () => {
    try {
      const payload = { ...servicioForm, categoriaId: servicioForm.categoriaId || null, duracionMin: parseInt(servicioForm.duracionMin) || 30, precio: parseFloat(servicioForm.precio) || 0, activo: true };
      const nuevo = await createServicio(payload);
      toast?.({ message: "Servicio creado", variant: "success" });
      setServicios((prev) => [...prev, nuevo.data]);
      const s = nuevo.data;
      const addons = form.addons || [];
      const addonsTotal = addons.reduce((acc, a) => acc + parseFloat(a.precio || 0), 0);
      const addonsDur = addons.reduce((acc, a) => acc + parseInt(a.duracionMin || 0, 10), 0);
      const precioBase = parseFloat(s.precio) || 0;
      const durBase = s.duracionMin || 30;
      setForm((f) => ({ ...f, servicioId: s.id, duracionMin: durBase + addonsDur, precioTotal: precioBase + addonsTotal }));
      setServicioForm({ nombre: "", categoriaId: "", duracionMin: 30, precio: 0, descripcion: "" });
      setOpenServicioModal(false);
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  const handleCrearAddon = async () => {
    try {
      const payload = { ...addonForm, precio: parseFloat(addonForm.precio) || 0, duracionMin: parseInt(addonForm.duracionMin) || 0, activo: true };
      const nuevo = await createAddon(payload);
      toast?.({ message: "Servicio extra creado", variant: "success" });
      setAddonsList((prev) => [...prev, nuevo.data]);
      addAddon(String(nuevo.data.id));
      setAddonForm({ nombre: "", precio: 0, duracionMin: 0, descripcion: "" });
      setOpenAddonModal(false);
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
    }
  };

  return (
    <Container sx={{ py: 2 }}>
      <Button variant="contained" startIcon={<Add />} sx={{ mb: 2 }} onClick={handleOpenNewTurno}>
        Nuevo turno
      </Button>
      <TurnoCalendaryTable
        turnos={rows}
        onReload={fetchData}
        onEdit={handleEdit}
        readOnly={false}
        onEstadoChange={async (turno, estado) => {
          try {
            await updateTurno(turno.id, { estado });
            toast?.({ message: "Estado actualizado", variant: "success" });
            fetchData();
          } catch (e) {
            toast?.({ message: e?.response?.data?.message || "Error", variant: "error" });
          }
        }}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editRow ? "Editar turno" : "Nuevo turno"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {/* Cliente + Empleado lado a lado */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <SearchableSelect
                    label="Cliente"
                    items={clientes}
                    value={form.clienteId ?? ""}
                    onChange={(val) => setForm({ ...form, clienteId: val })}
                    getOptionLabel={(item) => item.nombre || `Cliente #${item.id}`}
                    getOptionValue={(item) => item.id}
                    placeholder="Buscar cliente..."
                  />
                </Box>
                <Tooltip title="Agregar cliente">
                  <IconButton color="primary" onClick={() => { setClienteForm({ nombre: "", telefono: "", email: "", notas: "" }); setOpenClienteModal(true); }} sx={{ mt: 1 }}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEmpleado ? (
                <TextField
                  fullWidth
                  label="Empleado"
                  value={empleadoMe?.user ? `${empleadoMe.user.firstName} ${empleadoMe.user.firstLastName}` : "Tú"}
                  InputProps={{ readOnly: true }}
                  helperText="Asignado a tu nombre"
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <SearchableSelect
                      label="Empleado"
                      items={empleados}
                      value={form.empleadoId ?? ""}
                      onChange={(val) => setForm({ ...form, empleadoId: val })}
                      getOptionLabel={(item) => item.user ? `${item.user.firstName} ${item.user.firstLastName}` : `Empleado #${item.id}`}
                      getOptionValue={(item) => item.id}
                      placeholder="Buscar empleado..."
                    />
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Servicio + Servicio extra lado a lado */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <SearchableSelect
                    label="Servicio"
                    items={servicios}
                    value={form.servicioId ?? ""}
                    onChange={(val) => onServicioChange(val)}
                    getOptionLabel={(item) => `${item.nombre} - $${parseFloat(item.precio || 0).toFixed(2)} (${item.duracionMin} min)`}
                    getOptionValue={(item) => item.id}
                    placeholder="Buscar servicio..."
                  />
                </Box>
                <Tooltip title="Agregar servicio">
                  <IconButton color="primary" onClick={() => { setServicioForm({ nombre: "", categoriaId: "", duracionMin: 30, precio: 0, descripcion: "" }); setOpenServicioModal(true); }} sx={{ mt: 1 }}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <SearchableSelect
                    label="Servicio extra"
                    items={addonsList.filter((a) => !(form.addons || []).some((x) => x.addonId === a.id))}
                    value=""
                    onChange={(val) => { if (val) addAddon(val); }}
                    getOptionLabel={(item) => `${item.nombre} - $${parseFloat(item.precio || 0).toFixed(2)}`}
                    getOptionValue={(item) => item.id}
                    placeholder="Buscar servicio extra..."
                  />
                </Box>
                <Tooltip title="Agregar servicio extra">
                  <IconButton color="primary" onClick={() => { setAddonForm({ nombre: "", precio: 0, duracionMin: 0, descripcion: "" }); setOpenAddonModal(true); }} sx={{ mt: 1 }}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
              {(form.addons || []).map((item, idx) => {
                const addon = addonsList.find((a) => a.id === item.addonId);
                return (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, p: 0.5, bgcolor: "action.hover", borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{addon?.nombre || `#${item.addonId}`} · ${parseFloat(item.precio || 0).toFixed(2)}</Typography>
                    <Tooltip title="Minuto del servicio principal en que inicia este extra (ej: 30 = a mitad del servicio)">
                      <TextField type="number" size="small" label="Desde min" value={item.minutoInicio ?? 0} onChange={(e) => updateAddonMinuto(idx, e.target.value)} sx={{ width: 90 }} inputProps={{ min: 0, max: 999 }} />
                    </Tooltip>
                    <IconButton size="small" onClick={() => removeAddon(idx)} color="error"><Delete /></IconButton>
                  </Box>
                );
              })}
            </Grid>

            {/* Fecha y hora */}
            <Grid item xs={12}>
              <TextField type="datetime-local" fullWidth label="Fecha y hora" value={form.fechaHora} onChange={(e) => setForm({ ...form, fechaHora: e.target.value })} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>

            {/* Precio Total, Duración, Monto adelantado lado a lado */}
            <Grid item xs={12} sm={4}>
              <TextField type="number" fullWidth label="Precio total" value={form.precioTotal} onChange={(e) => setForm({ ...form, precioTotal: e.target.value })} size="small" inputProps={{ step: 0.01 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField type="number" fullWidth label="Duración (min)" value={form.duracionMin} onChange={(e) => setForm({ ...form, duracionMin: e.target.value })} size="small" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField type="number" fullWidth label="Monto adelantado" value={form.montoAdelantado} onChange={(e) => setForm({ ...form, montoAdelantado: e.target.value })} size="small" inputProps={{ step: 0.01 }} />
            </Grid>

            {/* Recordatorio */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Recordatorio</InputLabel>
                <Select value={form.recordarAntes ?? 0} label="Recordatorio" onChange={(e) => setForm({ ...form, recordarAntes: Number(e.target.value) })}>
                  {RECORDAR_OPCIONES.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Estado + Método de pago lado a lado */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select value={form.estado} label="Estado" onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  {Object.entries(estadoLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Método de pago</InputLabel>
                <Select value={form.metodoPago} label="Método de pago" onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}>
                  <MenuItem value="efectivo">Efectivo</MenuItem>
                  <MenuItem value="tarjeta">Tarjeta</MenuItem>
                  <MenuItem value="transferencia">Transferencia</MenuItem>
                  <MenuItem value="mixto">Mixto</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Notas como textarea */}
            <Grid item xs={12}>
              <TextField fullWidth label="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} multiline rows={3} placeholder="Notas adicionales del turno..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.clienteId || (!isEmpleado && !form.empleadoId) || (isEmpleado && !empleadoMe) || !form.servicioId || !form.fechaHora}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal agregar cliente */}
      <Dialog open={openClienteModal} onClose={() => setOpenClienteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo cliente</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" value={clienteForm.nombre} onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Teléfono" value={clienteForm.telefono} onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })} margin="normal" />
          <TextField fullWidth label="Email" value={clienteForm.email} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} margin="normal" />
          <TextField fullWidth label="Notas" value={clienteForm.notas} onChange={(e) => setClienteForm({ ...clienteForm, notas: e.target.value })} margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClienteModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearCliente} disabled={!clienteForm.nombre?.trim()}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal agregar servicio */}
      <Dialog open={openServicioModal} onClose={() => setOpenServicioModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo servicio</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" value={servicioForm.nombre} onChange={(e) => setServicioForm({ ...servicioForm, nombre: e.target.value })} margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select value={servicioForm.categoriaId} label="Categoría" onChange={(e) => setServicioForm({ ...servicioForm, categoriaId: e.target.value })}>
              <MenuItem value="">Sin categoría</MenuItem>
              {categorias.map((c) => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField type="number" fullWidth label="Duración (min)" value={servicioForm.duracionMin} onChange={(e) => setServicioForm({ ...servicioForm, duracionMin: e.target.value })} margin="normal" />
          <TextField type="number" fullWidth label="Precio" value={servicioForm.precio} onChange={(e) => setServicioForm({ ...servicioForm, precio: e.target.value })} margin="normal" inputProps={{ step: 0.01 }} />
          <TextField fullWidth label="Descripción" value={servicioForm.descripcion} onChange={(e) => setServicioForm({ ...servicioForm, descripcion: e.target.value })} margin="normal" multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServicioModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearServicio} disabled={!servicioForm.nombre?.trim()}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal agregar servicio extra */}
      <Dialog open={openAddonModal} onClose={() => setOpenAddonModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo servicio extra</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" value={addonForm.nombre} onChange={(e) => setAddonForm({ ...addonForm, nombre: e.target.value })} margin="normal" required />
          <TextField type="number" fullWidth label="Precio" value={addonForm.precio} onChange={(e) => setAddonForm({ ...addonForm, precio: e.target.value })} margin="normal" inputProps={{ step: 0.01 }} />
          <TextField type="number" fullWidth label="Duración extra (min)" value={addonForm.duracionMin} onChange={(e) => setAddonForm({ ...addonForm, duracionMin: e.target.value })} margin="normal" />
          <TextField fullWidth label="Descripción" value={addonForm.descripcion} onChange={(e) => setAddonForm({ ...addonForm, descripcion: e.target.value })} margin="normal" multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddonModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearAddon} disabled={!addonForm.nombre?.trim()}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
