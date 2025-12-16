// src/Components/SearchableSelect.jsx
import React, { useState, useMemo } from "react";
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
  getOptionLabel = (item) => item.name, // cómo mostrar texto
  getOptionValue = (item) => item.id,   // valor que devuelve (id normalmente)
  placeholder = "Buscar...",
}) {
  const [search, setSearch] = useState("");

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

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>

        <Select
          label={label}
          value={value ?? ""}
          onChange={handleChange}
          MenuProps={{
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
              size="small"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              autoFocus
              // 👇 muy importante para que NO se cierre el menú
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  e.stopPropagation();
                }
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
