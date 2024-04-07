import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PoolIcon from '@mui/icons-material/Pool';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useAuth } from "../context/AuthContext";

function ResponsiveAppBar() {
  const { isAuthenticated, logout, user, isLoading } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  const settings = [
    { name: "Perfil", link: "/perfil", icon: <AdbIcon/>, function: () => { /* Agrega la función correspondiente */ } },
    { name: "Cerrar Sesión", link: "/", icon: <AdbIcon/>, function: logout } // Asumiendo que 'logout' es una función definida
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  // Definir los arrays de páginas para cada rol
  const permisos = {
    Programador: [
      { name: "Nadadores", link: "/nadadores", icon: <AdbIcon/> }, 
      { name: "Tiempos", link: "/tiempos", icon: <AdbIcon/> }, 
      { name: "Progreso", link: "/progreso", icon: <AdbIcon/> },
      { name: "Institucion", link: "/institucion", icon: <AdbIcon/> },
      { name: "Mas", icon: <AdbIcon/>, menu: { items: [{ name: "Nadadores", link: "/nadadores", icon: <AdbIcon/> }, { name: "Progreso", link: "/progreso", icon: <AdbIcon/> }] } }
    ],
    Administrador: [{ name: "Nadadores", link: "/nadadores", icon: <AdbIcon/> }, { name: "Tiempos", link: "/tiempos", icon: <AdbIcon/> }],
    Usuario: [
      { name: "Tiempos", link: "/tiempos", icon: <AdbIcon/> },
      { name: "Progreso", link: "/progreso", icon: <AdbIcon/> }
    ]
  };

  const pagesToShow = permisos[user.nameRol] || [];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Natación
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pagesToShow.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} to={page.link}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <PoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Natación
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
  {pagesToShow.map((page) => {
    if (page.menu) {
      return (
        <React.Fragment key={page.name}>
          <Tabs value={false} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
            <Tab label={page.name} onClick={handleMoreMenuOpen} sx={{ my: 2, color: 'white'}}/>
          </Tabs>
          <Menu
            id={`${page.name.toLowerCase()}-menu`}
            anchorEl={moreMenuAnchor}
            keepMounted
            open={Boolean(moreMenuAnchor)}
            onClose={handleMoreMenuClose}
          >
            {page.menu.items.map((item) => (
              <MenuItem key={item.name} onClick={handleMoreMenuClose} component={Link} to={item.link}>
                <Typography textAlign="center">{item.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      );
    } else {
      return (
        <Button
          key={page.name}
          component={Link}
          to={page.link}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {page.name}
        </Button>
      );
    }
  })}
</Box>



          {!isLoading && isAuthenticated ? (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.firstName} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={() => { setting.function(); handleCloseUserMenu(); }} component={Link} to={setting.link}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Iniciar sesión</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;