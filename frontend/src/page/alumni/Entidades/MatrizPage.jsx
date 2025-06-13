import {
    Container,
    IconButton,
    Button,
    Grid,
    Box,
    TextField
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { Person, Edit, Delete,Send } from "@mui/icons-material";
  
  import { useForm } from "react-hook-form";
  import DataTable from "../../../Components/Tables/DataTable";
  import { getPeriods,addPeriod,editPeriod,deletePeriod, getMatriz } from "../../../api/alumniRequest.js";



  
  import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
  import { useAuth } from "../../../context/AuthContext";
  function MatrizPage() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [id, setId] = useState(0);
    const [titleUserDialog, settitleUserDialog] = useState("");
    const { toast} = useAuth();
  
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
          editPeriod(id, values),
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
          addPeriod(values),
              successMessage: "Carrera guardada con éxito",
              onSuccess: (data) => {
                fetchdata();
                reset();
                setIsEditing(false);
              }
        });
  
      }
  
    const fetchdata = async () => {
      const { data } = await getMatriz();
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
        deletePeriod(dataToDelete.idPeriod),
            successMessage: "Matriz Eliminada con éxito",
            onSuccess: (dataresponse) => {
  
              setData(data.filter((data) => data.idPeriod !== dataToDelete.idPeriod));
              handleDialog();
            }
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
        field: "idMatriz",
        width: 30,
      },
      {
        headerName: "Graduado",
        field: "Graduado",
        width: 220,
        sortable: false,
        renderCell: (params) => {
          const user=params.row.user
          return `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`
        }
      },
      {
        headerName: "Periodo",
        field: "Periodo",
        width: 150,
        sortable: false,
        renderCell: (params) => {
          const period=params.row.alumni_period
          return `${period.name}`
        }
      },
      {
        headerName: "Modalidad",
        field: "modality",
        width: 80,
      },
      {
        headerName: "Fecha Grado",
        field: "grateDate",
        width: 80,
      },
      {
        headerName: "Carrera",
        field: "Carrera",
        width: 300,
        sortable: false,
        renderCell: (params) => {
          return params.row.alumni_career.name
        }
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
                setId(params.row.idPeriod);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton  onClick={() => {
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
  
      <Container>
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
                      label="Agregar Matriz"
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
      </Container>
    );
  }
  
  export default MatrizPage;
  