// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getMetros = async (data) => await axios.get(`/getMetros`,{
    headers: {
      Authorization: jwt(),
    },
  });
export const getPruebas = async (data) => await axios.get(`/getPruebas`,{
    headers: {
      Authorization: jwt(),
    },
  });









