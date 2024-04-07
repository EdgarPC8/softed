import { Box, Container, Grid, TextField, IconButton } from "@mui/material";

import { Send, Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import {
  addInstitutionRequest,
  deleteInstitutionRequest,
  getInstitutionsRequest,
  updateInstitutionRequest,
} from "../api/institutionRequest";
import DataTable from "../Components/DataTable";

function Institution() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm();

  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  const [institutions, setInstitutions] = useState([]);
  const deleteInstitution = async (id) => {
    // console.log(id);
    const response = await deleteInstitutionRequest(id);
    setInstitutions(
      institutions.filter((institution) => institution.id !== id)
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 80,
      sortable: false,
    },
    {
      headerName: "Institucion",
      field: "nombre",
      width: 500,
      editable: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <>
          <>
            <IconButton
              onClick={() => {
                setValue("nombre", params.row.nombre);
                setEdit(true);
                setId(params.row[0]);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton onClick={() => deleteInstitution(params.row[0])}>
              <Delete />
            </IconButton>
          </>
          {/* <Button variant="contained" color="primary">
            Editar
          </Button>
          <Button
            sx={{ ml: 1 }}
            variant="contained"
            color="error"
            onClick={() => deleteInstitution(params.row[0])}
          >
            Eliminar
          </Button> */}
        </>
      ),
    },
  ];

  const onSubmit = async (values) => {
    if (isEdit) {
      toast.promise(
        updateInstitutionRequest(id, values),
        {
          loading: "Editando...",
          success: "Institución editado con éxito",
          error: "Ocurrio un error",
        },
        {
          position: "top-right",
          style: {
            fontFamily: "roboto",
          },
        }
      );
      fetchInstitutions();
      setEdit(false)
      reset();
      return;
    }

    toast.promise(
      addInstitutionRequest(values),
      {
        loading: "Añadiendo...",
        success: "Institución añadido con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    fetchInstitutions();
    reset();
  };

  const fetchInstitutions = async () => {
    const { data } = await getInstitutionsRequest();
    setInstitutions(data);
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Agregar institución"
                variant="standard"
                {...register("nombre", { required: true })}
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
        <DataTable columns={columns} data={institutions} />
      </Container>
    </>
  );
}

export default Institution;
