import { Box, Container, Grid, TextField, IconButton } from "@mui/material";

import { Send, Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import {
  deleteInstitutionRequest,
  getInstitutionsRequest,
} from "../api/institutionRequest";
import DataTable from "../Components/DataTable";
import {
  addTestsRequest,
  deleteTestsRequest,
  getTestRequest,
  updateTestsRequest,
} from "../api/testRequest";

function Tests() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm();

  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  const [tests, setTest] = useState([]);
  
  const deleteTest = async (id) => {
    const response = await deleteTestsRequest(id);
    setTest(tests.filter((test) => test.id !== id));
  };

  const columns = [
    {
      headerName: "Pruebas",
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
                setId(params.row.id);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton onClick={() => deleteTest(params.row.id)}>
              <Delete />
            </IconButton>
          </>
        </>
      ),
    },
  ];

  const onSubmit = async (values) => {
    if (isEdit) {
      toast.promise(
        updateTestsRequest(id, values),
        {
          loading: "Editando...",
          success: "Prueba editado con éxito",
          error: "Ocurrio un error",
        },
        {
          position: "top-right",
          style: {
            fontFamily: "roboto",
          },
        }
      );
      fetchTest();
      setEdit(false);
      reset();
      return;
    }

    toast.promise(
      addTestsRequest(values),
      {
        loading: "Añadiendo...",
        success: "Prueba añadido con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    fetchTest();
    reset();
  };

  const fetchTest = async () => {
    const { data } = await getTestRequest();
    setTest(data);
  };

  useEffect(() => {
    fetchTest();
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
                label="Agregar Prueba"
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
        <DataTable columns={columns} data={tests} />
      </Container>
    </>
  );
}

export default Tests;
