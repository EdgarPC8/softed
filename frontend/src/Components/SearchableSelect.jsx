// src/Components/SearchableSelect.jsx
import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  Select,
  ListSubheader,
} from "@mui/material";

function SearchableSelect({
  label = "Seleccionar",
  items = [],
  value = "",
  onChange,
  getOptionLabel = (item) => item.name,
  getOptionValue = (item) => item.id,
  placeholder = "Buscar...",
  clearSearchOnClose = true, // opcional
}) {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      (getOptionLabel(item) || "").toLowerCase().includes(q)
    );
  }, [search, items, getOptionLabel]);

  const handleChange = (event) => {
    const val = event.target.value;
    if (onChange) onChange(val);
  };

  const handleOpen = () => {
    // Enfoca el buscador cuando se abre el menú
    setTimeout(() => {
      searchRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    if (clearSearchOnClose) setSearch("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>

        <Select
          label={label}
          value={value ?? ""}
          onChange={handleChange}
          onOpen={handleOpen}
          onClose={handleClose}
          MenuProps={{
            // ✅ CLAVE: evita que MUI robe el foco del TextField al tipear
            autoFocus: false,
            disableAutoFocusItem: true,
            MenuListProps: {
              autoFocusItem: false,
              // evita que key events del menú interfieran con el input
              onKeyDown: (e) => {
                // si el foco está en el buscador, no dejes que el menú capture teclas
                if (document.activeElement === searchRef.current) {
                  e.stopPropagation();
                }
              },
            },
            PaperProps: {
              sx: {
                maxHeight: 360,
                "& .MuiListSubheader-root": {
                  bgcolor: "background.paper",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
              },
            },
          }}
        >
          {/* 🔍 Buscador dentro del menú */}
          <ListSubheader disableSticky>
            <TextField
              inputRef={searchRef}
              size="small"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              // ❌ quita autoFocus aquí (lo manejamos en handleOpen)
              // autoFocus
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                // ✅ evita que el menú capture teclas mientras escribes
                e.stopPropagation();
              }}
            />
          </ListSubheader>

          {/* 📌 Opciones filtradas */}
          {filtered.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="caption">
                No se encontraron resultados…
              </Typography>
            </MenuItem>
          ) : (
            filtered.map((item) => {
              const optionValue = getOptionValue(item);
              const optionLabel = getOptionLabel(item);
              return (
                <MenuItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </MenuItem>
              );
            })
          )}
        </Select>
      </FormControl>
    </Box>
  );
}

export default SearchableSelect;
