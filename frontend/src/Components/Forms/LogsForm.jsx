import { Grid, TextField, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

function LogsForm({ isEditing = false, datos = {}, onClose, reload }) {
  const { register, setValue } = useForm();
  const dni = datos?.id;

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  useEffect(() => {
    if (isEditing && datos && Object.keys(datos).length) {
      Object.keys(datos).forEach((key) => {
        const val = key === "date" ? formatDate(datos[key]) : datos[key];
        setValue(key, val ?? "");
      });
    }
  }, [isEditing, datos]);

  return (
    <Box component="form" sx={{ mt: 2, minWidth: 520 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            InputProps={{ readOnly: true }}
            label="Método Http"
            fullWidth
            variant="outlined"
            size="small"
            {...register("httpMethod")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            InputProps={{ readOnly: true }}
            label="Fecha"
            variant="outlined"
            fullWidth
            size="small"
            {...register("date")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            InputProps={{ readOnly: true }}
            label="Acción"
            variant="outlined"
            fullWidth
            size="small"
            {...register("action")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            InputProps={{ readOnly: true }}
            label="Url"
            variant="outlined"
            fullWidth
            size="small"
            {...register("endPoint")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripción"
            InputProps={{ readOnly: true }}
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            maxRows={6}
            size="small"
            sx={{ "& .MuiInputBase-input": { whiteSpace: "pre-wrap" } }}
            {...register("description")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Sistema / User-Agent"
            InputProps={{ readOnly: true }}
            fullWidth
            variant="outlined"
            multiline
            minRows={2}
            maxRows={4}
            size="small"
            sx={{ "& .MuiInputBase-input": { whiteSpace: "pre-wrap", wordBreak: "break-word" } }}
            {...register("system")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LogsForm;
