import axios, { jwt } from "./axios.js";

export const getNotifications = async () =>
  await axios.get("/notifications", { headers: { Authorization: jwt() } });

export const getUnreadCount = async () =>
  await axios.get("/notifications/unreadCount", { headers: { Authorization: jwt() } });

// Crear una nueva notificación
export const createNotification = async (data) =>
  await axios.post("/notifications", data, {
    headers: {
      Authorization: jwt(),
    },
  });

// Marcar una notificación como vista
export const markNotificationAsSeen = async (id) =>
  await axios.put(`/notifications/seen/${id}`, null, {
    headers: {
      Authorization: jwt(),
    },
  });

// Marcar como eliminada (soft delete)
export const deleteNotification = async (id) =>
  await axios.delete(`/notifications/${id}`, {
    headers: {
      Authorization: jwt(),
    },
  });
