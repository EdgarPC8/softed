// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const addAccountRequest = async (data) =>
  await axios.post("/account", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const updateAccountRequest = async (id, data) =>
  await axios.put(`/account/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const updateAccountUser = async (id,userId,rolId, data) =>
  await axios.put(`/account/updateAccountUser/${id}/${userId}/${rolId}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const resetPassword = async (id, data) =>
  await axios.put(`/account/resetPassword/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const getOneAccountRequest = async (id) =>
  await axios.get(`/account/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getAccount = async (userId,rolId) =>
  await axios.get(`/account/${userId}/${rolId}`, {
    headers: {
      Authorization: jwt(),
    },
  });


export const deleteAccountRequest = async (id) =>
  await axios.delete(`/account/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getAccountRequest = async (dni) =>
  await axios.get("/account", {
    headers: {
      Authorization: jwt(),
    },
  });




  export const addRolRequest = async (data) =>
  await axios.post("/rol", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const updateRolRequest = async (id, data) =>
  await axios.put(`/rol/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const getOneRolRequest = async (id) =>
  await axios.get(`/rol/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteRolRequest = async (id) =>
  await axios.delete(`/rol/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getRolRequest = async (dni) =>
  await axios.get("/rol", {
    headers: {
      Authorization: jwt(),
    },
  });



