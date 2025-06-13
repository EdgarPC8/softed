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
} from "@mui/material";
import { reloadBD, saveBackup, downloadBackup } from '../api/comandsRequest';
import BackupIcon from '@mui/icons-material/Backup';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import Person from '@mui/icons-material/Person';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import BackupViewerModal from '../Components/ViewModal/BackupViewerModal';
import StudentViewerModal from '../Components/ViewModal/StudentViewerModal';



export default function Comandos() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, settitleDialog] = useState("");
  const [backupData, setBackupData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);

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
    {
      name: "Cargar Matriculados backup.json",
      info: "Carga un archivo JSON de Matriculados del istms",
      icon: <BackupIcon sx={{ fontSize: 50 }} />,
      function: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const json = JSON.parse(e.target.result);
                setBackupData(json);
                settitleDialog("Vista del Backup");
                setOpenDialog(true);
              } catch (err) {
                toast.error("Archivo inválido o corrupto", { position: "top-right" });
              }
            };
            reader.readAsText(file);
          }
        };

        input.click();
      }

    },
    {
      name: "Cargar Estudiantes backup.json",
      info: "Carga un archivo JSON de los Estudiantes del istms",
      icon: <BackupIcon sx={{ fontSize: 50 }} />,
      function: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const json = JSON.parse(e.target.result);
                setStudentsData(json);
                settitleDialog("Vista del Backup Estudiantes");
                setOpenStudentsDialog(true);
              } catch (err) {
                toast.error("Archivo inválido o corrupto", { position: "top-right" });
              }
            };
            reader.readAsText(file);
          }
        };

        input.click();
      }

    },
  ];
  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };
  const handleDialog2 = () => {
    setOpenStudentsDialog(!openStudentsDialog);
  };
  return (
    <Box>
      <SimpleDialog
        open={openDialog}
        onClose={handleDialog}
        tittle={titleDialog}
        maxWidth="xl"
        fullWidth
      >
        <BackupViewerModal jsonData={backupData} onClose={() => setOpenDialog(false)} />
      </SimpleDialog>
      <SimpleDialog
        open={openStudentsDialog}
        onClose={handleDialog2}
        tittle={titleDialog}
        maxWidth="xl"
        fullWidth
      >
        <StudentViewerModal jsonData={studentsData}  />
      </SimpleDialog>


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
                <Typography variant="h6" align="center" color="colors.gray" gutterBottom>
                  {comand.name}
                </Typography>
                <Typography variant="body2" align="center" color="colors.gray">
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
    </Box>

  );
}
