import axios, { jwt } from "./axios.js";

const auth = () => ({ headers: { Authorization: jwt() } });

export const getClientes = () => axios.get("/clientes", auth());
export const getCliente = (id) => axios.get(`/clientes/${id}`, auth());
export const createCliente = (data) => axios.post("/clientes", data, auth());
export const updateCliente = (id, data) => axios.put(`/clientes/${id}`, data, auth());
export const deleteCliente = (id) => axios.delete(`/clientes/${id}`, auth());

export const getCategorias = () => axios.get("/categorias", auth());
export const getCategoria = (id) => axios.get(`/categorias/${id}`, auth());
export const createCategoria = (data) => axios.post("/categorias", data, auth());
export const updateCategoria = (id, data) => axios.put(`/categorias/${id}`, data, auth());
export const deleteCategoria = (id) => axios.delete(`/categorias/${id}`, auth());

export const getServicios = () => axios.get("/servicios", auth());
export const getServicio = (id) => axios.get(`/servicios/${id}`, auth());
export const createServicio = (data) => axios.post("/servicios", data, auth());
export const updateServicio = (id, data) => axios.put(`/servicios/${id}`, data, auth());
export const deleteServicio = (id) => axios.delete(`/servicios/${id}`, auth());

export const getAddons = () => axios.get("/servicio-extra", auth());
export const getAddon = (id) => axios.get(`/servicio-extra/${id}`, auth());
export const createAddon = (data) => axios.post("/servicio-extra", data, auth());
export const updateAddon = (id, data) => axios.put(`/servicio-extra/${id}`, data, auth());
export const deleteAddon = (id) => axios.delete(`/servicio-extra/${id}`, auth());

export const getEmpleados = () => axios.get("/empleados", auth());
export const getEmpleadoMe = () => axios.get("/empleados/me", auth());
export const getEmpleado = (id) => axios.get(`/empleados/${id}`, auth());
export const createEmpleado = (data) => axios.post("/empleados", data, auth());
export const updateEmpleado = (id, data) => axios.put(`/empleados/${id}`, data, auth());
export const deleteEmpleado = (id) => axios.delete(`/empleados/${id}`, auth());

export const getTurnos = (params) => axios.get("/turnos", { params, ...auth() });
export const getTurno = (id) => axios.get(`/turnos/${id}`, auth());
export const createTurno = (data) => axios.post("/turnos", data, auth());
export const updateTurno = (id, data) => axios.put(`/turnos/${id}`, data, auth());
export const deleteTurno = (id) => axios.delete(`/turnos/${id}`, auth());

export const consultarTurnoPorTelefono = (telefono) =>
  axios.get("/turnos/consultar", { params: { telefono } });
