import {
  Container,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import DataTable from "../Components/DataTable";
import { useEffect, useState } from "react";
import { deleteUserRequest, getUsersRequest } from "../api/userRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});

  const fetchUsers = async () => {
    const { data } = await getUsersRequest();

    setUsers(data);
  };

  const handleDialog = () => {
    setOpen(!open);
  };

  const deleteUser = async () => {
    toast.promise(
      deleteUserRequest(userToDelete.cedula),
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

    setUsers(users.filter((user) => user.cedula !== userToDelete.cedula));
    handleDialog();
  };

  const columns = [
    {
      headerName: "Cedula",
      field: "cedula",
      width: 150,
    },
    {
      headerName: "Nombres",
      field: "nombres",
      width: 150,
    },
    {
      headerName: "Apellidos",
      field: "apellidos",
      width: 150,
    },
    {
      headerName: "Fecha de nacimiento",
      field: "fecha_nacimiento",
      width: 150,
    },
    {
      headerName: "Genero",
      field: "genero",
      width: 150,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => navigate(`/editar-usuario/${params.row.cedula}`)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => {
              handleDialog();
              setUserToDelete(params.row);
            }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="md">
      <Dialog
        open={open}
        onClose={handleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Eliminar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro de eliminar al usuario {userToDelete?.nombres}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog}>Cancelar</Button>
          <Button onClick={deleteUser} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        sx={{ marginTop: "30px" }}
        variant="text"
        endIcon={<Person />}
        onClick={() => navigate("/añadir-usuario")}
      >
        Añadir Usuario
      </Button>
      <DataTable data={users} columns={columns} />
    </Container>
  );
}

export default Users;
