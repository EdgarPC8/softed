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
  import { useEffect, useState } from "react";
  import { Person, Edit, Delete } from "@mui/icons-material";
  import { useNavigate } from "react-router-dom";
  import toast from "react-hot-toast";
import UserForm from "../Forms/UserForm";

  
  
  function UserDialog({isEditing=false}) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState({});
  
    const fetchUsers = async () => {
  
    };
  
    const handleDialog = () => {
      setOpen(!open);
    };
  
    const deleteUser = async () => {
    //   toast.promise(
    //     deleteUserRequest(userToDelete.cedula),
    //     {
    //       loading: "Eliminando...",
    //       success: "Usuario elimninado con éxito",
    //       error: "Ocurrio un error",
    //     },
    //     {
    //       position: "top-right",
    //       style: {
    //         fontFamily: "roboto",
    //       },
    //     }
    //   );
  
    //   setUsers(users.filter((user) => user.cedula !== userToDelete.cedula));
      handleDialog();
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);

    const onSubmit = async (data) => {
        console.log(data);
        // toast.promise(
        //   addUserRequest({
        //     ...data,
        //     fecha_nacimiento: data.fecha_nacimiento.split("T")[0]
        //   }),
        //   {
        //     loading: "Guardando...",
        //     success: "Usuario guardando con éxito",
        //     error: "Ocurrio un error",
        //   },
        //   {
        //     position: "top-right",
        //     style: {
        //       fontFamily: "roboto",
        //     },
        //   }
        // );
      };
  
    return (
      <Container maxWidth="md">
        <Dialog
          open={open}
          onClose={handleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">Usuario</DialogTitle> */}
          <DialogContent>
          <UserForm onSubmit={onSubmit} isEditing={isEditing}/>
            {/* <DialogContentText id="alert-dialog-description">
              ¿Está seguro de eliminar al usuario?
            </DialogContentText> */}
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleDialog}>Cancelar</Button>
            <Button onClick={deleteUser} autoFocus>
              Aceptar
            </Button> */}
          </DialogActions>
        </Dialog>
        <Button
             sx={{ marginTop: "30px" }}
             variant="text"
             endIcon={<Person />}

              onClick={() => {
                handleDialog();
              }}
            >
                {!isEditing?'Añadir Usuario':'Editar Usuario'}
            </Button>
      </Container>
    );
  }
  
  export default UserDialog;
  