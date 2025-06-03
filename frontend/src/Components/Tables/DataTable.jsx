import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

function DataTable({ data, columns }) {

  data.forEach((element,index) => {
    element["#"]=index+1
    if(!element.id){
      element["id"]=index
    }
  });

  return (
    <div style={{ height: 500, width: "100%", marginTop: 10 }}>
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

