
import axios, { jwt } from "./axios.js";

export const getNivel = async () =>
  await axios.get("/getNivel", {
    headers: {
      Authorization: jwt(),
    },
  });

  export const addNivel = async (data) =>
  await axios.post("/addNivel", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateNivel= async (id, data) =>
  await axios.put(`/updateNivel/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getOneNivel = async (id) =>
  await axios.get(`/getOneNivel/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteNivel = async (id) =>
  await axios.delete(`/deleteNivel/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  