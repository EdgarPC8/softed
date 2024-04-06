// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getTiemposByCI = async (data) => await axios.get(`/getTiemposByCI/${data}`,{
    headers: {
      Authorization: jwt(),
    },
  });
export const getTiemposByMetrosPrueba = async (cedula,metros,prueba) => await axios.get(`/getTiemposByMetrosPrueba/${cedula}/${metros}/${prueba}`,{
    headers: {
      Authorization: jwt(),
    },
  });
export const getAllTiemposRecordsById = async (cedula) => await axios.get(`/getAllTiemposRecordsById/${cedula}`,{
    headers: {
      Authorization: jwt(),
    },
  });








