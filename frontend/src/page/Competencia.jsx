import { useEffect, useState } from "react";

import {
  Button,
  Container,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";

import DataTable from "../Components/DataTable";
import DataTableCompetencia from "../Components/DataTableCompetencia";
import { deleteSwimmerRequest, getAllNadadores } from "../api/nadadoresResquest.js";
import { deleteInstitutionRequest } from "../api/institutionRequest.js";
import { getCompetencia } from "../api/competenciaResquest";

function Competencia() {
  const [data, setData] = useState([]);

  async function getData() {
    try {
      const res = await getCompetencia();
      console.log(res.data)
      setData(res.data)

    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  useEffect(() => {
    getData();
    }, []);
    const columns = [
      {
        field: "#",
        headerName: "#",
        width: 50,
        sortable: false,
      },
      {
        headerName: "Categoria",
        field: "Categoria",
        width: 150,
        editable: true,
      },
      {
        headerName: "Prueba",
        field: "Prueba",
        width: 150,
        editable: true,
      },
      {
        headerName: "Genero",
        field: "Genero",
        width: 150,
        editable: true,
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <>
           
          </>
        ),
      },
    ];


  return (
    <>  
      {/* <DataTable columns={columns} data={data} /> */}
      <DataTableCompetencia/>

    </>
  );
}

export default Competencia;
