import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { getPatientByDni, createPatient, updatePatient } from "../../api/enfermeriaRequest";

const defaultValues = {
  cedula: "",
  nombres1: "",
  nombres2: "",
  apellido_paterno: "",
  apellido_materno: "",
  fecha_nacimiento: "",
  nacionalidad: "",
  sexo: "",
  grupo_cultural: "",
  estado_civil: "",
  tipo_sangre: "",
  lugar_nacimiento: "",
  residencia_habitual: "",
  zona: "",
  canton: "",
  parroquia: "",
  barrio: "",
  provincia: "",
  telefono: "",
  instruccion: "",
  ocupacion: "",
  empresa_trabajo: "",
  tipo_seguro_salud: "",
  referido: "",
  persona_emergencia1: "",
  persona_emergencia2: "",
  persona_emergencia3: "",
  persona_emergencia4: "",
};

export default function PatientFormModal({ patientRow, onClose, onSuccess, onError, onLoadError }) {
  const isEdit = !!patientRow;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (!patientRow) {
      reset(defaultValues);
      setLoading(false);
      return;
    }
    const load = async () => {
      const dni = patientRow?.dni ?? patientRow?.cedula;
      if (!dni) {
        reset(defaultValues);
        setLoading(false);
        return;
      }
      try {
        const { data } = await getPatientByDni(String(dni));
        if (data?.patient === "not found" || !data) {
          reset(defaultValues);
          onLoadError?.("Paciente no encontrado");
        } else {
          const nombres = (data.nombres || "").trim().split(" ");
          const nom1 = nombres[0] || "";
          const nom2 = nombres.slice(1).join(" ") || "";
          const dp = data.DatosPaciente || data.datosPaciente || {};
          const dap = data.DatosAdicionalesPaciente || data.datosAdicionalesPaciente || {};
          const dir = data.Direccion || data.direccion || {};
          reset({
            cedula: String(data.cedula ?? dni ?? ""),
            nombres1: nom1,
            nombres2: nom2,
            apellido_paterno: data.apellido_paterno ?? "",
            apellido_materno: data.apellido_materno ?? "",
            fecha_nacimiento: data.fecha_nacimiento ?? "",
            nacionalidad: data.nacionalidad ?? "",
            sexo: data.sexo ?? "",
            grupo_cultural: data.grupo_cultural ?? "",
            estado_civil: data.estado_civil ?? "",
            tipo_sangre: data.tipo_sangre ?? "",
            lugar_nacimiento: data.lugar_nacimiento ?? "",
            residencia_habitual: dp.residencia_habitual ?? dir.residencia_habitual ?? "",
            zona: dp.zona ?? dir.zona ?? "",
            canton: dp.canton ?? dir.canton ?? "",
            parroquia: dp.parroquia ?? dir.parroquia ?? "",
            barrio: dp.barrio ?? dir.barrio ?? "",
            provincia: dp.provincia ?? dir.provincia ?? "",
            telefono: dp.telefono ?? dir.telefono ?? "",
            instruccion: dp.instruccion ?? dap.instruccion ?? "",
            ocupacion: dp.ocupacion ?? dap.ocupacion ?? "",
            empresa_trabajo: dp.empresa_trabajo ?? dap.empresa_trabajo ?? "",
            tipo_seguro_salud: dp.tipo_seguro_salud ?? dap.tipo_seguro_salud ?? "",
            referido: dp.referido ?? dap.referido ?? "",
            persona_emergencia1: dp.persona_emergencia_nombre ?? dap.persona_emergencia_nombre ?? "",
            persona_emergencia2: dp.persona_emergencia_parentesco ?? dap.persona_emergencia_parentesco ?? "",
            persona_emergencia3: dp.persona_emergencia_direccion ?? dap.persona_emergencia_direccion ?? "",
            persona_emergencia4: dp.persona_emergencia_telefono ?? dap.persona_emergencia_telefono ?? "",
          });
        }
      } catch (err) {
        reset(defaultValues);
        onLoadError?.(err?.response?.data?.message || "Error al cargar paciente");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientRow?.dni ?? patientRow?.cedula, patientRow, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updatePatient({
          patientId: patientRow.patientId,
          ...data,
        });
      } else {
        await createPatient(data);
      }
      onSuccess?.();
      onClose?.();
    } catch (e) {
      onError?.(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="cedula"
            control={control}
            rules={{ required: "Requerido" }}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Cédula" fullWidth size="small" required error={!!fieldState.error} helperText={fieldState.error?.message} disabled={isEdit} />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="nombres1" control={control} render={({ field }) => <TextField {...field} label="Primer nombre" fullWidth size="small" disabled={isEdit} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="nombres2" control={control} render={({ field }) => <TextField {...field} label="Segundo nombre" fullWidth size="small" disabled={isEdit} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="apellido_paterno" control={control} render={({ field }) => <TextField {...field} label="Apellido paterno" fullWidth size="small" disabled={isEdit} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="apellido_materno" control={control} render={({ field }) => <TextField {...field} label="Apellido materno" fullWidth size="small" disabled={isEdit} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="fecha_nacimiento"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Fecha nacimiento" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} disabled={isEdit} />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller
            name="sexo"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" disabled={isEdit}>
                <InputLabel>Sexo</InputLabel>
                <Select {...field} label="Sexo">
                  <MenuItem value="">—</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="nacionalidad" control={control} render={({ field }) => <TextField {...field} label="Nacionalidad" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="estado_civil" control={control} render={({ field }) => <TextField {...field} label="Estado civil" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="tipo_sangre" control={control} render={({ field }) => <TextField {...field} label="Tipo sangre" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="lugar_nacimiento" control={control} render={({ field }) => <TextField {...field} label="Lugar nacimiento" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="grupo_cultural" control={control} render={({ field }) => <TextField {...field} label="Grupo cultural" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12}>
          <Controller name="residencia_habitual" control={control} render={({ field }) => <TextField {...field} label="Dirección residencia" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="barrio" control={control} render={({ field }) => <TextField {...field} label="Barrio" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="parroquia" control={control} render={({ field }) => <TextField {...field} label="Parroquia" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="canton" control={control} render={({ field }) => <TextField {...field} label="Cantón" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="provincia" control={control} render={({ field }) => <TextField {...field} label="Provincia" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="zona" control={control} render={({ field }) => <TextField {...field} label="Zona" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="telefono" control={control} render={({ field }) => <TextField {...field} label="Teléfono" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="instruccion" control={control} render={({ field }) => <TextField {...field} label="Instrucción" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="ocupacion" control={control} render={({ field }) => <TextField {...field} label="Ocupación" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="empresa_trabajo" control={control} render={({ field }) => <TextField {...field} label="Empresa trabaja" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="tipo_seguro_salud" control={control} render={({ field }) => <TextField {...field} label="Tipo seguro" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="referido" control={control} render={({ field }) => <TextField {...field} label="Referido" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="persona_emergencia1" control={control} render={({ field }) => <TextField {...field} label="Emergencia: nombre" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="persona_emergencia2" control={control} render={({ field }) => <TextField {...field} label="Parentesco" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="persona_emergencia3" control={control} render={({ field }) => <TextField {...field} label="Dirección emergencia" fullWidth size="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="persona_emergencia4" control={control} render={({ field }) => <TextField {...field} label="Teléfono emergencia" fullWidth size="small" />} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : isEdit ? "Guardar" : "Crear"}
        </Button>
      </Box>
    </Box>
  );
}
