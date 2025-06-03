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
import {  updateLicense,addLicense,getOneLicense } from "../../api/authRequest";

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
          promise: updateLicense(datos.id, {
            ...data,time:`${data.valorTime}${data.time}`,
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
          promise: addLicense( {
                ...data,
              }),
              successMessage: "Clave guardado con éxito",
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
    const { data } = await getOneLicense(datos.id);
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
            label="Codigo"
            fullWidth
            variant="standard"
            {...register("name", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
       
        <Grid item xs={6}>
          <TextField
            label="Valor"
            fullWidth
            type="number"
            variant="standard"
            {...register("valorTime", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel dni="sex-select">Tiempo</InputLabel>
            <Controller
              name="time"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="sex-select" label="time" {...field}>
                  <MenuItem value="s">Segundos</MenuItem>
                  <MenuItem value="m">Minutos</MenuItem>
                  <MenuItem value="h">Horas</MenuItem>
                  <MenuItem value="d">Dias</MenuItem>
                  <MenuItem value="w">Semanas</MenuItem>
                  <MenuItem value="y">Años</MenuItem>
                </Select>
              )}
            />
          </FormControl>
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
