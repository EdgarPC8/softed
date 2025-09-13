import { useForm } from "react-hook-form";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect } from "react";
import { createIncomeRequest, updateIncomeRequest, createExpenseRequest, updateExpenseRequest } from "../../../api/financeRequest";
import { useAuth } from "../../../context/AuthContext";

const categories = {
  income: ["Venta", "Donación","Carrera","Servicio", "Otro"],
  expense: ["Pago de servicios", "Compra de insumos", "Honorarios","Pago Empleados", "Otro"],
};

const FinanceForm = ({ type = "income", data = null, onClose, onSaved }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useAuth();

  const isEditing = !!data;

  useEffect(() => {
    if (data) {
      setValue("date", data.date || "");
      setValue("concept", data.concept || "");
      setValue("category", data.category || "");
      setValue("amount", data.amount || "");
    } else {
      const today = new Date().toISOString().split("T")[0];
      setValue("date", today);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const requestFn = isEditing
      ? type === "income"
        ? updateIncomeRequest
        : updateExpenseRequest
      : type === "income"
        ? createIncomeRequest
        : createExpenseRequest;

    toast({
      promise: requestFn(isEditing ? data.id : formData),
      loadingMessage: isEditing ? "Actualizando..." : "Guardando...",
      successMessage: isEditing ? "Actualizado correctamente" : "Registrado correctamente",
      errorMessage: "Hubo un error",
      onSuccess: () => {
        if (onClose) onClose();
        if (onSaved) onSaved();
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("date", { required: true })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Monto"
            type="number"
            fullWidth
            inputProps={{ step: "0.01", min: "0" }}
            {...register("amount", { required: true })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Concepto"
            fullWidth
            {...register("concept", { required: true })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            label="Categoría"
            fullWidth
            {...register("category", { required: true })}
          >
            {categories[type].map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} color="inherit" sx={{ mr: 2 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color={type === "income" ? "success" : "error"}>
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FinanceForm;
