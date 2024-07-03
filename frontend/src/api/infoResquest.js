// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";


export const getInfo = async (cedula) => await axios.get(`/getinfo/${cedula}`,{
    headers: {
      Authorization: jwt(),
    },
  });








