// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const createCuenta = async (data) => await axios.post("/createCuenta",data);









