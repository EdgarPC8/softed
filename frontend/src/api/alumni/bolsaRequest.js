import { axiosForAlumniModules as axios, jwt } from "../axios.js";

const prefix = "/bolsa-empleo";

// Públicas
export const getOfertasPublicas = (params = {}) =>
  axios.get(`${prefix}/ofertas`, { params, headers: { Authorization: jwt() } });

export const getOfertaById = (id) =>
  axios.get(`${prefix}/ofertas/${id}`, { headers: { Authorization: jwt() } });

export const getCareersForBolsa = () =>
  axios.get(`${prefix}/careers`, { headers: { Authorization: jwt() } });

// Empresa - Perfil
export const getPerfilEmpresa = () =>
  axios.get(`${prefix}/empresa/perfil`, { headers: { Authorization: jwt() } });

export const crearPerfilEmpresa = (data) =>
  axios.post(`${prefix}/empresa/perfil`, data, { headers: { Authorization: jwt() } });

export const actualizarPerfilEmpresa = (data) =>
  axios.put(`${prefix}/empresa/perfil`, data, { headers: { Authorization: jwt() } });

export const subirLogoEmpresaPerfil = (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  return axios.put(`${prefix}/empresa/perfil/logo`, formData, {
    headers: { Authorization: jwt(), "Content-Type": "multipart/form-data" },
  });
};

// Admin: empresas
export const getEmpresas = (params) =>
  axios.get(`${prefix}/admin/empresas`, { params, headers: { Authorization: jwt() } });

export const crearEmpresa = (data) =>
  axios.post(`${prefix}/admin/empresas`, data, { headers: { Authorization: jwt() } });

export const actualizarEmpresa = (id, data) =>
  axios.put(`${prefix}/admin/empresas/${id}`, data, { headers: { Authorization: jwt() } });

export const getAccountsParaVincularEmpresa = (empresaId) =>
  axios.get(`${prefix}/admin/empresas/accounts-vincular`, {
    params: empresaId ? { empresaId } : {},
    headers: { Authorization: jwt() },
  });

export const subirLogoEmpresa = (empresaId, file) => {
  const formData = new FormData();
  formData.append("logo", file);
  return axios.put(`${prefix}/admin/empresas/${empresaId}/logo`, formData, {
    headers: { Authorization: jwt(), "Content-Type": "multipart/form-data" },
  });
};

export const eliminarLogoEmpresa = (empresaId) =>
  axios.delete(`${prefix}/admin/empresas/${empresaId}/logo`, {
    headers: { Authorization: jwt() },
  });

// Empresa o Admin - Ofertas
export const getMisOfertas = (params) =>
  axios.get(`${prefix}/empresa/ofertas`, { params, headers: { Authorization: jwt() } });

export const crearOferta = (data) =>
  axios.post(`${prefix}/empresa/ofertas`, data, { headers: { Authorization: jwt() } });

export const actualizarOferta = (id, data) =>
  axios.put(`${prefix}/empresa/ofertas/${id}`, data, { headers: { Authorization: jwt() } });

export const cambiarEstadoOferta = (id, estado) =>
  axios.patch(`${prefix}/empresa/ofertas/${id}/estado`, { estado }, { headers: { Authorization: jwt() } });

// Empresa - Postulantes
export const getPostulantes = (ofertaId) =>
  axios.get(`${prefix}/empresa/ofertas/${ofertaId}/postulantes`, { headers: { Authorization: jwt() } });

export const actualizarEstadoPostulacion = (id, data) =>
  axios.patch(`${prefix}/empresa/postulaciones/${id}`, data, { headers: { Authorization: jwt() } });

// Graduado - Postularse
export const postularse = (ofertaId, mensajePresentacion) =>
  axios.post(`${prefix}/ofertas/${ofertaId}/postular`, { mensajePresentacion }, { headers: { Authorization: jwt() } });

export const getMisPostulaciones = () =>
  axios.get(`${prefix}/mis-postulaciones`, { headers: { Authorization: jwt() } });
