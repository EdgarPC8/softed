import { useEffect, useState } from "react";

import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogTitle,
  Box,
  Grid,
  TextField,
  Typography,
  Select,
  Avatar,
  IconButton,
  FormControl,
  Autocomplete,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SelectData from '../Components/SelectData';


import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";

import DataTable from "../Components/DataTable";
import DataTableCompetencia from "../Components/DataTableCompetencia";
import { deleteSwimmerRequest, getAllNadadores } from "../api/nadadoresResquest.js";
import { deleteInstitutionRequest } from "../api/institutionRequest.js";
import { getCompetencia, getCompetenciaTiempos, getResultados, getEntidadCompetencia, addCompetencia } from "../api/competenciaResquest";
import DataTableCompResults from "../Components/DataTableCompResults";
import DataTableEntidadesComp from "../Components/DataTableEntidadesComp";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { CloudUpload } from "@mui/icons-material";
import { getInstitutionsRequest } from "../api/institutionRequest";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { getOneSwimmerRequest } from "../api/nadadoresResquest";
import { getMetros, getPruebas } from "../api/metrosPruebaResquest.js";


function Competencia() {
  const [data, setData] = useState([]);
  const [dataPruebas, setDataPruebas] = useState([]);
  const [dataMetros, setDataMetros] = useState([]);
  const [prueba, setPrueba] = useState('');
  const [metros, setMetros] = useState('');

  async function getData() {
    try {
      // const res = await getEntidadCompetencia();
      const res = await getCompetencia();
      console.log(res.data)
      setData(res.data)


      const resMetros = await getMetros();
      const resPruebas = await getPruebas();
      const pruebasData = resPruebas.data.map(prueba => ({
        name: prueba.name,
        value: prueba.name
      }));
      setDataPruebas(pruebasData);

      const metrosData = resMetros.data.map(metros => ({
        name: metros.name,
        value: metros.name
      }));
      setDataMetros(metrosData);

    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  useEffect(() => {
    getData();
  }, []);


  // --------------------------------
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,

    formState: { errors },
  } = useForm();

  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [meters, setMeters] = useState([]);

  const deleteMeters = async (id) => {
    // console.log(id)
    // const response = await deleteMetersRequest(id);
    // setMeters(meters.filter((meter) => meter.id !== id));
  };

  const fetchMeters = async () => {
    // const { data } = await getMetersRequest();
    // setMeters(data);
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
    console.log(values)

    toast.promise(
      addCompetencia(values),
      {
        loading: "Añadiendo...",
        success: "Competencia añadido con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    // fetchMeters();
    // reset();
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
      {/* <DataTableEntidadesComp data={data}/> */}
      <DataTableCompetencia data={data}/>
      {/* <DataTableCompResults data={data.Competencia}/> */}
      {/* <Box margin={10} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              defaultValue=""
              InputLabelProps={{ shrink: true }}
              {...register("nombre", { required: true })}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date.toISOString())}
                    renderInput={(params) => <TextField {...params} />}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Button sx={{ mt: 3 }} variant="contained" fullWidth type="submit">
          Guardar
        </Button>
      </Box>
      <Box margin={10}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre"
              defaultValue=""
              InputLabelProps={{ shrink: true }}
              {...register("nameEvento", { required: true })}
              sx={{ my: 1 }} // Agrega margen vertical
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SelectData Data={dataMetros} Label="Metros" onChange={setMetros} />

              </Grid>
              <Grid item xs={6}>
                <SelectData Data={dataPruebas} Label="Pruebas" onChange={setPrueba} />

              </Grid>
            </Grid>

            <DataTable data={[{ nombre: "25 Metros" }]} columns={[
              {
                headerName: "Nombre",
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
            ]} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre"
              defaultValue=""
              InputLabelProps={{ shrink: true }}
              {...register("nameCategoria", { required: true })}
              sx={{ my: 1 }} // Agrega margen vertical
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Año Inicial"
                  defaultValue=""
                  InputLabelProps={{ shrink: true }}
                  {...register("nameAnioIncial", { required: true })}
                  sx={{ mb: 1 }} // Agrega margen vertical
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Año Final"
                  defaultValue=""
                  InputLabelProps={{ shrink: true }}
                  {...register("nameAnioFinal", { required: true })}
                  sx={{ mb: 1 }} // Agrega margen vertical
                />
              </Grid>
            </Grid>


            <DataTable data={[{ nombre: "Mariposa" }]} columns={[
              {
                headerName: "Nombre",
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
            ]} />
          </Grid>
        </Grid>
      </Box> */}

    </>
  );
}

export default Competencia;
