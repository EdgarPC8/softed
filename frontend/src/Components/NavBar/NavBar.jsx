import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  Typography, 
  IconButton, 
  Tooltip, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Popover, 
  Button, 
  Avatar, 
  Badge, 
  Menu, 
  MenuItem 
} from '@mui/material';



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
  Terminal,
  Home,
  Settings,
  Poll,
  AssignmentInd,
  School,
  CalendarMonth,
  AccountTree,
  Info,
  Layers,
  ViewModule,
  Quiz,
  VpnKey,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  AccountBox,
  PeopleAlt,
  List as ListIcon,
  Workspaces,
  Storage,
  Dns,
  IntegrationInstructions,
  QuestionAnswer,
  MonetizationOn,
  
} from '@mui/icons-material';


import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StraightenIcon from '@mui/icons-material/Straighten';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import FactoryIcon from "@mui/icons-material/Factory";






const permisos = {
  Programador: [
    {
      name: "Home",
      icon: <Home />,
      link: "/"
    },
    {
      name: "Inventory Control",
      icon: <InventoryIcon />,
      menu: {
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
          { name: "Productos destacados", link: "/inventory/productos-destacados", icon: <Inventory2Icon /> },
        ],
      },
    },
    {
      name: "Encuestas",
      icon: <Poll />,
      menu: {
        items: [
          { name: "Ver encuestas", link: "/forms", icon: <ListIcon /> },
          { name: "Mis encuestas", link: "/myforms", icon: <AssignmentInd /> },
        ],
      },
    },
    {
      name: "Cuestionarios",
      icon: <Poll />,
      menu: {
        items: [
          { name: "Ver cuestionarios", link: "/quizzes", icon: <ListIcon /> },
          { name: "Mis cuestionarios", link: "/myQuizzes", icon: <AssignmentInd /> },
        ],
      },
    },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
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
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Panel de Control", link: "/panel_control", icon: <Dns /> },
          { name: "Info", link: "/info", icon: <Info /> },
          { name: "Donaciones", link: "/donations", icon: <CardGiftcardIcon /> },
        ],
      },
    },
    {
      name: "Programador",
      icon: <Terminal />,
      menu: {
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
    {
      name: "Home",
      icon: <Home />,
      link: "/"
    },
        {
      name: "Inventory Control",
      icon: <InventoryIcon />,
      menu: {
        items: [
          { name: "Finanzas", link: "/inventory/finance", icon: <MonetizationOn /> },
          { name: "Movimientos", link: "/inventory/movement", icon: <CompareArrowsIcon /> },
          { name: "Productos", link: "/inventory/products", icon: <Inventory2Icon /> },
          { name: "Clientes", link: "/inventory/customers", icon: <PeopleIcon /> },
          { name: "Pedidos", link: "/inventory/orders", icon: <AssignmentIcon /> },
          { name: "Categorias", link: "/inventory/categories", icon: <CategoryIcon /> },
          { name: "Unidades", link: "/inventory/units", icon: <StraightenIcon /> },
          { name: "Recetas", link: "/inventory/recipes", icon: <ReceiptLongIcon /> },
        ],
      },
    },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Panel de Control", link: "/panel_control", icon: <Dns /> },
          { name: "Información", link: "/info", icon: <Info /> },
        ],
      },
    },
  ],
  Estudiante: [
    {
      name: "Home",
      icon: <Home />,
      link: "/"
    },
    {
      name: "Encuestas",
      icon: <Poll />,
      menu: {
        items: [
          { name: "Mis encuestas", link: "/myforms", icon: <AssignmentInd /> },
        ],
      },
    },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },

        ],
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, logout, user, isLoading, profileImageUser } = useAuth();
  const [expandedAccordion, setExpandedAccordion] = useState(null); // Estado para controlar qué Accordion está abierto
  const [openChangeRol, setOpenChangeRol] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null); // para popover de notificaciones
  const location = useLocation();
  const [tooltipOpen, setTooltipOpen] = useState(null);


  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);


  useNotificationSocket(user?.userId, (notif) => {
    // console.log("Notificación recibida:", notif);
    // setNotifications((prev) => [notif, ...prev]);
    setUnreadCount((count) => count + 1); // aumenta solo si llega una nueva
  });


  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.userId) return;
      try {
        const res = await getNotificationsByUser(user.userId); // deberías tener esta función
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.seen).length);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };
    fetchNotifications();
  }, [user?.userId]);




  const openNotif = Boolean(anchorElNotif);

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };
  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const handleMenuClose = () => {
    setAnchorMenu(null);
  };

  const handleDialogChangeRol = () => {
    setOpenChangeRol(!openChangeRol);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setExpandedAccordion(null); // Cierra los Accordion cuando se cierre el Drawer
  };

  const handleNavigation = (link) => {
    navigate(link);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null); // Abre/cierra el Accordion
  };

  const pagesToShow = permisos[user.loginRol] || [];

  if (!isAuthenticated) {
    return <Box component="main" sx={{ flexGrow: 1 }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
  
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h4" noWrap component="div">
            {user.loginRol}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            aria-label="ver notificaciones"
            color={location.pathname === "/notifications" ? "secondary" : "inherit"}
            onClick={handleNotifClick}
            disabled={location.pathname === "/notifications"}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              overlap="circular"
            >
              <NotificationsIcon />
            </Badge>

          </IconButton>

          <Popover
            open={openNotif}
            anchorEl={anchorElNotif}
            onClose={handleNotifClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ width: 400, maxHeight: 500, display: "flex", flexDirection: "column" }}>

              <Box sx={{ overflowY: "auto", flexGrow: 1, px: 2 }}>
                <NotificationList
                  setCount={setUnreadCount}
                />

              </Box>

              {/* Botón Ver todo */}
              <Box textAlign="center" p={1}>
                <Button
                  variant="text"
                  onClick={() => {
                    handleNotifClose();
                    navigate("/notifications");
                  }}
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                  Ver todo
                </Button>
              </Box>
            </Box>
          </Popover>


          {user.firstName} {user.firstLastName}
          <IconButton
  size="large"
  aria-controls="menu-appbar"
  aria-haspopup="true"
  onClick={handleMenu}
  color="inherit"
>
  <Avatar alt={user.firstName} src={profileImageUser} />
</IconButton>

          <Menu
  id="menu-appbar"
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>

            <MenuItem onClick={() => handleNavigation("/perfil") & handleClose()}>Perfil</MenuItem>
            <MenuItem onClick={handleDialogChangeRol}>Cambiar Rol</MenuItem>
            <MenuItem
  onClick={() => {
    handleClose(); // 👈 Cierra el menú antes de cerrar sesión
    logout();      // 👈 Luego cierra sesión
  }}
>
  Cerrar Sesión
</MenuItem>

            <SimpleDialog
              open={openChangeRol}
              onClose={handleDialogChangeRol}
              tittle={""}
            >
              <CambiarRol />
            </SimpleDialog>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
      <DrawerHeader>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    width="100%"
    px={2}
  >
    {/* Logo + texto */}
    <Box display="flex" alignItems="center" gap={1}>
      <img
        src="./android-chrome-512x512.png"
        alt="SoftEd Logo"
        style={{ width: 50, height: 50 }}
      />
      <Typography variant="h6" color="black">
        SoftEd
      </Typography>
    </Box>

    {/* Botón de cerrar */}
    <IconButton onClick={handleDrawerClose}>
      {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </IconButton>
  </Box>
</DrawerHeader>

        <Divider />
        <List>
          {pagesToShow.map((page, index) => {
            if (page.menu) {
              return (
                <Accordion
                  key={page.name}
                  expanded={expandedAccordion === page.name}
                  onChange={handleAccordionChange(page.name)}
                  sx={{
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    '&:before': { display: 'none' },
                    paddingLeft: open ? 0 : 0, // sin indentación lateral innecesaria
                  }}
                >
                  <AccordionSummary
                    onClick={() => {
                      if (!open) handleDrawerOpen();
                    }}
                    expandIcon={open ? <ExpandMoreIcon /> : null}
                    sx={{
                      padding: 0,
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      cursor: 'pointer',
                    }}
                  >

                    <ListItemButton
                      sx={{
                        minHeight: 38,
                        justifyContent: 'center',
                        px: 0,
                      }}
                    >

                      <Tooltip title={page.name} placement="right" disableHoverListener={open}>
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {page.icon}
                        </ListItemIcon>
                      </Tooltip>


                      {open && (
                        <ListItemText
                          primary={page.name}
                          sx={{ marginLeft: 1 }}
                        />
                      )}

                    </ListItemButton>
                  </AccordionSummary>
                  {open && (
                   <AccordionDetails sx={{ padding: 0 }}>
                   <List component="div" disablePadding>
                     {page.menu.items.map((subItem) => (
                       <ListItem
                         key={subItem.name}
                         disablePadding
                         onClick={() => handleNavigation(subItem.link)}
                         sx={{ pl: 4 }}
                       >
                         <ListItemButton>
                           <ListItemIcon>
                             {subItem.icon}
                           </ListItemIcon>
                           <ListItemText primary={subItem.name} />
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
              <ListItem
                key={page.name}
                disablePadding
                sx={{ display: 'block' }}
                onClick={() => handleNavigation(page.link)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText primary={page.name} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
