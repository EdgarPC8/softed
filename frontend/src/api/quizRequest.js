import axios, { jwt } from "./axios.js";

// Obtener todos los cuestionarios
export const getQuizzes = async () =>
  await axios.get("/quiz", {
    headers: { Authorization: jwt() },
  });

// Crear un nuevo cuestionario
export const createQuiz = async (data) =>
  await axios.post("/quiz", data, {
    headers: { Authorization: jwt() },
  });

// Editar un cuestionario
export const editQuiz = async (id, data) =>
  await axios.put(`/quiz/${id}`, data, {
    headers: { Authorization: jwt() },
  });

// Eliminar un cuestionario
export const deleteQuiz = async (id) =>
  await axios.delete(`/quiz/${id}`, {
    headers: { Authorization: jwt() },
  });

// Obtener preguntas por quiz
export const getQuestionsByQuiz = async (id) =>
  await axios.get(`/quiz/questions/${id}`, {
    headers: { Authorization: jwt() },
  });

// Guardar preguntas del cuestionario
export const addQuestionsToQuiz = async (quizId, payload) =>
  await axios.put(`/quiz/questions/${quizId}`, payload,{
    headers: { Authorization: jwt() },
  });

// Obtener respuestas planas
export const getQuizResponses = async (quizId) =>
  await axios.get(`/quiz/responses/${quizId}`, {
    headers: { Authorization: jwt() },
  });

// Obtener respuestas agrupadas por usuario
export const getQuizUserResponses = async (quizId) =>
  await axios.get(`/quiz/responses/users/${quizId}`, {
    headers: { Authorization: jwt() },
  });

// Obtener usuarios asignados a un quiz
export const getUsersByQuizAssign = async (quizId) =>
  await axios.get(`/quiz/assign/${quizId}`, {
    headers: { Authorization: jwt() },
  });

// Desasignar usuario de un quiz
export const deleteUsersByQuizAssign = async (quizId, userId) =>
  await axios.delete(`/quiz/assign/${quizId}/${userId}`, {
    headers: { Authorization: jwt() },
  });


  export const filterUsersByRole = async (roleId) =>
  await axios.post(
    `/quiz/assign/filter`, { roleId },
    {
      headers: {
        Authorization: jwt(),
      },
    }
  );

  export const assignUsersToQuiz = async (quizId, payload) =>
  await axios.post(`/quiz/assign/${quizId}`, payload, {
    headers: {
      Authorization: jwt(),
    },
  });


  export const getQuizzesByUserId = async (userId) =>
  await axios.get(`/quiz/assigned/${userId}`, {
    headers: {
      Authorization: jwt(),
    },
  });

  export const submitQuizAnswers = async (quizId, payload) =>
  await axios.post(`/quiz/submit/${quizId}`, payload, {
    headers: { Authorization: jwt() },
  });




