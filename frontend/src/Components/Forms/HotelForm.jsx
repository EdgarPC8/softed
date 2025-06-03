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
import {
  addHotel,
  getOneHotel,
  updateHotel
} from "../../api/hotelRequest";

function HotelForm({isEditing = false,datos = [], reload}) {
  const [inputValue, setInputValue] = useState("");
  const { handleSubmit, register, reset, setValue, control } = useForm();

  const dni=datos.id;
  const resetForm = () => {
    // setInputValue("");
    // reset();
  };

  const submitForm = (data) => {
      if (isEditing) {

        toast.promise(
          updateHotel(datos.id, data),
          {
            loading: "Editando...",
              success: "Hotel editado con éxito",
            error: "Ocurrio un error",
          },
          {
            position: "top-right",
            style: {
              fontFamily: "roboto",
            },
          }
        );
      }else{
        toast.promise(
          addHotel(data),
          {
            loading: "Guardando...",
            success: "Hotel guardando con éxito",
            error: "Ocurrio un error",
          },
          {
            position: "top-right",
            style: {
              fontFamily: "roboto",
            },
          }
        );

      }

//  resetForm();
if (reload) reload([data]); 



  };

  const loadUser = async () => {
    if (isEditing) {
    const { data } = await getOneHotel(datos.id);
    // console.log(data)
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
            label="Nombre"
            fullWidth
            variant="standard"
            {...register("name", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Ubicacion"
            fullWidth
            variant="standard"
            {...register("ubication", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripcion"
            fullWidth
            variant="standard"
            {...register("description", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Telf/Cel"
            fullWidth
            variant="standard"
            {...register("phone", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Correo"
            variant="standard"
            fullWidth
            {...register("email", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel dni="sex-select">Tipo de Moneda</InputLabel>
            <Controller
              name="typeCoin"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="sex-select" label="Moneda" {...field}>
                  <MenuItem value="$">Dolar</MenuItem>
                  <MenuItem value="Peso">Peso</MenuItem>
                  <MenuItem value="Soles">Soles</MenuItem>
                  <MenuItem value="Euro">Euro</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
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

export default HotelForm;
