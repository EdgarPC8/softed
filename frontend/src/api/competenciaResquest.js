// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getCompetencia = async () =>
  await axios.get("/administrarCompetencia", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getCompetenciaTiempos = async () =>
  await axios.get("/getCompetenciaTiempos", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getResultados = async () =>
  await axios.get("/getResultados", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getEntidadCompetencia = async () =>
  await axios.get("/getEntidadCompetencia", {
    headers: {
      Authorization: jwt(),
    },
  });


export const updateTimeCompetencia = async (id, data) =>
await axios.put(`/updateTimeCompetencia/${id}`, data, {
  headers: {
    Authorization: jwt(),
  },
});


