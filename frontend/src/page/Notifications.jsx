import { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import NotificationList from "../Components/NotificationList";
const simulatedNotifications = [
  {
    id: 1,
    title: "Sistema de Encuestas",
    message: "Tienes una nueva encuesta asignada.",
    createdAt: "2025-06-02T12:00:00Z",
    seen: false,
  },
  {
    id: 2,
    title: "Recordatorio",
    message: "Recuerda completar la encuesta antes del viernes.",
    createdAt: "2025-06-01T10:00:00Z",
    seen: true,
  },
  // agrega más si quieres
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setNotifications(simulatedNotifications);
    }, 300);
  }, []);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, bgcolor: "background.paper", borderRadius: 2, p: 2, boxShadow: 3 }}>
      <NotificationList notifications={notifications} />
    </Box>
  );
}

export default NotificationsPage;
