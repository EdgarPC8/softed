import axios, { jwt } from "./axios.js";

// Obtener todas las encuestas
export const getForms = async () => 
  await axios.get("/forms", { headers: { Authorization: jwt() } });

  
  export const getUsersByFormAssign = async (id) =>
  await axios.get(`/forms/assign/${id}`, { headers: { Authorization: jwt() } });

  export const deleteUsersByFormAssign = async (formId,userId) =>
  await axios.delete(`/forms/assign/${formId}/${userId}`, { headers: { Authorization: jwt() } });

  export const getQuestionsByForm = async (id) =>
  await axios.get(`/forms/manage/${id}`, { headers: { Authorization: jwt() } });

export const assignUsersToForm = async (formId,userIds) =>
  await axios.post(`/forms/assign/${formId}`, {userIds}, { headers: { Authorization: jwt() } });
// Crear una nueva encuesta
export const createForm = async (data) =>
  await axios.post("/forms", data, { headers: { Authorization: jwt() } });

// Editar una encuesta existente por ID
export const editForm = async (id, data) =>
  await axios.put(`/forms/${id}`, data, { headers: { Authorization: jwt() } });

// Eliminar una encuesta por ID
export const deleteForm = async (id) =>
  await axios.delete(`/forms/${id}`, { headers: { Authorization: jwt() } });

// Añadir preguntas a una encuesta por ID
export const addQuestionsToForm = async (id, questions) =>
  await axios.post(`/forms/manage/${id}`, questions, { headers: { Authorization: jwt() } });

// Obtener respuestas de una encuesta por ID
export const getResponses = async (id) =>
  await axios.get(`/forms/responses/${id}`, { headers: { Authorization: jwt() } });

// Enviar una respuesta a una encuesta
export const respondeForm = async (id, response) =>
  await axios.post(`/forms/submit/${id}`, response, { headers: { Authorization: jwt() } });

// Obtener todas las encuestas de un usuario por userId
export const getFormsByUserId = async (userId) =>
  await axios.get(`/forms/user/${userId}`, { headers: { Authorization: jwt() } });

export const cloneFormRequest = (formId) => axios.post(`/forms/clone/${formId}`);


  