// src/components/ThemeSwitcher.jsx
import { useState } from "react";
import {
  IconButton, Tooltip, Menu, MenuItem,
  ListItemIcon, ListItemText, Divider
} from "@mui/material";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckIcon from "@mui/icons-material/Check";

import { useThemeMode } from "../theme/ThemeModeProvider";

const OPTIONS = [
  { value: "system", label: "Usar sistema", icon: <BrightnessAutoIcon fontSize="small" /> },
  { value: "light",  label: "Claro (Light)", icon: <LightModeIcon fontSize="small" /> },
  { value: "dark",   label: "Oscuro (Dark)", icon: <DarkModeIcon fontSize="small" /> },
  { value: "neon",   label: "Neón (Tron)",   icon: <BoltIcon fontSize="small" /> },

];

export default function ThemeSwitcher() {
  const { mode, setMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (value) => {
    setMode(value);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Cambiar tema">
        <IconButton
          size="small"
          color="inherit"
          onClick={handleOpen}
          aria-label="Cambiar tema"
          aria-controls={open ? "theme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <SettingsBrightnessIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled sx={{ opacity: 0.8 }}>Tema de la interfaz</MenuItem>
        <Divider />

        {OPTIONS.map(opt => {
          const selected = mode === opt.value;
          return (
            <MenuItem
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              selected={selected}
              dense
            >
              <ListItemIcon>
                {opt.icon}
              </ListItemIcon>
              <ListItemText primary={opt.label} />
              {selected && <CheckIcon fontSize="small" />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
