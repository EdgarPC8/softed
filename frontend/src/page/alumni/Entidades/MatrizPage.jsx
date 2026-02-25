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
  import TablePro from "../../../Components/Tables/TablePro";
  import { getPeriods,addPeriod,editPeriod,deletePeriod, getMatriz } from "../../../api/alumni/alumniRequest.js";



  
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
      { id: "idMatriz", label: "Id" },
      {
        id: "graduado",
        label: "Graduado",
        render: (row) => {
          const user = row.user;
          return user
            ? `${user.firstName || ""} ${user.secondName || ""} ${user.firstLastName || ""} ${user.secondLastName || ""}`.trim()
            : "";
        },
      },
      {
        id: "periodo",
        label: "Periodo",
        render: (row) => row.alumni_period?.name ?? "",
      },
      { id: "modality", label: "Modalidad" },
      { id: "grateDate", label: "Fecha Grado" },
      {
        id: "carrera",
        label: "Carrera",
        render: (row) => row.alumni_career?.name ?? "",
      },
      {
        id: "actions",
        label: "Actions",
        render: (row) => (
          <>
            <IconButton
              onClick={() => {
                setValue("name", row.name);
                setIsEditing(true);
                setId(row.idPeriod);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDialog();
                setDataToDelete(row);
              }}
            >
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
            <TablePro
              rows={data.map((row, i) => ({ ...row, id: row.idMatriz ?? row.idPeriod ?? i }))}
              columns={columns}
              title=""
              showSearch
              showPagination
              defaultRowsPerPage={5}
              tableMaxHeight={400}
              showIndex
              indexHeader="#"
            />
      </Container>
    );
  }
  
  export default MatrizPage;
  