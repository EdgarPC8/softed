import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

// Definir el modelo de paginación
const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ columns = [], rows = [], onSelectionChange }) {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
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
    </Paper>
  );
}
