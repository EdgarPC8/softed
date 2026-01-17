import {
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { registerMovement } from "../../../api/inventoryControlRequest";
import SimulateProductionComponent from "./SimulateProduction.jsx";
import SearchableSelect from "../../../Components/SearchableSelect.jsx";

function normalizeAbbr(abbr) {
  return String(abbr || "").trim().toLowerCase();
}

// Detecta si la unidad es "unidad" (un, u, und, unidad, pcs, etc.)
function isUnitBasedByAbbr(abbr) {
  const a = normalizeAbbr(abbr);
  return ["un", "u", "und", "unidad", "unit", "units", "pc", "pcs"].includes(a);
}

// Detecta si es basado en gramos/kilos (g, gr, kg)
function isGramBasedByAbbr(abbr) {
  const a = normalizeAbbr(abbr);
  return ["g", "gr", "gram", "grams", "kg", "kilo", "kilos"].includes(a);
}

function MovementForm({ onClose, productOptions = [], onSaved }) {
  const { handleSubmit, register, reset, setValue, watch } = useForm({
    defaultValues: {
      productId: "",
      type: "entrada",
      reason: "", // ✅ obligatorio ahora
      quantity: "",
      price: "",
      description: "",
      referenceType: "",
      referenceId: "",
      pricingRuleMode: "auto", // ✅ NUEVO: auto | invert
    },
  });

  const { toast: toastAuth } = useAuth();
  const [simulatedData, setSimulatedData] = useState(null);

  const selectedProductId = watch("productId");
  const selectedType = watch("type");
  const selectedReason = watch("reason");
  const pricingRuleMode = watch("pricingRuleMode"); // auto | invert

  const quantityValue = Number(watch("quantity") || 0);
  const priceInputValue = watch("price") === "" ? null : Number(watch("price"));

  const productById = useMemo(() => {
    const map = new Map();
    (productOptions || []).forEach((p) => map.set(Number(p.id), p));
    return map;
  }, [productOptions]);

  const selectedProduct = useMemo(() => {
    const pid = Number(selectedProductId);
    if (!pid) return null;
    return productById.get(pid) || null;
  }, [selectedProductId, productById]);

  // ✅ IMPORTANTE:
  // Ajusta estos accesos si tu include llega con otro nombre.
  const unitAbbr =
    selectedProduct?.unit?.abbreviation ||
    selectedProduct?.InventoryUnit?.abbreviation ||
    selectedProduct?.ERP_inventory_unit?.abbreviation ||
    "";

  const quantityLabel = unitAbbr ? `Cantidad (${unitAbbr})` : "Cantidad";

  const reasonOptionsByType = {
    entrada: [
      { value: "ENTRADA_COMPRA", label: "Entrada por compra" },
      { value: "ENTRADA_DEVOLUCION", label: "Entrada por devolución" },
      { value: "ENTRADA_OTRA", label: "Otra entrada" },
    ],
    salida: [
      { value: "SALIDA_VENTA", label: "Salida por venta" },
      { value: "SALIDA_CONSUMO", label: "Salida por consumo/uso interno" },
      { value: "SALIDA_MERMA", label: "Salida por merma/daño" },
      { value: "SALIDA_OTRA", label: "Otra salida" },
    ],
    ajuste: [{ value: "AJUSTE_INVENTARIO", label: "Ajuste de inventario" }],
    produccion: [
      { value: "PRODUCCION_FINAL", label: "Producción (producto final)" },
      { value: "PRODUCCION_INTERMEDIA", label: "Producción (intermedio)" },
    ],
  };

  // ✅ setea producto inicial si hay opciones
  useEffect(() => {
    if ((productOptions || []).length > 0) {
      const firstId = String(productOptions[0].id);
      setValue("productId", firstId, { shouldValidate: true, shouldDirty: false });
    }
  }, [productOptions, setValue]);

  // ✅ si cambia tipo y reason está vacío, poner uno por defecto
  useEffect(() => {
    if (!selectedReason) {
      if (selectedType === "entrada") setValue("reason", "ENTRADA_COMPRA");
      if (selectedType === "salida") setValue("reason", "SALIDA_CONSUMO");
      if (selectedType === "ajuste") setValue("reason", "AJUSTE_INVENTARIO");
      if (selectedType === "produccion") setValue("reason", "PRODUCCION_FINAL");
    }
  }, [selectedType, selectedReason, setValue]);

  // ✅ si cambia tipo/producto/cantidad, resetea simulación cuando no aplique
  useEffect(() => {
    if (selectedType !== "produccion") {
      setSimulatedData(null);
      return;
    }
    if (!selectedProductId || quantityValue <= 0) {
      setSimulatedData(null);
    }
  }, [selectedType, selectedProductId, quantityValue]);

  /**
   * ✅ REGLA:
   * - Si abreviación es "un" => por defecto MULTIPLICA (qty * price)
   * - Si abreviación es gramos/kg => por defecto NO multiplica (price tal cual)
   * - Radio "invert" invierte la regla
   */
  const baseShouldMultiply = useMemo(() => {
    if (!unitAbbr) return false;

    // Si es unidad -> multiplica
    if (isUnitBasedByAbbr(unitAbbr)) return true;

    // Si es gramos/kg -> NO multiplica
    if (isGramBasedByAbbr(unitAbbr)) return false;

    // Si es otra unidad rara, por seguridad NO multiplica
    return false;
  }, [unitAbbr]);

  const shouldMultiply = useMemo(() => {
    if (pricingRuleMode === "invert") return !baseShouldMultiply;
    return baseShouldMultiply;
  }, [pricingRuleMode, baseShouldMultiply]);

  // ✅ Total a guardar en BD (para compras y para mostrar confirmación)
  const totalToSave = useMemo(() => {
    if (priceInputValue == null || Number.isNaN(priceInputValue)) return null;

    if (shouldMultiply) {
      const qty = Number(quantityValue || 0);
      if (!qty || Number.isNaN(qty)) return null;
      return qty * priceInputValue;
    }

    return priceInputValue;
  }, [priceInputValue, quantityValue, shouldMultiply]);

  const priceLabel = useMemo(() => {
    // Si multiplica => el input es "precio unitario"
    // Si NO multiplica => el input es "precio total"
    if (selectedType === "entrada" && selectedReason === "ENTRADA_COMPRA") {
      return shouldMultiply ? "Precio Unitario" : "Precio Total (lo que pagaste)";
    }
    return shouldMultiply ? "Precio Unitario" : "Precio";
  }, [selectedType, selectedReason, shouldMultiply]);

  const ruleText = useMemo(() => {
    const u = unitAbbr ? `(${unitAbbr})` : "";
    if (shouldMultiply) return `Regla aplicada: TOTAL = Cantidad ${u} × Precio.`;
    return `Regla aplicada: TOTAL = Precio (sin multiplicar).`;
  }, [shouldMultiply, unitAbbr]);

  const submitForm = async (formData) => {
    // ✅ Siempre guardamos "price" como TOTAL calculado/confirmado
    // (así tus finanzas y movimientos quedan consistentes)
    const dataToSend = {
      productId: Number(formData.productId),
      type: formData.type,
      reason: formData.reason,
      quantity: Number(formData.quantity),
      description: formData.description || null,

      // ✅ TOTAL confirmado
      price: totalToSave == null ? null : Number(totalToSave),

      referenceType: formData.referenceType || null,
      referenceId: formData.referenceId ? Number(formData.referenceId) : null,

      simulated: simulatedData,
    };

    toastAuth({
      promise: registerMovement(dataToSend),
      successMessage: "Movimiento registrado con éxito",
      onSuccess: () => {
        if (onClose) onClose();
        if (onSaved) onSaved(Number(formData.productId));
        reset();
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchableSelect
            label="Producto"
            items={productOptions}
            value={selectedProductId || ""}
            onChange={(val) => {
              const nextId =
                val && typeof val === "object"
                  ? String(val.id ?? "")
                  : String(val ?? "");
              setValue("productId", nextId, { shouldValidate: true, shouldDirty: true });

              // al cambiar producto, también reinicio modo de regla en auto
              setValue("pricingRuleMode", "auto", { shouldDirty: true });
            }}
            getOptionLabel={(opt) => opt?.name ?? ""}
            getOptionValue={(opt) => opt?.id ?? ""}
            placeholder="Busca un producto..."
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Tipo de Movimiento"
            select
            fullWidth
            variant="standard"
            value={selectedType || ""}
            {...register("type", { required: true })}
          >
            <MenuItem value="entrada">Entrada</MenuItem>
            <MenuItem value="salida">Salida</MenuItem>
            <MenuItem value="ajuste">Ajuste</MenuItem>
            <MenuItem value="produccion">Producción</MenuItem>
          </TextField>
        </Grid>

        {/* ✅ Reason */}
        <Grid item xs={12}>
          <TextField
            label="Motivo (reason)"
            select
            fullWidth
            variant="standard"
            value={selectedReason || ""}
            {...register("reason", { required: true })}
            onChange={(e) => setValue("reason", e.target.value, { shouldDirty: true })}
          >
            {(reasonOptionsByType[selectedType] || []).map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* ✅ Radio: Auto / Invertir */}
        <Grid item xs={12}>
          <FormControl>
            <FormLabel>Regla de precio</FormLabel>
            <RadioGroup
              row
              value={pricingRuleMode}
              onChange={(e) =>
                setValue("pricingRuleMode", e.target.value, { shouldDirty: true })
              }
            >
              <FormControlLabel
                value="auto"
                control={<Radio />}
                label="Auto (según unidad)"
              />
              <FormControlLabel
                value="invert"
                control={<Radio />}
                label="Invertir regla"
              />
            </RadioGroup>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {ruleText}
            </Typography>
          </FormControl>
        </Grid>

        {/* Cantidad y Precio */}
        <Grid item xs={6}>
          <TextField
            label={quantityLabel}
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any", min: 0 }}
            value={watch("quantity") || ""}
            {...register("quantity", { required: true })}
            onChange={(e) => setValue("quantity", e.target.value, { shouldDirty: true })}
            helperText={
              unitAbbr
                ? `Ingresa la cantidad en ${unitAbbr}.`
                : "Ingresa la cantidad según la unidad del producto."
            }
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label={priceLabel}
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any", min: 0 }}
            value={watch("price") || ""}
            {...register("price")}
            onChange={(e) => setValue("price", e.target.value, { shouldDirty: true })}
            helperText={
              shouldMultiply
                ? "Este precio se interpreta como UNITARIO."
                : "Este precio se interpreta como TOTAL."
            }
          />
        </Grid>

        {/* ✅ Confirmación del TOTAL a guardar */}
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ p: 1.2, borderRadius: 1, bgcolor: "action.hover" }}>
            <Typography variant="subtitle2">
              Confirmación (se guardará en BD)
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <b>Unidad:</b> {unitAbbr || "—"}{" "}
              <b style={{ marginLeft: 12 }}>Cantidad:</b>{" "}
              {quantityValue ? quantityValue : "—"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <b>Precio ingresado:</b>{" "}
              {priceInputValue == null || Number.isNaN(priceInputValue) ? "—" : priceInputValue}
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.8 }}>
              <b>TOTAL a guardar:</b>{" "}
              {totalToSave == null || Number.isNaN(totalToSave)
                ? "—"
                : totalToSave.toFixed(2)}
            </Typography>
          </Box>
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

        {/* ✅ Simulación SOLO si es producción */}
        {selectedType === "produccion" &&
          selectedProductId &&
          Number(selectedProductId) > 0 &&
          quantityValue > 0 && (
            <Grid item xs={12}>
              <SimulateProductionComponent
                productId={Number(selectedProductId)}
                quantity={quantityValue}
                onSimulated={(data) => setSimulatedData(data)}
              />
            </Grid>
          )}

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={
              !selectedProductId ||
              !selectedType ||
              !selectedReason ||
              !quantityValue ||
              totalToSave == null
            }
          >
            Registrar Movimiento
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MovementForm;
