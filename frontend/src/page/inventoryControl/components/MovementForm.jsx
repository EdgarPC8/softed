import {
    Grid,
    TextField,
    Box,
    Button,
    MenuItem,
  } from "@mui/material";
  import { useForm } from "react-hook-form";
  import { useEffect } from "react";
  import { useAuth } from "../../../context/AuthContext";
  import { registerMovement } from "../../../api/inventoryControlRequest";
  
  function MovementForm({ onClose, productOptions = [], onSaved }) {
    const { handleSubmit, register, reset, setValue, watch } = useForm();
    const { toast: toastAuth } = useAuth();
  
    const submitForm = async (formData) => {
      toastAuth({
        promise: registerMovement(formData),
        successMessage: "Movimiento registrado con éxito",
        onSuccess: () => {
          if (onClose) onClose();
          if (onSaved) onSaved(formData.productId);
          reset();
        },
      });
    };
  
    useEffect(() => {
      if (productOptions.length > 0) {
        setValue("productId", productOptions[0].id);
      }
    }, [productOptions, setValue]);
  
    return (
      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Producto"
              select
              fullWidth
              variant="standard"
              value={watch("productId") || ""}
              {...register("productId", { required: true })}
            >
              {productOptions.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>
                  {prod.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              label="Tipo de Movimiento"
              select
              fullWidth
              variant="standard"
              value={watch("type") || ""}
              {...register("type", { required: true })}
            >
              <MenuItem value="entrada">Entrada</MenuItem>
              <MenuItem value="salida">Salida</MenuItem>
              <MenuItem value="ajuste">Ajuste</MenuItem>
              <MenuItem value="produccion">Producción</MenuItem>
            </TextField>
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              variant="standard"
              inputProps={{ step: "any" }}
              {...register("quantity", { required: true })}
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              variant="standard"
              multiline
              rows={3}
              {...register("description")}
            />
          </Grid>
  
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit">
              Registrar Movimiento
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  export default MovementForm;
  