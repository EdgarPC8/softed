import {
  Container,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import TablePro from "../../../Components/Tables/TablePro";
import { getAccountsByFormAssign, deleteAccountByFormAssign } from "../../../api/formsRequest";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import AssignUserForm from "../components/AssignUserForm";
import { useParams } from "react-router-dom";



function AssignForm() {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");
  const { id: formId } = useParams();

  const fetchAccounts = async () => {
    const { data } = await getAccountsByFormAssign(formId);
    setAccounts(data || []);
  };

  const handleDialog = () => {
    setOpen(!open);
  };
  const handleDialogUser = () => {
    setOpenDialog(!openDialog);
  };
  const deleteAccount = async () => {
    toast.promise(
      deleteAccountByFormAssign(formId, accountToDelete.id),
      {
        loading: "Eliminando...",
        success: "Cuenta eliminada con éxito",
        error: "Ocurrió un error",
      },
      { position: "top-right", style: { fontFamily: "roboto" } }
    );
    setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
    handleDialog();
  };

  const flatRow = (acc) => {
    const roleNames = (acc.roles || []).map((r) => r.name).filter(Boolean);
    return {
      id: acc.id,
      ci: acc.user?.ci ?? acc.ci ?? "-",
      firstName: acc.user?.firstName ?? acc.firstName,
      secondName: acc.user?.secondName ?? acc.secondName,
      firstLastName: acc.user?.firstLastName ?? acc.firstLastName,
      secondLastName: acc.user?.secondLastName ?? acc.secondLastName,
      rol: roleNames.join(", ") || "-",
    };
  };
  const columns = [
    { id: "ci", label: "Cédula", render: (row) => row.ci ?? "-" },
    {
      id: "nombre",
      label: "Nombres y Apellidos",
      render: (row) => {
        const name = `${row.firstName || ""} ${row.secondName || ""} ${row.firstLastName || ""} ${row.secondLastName || ""}`.trim();
        return name || "-";
      },
    },
    { id: "rol", label: "Rol", render: (row) => row.rol ?? "-" },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <IconButton
          size="small"
          onClick={() => {
            handleDialog();
            setAccountToDelete(row);
          }}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  const rowsWithId = accounts.map((a) => flatRow(a));


  useEffect(() => {
    fetchAccounts();
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
        tittle="Desasignar cuenta"
        onClickAccept={deleteAccount}
      >
        ¿Está seguro de eliminar esta cuenta de la encuesta?
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
          datos={accounts}
          reload={fetchAccounts}
        />
      </SimpleDialog>
  
      {/* Tabla centrada */}
      <TablePro
        rows={rowsWithId}
        columns={columns}
        showIndex
        showSearch
        rowsPerPageOptions={[5, 10, 25]}
        defaultRowsPerPage={10}
      />
    </Box>
  );
  
}

export default AssignForm;


