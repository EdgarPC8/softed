// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getAllNadadores = async () =>
  await axios.get("/getAllNadadores", {
    headers: {
      Authorization: jwt(),
    },
  });

export const addSwimmerRequest = async (data) =>
  await axios.post("/swimmer", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getOneSwimmerRequest = async (dni) =>
  await axios.get(`/swimmer/${dni}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateSwimmerRequest = async (dni, data) =>
  await axios.put(`/swimmer/${dni}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteSwimmerRequest = async (dni) =>
  await axios.delete(`/swimmer/${dni}`, {
    headers: {
      Authorization: jwt(),
    },
  });
