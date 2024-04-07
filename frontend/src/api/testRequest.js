import axios, { jwt } from "./axios.js";

export const getTestRequest = async () =>
  await axios.get("/tests", {
    headers: {
      Authorization: jwt(),
    },
  });

export const addTestsRequest = async (data) =>
  await axios.post("/tests", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateTestsRequest = async (id, data) =>
  await axios.put(`/tests/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteTestsRequest = async (id) =>
  await axios.delete(`/tests/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
