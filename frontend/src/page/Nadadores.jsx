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
import {
  deleteSwimmerRequest,
  getAllNadadores,
} from "../api/nadadoresResquest.js";
import { deleteInstitutionRequest } from "../api/institutionRequest.js";

function Nadadores() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [swimmer, setSwimmer] = useState("");
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const deleteSwimmer = async () => {
    toast.promise(
      deleteSwimmerRequest(swimmer.cedula),
      {
        loading: "Eliminando...",
        success: "Usuario elimninado con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    setData(data.filter((data) => data.cedula !== swimmer.cedula));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      headerName: "Cedula",
      field: "cedula",
      width: 150,
      editable: true,
    },
    {
      headerName: "Nadador",
      field: "nombres",
      width: 200,
      
    },
    {
      headerName: "Genero",
      field: "genero",
      width: 100,
      
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => navigate(`/editar-nadador/${params.row.cedula}`)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => {
              handleClickOpen();
              setSwimmer(params.row);
              // console.log(params.row.nadador)
            }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];
  async function fetchData() {
    try {
      const nadadores = await getAllNadadores();
      setData(nadadores.data);
      // console.log(nadadores)
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="md">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Eliminar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro de eliminar al nadador {swimmer?.nadador}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={deleteSwimmer} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        sx={{ marginTop: "30px" }}
        variant="text"
        endIcon={<Person />}
        onClick={() => navigate("/añadir-nadador")}
      >
        Agregar nadador
      </Button>

      <DataTable columns={columns} data={data} />
    </Container>
  );
}

export default Nadadores;
