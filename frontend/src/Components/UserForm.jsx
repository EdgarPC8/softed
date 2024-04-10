import { CloudUpload, Save } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Box,
  Button,
  InputLabel,
  Avatar,
  IconButton,
  FormControl,
  Select,
  ButtonGroup,
  MenuItem,
} from "@mui/material";
import { VisuallyHiddenInput } from "./VisuallyHiddenInput";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addUserPhotoRequest,
  getOneUserRequest,
  updateUserPhotoRequest,
} from "../api/userRequest";
import toast from "react-hot-toast";
import { pathPhotos } from "../api/axios";

function UserForm({ onSubmit }) {
  const [inputValue, setInputValue] = useState("");
  const { handleSubmit, register, reset, setValue, control } = useForm();
  const [photo, setPhoto] = useState("");
  const [user, setUser] = useState({});
  const { dni } = useParams();

  const resetForm = () => {
    setInputValue("");
    setPhoto("");
    reset();
  };

  const sendPhotoToUpdate = async () => {
    const formData = new FormData();
    formData.append("_method", "put"); // Agrega este campo para simular una solicitud PUT
    formData.append("photo", photo);

    toast.promise(
      updateUserPhotoRequest(dni, formData),
      {
        loading: "Editando...",
        success: "Usuario editado con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
  };

  const submitForm = (values) => {
    if (dni) {
      onSubmit(dni, values);
      resetForm();

      return;
    }

    onSubmit(values);
    resetForm();
  };

  const loadUser = async () => {
    const { data } = await getOneUserRequest(dni);
    setUser(data[0]);
    console.log(data[0]);

    // data.forEach((swimmer) => console.log(swimmer));

    const users = data[0];
    const keys = Object.keys(users);

    keys.forEach((key) => {
      setValue(key, users[key]);
      // console.log(key)
    });
  };

  const handlePhotoChange = ({ target }) => {
    setPhoto(target.files[0]);
  };

  useEffect(() => {
    if (dni) {
      loadUser();
    }
  }, []);

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
      {dni && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{ width: 80, height: 80 }}
            src={
              photo ? URL.createObjectURL(photo) : `${pathPhotos}/${user?.foto}`
            }
          />

          {dni && (
            <ButtonGroup sx={{ mt: 2 }}>
              <Button
                variant="text"
                tabIndex={-1}
                component="label"
                role={undefined}
              >
                Editar foto
                <VisuallyHiddenInput
                  type="file"
                  onChange={({ target }) => {
                    setPhoto(target.files[0]);
                  }}
                />
              </Button>
              {photo && (
                <Button variant="text" onClick={sendPhotoToUpdate}>
                  Guardar
                </Button>
              )}
            </ButtonGroup>
          )}

          {/* {!dni && (
          <ButtonGroup sx={{ mt: 2 }}>
            <Button
              variant="text"
              tabIndex={-1}
              component="label"
              role={undefined}
            >
              Cargar foto
              <VisuallyHiddenInput
                type="file"
                onChange={({ target }) => {
                  setPhoto(target.files[0]);
                }}
              />
            </Button>
          </ButtonGroup>
        )} */}
        </Box>
      )}
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <TextField
            label="Cedula"
            fullWidth
            variant="standard"
            {...register("cedula", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer nombre"
            fullWidth
            variant="standard"
            {...register("primer_nombre", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo nombre"
            variant="standard"
            fullWidth
            {...register("segundo_nombre", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer apellido"
            variant="standard"
            fullWidth
            {...register("primer_apellido", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo apellido"
            variant="standard"
            fullWidth
            {...register("segundo_apellido", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel dni="sex-select">Sexo</InputLabel>
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
        <Grid item xs={4}>
          <Button variant="contained" fullWidth type="submit">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserForm;
