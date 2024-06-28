import axios, { jwt } from "./axios.js";

export const sendBackUpRequest = async (back) =>
  await axios.post("/backUp", back, {
    headers: {
      Authorization: jwt(),
    },
  });

export const addImagesHomeRequest = async (images) =>
  await axios.post("/images", images, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getHomeImagesRequest = async () =>
  await axios.get("/images", {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteImageRequest = async (name) =>
  await axios.delete(`/images/${name}`, {
    headers: {
      Authorization: jwt(),
    },
  });

