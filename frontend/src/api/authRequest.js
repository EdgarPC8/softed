
import axios, { jwt } from "./axios.js";
export const changeRole = async (data) =>
await axios.post("/changeRole", data, {
  headers: {
    Authorization: jwt(),
  },
});

  export const getLicenses = async () =>
  await axios.get("/getLicenses", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const addLicense = async (data) =>
  await axios.post("/addLicense", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getOneLicense = async (id) =>
  await axios.get(`/license/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteLicense = async (id) =>
  await axios.delete(`/license/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const updateLicense = async (id, data) =>
  await axios.put(`/license/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },


  });

  // 🔐 Login con accountId y password
export const loginByAccountRequest = async (data) =>
await axios.post("/loginByAccount", data);

// 🔍 Obtener todas las cuentas asociadas a un usuario
export const getAccountsByUsernameRequest = async (username) =>
await axios.get(`/accounts/${username}`, {
  headers: {
    Authorization: jwt(),
  },
});