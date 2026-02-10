import {
  Container,
  IconButton,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";
import TablePro from "../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { deleteUserRequest, getUsersRequest } from "../api/userRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import UserForm from "../Components/Forms/UserForm";
import { pathImg } from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, setTitleUserDialog] = useState("");
  const { toast } = useAuth();

  const fetchUsers = async () => {
    const { data } = await getUsersRequest();
    setUsers(data);
  };

  const handleDialog = () => setOpen((v) => !v);
  const handleDialogUser = () => setOpenDialog((v) => !v);

  const deleteUser = async () => {
    toast({
      promise: deleteUserRequest(userToDelete.id),
      successMessage: "Usuario eliminado con éxito",
      onSuccess: () => {
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
        handleDialog();
      },
    });
  };

  const genderLabel = (g) => (g === "M" ? "Masculino" : g === "F" ? "Femenino" : g || "—");

  const fullName = (r) =>
    [r.firstName, r.secondName, r.firstLastName, r.secondLastName].filter(Boolean).join(" ") || "—";

  const columns = [
    { id: "id", label: "Id", getSortValue: (r) => r.id },
    { id: "ci", label: "Cédula" },
    {
      id: "nombreCompleto",
      label: "Nombre completo",
      getSearchValue: (r) => fullName(r),
      getSortValue: (r) => fullName(r).toLowerCase(),
      render: (row) => fullName(row),
    },
    { id: "birthday", label: "Fecha de nacimiento" },
    {
      id: "gender",
      label: "Género",
      render: (row) => genderLabel(row.gender),
      getSortValue: (r) => (r.gender || "").toLowerCase(),
    },
    {
      id: "photo",
      label: "Foto",
      render: (row) => (
        <Avatar
          src={row.photo ? `${pathImg}${row.photo}` : undefined}
          alt={fullName(row)}
          sx={{ width: 36, height: 36 }}
        />
      ),
    },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <>
          <Tooltip title="Editar Usuario">
            <IconButton
              size="small"
              onClick={() => {
                setDatos(row);
                setIsEditing(true);
                setTitleUserDialog("Editar Usuario");
                handleDialogUser();
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar Usuario">
            <IconButton
              size="small"
              onClick={() => {
                handleDialog();
                setUserToDelete(row);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Usuario"
        onClickAccept={deleteUser}
      >
        ¿Está seguro de eliminar al usuario?
      </SimpleDialog>

      <Button
        variant="text"
        endIcon={<Person />}
        onClick={() => {
          setIsEditing(false);
          setTitleUserDialog("Agregar Usuario");
          handleDialogUser();
        }}
        sx={{ mb: 2 }}
      >
        Añadir Usuario
      </Button>

      <SimpleDialog open={openDialog} onClose={handleDialogUser} tittle={titleUserDialog}>
        <UserForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} reload={fetchUsers} />
      </SimpleDialog>

      <TablePro
        title="Usuarios"
        rows={users}
        columns={columns}
        showSearch
        showPagination
        showIndex
        indexHeader="#"
        rowsPerPageOptions={[5, 10, 25]}
        defaultRowsPerPage={10}
        tableMaxHeight={440}
      />
    </Container>
  );
}

export default Users;
