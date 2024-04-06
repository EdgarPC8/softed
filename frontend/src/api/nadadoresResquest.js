// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getAllNadadores = async () => await axios.get("/getAllNadadores",{
    headers: {
      Authorization: jwt(),
    },
  });








