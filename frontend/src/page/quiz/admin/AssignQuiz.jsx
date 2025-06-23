import {
  Container,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Person, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import {
  getUsersByQuizAssign,
  deleteUsersByQuizAssign,
} from "../../../api/quizRequest";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import AssignUserForm from "../components/AssignUserForm";
import { useParams } from "react-router-dom";
import { anonimizarTextoChino } from "../../../helpers/functions";

function AssignQuiz() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");
  const { id: quizId } = useParams();

  const fetchUsers = async () => {
    const { data } = await getUsersByQuizAssign(quizId);
    setUsers(data);
  };

  const handleDialog = () => setOpen(!open);
  const handleDialogUser = () => setOpenDialog(!openDialog);

  const deleteUser = async () => {
    toast.promise(
      deleteUsersByQuizAssign(quizId, userToDelete.id),
      {
        loading: "Eliminando...",
        success: "Usuario eliminado con éxito",
        error: "Ocurrió un error",
      },
      {
        position: "top-right",
        style: { fontFamily: "roboto" },
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
      headerName: "Cédula",
      field: "ci",
      width: 250,
    },
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 350,
      sortable: false,
      renderCell: (params) => {
        const user = params.row;
        const name = `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`;
        return name;
      },
    },
    {
      headerName: "Modos asignados",
      field: "availableModes",
      width: 250,
    },
    
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            handleDialog();
            setUserToDelete(params.row);
          }}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box maxWidth="md" sx={{ mt: 4, mx: "auto" }}>
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Desasignar Usuario"
        onClickAccept={deleteUser}
      >
        ¿Está seguro de eliminar el usuario del cuestionario?
      </SimpleDialog>

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
          quizId={quizId}
          reload={fetchUsers}
        />
      </SimpleDialog>

      <DataTable data={users} columns={columns} />
    </Box>
  );
}

export default AssignQuiz;
