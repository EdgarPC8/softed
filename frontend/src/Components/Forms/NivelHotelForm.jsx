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
  addNivel,
  getNivel,
  getOneNivel,
  updateNivel,
} from "../../api/nivelHotelRequest";
import toast from "react-hot-toast";
import {
  addHotel,
  getOneHotel,
  updateHotel
} from "../../api/hotelRequest";

function NivelHotelForm({isEditing = false,datos = [], onClose,fecth}) {
  const [inputValue, setInputValue] = useState("");
  const { handleSubmit, register, reset, setValue, control } = useForm();

  const dni=datos.id;
  const resetForm = () => {
    setInputValue("");
    reset();
  };

  const submitForm = async(data) => {
      if (isEditing) {

        //     const newRows=rows.filter(row => row.id !== data.id);
        toast.promise(
          updateNivel(datos.id, data),
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
        // if (reloadTable) reloadTable(valor.data) ; 
        toast.promise(
          addNivel(data),
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
      setTimeout(async() => {
        if (fecth) fecth() ; 
      }, 200);

 resetForm();
 if (onClose) onClose(); 
  };

 
  const loadUser = async () => {
    if (isEditing) {
    const { data } = await getOneNivel(datos.id);
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
            label="Descripcion"
            fullWidth
            variant="standard"
            {...register("description", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
          type={"number"}
            label="Orden"
            fullWidth
            variant="standard"
            {...register("orden", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
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

export default NivelHotelForm;
