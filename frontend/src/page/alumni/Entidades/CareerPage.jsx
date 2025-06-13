import {
  Container,
  IconButton,
  Button,
  Grid,
  Box,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { Person, Edit, Delete, Send } from "@mui/icons-material";

import { useForm } from "react-hook-form";
import DataTable from "../../../Components/Tables/DataTable";
import { getCareers, addCareer, editCareer, deleteCareer } from "../../../api/alumniRequest.js";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../../context/AuthContext";
function CareerPage() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(0);
  const [titleUserDialog, settitleUserDialog] = useState("");
  const { toast } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm();
  const onSubmit = async (values) => {
    if (isEditing) {
      toast({
        promise:
          editCareer(id, values),
        successMessage: "Carrera editada con éxito",
        onSuccess: (data) => {
          fetchdata();
          reset();
          setIsEditing(false);
        }
      });
      return;
    }
    toast({
      promise:
        addCareer(values),
      successMessage: "Carrera guardada con éxito",
      onSuccess: (data) => {
        fetchdata();
        reset();
        setIsEditing(false);
      }
    });

  }

  const fetchdata = async () => {
    const { data } = await getCareers();
    setData(data);
  };

  const handleDialog = () => {
    setOpen(!open);
  };
  const handleDialogUser = () => {
    setOpenDialog(!openDialog);
  };

  const deleteData = async () => {
    toast({
      promise:
        deleteCareer(dataToDelete.idCareer),
      successMessage: "Carrera Eliminada con éxito",
      onSuccess: (dataresponse) => {

        setData(data.filter((data) => data.idCareer !== dataToDelete.idCareer));
        handleDialog();
      }
    });
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 30,
    },
    {
      headerName: "Id",
      field: "idCareer",
      width: 50,
    },
    {
      headerName: "Nombre",
      field: "name",
      width: 500,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setValue("name", params.row.name);
              setIsEditing(true);
              setId(params.row.idCareer);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => {
            handleDialog();
            setDataToDelete(params.row);
          }}>

            <Delete />
          </IconButton>
        </>
      ),
    },
  ];
  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <Box maxWidth={"md"}
    sx={{
      mt:4,
      mx: "auto",           // centra horizontalmente
      textAlign: "center",  // opcional si quieres centrar textos
    }}
  >
        <SimpleDialog
          open={open}
          onClose={handleDialog}
          tittle="Eliminar Carrera"
          onClickAccept={deleteData}
        >
          ¿Está seguro de eliminar la Carrera?
        </SimpleDialog>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label="Agregar Carrera"
                  variant="standard"
                  {...register("name", { required: true })}
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit">
                        <Send />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        <SimpleDialog
          open={openDialog}
          onClose={handleDialogUser}
          tittle={titleUserDialog}
        >
        </SimpleDialog>
        <DataTable data={data} columns={columns} />
  </Box>
  );

}

export default CareerPage;
