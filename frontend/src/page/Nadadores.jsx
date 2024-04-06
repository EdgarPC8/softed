import { useEffect, useState } from "react";

import {
  Button,
  Container,
} from '@mui/material';
import DataTable from '../Components/DataTable';
import { getAllNadadores } from '../api/nadadoresResquest.js';

function Nadadores() {

  const [Data, setData] = useState([]);
  const columns = [
    {
      field: "#",
      headerName: "#",
      width: 50,
      sortable: false,
    },
    {
      headerName: "Cedula",
      field: "cedula",
      width: 200,
      editable: true,
    },
    {
      headerName: "Nadador",
      field: "nombres",
      width: 200,
      editable: true,
    },
    {
      headerName: "Genero",
      field: "genero",
      width: 200,
      editable: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
        >
          Editar
        </Button>
      )
    },
  ];
  async function fetchData() {
    try {
      const nadadores= await getAllNadadores();
      setData(nadadores.data);
      // console.log(nadadores.data)
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
  useEffect(() => {
    fetchData();
},[]);
  
  

  return (
    <Container maxWidth="md">
      <DataTable columns={columns} data={Data} />
    </Container>
  );
}

export default Nadadores;
