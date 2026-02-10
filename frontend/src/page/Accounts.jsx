import {
  Container,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import TablePro from "../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { deleteAccountRequest, getAccountRequest, resetPassword } from "../api/accountRequest.js";
import { Person, Edit, Delete, LockReset } from "@mui/icons-material";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import AccountForm from "../Components/Forms/AccountForm";
import { useAuth } from "../context/AuthContext";

function Accounts() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetPass, setOpenResetPass] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [idResetPass, setIdResetPass] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, setTitleUserDialog] = useState("");
  const { toast } = useAuth();

  const fetchdata = async () => {
    const { data } = await getAccountRequest();
    setData(data);
  };

  const handleDialogResetPass = () => setOpenResetPass((v) => !v);
  const handleDialog = () => setOpen((v) => !v);
  const handleDialogUser = () => setOpenDialog((v) => !v);

  const deleteUser = async () => {
    toast({
      promise: deleteAccountRequest(dataToDelete.id),
      successMessage: "Usuario eliminado con éxito",
      onSuccess: () => {
        setData((prev) => prev.filter((d) => d.id !== dataToDelete.id));
        handleDialog();
      },
    });
  };

  const resetPasswordAccount = async () => {
    toast({
      promise: resetPassword(idResetPass),
      successMessage: "Contraseña reseteada con éxito a 12345678",
      onSuccess: () => {
        setIdResetPass(0);
        handleDialogResetPass();
      },
    });
  };

  const columns = [
    { id: "id", label: "Id", getSortValue: (r) => r.id },
    {
      id: "fullName",
      label: "Nombres y Apellidos",
      getSearchValue: (r) =>
        r.user
          ? `${r.user.firstName || ""} ${r.user.firstLastName || ""} ${r.user.secondName || ""} ${r.user.secondLastName || ""}`.trim()
          : "",
      render: (row) => {
        const user = row.user || {};
        return `${user.firstName || ""} ${user.firstLastName || ""} ${user.secondName || ""} ${user.secondLastName || ""}`.trim() || "—";
      },
    },
    { id: "username", label: "Usuario", getSortValue: (r) => (r.username || "").toLowerCase() },
    {
      id: "roles",
      label: "Roles",
      getSearchValue: (r) => (r.roles || []).map((role) => role.name).join(" "),
      render: (row) => (row.roles || []).map((role) => role.name).join(", ") || "—",
    },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <>
          <Tooltip title="Editar Cuenta">
            <IconButton
              size="small"
              onClick={() => {
                setDatos(row);
                setIsEditing(true);
                setTitleUserDialog("Editar Cuenta");
                handleDialogUser();
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Resetear Contraseña">
            <IconButton
              size="small"
              onClick={() => {
                setIdResetPass(row.id);
                handleDialogResetPass();
              }}
            >
              <LockReset />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar Cuenta">
            <IconButton
              size="small"
              onClick={() => {
                handleDialog();
                setDataToDelete(row);
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
    fetchdata();
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <SimpleDialog
        open={openResetPass}
        onClose={handleDialogResetPass}
        tittle="Resetear Contraseña"
        onClickAccept={resetPasswordAccount}
      >
        ¿Está seguro de resetear la contraseña de esta cuenta?
      </SimpleDialog>

      <SimpleDialog open={open} onClose={handleDialog} tittle="Eliminar Cuenta" onClickAccept={deleteUser}>
        ¿Está seguro de eliminar la cuenta?
      </SimpleDialog>

      <Button
        variant="text"
        endIcon={<Person />}
        onClick={() => {
          setIsEditing(false);
          setTitleUserDialog("Agregar Cuenta");
          handleDialogUser();
        }}
        sx={{ mb: 2 }}
      >
        Añadir Cuenta
      </Button>

      <SimpleDialog open={openDialog} onClose={handleDialogUser} tittle={titleUserDialog}>
        <AccountForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} reload={fetchdata} />
      </SimpleDialog>

      <TablePro
        title="Cuentas"
        rows={data}
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

export default Accounts;
