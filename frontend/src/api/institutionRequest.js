import axios, { jwt } from "./axios.js";

export const addInstitutionRequest = async (data) =>
  await axios.post("/institution", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getInstitutionsRequest = async () =>
  await axios.get("/institution", {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteInstitutionRequest = async (id) =>
  await axios.delete(`/institution/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateInstitutionRequest = async (id, data) =>
  await axios.put(`/institution/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
