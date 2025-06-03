
import axios, { jwt } from "./axios.js";

export const getHotel = async () =>
  await axios.get("/getHotel", {
    headers: {
      Authorization: jwt(),
    },
  });

  export const addHotel = async (data) =>
  await axios.post("/addHotel", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateHotel= async (id, data) =>
  await axios.put(`/updateHotel/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getOneHotel = async (id) =>
  await axios.get(`/getOneHotel/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });



