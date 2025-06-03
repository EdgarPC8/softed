import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  CardActions,
  useTheme,
  Tooltip,
  Container,
  IconButton
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { reloadBD, saveBackup, downloadBackup } from '../api/comandsRequest';
import BackupIcon from '@mui/icons-material/Backup';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import {  getLicenses,deleteLicense } from "../api/authRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import LicenseForm from "../Components/Forms/LicenseForm";
import { formatDate } from "../helpers/functions";

const arrayComands = [
  {
    name: "Descargar backup.json",
    info: "Descarga la base de datos en formato JSON",
    icon: <BackupIcon sx={{ fontSize: 50 }} />,
    function: downloadBackup
  },
  {
    name: "Recargar BD",
    info: "Recarga el contenido actual de la base de datos",
    icon: <RefreshIcon sx={{ fontSize: 50 }} />,
    function: reloadBD
  },
  {
    name: "Guardar una copia backup.json",
    info: "Guarda una copia local de la base de datos",
    icon: <SaveIcon sx={{ fontSize: 50 }} />,
    function: saveBackup
  },
];

export default function Comandos() {
  const theme = useTheme();
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

      <Grid container spacing={3} sx={{ mt: 4, justifyContent: 'center' }}>
      {arrayComands.map((comand, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            elevation={6}
            sx={{
              backgroundColor: theme.palette.primary.dark,
              borderRadius: 3,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: `0 4px 20px ${theme.palette.primary.light}`,
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Tooltip title={comand.name}>
                  <Box sx={{ color: theme.palette.primary.main }}>{comand.icon}</Box>
                </Tooltip>
              </Box>
              <Typography variant="h6" align="center" color="text.primary" gutterBottom>
                {comand.name}
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                {comand.info}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={comand.function}
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.secondary.contrastText,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  }
                }}
              >
                Ejecutar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
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
