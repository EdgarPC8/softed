import React from "react";
import { Button, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getTiemposByCI } from "../api/tiemposResquest.js";
import { useEffect, useState } from "react";
import DataTable from "../Components/DataTable";

function Tiempos() {
  const { user } = useAuth();
  const [Data, setData] = useState([]);
  const columns = [
    {
      headerName: "Cedula",
      field: "cedula",
      width: 150,
      editable: true,
    },
    {
      headerName: "Fecha",
      field: "fecha",
      width: 150,
      editable: true,
    },
    {
      headerName: "Metros",
      field: "metros",
      width: 150,
      editable: true,
    },
    {
      headerName: "Prueba",
      field: "prueba",
      width: 150,
      editable: true,
    },
    {
      headerName: "Tiempo",
      field: "tiempo",
      width: 150,
      editable: true,
    },
  ];
  // console.log(user)
  async function fetchData() {
    try {
      const res = await getTiemposByCI(1150424552);
      setData(res.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="md">
      <DataTable columns={columns} data={Data} />
    </Container>
  );
}

export default Tiempos;
