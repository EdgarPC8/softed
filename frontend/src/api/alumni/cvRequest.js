import axios, { jwt } from "../axios.js";

const auth = () => ({ headers: { Authorization: jwt() } });

// Perfil CV (professional)
export const getProfessional = () =>
  axios.get("/cv/professional", auth());
export const updateProfessional = (data) =>
  axios.put("/cv/professional", data, auth());
/** Subir foto de la hoja de vida (FormData con campo "photo") */
export const updateProfessionalPhoto = (formData) =>
  axios.put("/cv/professional/photo", formData, auth());
export const deleteProfessionalPhoto = () =>
  axios.delete("/cv/professional/photo", auth());
/** Todos los datos del CV para vista/PDF */
export const getFullCv = () =>
  axios.get("/cv/full", auth());
/** Lista de plantillas de CV desde la BD */
export const getTemplates = () =>
  axios.get("/cv/templates", auth());
/** Guardar plantillas importadas. body: { templates: [ { name, description, type, sections, componentKey } ] } */
export const saveTemplates = (templates) =>
  axios.post("/cv/templates", { templates }, auth());

// Formación académica
export const getAllAcademicTraining = () =>
  axios.get("/cv/academic-training", auth());
export const addAcademicTraining = (data) =>
  axios.post("/cv/academic-training", data, auth());
export const editAcademicTraining = (id, data) =>
  axios.put(`/cv/academic-training/${id}`, data, auth());
export const deleteAcademicTraining = (id) =>
  axios.delete(`/cv/academic-training/${id}`, auth());

// Experiencia docente
export const getAllTeachingExperience = () =>
  axios.get("/cv/teaching-experience", auth());
export const addTeachingExperience = (data) =>
  axios.post("/cv/teaching-experience", data, auth());
export const editTeachingExperience = (id, data) =>
  axios.put(`/cv/teaching-experience/${id}`, data, auth());
export const deleteTeachingExperience = (id) =>
  axios.delete(`/cv/teaching-experience/${id}`, auth());

// Cursos / talleres
export const getAllCoursesWorkshops = () =>
  axios.get("/cv/courses-workshops", auth());
export const addCoursesWorkshops = (data) =>
  axios.post("/cv/courses-workshops", data, auth());
export const editCoursesWorkshops = (id, data) =>
  axios.put(`/cv/courses-workshops/${id}`, data, auth());
export const deleteCoursesWorkshops = (id) =>
  axios.delete(`/cv/courses-workshops/${id}`, auth());

// Producción intelectual
export const getAllIntellectualProduction = () =>
  axios.get("/cv/intellectual-production", auth());
export const addIntellectualProduction = (data) =>
  axios.post("/cv/intellectual-production", data, auth());
export const editIntellectualProduction = (id, data) =>
  axios.put(`/cv/intellectual-production/${id}`, data, auth());
export const deleteIntellectualProduction = (id) =>
  axios.delete(`/cv/intellectual-production/${id}`, auth());

// Libros
export const getAllBooks = () =>
  axios.get("/cv/books", auth());
export const addBooks = (data) =>
  axios.post("/cv/books", data, auth());
export const editBooks = (id, data) =>
  axios.put(`/cv/books/${id}`, data, auth());
export const deleteBooks = (id) =>
  axios.delete(`/cv/books/${id}`, auth());

// Méritos académicos y profesionales
export const getAllMerits = () =>
  axios.get("/cv/merits", auth());
export const addMerits = (data) =>
  axios.post("/cv/merits", data, auth());
export const editMerits = (id, data) =>
  axios.put(`/cv/merits/${id}`, data, auth());
export const deleteMerits = (id) =>
  axios.delete(`/cv/merits/${id}`, auth());

// Idiomas
export const getAllLanguages = () =>
  axios.get("/cv/languages", auth());
export const addLanguages = (data) =>
  axios.post("/cv/languages", data, auth());
export const editLanguages = (id, data) =>
  axios.put(`/cv/languages/${id}`, data, auth());
export const deleteLanguages = (id) =>
  axios.delete(`/cv/languages/${id}`, auth());

// Experiencia profesional
export const getAllProfessionalExperience = () =>
  axios.get("/cv/professional-experience", auth());
export const addProfessionalExperience = (data) =>
  axios.post("/cv/professional-experience", data, auth());
export const editProfessionalExperience = (id, data) =>
  axios.put(`/cv/professional-experience/${id}`, data, auth());
export const deleteProfessionalExperience = (id) =>
  axios.delete(`/cv/professional-experience/${id}`, auth());
