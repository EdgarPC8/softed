import * as React from 'react';
import { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function DataTable({ columns = [], rows = [], onSelectionChange, getRowId }) {
  const [searchText, setSearchText] = useState('');

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const term = searchText.toLowerCase().trim();
    return rows.filter((row) => {
      const nombre = `${row.firstName || ''} ${row.secondName || ''} ${row.firstLastName || ''} ${row.secondLastName || ''}`.toLowerCase();
      const ci = String(row.ci || '').toLowerCase();
      const rol = String(row.rol || row.roles?.join(' ') || '').toLowerCase();
      const estado = row.asignado ? 'ya asignado' : 'disponible';
      return nombre.includes(term) || ci.includes(term) || rol.includes(term) || estado.includes(term);
    });
  }, [rows, searchText]);

  return (
    <Paper sx={{ width: '100%' }}>
      <Box sx={{ p: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, cédula..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 1 }}
        />
      </Box>
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={getRowId}
          checkboxSelection
        disableSelectionOnClick
        isRowSelectable={(params) => !params.row.asignado} // No seleccionables si ya están asignados
        getRowClassName={(params) =>
          params.row.asignado ? 'row-disabled' : '' // Asignamos una clase si el usuario está asignado
        }
        sx={{
          border: 0,
          '& .row-disabled': {
            backgroundColor: '#f0f0f0', // Fondo gris claro
            color: '#888888', // Texto en gris claro
            pointerEvents: 'none', // Evita que la fila sea seleccionada o interactuada
          },
        }}
        onRowSelectionModelChange={(newSelection) => {
          if (onSelectionChange) onSelectionChange(newSelection);
        }}
      />
      </Box>
    </Paper>
  );
}
