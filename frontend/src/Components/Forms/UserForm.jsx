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
// import { VisuallyHiddenInput } from "./VisuallyHiddenInput";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addUserRequest,
  getOneUserRequest,
  updateUserRequest,
} from "../../api/userRequest";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";


function UserForm({isEditing = false,datos = [], onClose,reload}) {
  const [inputValue, setInputValue] = useState("");
  const { handleSubmit, register, reset, setValue, control } = useForm();
  const [user, setUser] = useState({});
  const dni=datos.id;
  const { toast} = useAuth();

  const peticion = async() => {
    // const promise =await ; // Crear la promesa

    
  };
  const resetForm = () => {
    setInputValue("");
    reset();
  };

  const submitForm = (data) => {
      if (isEditing) {
        toast({
          promise: updateUserRequest(datos.id, {
            ...data,
            birthday: data.birthday.split("T")[0],
          }),
          // successMessage: "Usuario editado con funciona este ",
          onSuccess: (data) => {
            // Sobrescribir el título y descripción
            if (onClose) onClose(); 
            if (reload) reload(); 
            resetForm();
            // Retornar los atributos personalizados del toast
            return {
              title: "Formación académica",
              description: "Usuario editado con éxito"
            };
          }
        });
        
      }else{
        toast({
          promise: addUserRequest( {
                ...data,
                birthday: data.birthday.split("T")[0],
              }),
              successMessage: "Usuario guardado con éxito",
              onSuccess: (data) => {
                if (onClose) onClose(); 
                if (reload) reload(); 
                resetForm();
              }
        });

      }
  };

  const loadUser = async () => {
    if (isEditing) {
    const { data } = await getOneUserRequest(datos.id);
    const users = data;
    const keys = Object.keys(users);
    keys.forEach((key) => {
      setValue(key, users[key]);
    });

    }

  };
 

  useEffect(() => {
      loadUser();
  }, []);
  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <TextField
            label="Cedula"
            fullWidth
            variant="standard"
            {...register("ci", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer nombre"
            fullWidth
            variant="standard"
            {...register("firstName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo nombre"
            variant="standard"
            fullWidth
            {...register("secondName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer apellido"
            variant="standard"
            fullWidth
            {...register("firstLastName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo apellido"
            variant="standard"
            fullWidth
            {...register("secondLastName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel dni="sex-select">Sexo</InputLabel>
            <Controller
              name="gender"
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
              name="birthday"
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
            {!isEditing?'Guardar':'Editar'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserForm;
