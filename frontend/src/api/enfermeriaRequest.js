import axios, { jwt } from "./axios.js";
import appsInfo from "../../appConfig.js";

const auth = () => ({ headers: { Authorization: jwt() } });

// Base URL del backend de enfermería (siempre apuntar ahí para stats)
const getEnfermeriaBaseUrl = () => {
  const cfg = appsInfo.enfermeria || { apiPath: "enfermeriaapi", apiPort: 3003 };
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:${cfg.apiPort}/${cfg.apiPath}`;
};

// Estadísticas públicas (sin auth) - siempre llama al backend enfermería
export const getStatsPublic = () => axios.get(`${getEnfermeriaBaseUrl()}/stats`);

// Auth
export const loginEnfermeria = (data) => axios.post("/auth", data);
export const logoutEnfermeria = () => axios.post("/auth/logout", {}, auth());
export const getSessionEnfermeria = () => axios.get("/auth", auth());
export const getRolesEnfermeria = () => axios.get("/roles");

// Pacientes
export const getPatients = () => axios.get("/patients", auth());
export const searchPatient = (term) => axios.get(`/patients/search/${encodeURIComponent(term)}`, auth());
export const getPatientByDni = (dni) => axios.get(`/patients/${dni}`, auth());
export const getPatientHistory = (dni) => axios.get(`/patients/history/${dni}`, auth());
export const getMedicalRecord = (dni, page) =>
  axios.get(`/patients/medicalrecord/${dni}/${page}`, auth());
export const getCompletedMedicalRecord = (dni, page) =>
  axios.get(`/patients/completedMedicalRecord/${dni}/${page}`, auth());
export const createPatient = (data) => axios.post("/patients", data, auth());
export const updatePatient = (data) => axios.put("/patients", data, auth());

// Instituciones
export const getInstitutions = () => axios.get("/institution", auth());
export const searchInstitution = (search) =>
  axios.get(`/institution/${encodeURIComponent(search)}`, auth());
export const createInstitution = (data) => axios.post("/institution", data, auth());
export const updateInstitution = (data) => axios.put("/institution", data, auth());

// Diagnósticos CIE-10
export const searchDiagnostic = (search) =>
  axios.get(`/diagnostics/${encodeURIComponent(search)}`, auth());

// CIE-10 (catálogo jerárquico)
export const getCie10Grupos = () => axios.get("/cie10/grupos", auth());
export const getCie10Subgrupos = (idGrupo) =>
  axios.get(`/cie10/grupos/${idGrupo}/subgrupos`, auth());
export const getCie10Categorias = (idSubgrupo) =>
  axios.get(`/cie10/subgrupos/${idSubgrupo}/categorias`, auth());
export const getCie10Diagnosticos = (idCategoria) =>
  axios.get(`/cie10/categorias/${idCategoria}/diagnosticos`, auth());
export const searchCie10 = (term) =>
  axios.get(`/cie10/search/${encodeURIComponent(term)}`, auth());

// Ficha médica
export const searchDoctor = (search) =>
  axios.get(`/addMedicalRecord/${encodeURIComponent(search)}`, auth());
export const saveMedicalRecord = (data) => axios.post("/medicalRecord", data, auth());
export const updateMedicalRecord = (data) => axios.put("/medicalRecord", data, auth());

// Logs
export const getLogs = () => axios.get("/logs", auth());
