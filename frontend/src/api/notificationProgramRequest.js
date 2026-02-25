import axios, { jwt } from "./axios.js";

export const getNotificationPrograms = () =>
  axios.get("/notification-programs", { headers: { Authorization: jwt() } });

export const createNotificationProgram = (data) =>
  axios.post("/notification-programs", data, { headers: { Authorization: jwt() } });

export const updateNotificationProgram = (id, data) =>
  axios.put(`/notification-programs/${id}`, data, { headers: { Authorization: jwt() } });

export const deleteNotificationProgram = (id) =>
  axios.delete(`/notification-programs/${id}`, { headers: { Authorization: jwt() } });

export const sendNotificationProgramNow = (id) =>
  axios.post(`/notification-programs/${id}/send`, null, { headers: { Authorization: jwt() } });
