// src/hooks/useNotificationSocket.js
import { useEffect } from "react";

import { socket } from "../api/axios";

export const useNotificationSocket = (userId, onNewNotification) => {
  useEffect(() => {
    // console.log("------------------------ si se ejecuta ",userId)
    if (!userId) return;
    socket.emit("join", userId);
  }, [userId]);

  useEffect(() => {
    socket.on("newNotification", onNewNotification);
    return () => socket.off("newNotification", onNewNotification);
  }, [onNewNotification]);
};
