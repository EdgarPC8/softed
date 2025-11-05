// MiniDrawer.jsx
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, CssBaseline, Toolbar, Typography, IconButton, Tooltip, Divider, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Accordion, AccordionSummary,
  AccordionDetails, Popover, Button, Avatar, Badge, Menu, MenuItem
} from '@mui/material';
import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";


import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import { getNotificationsByUser } from '../../api/notificationsRequest';

import SimpleDialog from '../Dialogs/SimpleDialog';
import CambiarRol from '../ViewModal/CambiarRol';
import NotificationList from '../NotificationList';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';

import {
  Terminal, Home, Settings, Poll, AssignmentInd, School, CalendarMonth, AccountTree,
  Info, ViewModule, VpnKey, Notifications as NotificationsIcon, ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon, Menu as MenuIconBar, ExpandMore as ExpandMoreIcon, AccountBox,
  PeopleAlt, List as ListIcon, Workspaces, Storage, Dns, IntegrationInstructions,
  QuestionAnswer, MonetizationOn,
} from '@mui/icons-material';

import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StraightenIcon from '@mui/icons-material/Straighten';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import FactoryIcon from "@mui/icons-material/Factory";
import StarRounded from "@mui/icons-material/StarRounded";
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import ThemeSwitcher from '../ThemeSwitcher';

// Íconos públicos
import HomeIcon from "@mui/icons-material/Home";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import CakeIcon from "@mui/icons-material/Cake";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { activeApp } from '../../../appConfig';
import ViewModuleIcon from "@mui/icons-material/ViewModule";


const PUBLIC_NAV = [
  { label: "Inicio", icon: <HomeIcon fontSize="small" />, to: "/" },
  { label: "Catalogo", icon: <BakeryDiningIcon fontSize="small" />, to: "/catalogo" },
  { label: "Puntos de Venta", icon: <StorefrontIcon fontSize="small" />, to: "/punto_venta" },

];

const permisos = {
  Programador: [
    { name: "Home", icon: <Home />, link: "/" },
    { name: "Panaderia", icon: <BakeryDiningIcon />, link: "/backery" },
    { name: "Catalogo Config", icon: <ViewModuleIcon />, link: "/catalog_manager" },
    {
      name: "Inventory Control", icon: <InventoryIcon />, menu: {
        items: [
          { name: "Finanzas", link: "/inventory/finance", icon: <MonetizationOn /> },
          { name: "Producción", link: "/inventory/production", icon: <FactoryIcon /> },
          { name: "Movimientos", link: "/inventory/movement", icon: <CompareArrowsIcon /> },
          { name: "Productos", link: "/inventory/products", icon: <Inventory2Icon /> },
          { name: "Clientes", link: "/inventory/customers", icon: <PeopleIcon /> },
          { name: "Pedidos", link: "/inventory/orders", icon: <AssignmentIcon /> },
          { name: "Categorias", link: "/inventory/categories", icon: <CategoryIcon /> },
          { name: "Unidades", link: "/inventory/units", icon: <StraightenIcon /> },
          { name: "Recetas", link: "/inventory/recipes", icon: <ReceiptLongIcon /> },
          { name: "Productos Destacados", link: "/inventory/productos-destacados", icon: <StarRounded /> },
          { name: "Puntos de Venta", link: "/inventory/puntos-venta", icon: <StorefrontRounded /> },
        ],
      },
    },
    {
      name: "Encuestas", icon: <Poll />, menu: {
        items: [
          { name: "Ver encuestas", link: "/forms", icon: <ListIcon /> },
          { name: "Mis encuestas", link: "/myforms", icon: <AssignmentInd /> },
        ],
      },
    },
    {
      name: "Cuestionarios", icon: <Poll />, menu: {
        items: [
          { name: "Ver cuestionarios", link: "/quizzes", icon: <ListIcon /> },
          { name: "Mis cuestionarios", link: "/myQuizzes", icon: <AssignmentInd /> },
        ],
      },
    },
    {
      name: "Entidades", icon: <AccountTree />, menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
          { name: "Carreras", link: "/careers", icon: <School /> },
          { name: "Periodos", link: "/periods", icon: <CalendarMonth /> },
          { name: "Matrices", link: "/matriz", icon: <Storage /> },
          { name: "Usuarios", link: "/users", icon: <PeopleAlt /> },
        ],
      },
    },
    {
      name: "Configuracion", icon: <Settings />, menu: {
        items: [
          { name: "Panel de Control", link: "/panel_control", icon: <Dns /> },
          { name: "Info", link: "/info", icon: <Info /> },
          { name: "Donaciones", link: "/donations", icon: <CardGiftcardIcon /> },
        ],
      },
    },
    {
      name: "Programador", icon: <Terminal />, menu: {
        items: [
          { name: "Comandos", link: "/comandos", icon: <IntegrationInstructions /> },
          { name: "Logs", link: "/logs", icon: <ListIcon /> },
          { name: "Componentes", link: "/componentes", icon: <ViewModule /> },
          { name: "Preguntas", link: "/quiz", icon: <QuestionAnswer /> },
          { name: "Tokens", link: "/tokens", icon: <VpnKey /> },
        ],
      },
    },
  ],
  Administrador: [
    { name: "Home", icon: <Home />, link: "/" },
    { name: "Pedidos", link: "/inventory/orders", icon: <AssignmentIcon /> },
          { name: "Finanzas", link: "/inventory/finance", icon: <MonetizationOn /> },

    {
      name: "Configuracion", icon: <Settings />, menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
        ],
      },
    },
  ],
  Estudiante: [
    { name: "Home", icon: <Home />, link: "/" },
    {
      name: "Encuestas", icon: <Poll />, menu: {
        items: [{ name: "Mis encuestas", link: "/myforms", icon: <AssignmentInd /> }],
      },
    },
    {
      name: "Configuracion", icon: <Settings />, menu: {
        items: [{ name: "Información", link: "/info", icon: <Info /> }],
      },
    },
  ],
};

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
  padding: theme.spacing(0, 1), ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth, flexShrink: 0, whiteSpace: 'nowrap', boxSizing: 'border-box',
    ...(open && { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }),
    ...(!open && { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }),
  })
);

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, logout, user, profileImageUser } = useAuth();
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [openChangeRol, setOpenChangeRol] = useState(false);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const location = useLocation();
  const [title, setTitle] = useState(activeApp.alias || activeApp.name || "App");
  const [logo, setLogo] = useState(activeApp.logo || "Logo");
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
const openMobileMenu = Boolean(mobileAnchorEl);
const handleOpenMobileMenu = (e) => setMobileAnchorEl(e.currentTarget);
const handleCloseMobileMenu = () => setMobileAnchorEl(null);




  

  const [unreadCount, setUnreadCount] = useState(0);

  useNotificationSocket(isAuthenticated ? user?.userId : null, () => {
    if (isAuthenticated) setUnreadCount((c) => c + 1);
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user?.userId) return;
      try {
        const res = await getNotificationsByUser(user.userId);
        setUnreadCount(res.data.filter(n => !n.seen).length);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };
    fetchNotifications();
  }, [isAuthenticated, user?.userId]);

  const openNotif = Boolean(anchorElNotif);

  const handleNotifClick = (event) => setAnchorElNotif(event.currentTarget);
  const handleNotifClose = () => setAnchorElNotif(null);

  const handleDialogChangeRol = () => setOpenChangeRol((v) => !v);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => { setOpen(false); setExpandedAccordion(null); };
  const handleNavigation = (link) => navigate(link);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAccordionChange = (panel) => (_e, isExp) => setExpandedAccordion(isExp ? panel : null);

  const pagesToShow = isAuthenticated ? (permisos[user.loginRol] || []) : [];

  const showDrawer = isAuthenticated;
  const showUserActions = isAuthenticated;

  // ====== MENÚ PÚBLICO EN APPBAR (cuando NO está logeado) ======
  const [publicAnchorEl, setPublicAnchorEl] = useState(null);
  const [publicActive, setPublicActive] = useState(null);
  const openPublicMenu = Boolean(publicAnchorEl);

  const handleOpenPublicMenu = (e, item) => {
    if (!item.children || item.children.length === 0) {
      if (item.to) navigate(item.to);
      return;
    }
    setPublicActive(item);
    setPublicAnchorEl(e.currentTarget);
  };
  const handleClosePublicMenu = () => {
    setPublicAnchorEl(null);
    setPublicActive(null);
  };
  const handleClickPublicChild = (to) => {
    handleClosePublicMenu();
    if (to) navigate(to);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar SIEMPRE visible */}
      <AppBar position="fixed" open={showDrawer && open}>
        <Toolbar>
          {/* Botón menú solo si hay Drawer (logueado) */}
          {showDrawer && !open && (
            <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ mr: 2 }}>
              <MenuIconBar />
            </IconButton>
          )}

          <Typography variant="h4" noWrap component="div">
            {showUserActions ? user.loginRol : title}
          </Typography>

          {/* Navegación pública (Panadería / Pastelería / Repostería / Puntos de Venta) SOLO si NO está logeado */}
    {/* Navegación pública SOLO si NO está logeado (responsiva) */}
{!showUserActions && (
  <>
    {isMdUp ? (
      // ✅ Vista desktop/tablet: botones en línea
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
        {PUBLIC_NAV.map((item) => (
          <Button
            key={item.label}
            color="inherit"
            onClick={() => navigate(item.to)}
            startIcon={item.icon || null}
            sx={{ textTransform: "none", fontWeight: 600, whiteSpace: "nowrap" }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    ) : (
      // ✅ Vista móvil: menú hamburguesa
      <Box sx={{ ml: 1 }}>
        <IconButton
          color="inherit"
          aria-label="abrir menú"
          onClick={handleOpenMobileMenu}
          edge="start"
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={mobileAnchorEl}
          open={openMobileMenu}
          onClose={handleCloseMobileMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{ sx: { minWidth: 220 } }}
        >
          {PUBLIC_NAV.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                handleCloseMobileMenu();
                navigate(item.to);
              }}
              sx={{ gap: 1 }}
            >
              {item.icon || null}
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    )}
  </>
)}


          <Box sx={{ flexGrow: 1 }} />

          {/* ThemeSwitcher siempre */}
          <ThemeSwitcher />

          {/* Si NO está logeado → botón Iniciar sesión */}
          {!showUserActions && (
            <Button
              variant="outlined"
              color="inherit"
              sx={{ ml: 2, textTransform: "none", fontWeight: 700 }}
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
          )}

          {/* Si está logeado → notificaciones + menú usuario */}
          {showUserActions && (
            <>
              <IconButton
                size="large"
                aria-label="ver notificaciones"
                color={location.pathname === "/notifications" ? "secondary" : "inherit"}
                onClick={handleNotifClick}
                disabled={location.pathname === "/notifications"}
              >
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Popover
                open={openNotif}
                anchorEl={anchorElNotif}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Box sx={{ width: 400, maxHeight: 500, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ overflowY: "auto", flexGrow: 1, px: 2 }}>
                    <NotificationList setCount={setUnreadCount} />
                  </Box>
                  <Box textAlign="center" p={1}>
                    <Button
                      variant="text"
                      onClick={() => { handleNotifClose(); navigate("/notifications"); }}
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                    >
                      Ver todo
                    </Button>
                  </Box>
                </Box>
              </Popover>

              <Typography sx={{ mx: 1 }}>
                {user.firstName} {user.firstLastName}
              </Typography>

              <IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
                <Avatar alt={user.firstName} src={profileImageUser} />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { handleNavigation("/perfil"); handleClose(); }}>Perfil</MenuItem>
                <MenuItem onClick={handleDialogChangeRol}>Cambiar Rol</MenuItem>
                <MenuItem onClick={() => { handleClose(); logout(); }}>Cerrar Sesión</MenuItem>

                <SimpleDialog open={openChangeRol} onClose={handleDialogChangeRol} tittle={""}>
                  <CambiarRol />
                </SimpleDialog>
              </Menu>
            </>
          )}
        </Toolbar>

        {/* Menú desplegable PÚBLICO */}
        <Menu
          anchorEl={publicAnchorEl}
          open={openPublicMenu}
          onClose={handleClosePublicMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {publicActive?.children?.map((child, idx) => (
            <Box key={child.label}>
              <MenuItem onClick={() => handleClickPublicChild(child.to)}>
                {child.label}
              </MenuItem>
              {(idx + 1) % 4 === 0 && idx !== publicActive.children.length - 1 && (
                <Divider sx={{ my: 0.5 }} />
              )}
            </Box>
          ))}
        </Menu>
      </AppBar>

      {/* Drawer solo si está logeado */}
      {showDrawer && (
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" px={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <img
  src={logo}
  alt="Logo"
  style={{
    width: 50,
    height: 50,
    borderRadius: "50%",   // 👈 lo hace circular
    objectFit: "cover",    // 👈 recorta sin deformar
  }}
/>

                <Typography variant="h6" >{title}</Typography>
              </Box>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>
          </DrawerHeader>

          <Divider />

          <List>
            {(pagesToShow || []).map((page) => {
              if (page.menu) {
                return (
                  <Accordion
                    key={page.name}
                    expanded={expandedAccordion === page.name}
                    onChange={handleAccordionChange(page.name)}
                    sx={{ boxShadow: 'none', backgroundColor: 'transparent', '&:before': { display: 'none' } }}
                  >
                    <AccordionSummary
                      onClick={() => { if (!open) handleDrawerOpen(); }}
                      expandIcon={open ? <ExpandMoreIcon /> : null}
                      sx={{ p: 0, minHeight: 48, justifyContent: open ? 'initial' : 'center', cursor: 'pointer' }}
                    >
                      <ListItemButton sx={{ minHeight: 38, justifyContent: 'center', px: 0 }}>
                        <Tooltip title={page.name} placement="right" disableHoverListener={open}>
                          <ListItemIcon sx={{ minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {page.icon}
                          </ListItemIcon>
                        </Tooltip>
                        {open && <ListItemText primary={page.name} sx={{ ml: 1 }} />}
                      </ListItemButton>
                    </AccordionSummary>

                    {open && (
                      <AccordionDetails sx={{ p: 0 }}>
                        <List component="div" disablePadding>
                          {page.menu.items.map((sub) => (
                            <ListItem key={sub.name} disablePadding onClick={() => handleNavigation(sub.link)} sx={{ pl: 4 }}>
                              <ListItemButton>
                                <ListItemIcon>{sub.icon}</ListItemIcon>
                                <ListItemText primary={sub.name} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    )}
                  </Accordion>
                );
              }

              return (
                <ListItem key={page.name} disablePadding sx={{ display: 'block' }} onClick={() => handleNavigation(page.link)}>
                  <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText primary={page.name} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
