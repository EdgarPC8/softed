
import axios, { jwt } from "./axios.js";


export const getQuizzes = async () =>
  await axios.get("/quiz", {
    headers: {
      Authorization: jwt(),
    },
  });

  export const saveQuiz = async (data) =>
  await axios.post("/quiz", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const getOptionsQuestions = async () =>
  await axios.get("/quiz/getOptionsQuestions", {
    headers: {
      Authorization: jwt(),
    },
  });

  export const addAnswerUser = async (data) =>
  await axios.post("/quiz/answer", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const addAllAnswersUsers = async (data) =>
  await axios.post("/quiz/addAllAnswersUsers", data, {
    headers: {
      Authorization: jwt(),
    },
  });

