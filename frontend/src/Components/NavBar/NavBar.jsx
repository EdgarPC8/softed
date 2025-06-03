import React, { useState,useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TerminalIcon from '@mui/icons-material/Terminal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LoginIcon from '@mui/icons-material/Login';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from "../../context/AuthContext";
import { Avatar } from '@mui/material';


const permisos = {
  Programador: [
    {
      name: "Home",
      icon: <HomeIcon />,
      link: "/"
    },
    // {
    //   name: "Reservas",
    //   icon: <CalendarMonthIcon />,
    //   link: "/reservas"
    // },
    // {
    //   name: "Recepción",
    //   icon: <LoginIcon />,
    //   link: "/recepcion"
    // },
    // {
    //   name: "Analisis",
    //   icon: <AnalyticsIcon />,
    //   link: "/analisis"
    // },
    {
      name: "Encuestas",
      icon: <SettingsIcon />,
      menu: {
        items: [
          { name: "Ver lista", link: "/forms", icon: <AdbIcon /> },
          { name: "Mis encuestas", link: "/myforms", icon: <AdbIcon /> },
        ],
      },
    },
    {
      name: "Entidades",
      icon: <SettingsIcon />,
      menu: {
        items: [
          { name: "Carreras", link: "/careers", icon: <AdbIcon /> },
          { name: "Periodos", link: "/periods", icon: <AdbIcon /> },
          { name: "Matrices", link: "/matriz", icon: <AdbIcon /> },
        ],
      },
    },
    {
      name: "Configuracion",
      icon: <SettingsIcon />,
      menu: {
        items: [
          { name: "Info Hotel", link: "/infoHotel", icon: <AdbIcon /> },
          { name: "Niveles", link: "/nivel", icon: <AdbIcon /> },
        ],
      },
    },
    {
      name: "Programador",
      icon: <TerminalIcon />,
      menu: {
        items: [
          { name: "Comandos", link: "/comandos", icon: <TerminalIcon /> },
          { name: "Logs", link: "/logs", icon: <TerminalIcon /> },
          { name: "Cuentas", link: "/cuentas", icon: <TerminalIcon /> },
          { name: "Componentes", link: "/componentes", icon: <TerminalIcon /> },
          { name: "Preguntas", link: "/quiz", icon: <TerminalIcon /> },
        ],
      },
    },
  ],
  Administrador: [
    { name: "Nadadores", link: "/nadadores", icon: <AdbIcon /> },
    { name: "Tiempos", link: "/tiempos", icon: <AdbIcon /> },
  ],
  Usuario: [
    {
      name: "Progreso",
      icon: <AdbIcon />,
      menu: {
        items: [
          { name: "Mi Progreso", link: "/miprogreso", icon: <AdbIcon /> },
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
  const { isAuthenticated, logout, user, isLoading ,profileImageUser} = useAuth();
  const [expandedAccordion, setExpandedAccordion] = useState(null); // Estado para controlar qué Accordion está abierto

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
    return <Box component="main" sx={{ flexGrow: 1, p: 3 }}>{children}</Box>;
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
          {user.firstName} {user.firstLastName}
          <IconButton
            size="large"
            aria-label="account of current user"
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
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleNavigation("/perfil") & handleClose()}>Perfil</MenuItem>
            <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pagesToShow.map((page, index) => {
            if (page.menu) {
              return (
                <Accordion
                  onClick={handleDrawerOpen}

                  key={page.name}
                  expanded={expandedAccordion === page.name}
                  onChange={handleAccordionChange(page.name)}
                  sx={{ boxShadow: 'none', backgroundColor: 'transparent', paddingLeft: open ? 0 : "6.2rem" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${page.name}-content`}
                    id={`${page.name}-header`}
                    sx={{
                      padding: 0,
                      minHeight: 0,
                      justifyContent: open ? 'initial' : 'center',
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 1,
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
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <List component="div" disablePadding>
                      {page.menu.items.map((subItem) => (
                        <ListItem
                          key={subItem.name}
                          disablePadding
                          sx={{ pl: open ? 4 : 2 }}
                          onClick={() => handleNavigation(subItem.link)}
                        >
                          <ListItemButton>
                            <ListItemText primary={subItem.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
