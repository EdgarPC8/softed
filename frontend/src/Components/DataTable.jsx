import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

function DataTable({ data, columns }) {
  // Agregar numeración a cada fila y definir un ID único
  const nadadores= data.forEach((row, index) => {
    row.id = index + 1;
  });

  return (
    <div style={{ height: 500, width: "100%", marginTop: 20 }}>
      <DataGrid
        rows={data}
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

