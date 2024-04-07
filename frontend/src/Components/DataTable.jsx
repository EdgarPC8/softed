import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

function DataTable({ data, columns }) {
  // Agregar numeración a cada fila y definir un ID único
  // const dataWithRowNumberAndId = data.map((row, index) => ({
  //   ...row,
  //   rowId: index + 1, // Usar el índice de la fila + 1 como ID único
  //   "#": index + 1,
  // }));
  function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  const handleEditCellChangeCommitted = (params) => {
    console.log("Valor actualizado:", params.value);
    // Aquí puedes realizar acciones adicionales con el valor actualizado, como actualizar el estado o enviar una solicitud a una base de datos
  };

  const getRowId = (row) => {
    return row.id || generateId(); // Si la fila tiene un ID, úsalo; de lo contrario, genera uno nuevo
  };

  return (
    <div style={{ height: 500, width: "100%", marginTop: 20 }}>
      <DataGrid
        rows={data}
        getRowId={generateId}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}

export default DataTable;
