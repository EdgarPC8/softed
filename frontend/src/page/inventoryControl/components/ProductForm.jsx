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
  createProduct,
  updateProduct,
  getCategories,
  getUnits,
} from "../../../api/inventoryControlRequest.js";

function ProductForm({ isEditing = false, datos = [], onClose, reload }) {
  const { handleSubmit, register, reset, setValue, watch } = useForm();

  const idData = datos.id;
  const { toast: toastAuth } = useAuth();
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  const resetForm = () => {
    reset();
  };

  const submitForm = async (formData) => {

    if (isEditing) {
      toastAuth({
        promise: updateProduct(datos.id, formData),
        onSuccess: () => {
          if (onClose) onClose();
          if (reload) reload();
          resetForm();
          return {
            title: "Producto",
            description: "Producto actualizado correctamente",
          };
        },
      });
      return;
    }

    toastAuth({
      promise: createProduct(formData),
      successMessage: "Producto guardado con éxito",
      onSuccess: () => {
        if (onClose) onClose();
        if (reload) reload();
        resetForm();
      },
    });
  };


  const loadData = async () => {
    if (isEditing && datos) {
      setValue("name", datos.name || "");
      setValue("type", datos.type || "raw");
      setValue("unitId", datos.unitId || "");
      setValue("categoryId", datos.categoryId || "");
      setValue("price", datos.price || 0);
      setValue("minStock", datos.minStock || 0);
      setValue("stock", datos.stock || 0);
      setValue("standardWeightGrams", datos.standardWeightGrams || "");
    }
  };

  const fetchOptions = async () => {
    const { data: catData } = await getCategories();
    const { data: unitData } = await getUnits();
    setCategories(catData);
    setUnits(unitData);
  };

  useEffect(() => {
    loadData();
    fetchOptions();
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
            InputLabelProps={idData ? { shrink: true } : {}}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Tipo"
            select
            fullWidth
            variant="standard"
            defaultValue="raw"
            {...register("type", { required: true })}
            InputLabelProps={idData ? { shrink: true } : {}}
          >
            <MenuItem value="raw">Materia Prima</MenuItem>
            <MenuItem value="intermediate">Producto Intermedio</MenuItem>
            <MenuItem value="final">Producto Final</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Unidad"
            select
            fullWidth
            variant="standard"
            value={watch("unitId") || ""}
            {...register("unitId", { required: true })}
            InputLabelProps={idData ? { shrink: true } : {}}
          >
         {Array.isArray(units) && units.map((unit) => (
  <MenuItem key={unit.id} value={unit.id}>
    {unit.name} ({unit.abbreviation})
  </MenuItem>
))}

          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Categoría"
            select
            fullWidth
            variant="standard"
            value={watch("categoryId") || ""}
            {...register("categoryId", { required: true })}
            InputLabelProps={idData ? { shrink: true } : {}}
          >
         {Array.isArray(categories) && categories.map((cat) => (
  <MenuItem key={cat.id} value={cat.id}>
    {cat.name}
  </MenuItem>
))}

          </TextField>
        </Grid>


        <Grid item xs={12}>
          <TextField
            label="Precio"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any" }}
            {...register("price", { required: true })}
            InputLabelProps={idData ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={12}>

<Grid container spacing={2}>
  <Grid item xs={6}>
    <TextField
      label="Stock actual"
      type="number"
      fullWidth
      variant="standard"
      inputProps={{ step: "any" }}
      {...register("stock", { required: true })}
      InputLabelProps={idData ? { shrink: true } : {}}
    />
  </Grid>

  <Grid item xs={6}>
    <TextField
      label="Stock mínimo"
      type="number"
      fullWidth
      variant="standard"
      {...register("minStock", { required: true })}
      InputLabelProps={idData ? { shrink: true } : {}}
    />
  </Grid>
</Grid>
        </Grid>

 
      <Grid item xs={12}>
        <TextField
          label="Peso promedio por unidad (g)"
          type="number"
          fullWidth
          variant="standard"
          inputProps={{ step: "any", min: 0 }}
          {...register("standardWeightGrams", { required: true })}
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

export default ProductForm;
