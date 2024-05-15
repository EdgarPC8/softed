import axios, { jwt } from "./axios.js";

export const sendBackUpRequest = async (back) =>
  axios.post("/backUp", back, {
    headers: {
      Authorization: jwt(),
    },
  });
