// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getSessionRequest = async () => await axios.get("/getSession",{
    headers: {
      Authorization: jwt(),
    },
  });
export const loginRequest = async (data) => await axios.post("/login",data);








