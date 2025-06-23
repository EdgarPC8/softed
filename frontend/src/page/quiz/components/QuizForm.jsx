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
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { createQuiz, editQuiz } from "../../../api/quizRequest";

function QuizForm({ isEditing = false, datos = [], onClose, reload }) {
  const [inputValue, setInputValue] = useState("");
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm();
  const idData = datos.id;
  const { toast: toastAuth } = useAuth();

  const resetForm = () => {
    setInputValue("");
    reset();
  };

  const submitForm = async (formData) => {
    const payload = {
      ...formData,
      date: formData.date ? formData.date.split("T")[0] : null,
      isPublic: formData.isPublic === "true",
      maxAttempts: parseInt(formData.maxAttempts) || 1,
    };

    if (isEditing) {
      toastAuth({
        promise: editQuiz(datos.id, payload),
        onSuccess: () => {
          if (onClose) onClose();
          if (reload) reload();
          resetForm();
          return {
            title: "Cuestionario",
            description: "Editado con éxito"
          };
        }
      });
      return;
    }

    toastAuth({
      promise: createQuiz(payload),
      successMessage: "Cuestionario guardado con éxito",
      onSuccess: () => {
        if (onClose) onClose();
        if (reload) reload();
        resetForm();
      }
    });
  };

  const loadData = async () => {
    if (isEditing && datos) {
      setValue("title", datos.title || "");
      setValue("description", datos.description || "");
      setValue("date", datos.date || null);
      setValue("isPublic", datos.isPublic ? "true" : "false");
      setValue("maxAttempts", datos.maxAttempts || "1");
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
            {...register("title", { required: "Título requerido" })}
            error={!!errors.title}
            helperText={errors.title?.message}
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
            {...register("description", { required: "Descripción requerida" })}
            error={!!errors.description}
            helperText={errors.description?.message}
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
                  <FormControlLabel value="true" control={<Radio />} label="Sí" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Intentos máximos"
            fullWidth
            type="number"
            variant="standard"
            {...register("maxAttempts", {
              required: "Este campo es obligatorio",
              min: { value: 1, message: "Debe permitir al menos 1 intento" }
            })}
            error={!!errors.maxAttempts}
            helperText={errors.maxAttempts?.message}
            InputLabelProps={idData ? { shrink: true } : {}}
          />
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

export default QuizForm;
