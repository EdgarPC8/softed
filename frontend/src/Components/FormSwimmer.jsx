import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  Avatar,
  IconButton,
  FormControl,
  Autocomplete,
  InputLabel,
  MenuItem,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { CloudUpload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getInstitutionsRequest } from "../api/institutionRequest";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { getOneSwimmerRequest } from "../api/nadadoresResquest";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function FormSwimmer({ onSubmit }) {
  const [swimmer, setSwimmer] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    grupo: "",
  });

  const [inputValue, setInputValue] = useState("");
  const { dni } = useParams();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [institutions, setInstitutions] = useState([]);

  const submitForm = async (data) => {
    if (dni) {
      setInputValue("");
      onSubmit(dni, data);
      reset();

      return;
    }
    setInputValue("");
    onSubmit(data);
    reset();

    // if (dni) {
    //   console.log("editandod");
    //   return;
    // }
  };

  const loadSwimmer = async () => {
    const { data } = await getOneSwimmerRequest(dni);
    // data.forEach((swimmer) => console.log(swimmer));

    const swimmer = data[0];
    const keys = Object.keys(swimmer);

    keys.forEach((key) => {
      setValue(key, swimmer[key]);
      // console.log(key)
    });
  };

  const fetchInstitutions = async () => {
    const { data } = await getInstitutionsRequest();
    setInstitutions(data);
  };

  useEffect(() => {
    if (dni) {
      loadSwimmer();
    }
  }, []);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <Box
      component="form"
      sx={{ mt: "30px" }}
      onSubmit={handleSubmit(submitForm)}
    >
      {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Avatar sx={{ width: 80, height: 80 }} />
          <IconButton
            tabIndex={-1}
            component="label"
            sx={{ mt: "5px" }}
            role={undefined}
          >
            <CloudUpload />
            <VisuallyHiddenInput type="file" />
          </IconButton>
        </Box> */}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cedula"
            defaultValue=""
            InputLabelProps={{ shrink: true }}
            {...register("cedula", { required: true })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nombres"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("nombres", { required: true })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Apellidos"
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...register("apellidos", { required: true })}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="sex-select">Sexo</InputLabel>
            <Controller
              name="genero"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="sex-select" label="Sexo" {...field}>
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="grupo"
            control={control}
            render={({ field }) => (
              <Autocomplete
                // {...field}
                freeSolo
                options={institutions.map((inst) => ({
                  id: inst.id,
                  nombre: inst.nombre,
                }))}
                getOptionLabel={(inst) => inst.nombre}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Grupo" name="grupo" />
                )}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(event, value, reason) => {
                  // console.log(reason)
                  // Solo enviar el ID del valor seleccionado
                  const selectedId = value ? value.id : null;

                  // console.log("hola")

                  field.onChange(selectedId); // Llama a onChange de field para actualizar el valor
                }}
                inputValue={inputValue}
                value={
                  institutions.find((inst) => inst.id === field.value) || null
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="fecha_nacimiento"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Fecha de nacimiento"
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
  );
}

export default FormSwimmer;
