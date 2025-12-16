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
import { reloadBD, saveBackup, downloadBackup, uploadBackup } from '../api/comandsRequest';
import BackupIcon from '@mui/icons-material/Backup';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from "react";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import BackupViewerModal from '../Components/ViewModal/BackupViewerModal';
import StudentViewerModal from '../Components/ViewModal/StudentViewerModal';
import { useAuth } from "../context/AuthContext";   // 👈 IMPORTANTE


export default function Comandos() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, settitleDialog] = useState("");
  const [backupData, setBackupData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);

  const { toast } = useAuth(); // 👈 USAMOS EL MISMO TOAST QUE EN Accounts

  const arrayComands = [
    {
      name: "Subir backup.json (reemplazar original)",
      info: "Reemplaza el archivo backup.json original usado para recargar la BD",
      icon: <BackupIcon sx={{ fontSize: 50 }} />,
      function: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
  
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (!file) return;
  
          const formData = new FormData();
          formData.append("backup", file); // 👈 nombre del campo igual al de multer
  
          toast({
            promise: uploadBackup(formData),
            successMessage: "Backup original reemplazado con éxito",
            onSuccess: (res) => {
              console.log("Upload backup result:", res.data);
            },
          });
        };
  
        input.click();
      },
    },
    {
      name: "Descargar backup.json",
      info: "Descarga la base de datos en formato JSON",
      icon: <BackupIcon sx={{ fontSize: 50 }} />,
      function: () => {
        toast({
          promise: downloadBackup(),
          successMessage: "Backup descargado con éxito",
        });
      },
    },
    {
      name: "Recargar BD",
      info: "Recarga el contenido actual de la base de datos",
      icon: <RefreshIcon sx={{ fontSize: 50 }} />,
      function: () => {
        toast({
          promise: reloadBD(),
          successMessage: "Base de datos recargada con éxito",
        });
      },
    },
    {
      name: "Guardar una copia backup.json",
      info: "Guarda una copia local de la base de datos",
      icon: <SaveIcon sx={{ fontSize: 50 }} />,
      function: () => {
        toast({
          promise: saveBackup(),
          successMessage: "Copia de seguridad guardada con éxito",
        });
      },
    },
    {
      name: "Cargar Matriculados backup.json",
      info: "Carga un archivo JSON de Matriculados del ISTMS",
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
                // 👇 ahora usando el mismo toast del contexto
                toast.error("Archivo inválido o corrupto", {
                  position: "top-right",
                });
              }
            };
            reader.readAsText(file);
          }
        };

        input.click();
      },
    },
    {
      name: "Cargar Estudiantes backup.json",
      info: "Carga un archivo JSON de los Estudiantes del ISTMS",
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
                toast.error("Archivo inválido o corrupto", {
                  position: "top-right",
                });
              }
            };
            reader.readAsText(file);
          }
        };

        input.click();
      },
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
        <BackupViewerModal
          jsonData={backupData}
          onClose={() => setOpenDialog(false)}
        />
      </SimpleDialog>

      <SimpleDialog
        open={openStudentsDialog}
        onClose={handleDialog2}
        tittle={titleDialog}
        maxWidth="xl"
        fullWidth
      >
        <StudentViewerModal jsonData={studentsData} />
      </SimpleDialog>

      <Grid container spacing={3} sx={{ mt: 4, justifyContent: "center" }}>
        {arrayComands.map((comand, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={6}
              sx={{
                backgroundColor: theme.palette.primary.dark,
                borderRadius: 3,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: `0 4px 20px ${theme.palette.primary.light}`,
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={2}
                >
                  <Tooltip title={comand.name}>
                    <Box sx={{ color: theme.palette.primary.main }}>
                      {comand.icon}
                    </Box>
                  </Tooltip>
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  color="colors.gray"
                  gutterBottom
                >
                  {comand.name}
                </Typography>
                <Typography variant="body2" align="center" color="colors.gray">
                  {comand.info}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={comand.function}
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.secondary.contrastText,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
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
