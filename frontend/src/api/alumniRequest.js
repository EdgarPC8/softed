import axios, { jwt } from "./axios.js";

export const getCareers = async () =>
  await axios.get("/alumni/career", { headers: { Authorization: jwt() } });
export const addCareer = async (data) =>
  await axios.post("/alumni/career", data, { headers: { Authorization: jwt() } });
export const editCareer = async (id, data) =>
  await axios.put(`/alumni/career/${id}`, data, { headers: { Authorization: jwt() } });
export const deleteCareer = async (id) =>
  await axios.delete(`/alumni/career/${id}`, { headers: { Authorization: jwt() } });




  export const getPeriods = async () =>
  await axios.get("/alumni/period", { headers: { Authorization: jwt() } });
export const addPeriod = async (data) =>
  await axios.post("/alumni/period", data, { headers: { Authorization: jwt() } });
export const editPeriod = async (id, data) =>
  await axios.put(`/alumni/period/${id}`, data, { headers: { Authorization: jwt() } });
export const deletePeriod = async (id) =>
  await axios.delete(`/alumni/period/${id}`, { headers: { Authorization: jwt() } });


  export const getMatriz = async () =>
  await axios.get("/alumni/matriz", { headers: { Authorization: jwt() } });
export const addMatriz = async (data) =>
  await axios.post("/alumni/matriz", data, { headers: { Authorization: jwt() } });
export const editMatriz = async (id, data) =>
  await axios.put(`/alumni/matriz/${id}`, data, { headers: { Authorization: jwt() } });
export const deleteMatriz = async (id) =>
  await axios.delete(`/alumni/matriz/${id}`, { headers: { Authorization: jwt() } });





