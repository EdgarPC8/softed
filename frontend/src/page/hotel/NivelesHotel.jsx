import {
  Container,
  IconButton,
  Button,
} from "@mui/material";
import DataTable from "../../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import { deleteNivel, getNivel } from "../../api/nivelHotelRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import UserForm from "../../Components/Forms/UserForm";
import NivelHotelForm from "../../Components/Forms/NivelHotelForm";

function NivelesHotel() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  const fetchUsers = async () => {
    const { data } = await getNivel();
    setUsers(data);
  };

  const handleDialog = () => {
    setOpen(!open);
  };
  const handleDialogUser = () => {
    setOpenDialog(!openDialog);
  };

  const deleteUser = async () => {
    toast.promise(
      deleteNivel(userToDelete.id),
      {
        loading: "Eliminando...",
        success: "Nivel elimninado con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );

    setUsers(users.filter((user) => user.id !== userToDelete.id));
    handleDialog();
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 30,
    },
    {
      headerName: "Id",
      field: "others",
      width: 50,
      sortable: false,
      renderCell: (params,index) => {
        
        return params.id;
      },
    },

  
    {
      headerName: "Nombre",
      field: "name",
      width: 200,
    },
     {
      headerName: "Orden",
      field: "orden",
      width: 50,
    },
    {
      headerName: "Descripcion",
      field: "description",
      width: 500,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setDatos(params.row)
              setIsEditing(true)
              settitleUserDialog("Editar Nivel")
              handleDialogUser();
            }}
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
    <Container>
        <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Nivel"
        onClickAccept={deleteUser}
      >
            ¿Está seguro de eliminar al usuario?
      </SimpleDialog>
      <Button
        sx={{ marginTop: "30px" }}
        variant="text"
        endIcon={<Person />}
        onClick={() => {
          setIsEditing(false)
          settitleUserDialog("Agregar Nivel")
          handleDialogUser();
        }}
      >
        Añadir Nivel
      </Button>

      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        {/* <UserForm onClose={handleDialogUser} isEditing={isEditing} datos={datos}></UserForm>  */}
        <NivelHotelForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} fecth={fetchUsers}></NivelHotelForm> 
      </SimpleDialog>
      <DataTable data={users} columns={columns} />
    </Container>
  );
}

export default NivelesHotel;
