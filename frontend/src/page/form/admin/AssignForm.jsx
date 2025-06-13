import {
  Container,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import { getUsersByFormAssign, deleteUsersByFormAssign } from "../../../api/formsRequest";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import AssignUserForm from "../components/AssignUserForm";
import { useParams } from "react-router-dom";
import { anonimizarTextoChino } from "../../../helpers/functions";



function AssignForm() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");
  const { id: formId } = useParams(); // Asegúrate que el id esté en la URL


  const fetchUsers = async () => {
    const { data } = await getUsersByFormAssign(formId);
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
      deleteUsersByFormAssign(formId, userToDelete.id),
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

    setUsers(users.filter((user) => user.id !== userToDelete.id));
    handleDialog();
  };
  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 50,
      sortable: false,
    },
    {
      headerName: "Cedula",
      field: "ci",
      width: 250,
      renderCell: (params) => anonimizarTextoChino(params.row.ci)

    },
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 350,
      sortable: false,
      renderCell: (params, index) => {
        const user = params.row;
        const name = `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`
        return anonimizarTextoChino(name);
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
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
    <Box
      maxWidth={"md"}
      sx={{
        mt: 4,
        mx: "auto",           // Centra el contenedor principal
      }}
    >
      {/* Diálogo para confirmar desasignación */}
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Desasignar Usuario"
        onClickAccept={deleteUser}
      >
        ¿Está seguro de eliminar el usuario de la Encuesta?
      </SimpleDialog>
  
      {/* Botón alineado a la izquierda */}
      <Box sx={{ textAlign: "left", mb: 2 }}>
        <Button
          variant="text"
          endIcon={<Person />}
          onClick={() => {
            setIsEditing(false);
            settitleUserDialog("Asignar Usuario");
            handleDialogUser();
          }}
        >
          Asignar Usuario
        </Button>
      </Box>
  
      {/* Diálogo de asignación */}
      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
        maxWidth="md"
        fullWidth
      >
        <AssignUserForm
          onClose={handleDialogUser}
          isEditing={isEditing}
          datos={users}
          reload={fetchUsers}
        />
      </SimpleDialog>
  
      {/* Tabla centrada */}
      <DataTable data={users} columns={columns} />
    </Box>
  );
  
}

export default AssignForm;


