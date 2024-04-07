import axios, { jwt } from "./axios.js";

export const getMetersRequest = async () =>
  await axios.get("/meters", {
    headers: {
      Authorization: jwt(),
    },
  });

export const addMetersRequest = async (data) =>
  await axios.post("/meters", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateMetersRequest = async (id, data) =>
  await axios.put(`/meters/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteMetersRequest = async (id) =>
  await axios.delete(`/meters/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
