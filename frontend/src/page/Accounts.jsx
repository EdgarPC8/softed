import {
  Container,
  IconButton,
  Button,
  Grid,
  Tooltip,
} from "@mui/material";
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import { deleteAccountRequest, getAccountRequest,resetPassword } from "../api/accountRequest.js";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import AccountForm from "../Components/Forms/AccountForm";
import Roles from "../Components/Roles";
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
  const [titleUserDialog, settitleUserDialog] = useState("");
  const { toast } = useAuth();


  const fetchdata = async () => {
    const { data } = await getAccountRequest();
    setData(data);
  };
  const handleDialogResetPass = () => {
    setOpenResetPass(!openResetPass);
  };

  const handleDialog = () => {
    setOpen(!open);
  };
  const handleDialogUser = () => {
    setOpenDialog(!openDialog);
  };

  const deleteUser = async () => {
    toast({
      promise:
      deleteAccountRequest(dataToDelete.id),
      successMessage: "Usuario elimninado con éxito",
      onSuccess: (success) => {
        setData(data.filter((d) => d.id !== dataToDelete.id));
        handleDialog();
      },
    });
  };
  const resetPasswordAccount = async () => {
    toast({
      promise:
      resetPassword(idResetPass),
      successMessage: "Contraseña reseteada con éxito a 12345678",
      onSuccess: (data) => {
        setIdResetPass(0)
        handleDialogResetPass();

      },
    });
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 20,
    },
    {
      headerName: "Id",
      field: "id",
      width: 30,
    },
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 180,
      sortable: false,
      renderCell: (params) => {
        const user = params.row.user
        return `${user.firstName} ${user.firstLastName} ${user.secondName} ${user.secondLastName}`;
      },
    },
    {
      headerName: "Rol",
      field: "rolName",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const rol = params.row.role
        return `${rol.name}`;
      },
    },

    {
      headerName: "Usuario",
      field: "username",
      width: 80,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
           <Tooltip title="Editar Cuenta">
           <IconButton
            onClick={() => {
              setDatos(params.row)
              setIsEditing(true)
              settitleUserDialog("Editar Cuenta")
              handleDialogUser();
            }}
          >
            <Edit />
          </IconButton>
     

</Tooltip>
<Tooltip title="Resetear Contraseña">
   
          <IconButton
            onClick={() => {
              setIdResetPass(params.row.id)
              handleDialogResetPass();
            }}
          >
            {`<>`}
          </IconButton>
</Tooltip>
<Tooltip title="Eliminar Cuenta">


          <IconButton
            onClick={() => {
              handleDialog();
              setDataToDelete(params.row);
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
    <Container>
      <Grid container sx={{ justifyContent: 'center' }} spacing={2}>
        <Grid item xs={4} sm={4}>
          <Roles />
        </Grid>
        <Grid item xs={8} sm={8} sx={{ marginTop: "18px" }}>
          <SimpleDialog
            open={openResetPass}
            onClose={handleDialogResetPass}
            tittle="Resetear Contraseña"
            onClickAccept={resetPasswordAccount}
          >
            ¿Está seguro de resetear la contraseña de esta cuenta?
          </SimpleDialog>

          <SimpleDialog
            open={open}
            onClose={handleDialog}
            tittle="Eliminar Cuenta"
            onClickAccept={deleteUser}
          >
            ¿Está seguro de eliminar la cuenta?
          </SimpleDialog>
          <Button
            variant="text"
            endIcon={<Person />}
            onClick={() => {
              setIsEditing(false)
              settitleUserDialog("Agregar Cuenta")
              handleDialogUser();
            }}
          >
            Añadir Cuenta
          </Button>
          <SimpleDialog
            open={openDialog}
            onClose={handleDialogUser}
            tittle={titleUserDialog}
          >
            <AccountForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} reload={fetchdata}></AccountForm>
          </SimpleDialog>
          <DataTable data={data} columns={columns} />

        </Grid>
      </Grid>
    </Container>
  );
}

export default Accounts;
