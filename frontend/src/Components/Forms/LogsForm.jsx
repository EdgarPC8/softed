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
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
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
              successMessage: "Usuario editado con éxito",
              onSuccess: (data) => {
                if (onClose) onClose(); 
                if (reload) reload(); 
                resetForm();
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
    // const { data } = await getOneUserRequest(datos.id);
    // const users = data;
    const keys = Object.keys(datos);
    keys.forEach((key) => {
      setValue(key, datos[key]);
    });

    }

  };
 

  useEffect(() => {
      loadUser();
  }, []);
  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
      <Grid spacing={2} container>
    
        <Grid item xs={6}>
          <TextField
            InputProps={{ readOnly: true }} 
            label="Metodo Http"
            fullWidth
            variant="standard"
            {...register("httpMethod", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            InputProps={{ readOnly: true }} 
            label="Fecha"
            variant="standard"
            fullWidth
            {...register("date", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            InputProps={{ readOnly: true }} 
            label="Accion"
            variant="standard"
            fullWidth
            {...register("action", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            InputProps={{ readOnly: true }} 
            label="Url"
            variant="standard"
            fullWidth
            {...register("endPoint", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripcion"
            InputProps={{ readOnly: true }} 
            fullWidth
            variant="standard"
            {...register("description", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Sistema OP"
            InputProps={{ readOnly: true }} 
            fullWidth
            variant="standard"
            {...register("system", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <Button variant="contained" fullWidth type="submit">
            {!isEditing?'Guardar':'Editar'}
          </Button>
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default UserForm;
