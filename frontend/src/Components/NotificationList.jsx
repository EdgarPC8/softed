import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getNotificationsByUser,
  markNotificationAsSeen,
  deleteNotification,
} from "../api/notificationsRequest";
import { useAuth } from "../context/AuthContext";

export function getRelativeTime(dateString) {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diff = Math.floor((now - createdAt) / 1000 / 60 / 60 / 24);
  if (diff === 0) return "hoy";
  if (diff === 1) return "1 d";
  if (diff < 7) return `${diff} d`;
  if (diff < 30) return `${Math.floor(diff / 7)} sem`;
  return `${Math.floor(diff / 30)} mes`;
}

const NotificationList = ({setCount}) => {
  const [tab, setTab] = useState("all");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotifId, setSelectedNotifId] = useState(null);
  const [menuAllAnchor, setMenuAllAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      const res = await getNotificationsByUser(user.userId);
      setNotifications(res.data);
    };
    fetchData();
  }, [user?.userId]);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleMenuOpen = (event, notifId) => {
    setSelectedNotifId(notifId);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNotifId(null);
  };

  const handleMarkAsRead = async () => {
    if (!selectedNotifId) return;
    await markNotificationAsSeen(selectedNotifId);

    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === selectedNotifId ? { ...n, seen: true } : n));

      if(setCount){
        setCount(updated.filter((n) => !n.seen).length); // 👈 recuenta
      }
       handleMenuClose();
      return updated;
    });
  };

  const handleDelete = async () => {
    if (!selectedNotifId) return;
    await deleteNotification(selectedNotifId);
    setNotifications((prev) => prev.filter((n) => n.id !== selectedNotifId));
    handleMenuClose();
  };

  const handleMenuAllOpen = (event) => setMenuAllAnchor(event.currentTarget);
  const handleMenuAllClose = () => setMenuAllAnchor(null);

  const handleMarkAll = async () => {
    const unseen = notifications.filter((n) => !n.seen);
    await Promise.all(unseen.map((n) => markNotificationAsSeen(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    handleMenuAllClose();
  };

  const handleOpenNotifications = () => {
    navigate("/notifications");
    handleMenuAllClose();
  };

  const filtered = tab === "unread"
    ? notifications.filter((n) => !n.seen)
    : notifications;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, pt: 1 }}>
        <Typography variant="h6">Notificaciones</Typography>
        <IconButton onClick={handleMenuAllOpen}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Tabs value={tab} onChange={handleTabChange} sx={{ px: 1 }}>
        <Tab value="all" label="Todas" />
        <Tab value="unread" label="No leídas" />
      </Tabs>

      <Divider />

      {filtered.map((notif) => (
        <Box
          key={notif.id}
          sx={{
            py: 1.5,
            display: "flex",
            alignItems: "flex-start",
            cursor: notif.link ? "pointer" : "default",
            "&:hover": { bgcolor: "action.hover" },
            px: 1,
            borderRadius: 1,
          }}
          onClick={() => notif.link && navigate(notif.link)}
        >
          <Avatar sx={{ mr: 2 }}>{notif.title.charAt(0)}</Avatar>

          <Box flex={1}>
            <Typography variant="body1" sx={{ fontWeight: notif.seen ? "normal" : "bold" }}>
              {notif.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notif.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getRelativeTime(notif.createdAt)}
            </Typography>
          </Box>

          {!notif.seen && (
            <NotificationsNoneIcon color="primary" sx={{ mx: 1, mt: 0.5 }} />
          )}

          <IconButton onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, notif.id); }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMarkAsRead}>Marcar como leída</MenuItem>
        <MenuItem onClick={handleDelete}>Eliminar esta notificación</MenuItem>
        <MenuItem disabled>Reportar un problema</MenuItem>
        {!location.pathname.includes("/notifications") && (
          <MenuItem onClick={() => navigate("/notifications")}>
            Abrir notificaciones
          </MenuItem>
        )}
      </Menu>

      <Menu anchorEl={menuAllAnchor} open={Boolean(menuAllAnchor)} onClose={handleMenuAllClose}>
        <MenuItem onClick={handleMarkAll}>✓ Marcar todas como leídas</MenuItem>
        <MenuItem disabled>⚙️ Configuración de notificaciones</MenuItem>
        {!location.pathname.includes("/notifications") && (
          <MenuItem onClick={handleOpenNotifications}>🖥️ Abrir notificaciones</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default NotificationList;
