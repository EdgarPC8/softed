import { useEffect } from "react";
import { socket } from "../api/axios";

export const useNotificationSocket = (userId, accountId, onNewNotification) => {
  useEffect(() => {
    if (!userId && !accountId) return;
    socket.emit("join", { userId: userId || null, accountId: accountId || null });
  }, [userId, accountId]);

  useEffect(() => {
    socket.on("newNotification", onNewNotification);
    return () => socket.off("newNotification", onNewNotification);
  }, [onNewNotification]);
};
