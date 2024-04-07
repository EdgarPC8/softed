import { Box, Container, Grid, TextField, IconButton } from "@mui/material";
import { Send, Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import DataTable from "../Components/DataTable";
import { useState, useEffect } from "react";
import {
  addMetersRequest,
  deleteMetersRequest,
  getMetersRequest,
  updateMetersRequest,
} from "../api/metersRequest";
import toast from "react-hot-toast";

function Meters() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm();

  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [meters, setMeters] = useState([]);

  const deleteMeters = async (id) => {
    // console.log(id)
    const response = await deleteMetersRequest(id);
    setMeters(meters.filter((meter) => meter.id !== id));
  };

  const fetchMeters = async () => {
    const { data } = await getMetersRequest();
    setMeters(data);
  };

  const onSubmit = (values) => {
    if (isEdit) {
        // console.log(id)
      toast.promise(
        updateMetersRequest(id, values),
        {
          loading: "Editando...",
          success: "Metros editado con éxito",
          error: "Ocurrio un error",
        },
        {
          position: "top-right",
          style: {
            fontFamily: "roboto",
          },
        }
      );
      fetchMeters();
      setEdit(false);
      reset();
      return;
    }

    toast.promise(
      addMetersRequest(values),
      {
        loading: "Añadiendo...",
        success: "Metros añadido con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    fetchMeters();
    reset();
  };

  const columns = [
    {
      headerName: "Metros",
      field: "metros",
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
                setValue("metros", params.row.metros);
                setEdit(true);
                setId(params.row.id);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton onClick={() => deleteMeters(params.row.id)}>
              <Delete />
            </IconButton>
          </>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchMeters();
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
                label="Agregar metros"
                variant="standard"
                {...register("metros", { required: true })}
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
        <DataTable columns={columns} data={meters} />
      </Container>
    </>
  );
}

export default Meters;
