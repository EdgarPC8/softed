import {
    Grid,
    TextField,
    Box,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    FormControl
  } from "@mui/material";
  
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import dayjs from "dayjs";
  import { useForm, Controller } from "react-hook-form";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import toast from "react-hot-toast";
  import { useAuth } from "../../../context/AuthContext";
import { createForm,editForm } from "../../../api/formsRequest";

  
  function FormForm({ isEditing = false, datos = [], onClose, reload }) {
    const [inputValue, setInputValue] = useState("");
    const { handleSubmit, register, reset, setValue, control } = useForm();
    const [data, setData] = useState({});
    const idData = datos.id;
    const { toast } = useAuth();
  
    const peticion = async () => {
      // Lógica de petición aquí
    };
  
    const resetForm = () => {
      setInputValue("");
      reset();
    };
  
    const submitForm = async (formData) => {
      // Lógica de envío de datos aquí
      if (isEditing) {
        toast({
          promise: editForm(datos.id, {
            ...formData,
            date: formData.date.split("T")[0],
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
        return
      }

        toast({
          promise: createForm( {
                ...formData,
                date: formData.date.split("T")[0],
              }),
              successMessage: "Formulario guardado con éxito",
              onSuccess: (data) => {
                if (onClose) onClose(); 
                if (reload) reload(); 
                resetForm();
                console.log(data);
              }

        });
    }
  
    const loadData = async () => {
      // Si estás en modo edición, podrías cargar datos existentes
      if (isEditing && datos) {
        setValue("title", datos.title || "");
        setValue("description", datos.description || "");
        setValue("date", datos.date || null);
        setValue("isPublic", datos.isPublic ? "true" : "false");
      }
    };
  
    useEffect(() => {
      loadData();
    }, []);
  
    return (
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
        <Grid spacing={2} container>
          <Grid item xs={12}>
            <TextField
              label="Titulo"
              fullWidth
              variant="standard"
              {...register("title", { required: true })}
              InputLabelProps={idData ? { shrink: true } : {}}
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={4}
              variant="standard"
              {...register("description", { required: true })}
              InputLabelProps={idData ? { shrink: true } : {}}
            />
          </Grid>
  
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toISOString() || null)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
  
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">¿Es público?</FormLabel>
              <Controller
                name="isPublic"
                control={control}
                defaultValue="false"
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Sí"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
  
          <Grid item xs={4}>
            <Button variant="contained" fullWidth type="submit">
              {!isEditing ? "Guardar" : "Editar"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  export default FormForm;
  