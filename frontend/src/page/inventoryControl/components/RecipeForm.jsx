import {
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getAllProducts,
  createRecipeRequest,
  updateRecipeRequest,
} from "../../../api/inventoryControlRequest";

function RecipeForm({ isEditing = false, datos = [], onClose, reload, productFinalId }) {
  const { handleSubmit, register, reset, setValue, watch } = useForm();
  const idData = datos?.id;
  const { toast: toastAuth } = useAuth();
  const [rawOptions, setRawOptions] = useState([]);

  const resetForm = () => {
    reset();
  };

  const submitForm = async (formData) => {
    const body = { ...formData, productFinalId };

    if (isEditing) {
      toastAuth({
        promise: updateRecipeRequest(datos.id, body),
        onSuccess: () => {
          if (onClose) onClose();
          if (reload) reload();
          resetForm();
          return {
            title: "Receta",
            description: "Insumo actualizado correctamente",
          };
        },
      });
      return;
    }

    toastAuth({
      promise: createRecipeRequest([body]),
      successMessage: "Insumo agregado a la receta con éxito",
      onSuccess: () => {
        if (onClose) onClose();
        if (reload) reload();
        resetForm();
      },
    });
  };

  const loadData = async () => {
    const { data } = await getAllProducts();
    setRawOptions(data.filter((p) => p.id !== productFinalId));


    if (isEditing && datos) {
      setValue("productRawId", datos.productRawId);
      setValue("quantity", datos.quantity);
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
            label="Materia Prima"
            select
            fullWidth
            variant="standard"
            value={watch("productRawId") || ""}
            {...register("productRawId", { required: true })}
            InputLabelProps={idData ? { shrink: true } : {}}
          >
            {rawOptions.map((opt) => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any", min: 0 }}
            {...register("quantity", { required: true })}
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

export default RecipeForm;
