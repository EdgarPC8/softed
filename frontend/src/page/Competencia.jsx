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
import { getCompetencia, getCompetenciaTiempos, getResultados, getEntidadCompetencia, addCompetencia, createCompetencia } from "../api/competenciaResquest";
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
  const [competencia, setCompetencia] = useState({});
  const [dataPruebas, setDataPruebas] = useState([]);
  const [dataMetros, setDataMetros] = useState([]);
  const [dataComp, setDataComp] = useState([]);
  const [prueba, setPrueba] = useState('');
  const [metros, setMetros] = useState('');
  const [nameEvento, setNameEvento] = useState("");
  const [nameCategoria, setNameCategoria] = useState("");
  const [nameAnioInicial, setNameAnioInicial] = useState("");
  const [nameAnioFinal, setNameAnioFinal] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  

  async function getData() {
    try {
      const res = await getEntidadCompetencia();
      // const res = await getCompetenciaTiempos();
      const res2 = await getCompetencia();
      setData(res.data)
      console.log(res.data, res2.data)



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
  const { register, handleSubmit, setValue, reset, control, formState: { errors }, getValues } = useForm();
  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [meters, setMeters] = useState([]);
  const deleteEvento = (eventoToDelete) => {
    // Filtra el array dataComp para eliminar el evento proporcionado
    const newDataComp = dataComp.filter(evento => evento !== eventoToDelete);
    setDataComp(newDataComp); // Actualiza el estado con el nuevo array sin el evento eliminado
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
    // console.log(values)
    if (dataComp.length==0) {
      toast.error("Debes llenar al menos un campo para agregar un evento.");
      return;
    }
    const obj={
      datos:values,
      eventos:dataComp
    }
    setCompetencia(obj)

    handleOpenDialog();

  
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

  const handleButtonClick = async () => {
    // Aquí puedes colocar la lógica que desees ejecutar al hacer clic en el botón
    // const res3 = await createCompetencia(data);
    // console.log('Competencia creada!');
    toast.promise(
      addCompetencia(competencia),
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
    handleCloseDialog()
  };

  const addEvento = () => {
    // const { nameEvento, nameCategoria, nameAnioInicial, nameAnioFinal } = values;
  
    const initialYear = parseInt(nameAnioInicial);
    const finalYear = parseInt(nameAnioFinal);
  
    if (isNaN(initialYear) || isNaN(finalYear)) {
      console.error("Por favor ingresa años válidos.");
      return;
    }
 
  
    const yearsRange = [];
    for (let year = initialYear; year <= finalYear; year++) {
      yearsRange.push(year);
    }
  
    const newCompetencia = {
      name: nameEvento,
      metros: metros,
      prueba: prueba,
      categoria: nameCategoria,
      anio: yearsRange.join(","),
      genero:"F,M"
    };
  
    // Verificar si ya existe un evento con los mismos datos
    const isDuplicate = dataComp.some((evento) => {
      return (
        evento.name === newCompetencia.name ||
        (evento.metros === newCompetencia.metros &&
          evento.prueba === newCompetencia.prueba &&
          evento.categoria === newCompetencia.categoria &&
          evento.anio === newCompetencia.anio)
      );
    });
  
    if (isDuplicate) {
      console.error("Ya existe un evento con el mismo nombre o los mismos datos.");
      return;
    }
  
    setDataComp([...dataComp, newCompetencia]);
  };
  


  return (
    <>
    <Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>Confirmación</DialogTitle>
  <DialogContent>
    <DialogContentText>
      ¿Estás seguro de que quieres crear la competencia?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary">
      Cancelar
    </Button>
    <Button onClick={handleButtonClick} color="primary">
      Crear Competencia
    </Button>
  </DialogActions>
</Dialog>


      <Box mt={10} component="form" onSubmit={handleSubmit(onSubmit)}>
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
        <Button variant="contained" type="submit">
          Guardar Competencia
        </Button>

      </Box>
      <Box mt={10} >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre del evento"
            value={nameEvento}
            onChange={(e) => setNameEvento(e.target.value)}
          />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SelectData Data={dataMetros} Label="Metros" onChange={setMetros} />
              </Grid>
              <Grid item xs={6}>
                <SelectData Data={dataPruebas} Label="Pruebas" onChange={setPrueba} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de la Categoría"
            value={nameCategoria}
            onChange={(e) => setNameCategoria(e.target.value)}
          />
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <TextField
            fullWidth
            label="Año Inicial"
            value={nameAnioInicial}
            onChange={(e) => setNameAnioInicial(e.target.value)}
          />
              </Grid>

              <Grid item xs={6}>
              <TextField
            fullWidth
            label="Año Final"
            value={nameAnioFinal}
            onChange={(e) => setNameAnioFinal(e.target.value)}
          />
              </Grid>

              <Grid item xs={6}>
              <Button onClick={addEvento}>Añadir</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container >
          <Grid item xs={12}>
            <DataTable data={dataComp} columns={[
              {
                headerName: "Evento",
                field: "name",
                width: 200,
                editable: true,
              },
              {
                headerName: "Metros",
                field: "metros",
                width: 200,
                editable: true,
              },
              {
                headerName: "Prueba",
                field: "prueba",
                width: 200,
                editable: true,
              },
              {
                headerName: "Nombre de Categoria",
                field: "categoria",
                width: 200,
                editable: true,
              },
              {
                headerName: "Años",
                field: "anio",
                width: 200,
                editable: true,
              },
              {
                headerName: "Actions",
                field: "actions",
                width: 200,
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
                      <IconButton onClick={() => deleteEvento(params.row)}>
                        <Delete />
                      </IconButton>

                    </>
                  </>
                ),
              },
            ]} />
          </Grid>
        </Grid>
      </Box>


      {/* <DataTableEntidadesComp data={data}/> */}
      {/* <DataTableCompetencia data={data.Competencia}/> */}
      {/* <Button variant="contained" onClick={handleButtonClick}>
        Crear Competencia
      </Button> */}
    </>
  );
}

export default Competencia;
