// MiniDrawer.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, CssBaseline, Toolbar, Typography, IconButton, Tooltip, Divider, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Accordion, AccordionSummary,
  AccordionDetails, Popover, Button, Avatar, Badge, Menu, MenuItem, ListSubheader
} from '@mui/material';
import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ImageIcon from "@mui/icons-material/Image";

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import { getNotifications, getUnreadCount } from '../../api/notificationsRequest';

import SimpleDialog from '../Dialogs/SimpleDialog';
import CambiarRol from '../ViewModal/CambiarRol';
import NotificationList from '../NotificationList';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';

import {
  Terminal, Dashboard, Settings, Poll, AssignmentInd, School, CalendarMonth, AccountTree,
  Info, ViewModule, VpnKey, Notifications as NotificationsIcon, ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon, Menu as MenuIconBar, ExpandMore as ExpandMoreIcon, AccountBox,
  PeopleAlt, List as ListIcon, Workspaces, Storage, Dns, IntegrationInstructions,
  QuestionAnswer, MonetizationOn,
} from '@mui/icons-material';

import Inventory2Icon from '@mui/icons-material/Inventory2';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StraightenIcon from '@mui/icons-material/Straighten';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PeopleIcon from '@mui/icons-material/People';
import FactoryIcon from "@mui/icons-material/Factory";
import StarRounded from "@mui/icons-material/StarRounded";
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ThemeSwitcher from '../ThemeSwitcher';
import { useThemeMode } from '../../theme/ThemeModeProvider';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckIcon from '@mui/icons-material/Check';

// Íconos públicos
import HomeIcon from "@mui/icons-material/Home";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import CakeIcon from "@mui/icons-material/Cake";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StoreMallDirectoryRounded from "@mui/icons-material/StoreMallDirectoryRounded";
import { activeApp, activeAppId } from "../../../appConfig";
import ViewModuleIcon from "@mui/icons-material/ViewModule";


import CollectionsBookmark from "@mui/icons-material/CollectionsBookmark";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import EditNote from "@mui/icons-material/EditNote";
import VolumeUp from "@mui/icons-material/VolumeUp";
// Cambiar Terminal por Campaign para Publicidad
import CampaignIcon from "@mui/icons-material/Campaign";
import PianoIcon from "@mui/icons-material/Piano";
import LyricsIcon from "@mui/icons-material/Lyrics";
import SaveIcon from "@mui/icons-material/Save";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { saveBackup, downloadBackup } from "../../api/comandsRequest";




const PUBLIC_NAV = [
  { label: "Inicio", icon: <HomeIcon fontSize="small" />, to: "/" },
  { label: "Consultar mi turno", icon: <CalendarMonth fontSize="small" />, to: "/home", app: "turnos" },
  { label: "Catálogo", icon: <BakeryDiningIcon fontSize="small" />, to: "/catalogo", app: "eddeli" },
  { label: "Locales", icon: <StoreMallDirectoryRounded fontSize="small" />, to: "/punto_venta", app: "eddeli" },
];

/** Menú público filtrado por app: en alumni no se muestran Catálogo ni Locales */
function getPublicNavForApp(currentAppId) {
  return PUBLIC_NAV.filter((item) => itemVisibleForApp(item.app, currentAppId));
}

/** Si la app está permitida para este ítem. softed = ver todo. */
function itemVisibleForApp(itemApp, currentAppId) {
  if (currentAppId === "softed") return true;
  if (!itemApp || itemApp === "shared") return true;
  return itemApp === currentAppId;
}

function filterPermisosByApp(permisosRole, currentAppId) {
  if (!permisosRole) return [];
  return permisosRole
    .map((item) => {
      // Si el ítem tiene app (ej. eddeli), no mostrarlo en otras apps (ej. alumni)
      if (!itemVisibleForApp(item.app, currentAppId)) return null;
      if (item.menu?.items) {
        const filtered = item.menu.items.filter((sub) =>
          itemVisibleForApp(sub.app, currentAppId)
        );
        if (filtered.length === 0) return null;
        return { ...item, menu: { ...item.menu, items: filtered } };
      }
      return item;
    })
    .filter(Boolean);
}

/** Particiona items por app cuando activeAppId es softed: EdDeli, Alumni, SoftEd */
function partitionByAppForSofted(items) {
  const eddeli = items.filter((p) => p.app === "eddeli");
  const alumni = items.filter((p) => p.app === "alumni");
  const softed = items.filter((p) => !p.app || p.app === "shared" || p.app === "softed");
  return { eddeli, alumni, softed };
}

const permisos = {
  Programador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/home" },
    { name: "Piano", icon: <PianoIcon />, link: "/piano", app: "softed" },
    { name: "PianoPro", icon: <PianoIcon />, link: "/pianoPro", app: "softed" },
    { name: "Hoja de vida", icon: <DescriptionIcon />, link: "/cv", app: "alumni" },
    { name: "Ver mi CV", icon: <PictureAsPdfIcon />, link: "/cv/ver", app: "alumni" },
    { name: "Plantillas de CV", icon: <CollectionsBookmark />, link: "/cv/plantillas", app: "alumni" },
    {
      name: "Bolsa de empleo",
      icon: <WorkIcon />,
      app: "alumni",
      menu: {
        items: [
          { name: "Ofertas y postulantes", link: "/bolsa-empleo/empresa/ofertas", icon: <WorkIcon /> },
          { name: "Empresas", link: "/bolsa-empleo/admin/empresas", icon: <BusinessIcon /> },
        ],
      },
    },
    { name: "Catalogo Config", icon: <ViewModuleIcon />, link: "/catalog_manager", app: "eddeli" },
    {
      name: "Ventas y clientes",
      icon: <PointOfSaleIcon />,
      app: "eddeli",
      menu: {
        items: [
          { name: "Pedidos", link: "/inventory/orders", icon: <AssignmentIcon /> },
          { name: "Clientes", link: "/inventory/customers", icon: <PeopleIcon /> },
          { name: "Finanzas", link: "/inventory/finance", icon: <MonetizationOn /> },
          { name: "Cobranzas", link: "/inventory/collections", icon: <RequestQuoteIcon /> },
        ],
      },
    },
    {
      name: "Inventario",
      icon: <Inventory2Icon />,
      app: "eddeli",
      menu: {
        items: [
          { name: "Productos", link: "/inventory/products", icon: <Inventory2Icon /> },
          { name: "Movimientos", link: "/inventory/movement", icon: <CompareArrowsIcon /> },
          { name: "Categorías", link: "/inventory/categories", icon: <CategoryIcon /> },
          { name: "Unidades", link: "/inventory/units", icon: <StraightenIcon /> },
          { name: "Recetas", link: "/inventory/recipes", icon: <ReceiptLongIcon /> },
        ],
      },
    },
    {
      name: "Producción y canal",
      icon: <FactoryIcon />,
      app: "eddeli",
      menu: {
        items: [
          { name: "Producción", link: "/inventory/production", icon: <FactoryIcon /> },
          { name: "Puntos de venta", link: "/inventory/puntos-venta", icon: <StorefrontRounded /> },
          { name: "Productos destacados", link: "/inventory/productos-destacados", icon: <StarRounded /> },
        ],
      },
    },
    {
      name: "Publicidad",
      icon: <CampaignIcon />,
      app: "eddeli",
      menu: {
        items: [
          { name: "Control de Imagenes", link: "/img", icon: <ImageIcon /> },
          { name: "Control de Archivos", link: "/file", icon: <InsertDriveFile /> },
          { name: "Editor de Publicidad", link: "/editorDefault", icon: <EditNote /> },
          { name: "Control Publicidad", link: "/publicidad", icon: <VolumeUp /> },
          { name: "Plantillas de Publicidad", link: "/templates", icon: <CollectionsBookmark /> },
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
          { name: "Carreras", link: "/careers", icon: <School />, app: "alumni" },
          { name: "Periodos", link: "/periods", icon: <CalendarMonth />, app: "alumni" },
          { name: "Matrices", link: "/matriz", icon: <Storage />, app: "alumni" },
          { name: "Hoja de vida", link: "/cv", icon: <DescriptionIcon />, app: "alumni" },
          { name: "Ver CV / PDF", link: "/cv/ver", icon: <PictureAsPdfIcon />, app: "alumni" },
          { name: "Plantillas de CV", link: "/cv/plantillas", icon: <CollectionsBookmark />, app: "alumni" },
          { name: "Usuarios", link: "/users", icon: <PeopleAlt /> },
        ],
      },
    },
    {
      name: "Encuestas",
      icon: <Poll />,
      app: "alumni",
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
      app: "alumni",
      menu: {
        items: [
          { name: "Ver cuestionarios", link: "/quizzes", icon: <ListIcon /> },
          { name: "Mis cuestionarios", link: "/myQuizzes", icon: <AssignmentInd /> },
        ],
      },
    },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Panel de Control", link: "/panel_control", icon: <Dns /> },
          { name: "Programar notificaciones", link: "/notification-programs", icon: <NotificationsIcon /> },
          { name: "Info", link: "/info", icon: <Info /> },
          { name: "Donaciones", link: "/donations", icon: <CardGiftcardIcon /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
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
          { name: "Control de Imágenes", link: "/img", icon: <ImageIcon /> },
          { name: "Control de Archivos", link: "/file", icon: <InsertDriveFile /> },
          { name: "Componentes", link: "/componentes", icon: <ViewModule /> },
          { name: "Preguntas", link: "/quiz", icon: <QuestionAnswer /> },
          { name: "Tokens", link: "/tokens", icon: <VpnKey /> },
        ],
      },
    },
  ],
  Administrador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Piano", icon: <PianoIcon />, link: "/piano", app: "softed" },
    { name: "PianoPro", icon: <PianoIcon />, link: "/pianoPro", app: "softed" },
    { name: "Hoja de vida", icon: <DescriptionIcon />, link: "/cv", app: "alumni" },
    { name: "Ver mi CV", icon: <PictureAsPdfIcon />, link: "/cv/ver", app: "alumni" },
    { name: "Plantillas de CV", icon: <CollectionsBookmark />, link: "/cv/plantillas", app: "alumni" },
    {
      name: "EdDeli · Ventas",
      icon: <PointOfSaleIcon />,
      app: "eddeli",
      menu: {
        items: [
          { name: "Pedidos", link: "/inventory/orders", icon: <AssignmentIcon /> },
          { name: "Finanzas", link: "/inventory/finance", icon: <MonetizationOn /> },
          { name: "Cobranzas", link: "/inventory/collections", icon: <RequestQuoteIcon /> },
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
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
          { name: "Carreras", link: "/careers", icon: <School />, app: "alumni" },
          { name: "Periodos", link: "/periods", icon: <CalendarMonth />, app: "alumni" },
          { name: "Matrices", link: "/matriz", icon: <Storage />, app: "alumni" },
          { name: "Usuarios", link: "/users", icon: <PeopleAlt /> },
        ],
      },
    },
    {
      name: "Bolsa de empleo",
      icon: <WorkIcon />,
      app: "alumni",
      menu: {
        items: [
          { name: "Ofertas y postulantes", link: "/bolsa-empleo/empresa/ofertas", icon: <WorkIcon /> },
          { name: "Empresas", link: "/bolsa-empleo/admin/empresas", icon: <BusinessIcon /> },
        ],
      },
    },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Panel de Control", link: "/panel_control", icon: <Dns /> },
          { name: "Programar notificaciones", link: "/notification-programs", icon: <NotificationsIcon /> },
          { name: "Guardar copia de seguridad", icon: <SaveIcon />, action: "saveBackup" },
          { name: "Descargar JSON", icon: <CloudDownloadIcon />, action: "downloadBackup" },
          { name: "Donaciones", link: "/donations", icon: <CardGiftcardIcon /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  Empresa: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Bolsa de empleo", icon: <WorkIcon />, link: "/bolsa-empleo", app: "alumni" },
    { name: "Perfil empresa", icon: <BusinessIcon />, link: "/bolsa-empleo/empresa/perfil", app: "alumni" },
    { name: "Mis ofertas", icon: <WorkIcon />, link: "/bolsa-empleo/empresa/ofertas", app: "alumni" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  Profesional: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Bolsa de empleo", icon: <WorkIcon />, link: "/bolsa-empleo", app: "alumni" },
    { name: "Mis postulaciones", icon: <AssignmentInd />, link: "/bolsa-empleo/mis-postulaciones", app: "alumni" },
    { name: "Hoja de vida", icon: <DescriptionIcon />, link: "/cv", app: "alumni" },
    { name: "Ver mi CV", icon: <PictureAsPdfIcon />, link: "/cv/ver", app: "alumni" },
    { name: "Plantillas de CV", icon: <CollectionsBookmark />, link: "/cv/plantillas", app: "alumni" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  // Permisos base para app Turnos (usuarios, roles, cuentas, comandos, logs, img)
  turnos_Programador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Clientes", icon: <PeopleIcon />, link: "/clientes" },
    { name: "Empleados", icon: <PeopleIcon />, link: "/empleados" },
    { name: "Servicios", icon: <CategoryIcon />, link: "/servicios" },
    { name: "Servicio extra", icon: <StarRounded />, link: "/servicio-extra" },
    { name: "Agenda", icon: <CalendarMonth />, link: "/agenda" },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
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
          { name: "Programar notificaciones", link: "/notification-programs", icon: <NotificationsIcon /> },
          { name: "Info", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
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
          { name: "Control de Imágenes", link: "/img", icon: <ImageIcon /> },
          { name: "Control de Archivos", link: "/file", icon: <InsertDriveFile /> },
          { name: "Componentes", link: "/componentes", icon: <ViewModule /> },
          { name: "Tokens", link: "/tokens", icon: <VpnKey /> },
        ],
      },
    },
  ],
  turnos_Empleado: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Clientes", icon: <PeopleIcon />, link: "/clientes" },
    { name: "Mis turnos", icon: <CalendarMonth />, link: "/agenda" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  // App Música (API musicaapi): usuarios, roles, cuentas, panel
  musica_Programador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Canciones", icon: <LyricsIcon />, link: "/canciones" },
    { name: "Piano Pro", icon: <PianoIcon />, link: "/pianoPro" },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
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
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
    {
      name: "Programador",
      icon: <Terminal />,
      menu: {
        items: [
          { name: "Comandos (backup)", link: "/comandos", icon: <IntegrationInstructions /> },
        ],
      },
    },
  ],
  musica_Administrador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Canciones", icon: <LyricsIcon />, link: "/canciones" },
    { name: "Piano Pro", icon: <PianoIcon />, link: "/pianoPro" },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
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
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  musica_Estudiante: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Canciones", icon: <LyricsIcon />, link: "/canciones" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Info", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  musica_Default: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Info", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  // Permisos para app Enfermería (Sistema Clínico)
  enfermeria_Programador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Tutorial", icon: <MenuBookIcon />, link: "/tutorial" },
    { name: "Pacientes", icon: <PeopleIcon />, link: "/pacientes" },
    {
      name: "Fichas médicas",
      icon: <AssignmentIcon />,
      menu: {
        items: [
          { name: "Añadir", link: "/ficha/anadir", icon: <AssignmentIcon /> },
          { name: "Estadísticas", link: "/ficha/estadisticas", icon: <AssignmentIcon /> },
        ],
      },
    },
    { name: "Instituciones", icon: <BusinessIcon />, link: "/instituciones" },
    { name: "CIE-10", icon: <CategoryIcon />, link: "/cie10" },
    { name: "Logs", icon: <ListIcon />, link: "/logs" },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
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
          { name: "Programar notificaciones", link: "/notification-programs", icon: <NotificationsIcon /> },
          { name: "Guardar copia de seguridad", icon: <SaveIcon />, action: "saveBackup" },
          { name: "Descargar JSON", icon: <CloudDownloadIcon />, action: "downloadBackup" },
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
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
          { name: "Control de Imágenes", link: "/img", icon: <ImageIcon /> },
          { name: "Control de Archivos", link: "/file", icon: <InsertDriveFile /> },
          { name: "Componentes", link: "/componentes", icon: <ViewModule /> },
          { name: "Tokens", link: "/tokens", icon: <VpnKey /> },
        ],
      },
    },
  ],
  "enfermeria_Doctor/a": [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Tutorial", icon: <MenuBookIcon />, link: "/tutorial" },
    { name: "Pacientes", icon: <PeopleIcon />, link: "/pacientes" },
    {
      name: "Fichas médicas",
      icon: <AssignmentIcon />,
      menu: {
        items: [
          { name: "Añadir", link: "/ficha/anadir", icon: <AssignmentIcon /> },
          { name: "Estadísticas", link: "/ficha/estadisticas", icon: <AssignmentIcon /> },
        ],
      },
    },
    { name: "CIE-10", icon: <CategoryIcon />, link: "/cie10" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  "enfermeria_Enfermero/a": [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Tutorial", icon: <MenuBookIcon />, link: "/tutorial" },
    { name: "Pacientes", icon: <PeopleIcon />, link: "/pacientes" },
    {
      name: "Fichas médicas",
      icon: <AssignmentIcon />,
      menu: {
        items: [
          { name: "Estructura", link: "/ficha/estructura", icon: <AssignmentIcon /> },
          { name: "Añadir", link: "/ficha/anadir", icon: <AssignmentIcon /> },
        ],
      },
    },
    { name: "CIE-10", icon: <CategoryIcon />, link: "/cie10" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  "enfermeria_Pasante": [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Tutorial", icon: <MenuBookIcon />, link: "/tutorial" },
    { name: "Pacientes", icon: <PeopleIcon />, link: "/pacientes" },
    {
      name: "Fichas médicas",
      icon: <AssignmentIcon />,
      menu: {
        items: [
          { name: "Estructura", link: "/ficha/estructura", icon: <AssignmentIcon /> },
          { name: "Añadir", link: "/ficha/anadir", icon: <AssignmentIcon /> },
        ],
      },
    },
    { name: "CIE-10", icon: <CategoryIcon />, link: "/cie10" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  enfermeria_Administrador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Tutorial", icon: <MenuBookIcon />, link: "/tutorial" },
    { name: "Pacientes", icon: <PeopleIcon />, link: "/pacientes" },
    { name: "Estructura de ficha", icon: <AssignmentIcon />, link: "/ficha/estructura" },
    { name: "Instituciones", icon: <BusinessIcon />, link: "/instituciones" },
    { name: "CIE-10", icon: <CategoryIcon />, link: "/cie10" },
    { name: "Logs", icon: <ListIcon />, link: "/logs" },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
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
          { name: "Guardar copia de seguridad", icon: <SaveIcon />, action: "saveBackup" },
          { name: "Descargar JSON", icon: <CloudDownloadIcon />, action: "downloadBackup" },
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  enfermeria_Moderador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Tutorial", icon: <MenuBookIcon />, link: "/tutorial" },
    { name: "Pacientes", icon: <PeopleIcon />, link: "/pacientes" },
    {
      name: "Fichas médicas",
      icon: <AssignmentIcon />,
      menu: {
        items: [
          { name: "Añadir", link: "/ficha/anadir", icon: <AssignmentIcon /> },
          { name: "Estadísticas", link: "/ficha/estadisticas", icon: <AssignmentIcon /> },
        ],
      },
    },
    { name: "Instituciones", icon: <BusinessIcon />, link: "/instituciones" },
    { name: "CIE-10", icon: <CategoryIcon />, link: "/cie10" },
    { name: "Logs", icon: <ListIcon />, link: "/logs" },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  turnos_Administrador: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Clientes", icon: <PeopleIcon />, link: "/clientes" },
    { name: "Empleados", icon: <PeopleIcon />, link: "/empleados" },
    { name: "Servicios", icon: <CategoryIcon />, link: "/servicios" },
    { name: "Servicio extra", icon: <StarRounded />, link: "/servicio-extra" },
    { name: "Agenda", icon: <CalendarMonth />, link: "/agenda" },
    {
      name: "Entidades",
      icon: <AccountTree />,
      menu: {
        items: [
          { name: "Cuentas", link: "/cuentas", icon: <AccountBox /> },
          { name: "Roles", link: "/roles", icon: <Workspaces /> },
          { name: "Usuarios", link: "/users", icon: <PeopleAlt /> },
        ],
      },
    },
    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Panel de Control", link: "/panel_control", icon: <Dns /> },
          { name: "Programar notificaciones", link: "/notification-programs", icon: <NotificationsIcon /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
        ],
      },
    },
  ],
  Estudiante: [
    { name: "Dashboard", icon: <Dashboard />, link: "/" },
    { name: "Bolsa de empleo", icon: <WorkIcon />, link: "/bolsa-empleo", app: "alumni" },
    { name: "Mis postulaciones", icon: <AssignmentInd />, link: "/bolsa-empleo/mis-postulaciones", app: "alumni" },
    { name: "Hoja de vida", icon: <DescriptionIcon />, link: "/cv", app: "alumni" },
    { name: "Ver mi CV", icon: <PictureAsPdfIcon />, link: "/cv/ver", app: "alumni" },
    { name: "Plantillas de CV", icon: <CollectionsBookmark />, link: "/cv/plantillas", app: "alumni" },
    { name: "Mis encuestas", icon: <AssignmentInd />, link: "/myforms", app: "alumni" },

    {
      name: "Configuracion",
      icon: <Settings />,
      menu: {
        items: [
          { name: "Información", link: "/info", icon: <Info /> },
          { name: "Tema", icon: <SettingsBrightnessIcon />, isThemeSelector: true },
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
  const { isAuthenticated, logout, user, profileImageUser, toast } = useAuth();
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

  /** Menú móvil EdDeli logueado: Inicio (vitrina /inicio) + catálogo + locales */
  const [eddeliBarMenuAnchor, setEddeliBarMenuAnchor] = useState(null);
  const openEddeliBarMenu = Boolean(eddeliBarMenuAnchor);
  const handleOpenEddeliBarMenu = (e) => setEddeliBarMenuAnchor(e.currentTarget);
  const handleCloseEddeliBarMenu = () => setEddeliBarMenuAnchor(null);




  

  const [unreadCount, setUnreadCount] = useState(0);

  useNotificationSocket(
    isAuthenticated ? user?.userId : null,
    isAuthenticated ? user?.accountId : null,
    () => { if (isAuthenticated) fetchUnreadCount(); }
  );

  // Refrescar conteo periódicamente por si el socket falla
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchUnreadCount, 60000); // cada 60 seg
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.accountId, user?.userId]);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data?.count ?? 0);
    } catch (error) {
      console.error("Error al obtener conteo de notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [isAuthenticated, user?.accountId, user?.userId]);

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
    fetchUnreadCount(); // refrescar al abrir
  };

  const openNotif = Boolean(anchorElNotif);
  const handleNotifClose = () => setAnchorElNotif(null);

  const handleDialogChangeRol = () => setOpenChangeRol((v) => !v);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => { setOpen(false); setExpandedAccordion(null); };
  const handleNavigation = (link) => navigate(link);
  const handleBackupAction = (actionType) => {
    if (actionType === "saveBackup") {
      toast?.({ promise: saveBackup(), successMessage: "Copia de seguridad guardada con éxito" });
    } else if (actionType === "downloadBackup") {
      toast?.({ promise: downloadBackup(), successMessage: "Backup descargado con éxito" });
    }
  };
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAccordionChange = (panel) => (_e, isExp) => setExpandedAccordion(isExp ? panel : null);

  const pagesToShow = isAuthenticated
    ? activeAppId === "turnos"
      ? permisos[`turnos_${user.loginRol}`] || permisos[user.loginRol] || []
      : activeAppId === "enfermeria"
      ? permisos[`enfermeria_${user.loginRol}`] || permisos[user.loginRol] || []
      : activeAppId === "musica"
      ? permisos[`musica_${user.loginRol}`] || permisos.musica_Default || []
      : filterPermisosByApp(permisos[user.loginRol] || [], activeAppId)
    : [];

  const showDrawer = isAuthenticated;
  const showUserActions = isAuthenticated;

  /** Con sesión: Inicio → vitrina (HomeLogout, /inicio); Catálogo + Locales. Dashboard del ERP sigue en el drawer (/). */
  const eddeliBarNav = useMemo(() => {
    if (!showUserActions || !(activeAppId === "eddeli" || activeAppId === "softed")) return [];
    const nav = getPublicNavForApp(activeAppId);
    const eddeliItems = nav.filter((item) => item.app === "eddeli");
    const inicioVitrina = {
      label: "Inicio",
      icon: <HomeIcon fontSize="small" />,
      to: "/inicio",
    };
    return [inicioVitrina, ...eddeliItems];
  }, [showUserActions, activeAppId]);

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

  const { mode: themeMode, setMode: setThemeMode } = useThemeMode();
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const THEME_OPTIONS = [
    { value: "system", label: "Usar sistema", icon: <BrightnessAutoIcon fontSize="small" /> },
    { value: "light", label: "Claro (Light)", icon: <LightModeIcon fontSize="small" /> },
    { value: "dark", label: "Oscuro (Dark)", icon: <DarkModeIcon fontSize="small" /> },
    { value: "neon", label: "Neón (Tron)", icon: <BoltIcon fontSize="small" /> },
  ];
  const handleThemeSelect = (value) => {
    setThemeMode(value);
    setThemeMenuAnchor(null);
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

          {/* EdDeli con sesión: Inicio (/inicio = HomeLogout) + Catálogo + Locales; drawer → Dashboard + Puntos de venta */}
          {eddeliBarNav.length > 0 && (
            <>
              {isMdUp ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 2 }}>
                  {eddeliBarNav.map((item) => (
                    <Button
                      key={`eddeli-bar-${item.label}`}
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
                <Box sx={{ ml: 1 }}>
                  <IconButton
                    color="inherit"
                    aria-label="inicio vitrina, catálogo y locales"
                    onClick={handleOpenEddeliBarMenu}
                    edge="start"
                  >
                    <StorefrontIcon />
                  </IconButton>
                  <Menu
                    anchorEl={eddeliBarMenuAnchor}
                    open={openEddeliBarMenu}
                    onClose={handleCloseEddeliBarMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    PaperProps={{ sx: { minWidth: 220 } }}
                  >
                    {eddeliBarNav.map((item) => (
                      <MenuItem
                        key={`eddeli-m-${item.label}`}
                        onClick={() => {
                          handleCloseEddeliBarMenu();
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

          {/* Navegación pública (Inicio / Catálogo / Locales / …) SOLO si NO está logeado */}
{!showUserActions && (
  <>
    {isMdUp ? (
      // ✅ Vista desktop/tablet: botones en línea
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
        {getPublicNavForApp(activeAppId).map((item) => (
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
          {getPublicNavForApp(activeAppId).map((item) => (
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
                  <CambiarRol onClose={handleDialogChangeRol} />
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
            {activeAppId === "softed" && pagesToShow?.length > 0 ? (
              // SoftEd: grupos EdDeli, Alumni, SoftEd
              (() => {
                const { eddeli, alumni, softed } = partitionByAppForSofted(pagesToShow);
                const renderItem = (page) => {
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
                              {page.menu.items.map((sub) =>
                                sub.isThemeSelector ? (
                                  <ListItem key={sub.name} disablePadding sx={{ pl: 4 }}>
                                    <ListItemButton onClick={(e) => setThemeMenuAnchor(e.currentTarget)}>
                                      <ListItemIcon>{sub.icon}</ListItemIcon>
                                      <ListItemText primary={sub.name} />
                                    </ListItemButton>
                                  </ListItem>
                                ) : sub.action ? (
                                  <ListItem key={sub.name} disablePadding sx={{ pl: 4 }}>
                                    <ListItemButton onClick={() => handleBackupAction(sub.action)}>
                                      <ListItemIcon>{sub.icon}</ListItemIcon>
                                      <ListItemText primary={sub.name} />
                                    </ListItemButton>
                                  </ListItem>
                                ) : (
                                  <ListItem key={sub.name} disablePadding onClick={() => handleNavigation(sub.link)} sx={{ pl: 4 }}>
                                    <ListItemButton>
                                      <ListItemIcon>{sub.icon}</ListItemIcon>
                                      <ListItemText primary={sub.name} />
                                    </ListItemButton>
                                  </ListItem>
                                )
                              )}
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
                };
                return (
                  <>
                    {eddeli.length > 0 && (
                      <>
                        <ListSubheader sx={{ lineHeight: 2, fontWeight: 700 }}>EdDeli (Panadería)</ListSubheader>
                        {eddeli.map((page) => renderItem(page))}
                        <Divider sx={{ my: 1 }} />
                      </>
                    )}
                    {alumni.length > 0 && (
                      <>
                        <ListSubheader sx={{ lineHeight: 2, fontWeight: 700 }}>Alumni</ListSubheader>
                        {alumni.map((page) => renderItem(page))}
                        <Divider sx={{ my: 1 }} />
                      </>
                    )}
                    {softed.length > 0 && (
                      <>
                        <ListSubheader sx={{ lineHeight: 2, fontWeight: 700 }}>SoftEd</ListSubheader>
                        {softed.map((page) => renderItem(page))}
                      </>
                    )}
                  </>
                );
              })()
            ) : (
              // EdDeli / Alumni: lista plana
              (pagesToShow || []).map((page) => {
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
                            {page.menu.items.map((sub) =>
                              sub.isThemeSelector ? (
                                <ListItem key={sub.name} disablePadding sx={{ pl: 4 }}>
                                  <ListItemButton onClick={(e) => setThemeMenuAnchor(e.currentTarget)}>
                                    <ListItemIcon>{sub.icon}</ListItemIcon>
                                    <ListItemText primary={sub.name} />
                                  </ListItemButton>
                                </ListItem>
                              ) : sub.action ? (
                                <ListItem key={sub.name} disablePadding sx={{ pl: 4 }}>
                                  <ListItemButton onClick={() => handleBackupAction(sub.action)}>
                                    <ListItemIcon>{sub.icon}</ListItemIcon>
                                    <ListItemText primary={sub.name} />
                                  </ListItemButton>
                                </ListItem>
                              ) : (
                                <ListItem key={sub.name} disablePadding onClick={() => handleNavigation(sub.link)} sx={{ pl: 4 }}>
                                  <ListItemButton>
                                    <ListItemIcon>{sub.icon}</ListItemIcon>
                                    <ListItemText primary={sub.name} />
                                  </ListItemButton>
                                </ListItem>
                              )
                            )}
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
              })
            )}
          </List>
        </Drawer>
      )}

      {/* Menú de tema (desde Configuración > Tema) */}
      <Menu
        anchorEl={themeMenuAnchor}
        open={Boolean(themeMenuAnchor)}
        onClose={() => setThemeMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem disabled sx={{ opacity: 0.8 }}>Tema de la interfaz</MenuItem>
        <Divider />
        {THEME_OPTIONS.map((opt) => {
          const selected = themeMode === opt.value;
          return (
            <MenuItem
              key={opt.value}
              onClick={() => handleThemeSelect(opt.value)}
              selected={selected}
              dense
            >
              <ListItemIcon>{opt.icon}</ListItemIcon>
              <ListItemText primary={opt.label} />
              {selected && <CheckIcon fontSize="small" />}
            </MenuItem>
          );
        })}
      </Menu>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
