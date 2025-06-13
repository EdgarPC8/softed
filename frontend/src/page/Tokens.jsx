import * as React from 'react';
import {
  Button,
  useTheme,
  Container,
  IconButton
} from "@mui/material";
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import {  getLicenses,deleteLicense } from "../api/authRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import LicenseForm from "../Components/Forms/LicenseForm";
import { formatDate } from "../helpers/functions";

export default function Tokens() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  const fetchUsers = async () => {
    const { data } = await getLicenses();
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
      deleteLicense(userToDelete.id),
      {
        loading: "Eliminando...",
        success: "Clave elimninada con éxito",
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
      field: "id",
      width: 30,
    },
    {
      headerName: "Codigo",
      field: "name",
      width: 150,
    },
    {
      headerName: "Token",
      field: "token",
      width: 150,
    },
     {
      headerName: "Tiempo",
      field: "time",
      width: 50,
    },
 
    {
      headerName: "Fecha Creacion",
      field: "dateCreation",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return formatDate(params.row.dateCreation)
      }
    },

    {
      headerName: "Fecha de Uso",
      field: "dateUse",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return formatDate(params.row.dateUse)
      }
    },
    {
      headerName: "Fecha de Uso",
      field: "dateUse",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return formatDate(params.row.dateExpiration)
      }
    },

    {
      headerName: "Activo",
      field: "valide",
      width: 50,
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
              setDatos(params.row)
              setIsEditing(true)
              settitleUserDialog("Editar Clave")
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
    <>
    <Container>
        <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Clave"
        onClickAccept={deleteUser}
      >
            ¿Está seguro de eliminar la clave?
      </SimpleDialog>
      <Button
        sx={{ marginTop: "30px" }}
        variant="text"
        endIcon={<Person />}
        onClick={() => {
          setIsEditing(false)
          settitleUserDialog("Crear Token")
          handleDialogUser();
        }}
      >
        Crear Token
      </Button>

      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <LicenseForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} reload={fetchUsers}></LicenseForm> 
      </SimpleDialog>
      <DataTable data={users} columns={columns} />
    </Container>
    </>
  
  );
}
