import {
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect,useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { registerMovement } from "../../../api/inventoryControlRequest";
import SimulateProductionComponent from "./SimulateProduction.jsx";

function MovementForm({ onClose, productOptions = [], onSaved }) {
  const { handleSubmit, register, reset, setValue, watch } = useForm();
  const { toast: toastAuth } = useAuth();
const [simulatedData, setSimulatedData] = useState(null);

  const selectedProductId = watch("productId");
  const selectedType = watch("type");
  const selectedQuantity = watch("quantity");

  const submitForm = async (formData) => {

     const dataToSend = {
    ...formData,
    simulated: simulatedData, // 👈 incluir receta con insumos
  };
    toastAuth({
      promise: registerMovement(dataToSend),
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

  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = productOptions.find(p => p.id === Number(selectedProductId));
      if (selectedProduct?.price) {
        setValue("unitPrice", selectedProduct.price);
      }
    }
  }, [selectedProductId, productOptions, setValue]);

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
          </TextField>
        </Grid>

        {/* 👉 Cantidad y Precio en una misma fila */}
        <Grid item xs={6}>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any", min: 0 }}
            {...register("quantity", { required: true })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Precio Unitario"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any", min: 0 }}
            {...register("price")}
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

        {/* ✅ Mostrar simulación solo si es producción
        {selectedType === "produccion" && selectedProductId && selectedQuantity > 0 && (
          <Grid item xs={12}>
            <SimulateProductionComponent
              productId={selectedProductId}
              quantity={selectedQuantity}
              onSimulated={(data) => setSimulatedData(data)} 
            />
          </Grid>
        )} */}

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
