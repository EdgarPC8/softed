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



export const addUserPhotoRequest = async (photo) =>
  await axios.post("/users/photo", photo, {
    headers: {
      Authorization: jwt(),
    },
  });

// export const updateUserPhotoRequest = async (id, photo) =>
//   await axios.put(`/users/photo/${id}`, photo);

  export const updateUserPhotoRequest = async (id, userData) =>
  await axios.put(`/users/photo/${id}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: jwt(),
    },
  });
  export const deleteUserPhotoRequest = async (id) =>
  await axios.delete(`/users/photo/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getOneUserRequest = async (id) =>
  await axios.get(`/users/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteUserRequest = async (id) =>
  await axios.delete(`/users/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const updateUserRequest = async (id, data) =>
  await axios.put(`/users/${id}`, data, {
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


