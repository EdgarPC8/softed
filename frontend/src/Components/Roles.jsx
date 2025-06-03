import {
    Container,
    IconButton,
    Button,
    Grid,
    Box,
    TextField
  } from "@mui/material";
  import DataTable from "./Tables/DataTable";
  import { useEffect, useState } from "react";
  import { deleteRolRequest, getRolRequest,updateRolRequest,addRolRequest } from "../api/accountRequest.js";
  import { Person, Edit, Delete,Send } from "@mui/icons-material";
  import toast from "react-hot-toast";
  import SimpleDialog from "./Dialogs/SimpleDialog";
  import UserForm from "./Forms/UserForm";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
  
  function Roles() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [datos, setDatos] = useState([]);
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
          updateRolRequest(id, values),
              successMessage: "Rol editado con éxito",
              onSuccess: (data) => {
                fetchdata();
                reset();
                setIsEditing(false);
              }
        });
      }else{
        toast({
          promise: 
          addRolRequest(values),
              successMessage: "Rol guardado con éxito",
              onSuccess: (data) => {
                fetchdata();
                reset();
                setIsEditing(false);
              }
        });
  
      }

    };
  
    const fetchdata = async () => {
      const { data } = await getRolRequest();
      setData(data);
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
        deleteRolRequest(dataToDelete.id),
            successMessage: "Rol Eliminado con éxito",
            onSuccess: (dataresponse) => {
  
              setData(data.filter((data) => data.id !== dataToDelete.id));
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
        field: "id",
        width: 50,
      },
      {
        headerName: "Nombre",
        field: "name",
        width: 100,
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
                setId(params.row.id);
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
              tittle="Eliminar Rol"
              onClickAccept={deleteUser}
            >
              ¿Está seguro de eliminar el rol?
            </SimpleDialog>
            {/* <Button
              sx={{ marginTop: "30px" }}
              variant="text"
              endIcon={<Person />}
              onClick={() => {
                setIsEditing(false)
                settitleUserDialog("Agregar Cuenta")
                handleDialogUser();
              }}
            >
              Añadir Rol
            </Button> */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Agregar Rol"
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
              <UserForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} reload={fetchdata}></UserForm>
            </SimpleDialog>
            <DataTable data={data} columns={columns} />
      </Container>
    );
  }
  
  export default Roles;
  