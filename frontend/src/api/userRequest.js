// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getSessionRequest = async () =>
  await axios.get("/getSession", {
    headers: {
      Authorization: jwt(),
    },
  });
export const loginRequest = async (data) => await axios.post("/login", data);

export const addUserRequest = async (data) =>
  await axios.post("/users", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateUserRequest = async (dni, data) =>
  await axios.put(`/users/${dni}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const addUserPhotoRequest = async (photo) =>
  await axios.post("/users/pohto", photo, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateUserPhotoRequest = async (dni, photo) =>
  await axios.post(`/users/photo/${dni}`, photo, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getOneUserRequest = async (dni) =>
  await axios.get(`/users/${dni}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteUserRequest = async (dni) =>
  await axios.delete(`/users/${dni}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getUsersRequest = async (dni) =>
  await axios.get("/users", {
    headers: {
      Authorization: jwt(),
    },
  });


