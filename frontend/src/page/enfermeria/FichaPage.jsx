import { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Button,
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  Skeleton,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  getPatientByDni,
  getInstitutions,
  getMedicalRecord,
  getCompletedMedicalRecord,
  saveMedicalRecord,
  updateMedicalRecord,
  searchPatient,
  createPatient,
} from "../../api/enfermeriaRequest";
import { ArrowBack, Save, Assignment, NoteAdd, UnfoldMore, UnfoldLess, PersonAdd, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import SearchableSelect from "../../Components/SearchableSelect";

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
  edad: "",
  fecha_medicion: dayjs().format("YYYY-MM-DD"),
  temperatura: "",
  presion_sistolica: "",
  presion_diastolica: "",
  presion_arterial: "",
  pulso: "",
  frec_respiratoria: "",
  talla: "",
  peso: "",
  anios: "",
  menarquia: "",
  fum: "",
  ciclo_menstrual: "",
  gesta: "",
  partos: 0,
  abortos: 0,
  parejas_sexuales: 0,
  motivo_consulta: "",
  enfermedad_problema: "",
  antecedentes_personales: "",
  antecedentes_familiares: "",
  af_cardiopatia: false,
  af_diabetes: false,
  af_enfer_c_vascular: false,
  af_hipertension: false,
  af_cancer: false,
  af_tuberculosis: false,
  af_enfer_mental: false,
  af_enfer_infecciosa: false,
  af_otro: false,
  af_sin_antecedente: false,
  revision_organos_sistemas: "",
  revision_ros_1: "",
  revision_ros_2: "",
  revision_ros_3: "",
  revision_ros_4: "",
  revision_ros_5: "",
  revision_ros_6: "",
  revision_ros_7: "",
  revision_ros_8: "",
  revision_ros_9: "",
  revision_ros_10: "",
  revision_desc_1: "",
  revision_desc_2: "",
  revision_desc_3: "",
  revision_desc_4: "",
  revision_desc_5: "",
  revision_desc_6: "",
  revision_desc_7: "",
  revision_desc_8: "",
  revision_desc_9: "",
  revision_desc_10: "",
  examen_fisico: "",
  examen_reg_1: "",
  examen_reg_2: "",
  examen_reg_3: "",
  examen_reg_4: "",
  examen_reg_5: "",
  examen_reg_6: "",
  examen_desc_1: "",
  examen_desc_2: "",
  examen_desc_3: "",
  examen_desc_4: "",
  examen_desc_5: "",
  examen_desc_6: "",
  diagnostico: "",
  diagnostico_cie_1: "",
  diagnostico_cie_2: "",
  diagnostico_cie_3: "",
  diagnostico_cie_4: "",
  diagnostico_tipo_1: "",
  diagnostico_tipo_2: "",
  diagnostico_tipo_3: "",
  diagnostico_tipo_4: "",
  plan_tratamiento: "",
  reporte_enfermeria: "",
  post_consulta: "",
  reporte_egreso: "",
  id_cab_ficha_con: 1,
  id_ficha: null,
  id_consulta_ext: null,
  id_signos_vitales: null,
  id_datos_paciente: null,
  n_historia_clinica: "",
  fecha_admision: dayjs().format("YYYY-MM-DD"),
  hora: dayjs().format("HH:mm:ss"),
  fecha: dayjs().format("YYYY-MM-DD"),
  n_hoja: 1,
};

function mapFichaItemToForm(item) {
  if (!item) return defaultValues;
  const nombres = (item.nombres || "").trim().split(" ");
  const nom1 = nombres[0] || "";
  const nom2 = nombres.slice(1).join(" ") || "";
  return {
    ...defaultValues,
    cedula: item.cedula ?? "",
    nombres1: nom1,
    nombres2: nom2,
    apellido_paterno: item.apellido_paterno ?? "",
    apellido_materno: item.apellido_materno ?? "",
    fecha_nacimiento: item.fecha_nacimiento ?? "",
    nacionalidad: item.nacionalidad ?? "",
    sexo: item.sexo ?? "",
    grupo_cultural: item.grupo_cultural ?? "",
    estado_civil: item.estado_civil ?? "",
    tipo_sangre: item.tipo_sangre ?? "",
    lugar_nacimiento: item.lugar_nacimiento ?? "",
    residencia_habitual: item.residencia_habitual ?? "",
    zona: item.zona ?? "",
    canton: item.canton ?? "",
    parroquia: item.parroquia ?? "",
    barrio: item.barrio ?? "",
    provincia: item.provincia ?? "",
    telefono: item.telefono ?? "",
    instruccion: item.instruccion ?? "",
    ocupacion: item.ocupacion ?? "",
    empresa_trabajo: item.empresa_trabajo ?? "",
    tipo_seguro_salud: item.tipo_seguro_salud ?? "",
    referido: item.referido ?? "",
    persona_emergencia1: item.persona_emergencia_nombre ?? "",
    persona_emergencia2: item.persona_emergencia_parentesco ?? "",
    persona_emergencia3: item.persona_emergencia_direccion ?? "",
    persona_emergencia4: item.persona_emergencia_telefono ?? "",
    edad: item.edad ?? "",
    fecha_medicion: item.fecha_medicion ?? dayjs().format("YYYY-MM-DD"),
    temperatura: item.temperatura ?? "",
    ...(function () {
      const pa = item.presion_arterial ?? "";
      const parts = String(pa).split("/").map((p) => p.trim());
      return {
        presion_sistolica: parts[0] ?? "",
        presion_diastolica: parts[1] ?? "",
        presion_arterial: pa,
      };
    })(),
    pulso: item.pulso ?? "",
    frec_respiratoria: item.frec_respiratoria ?? "",
    talla: item.talla ?? "",
    peso: item.peso ?? "",
    menarquia: item.menarquia ?? "",
    fum: item.fum ?? "",
    ciclo_menstrual: item.ciclo_menstrual ?? "",
    gesta: item.gesta ?? "",
    partos: item.partos ?? 0,
    abortos: item.abortos ?? 0,
    parejas_sexuales: item.parejas_sexuales ?? 0,
    motivo_consulta: item.motivo_consulta ?? "",
    enfermedad_problema: item.enfermedad_problema ?? "",
    antecedentes_personales: item.antecedentes_personales ?? "",
    antecedentes_familiares: item.antecedentes_familiares ?? "",
    revision_organos_sistemas: item.revision_organos_sistemas ?? "",
    examen_fisico: item.examen_fisico ?? "",
    diagnostico: item.diagnostico ?? "",
    plan_tratamiento: item.plan_tratamiento ?? "",
    reporte_enfermeria: item.reporte_enfermeria ?? "",
    post_consulta: item.post_consulta ?? "",
    reporte_egreso: item.reporte_egreso ?? "",
    id_cab_ficha_con: item.id_cab_ficha_con ?? 1,
    n_historia_clinica: item.n_historia_clinica ?? item.cedula ?? "",
    fecha_admision: item.fecha_admision ?? dayjs().format("YYYY-MM-DD"),
    hora: item.hora ?? dayjs().format("HH:mm:ss"),
    fecha: item.fecha ?? dayjs().format("YYYY-MM-DD"),
    n_hoja: item.n_hoja ?? 1,
    id_ficha: item.id_ficha ?? null,
    id_consulta_ext: item.id_consulta_ext ?? null,
    id_signos_vitales: item.id_signos_vitales ?? null,
    id_datos_paciente: item.id_datos_paciente ?? null,
  };
}

export default function FichaPage() {
  const { dni, page } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isViewMode = searchParams.get("view") === "1";
  const completada = searchParams.get("completada");
  const { toast, user } = useAuth();
  const theme = useTheme();
  const accordionHeaderSx = {
    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.1),
  };
  const [patient, setPatient] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatientCedula, setSelectedPatientCedula] = useState("");
  const [searchingPatient, setSearchingPatient] = useState(false);
  const PANEL_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
  const ENFERMERO_PANELS = ["1", "3", "9", "12"]; // Registro admisión, Reporte ingreso, Signos vitales, Reporte egreso
  const DOCTOR_PANELS = ["2", "4", "5", "6", "7", "8", "10", "11", "13", "14"]; // Resto
  const rol = user?.loginRol || "";
  const isDoctor = rol === "Doctor/a";
  const isEnfermero = rol === "Enfermero/a";
  const hasRoleFilter = isDoctor || isEnfermero;
  const [filterByRole, setFilterByRole] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({});
  const [addingPatient, setAddingPatient] = useState(false);
  const searchDebounceRef = useRef(null);

  const shouldShowPanel = (panelId) =>
    !filterByRole || !hasRoleFilter || (isEnfermero && ENFERMERO_PANELS.includes(panelId)) || (isDoctor && DOCTOR_PANELS.includes(panelId));
  const isPanelDisabledForRole = (panelId) =>
    !isViewMode && hasRoleFilter && !filterByRole && ((isEnfermero && DOCTOR_PANELS.includes(panelId)) || (isDoctor && ENFERMERO_PANELS.includes(panelId)));

  const isAccordionExpanded = (panelId) => expandedPanels[panelId] ?? true;
  const handleAccordionChange = (panelId) => (_, isExpanded) => {
    setExpandedPanels((prev) => ({ ...prev, [panelId]: isExpanded }));
  };
  const allExpanded = PANEL_IDS.every((id) => expandedPanels[id] !== false);
  const handleExpandCollapseAll = () => {
    const open = !allExpanded;
    setExpandedPanels(Object.fromEntries(PANEL_IDS.map((id) => [id, open])));
  };

  const { control, handleSubmit, watch, setValue, reset, getValues, trigger, formState: { errors } } = useForm({
    defaultValues,
  });

  const sexo = watch("sexo");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const instRes = await getInstitutions().catch(() => ({ data: [] }));
        setInstitutions(instRes.data || []);

        if (page && (completada === "0" || completada === "1")) {
          const api = completada === "1" ? getCompletedMedicalRecord : getMedicalRecord;
          const res = await api(dni, page);
          const items = res.data?.items ?? [];
          const item = items[0];
          if (!item) {
            setError("Ficha no encontrada");
            reset({ ...defaultValues, cedula: dni });
          } else {
            setPatient({ cedula: item.cedula, nombres: item.nombres, apellido_paterno: item.apellido_paterno, apellido_materno: item.apellido_materno });
            reset(mapFichaItemToForm(item));
          }
        } else {
          const patRes = await getPatientByDni(dni).catch(() => ({ data: { patient: "not found" } }));
          if (patRes.data?.patient === "not found" || !patRes.data) {
            setPatient(null);
            reset({ ...defaultValues, cedula: dni });
          } else {
            const p = patRes.data;
            setPatient(p);
            const nombres = (p.nombres || "").trim().split(" ");
            const nom1 = nombres[0] || "";
            const nom2 = nombres.slice(1).join(" ") || "";
            const dp = p.DatosPaciente || p.datosPaciente || {};
            const dap = p.DatosAdicionalesPaciente || p.datosAdicionalesPaciente || {};
            const dir = p.Direccion || p.direccion || {};
            reset({
              ...defaultValues,
              cedula: p.cedula || dni,
              nombres1: nom1,
              nombres2: nom2,
              apellido_paterno: p.apellido_paterno || "",
              apellido_materno: p.apellido_materno || "",
              fecha_nacimiento: p.fecha_nacimiento || "",
              nacionalidad: p.nacionalidad || "",
              sexo: p.sexo || "",
              grupo_cultural: p.grupo_cultural || "",
              estado_civil: p.estado_civil || "",
              tipo_sangre: p.tipo_sangre || "",
              lugar_nacimiento: p.lugar_nacimiento || "",
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
              edad: dp.edad ?? "",
              n_historia_clinica: p.cedula || dni,
            });
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Error al cargar");
      } finally {
        setLoading(false);
      }
    };
    const loadNuevo = async () => {
      setLoading(true);
      setError(null);
      try {
        const instRes = await getInstitutions().catch(() => ({ data: [] }));
        setInstitutions(instRes.data || []);
        reset(defaultValues);
      } catch (e) {
        setError(e?.response?.data?.message || "Error al cargar");
      } finally {
        setLoading(false);
      }
    };
    if (dni === "nuevo") {
      loadNuevo();
    } else if (dni) {
      load();
    }
  }, [dni, page, isViewMode, completada]);

  const loadPatientIntoForm = useCallback(
    async (cedula) => {
      setError(null);
      try {
        const patRes = await getPatientByDni(cedula);
        if (patRes.data?.patient === "not found" || !patRes.data) {
          reset({ ...defaultValues, cedula });
          setPatient(null);
        } else {
          const p = patRes.data;
          setPatient(p);
          const nombres = (p.nombres || "").trim().split(" ");
          const nom1 = nombres[0] || "";
          const nom2 = nombres.slice(1).join(" ") || "";
          const dp = p.DatosPaciente || p.datosPaciente || {};
          const dap = p.DatosAdicionalesPaciente || p.datosAdicionalesPaciente || {};
          const dir = p.Direccion || p.direccion || {};
          reset({
            ...defaultValues,
            cedula: p.cedula || cedula,
            nombres1: nom1,
            nombres2: nom2,
            apellido_paterno: p.apellido_paterno || "",
            apellido_materno: p.apellido_materno || "",
            fecha_nacimiento: p.fecha_nacimiento || "",
            nacionalidad: p.nacionalidad || "",
            sexo: p.sexo || "",
            grupo_cultural: p.grupo_cultural || "",
            estado_civil: p.estado_civil || "",
            tipo_sangre: p.tipo_sangre || "",
            lugar_nacimiento: p.lugar_nacimiento || "",
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
            edad: dp.edad ?? "",
            n_historia_clinica: p.cedula || cedula,
          });
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Error al cargar paciente");
      }
    },
    [reset]
  );

  useEffect(() => () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); }, []);

  const handleSearchPatient = useCallback((term) => {
    const t = String(term || "").trim();
    if (!t || t.length < 2) {
      setPatientOptions([]);
      setSearchingPatient(false);
      return;
    }
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setSearchingPatient(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await searchPatient(t);
        setPatientOptions(res.data ?? []);
      } catch {
        setPatientOptions([]);
      } finally {
        setSearchingPatient(false);
      }
    }, 350);
  }, []);

  const handleSelectPatient = useCallback(
    (cedula) => {
      const c = cedula != null && cedula !== "" ? String(cedula) : "";
      setSelectedPatientCedula(c);
      if (!c) {
        reset({ ...defaultValues });
        setPatient(null);
        return;
      }
      loadPatientIntoForm(c);
    },
    [loadPatientIntoForm, reset]
  );

  const handleAddPatient = useCallback(async () => {
    const valid = await trigger(["cedula", "nombres1", "apellido_paterno", "fecha_nacimiento"]);
    if (!valid) return;
    const data = getValues();
    setAddingPatient(true);
    try {
      const payload = {
        cedula: data.cedula,
        nombres1: data.nombres1,
        nombres2: data.nombres2,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        fecha_nacimiento: data.fecha_nacimiento || "",
        nacionalidad: data.nacionalidad,
        sexo: data.sexo,
        grupo_cultural: data.grupo_cultural,
        estado_civil: data.estado_civil,
        tipo_sangre: data.tipo_sangre,
        lugar_nacimiento: data.lugar_nacimiento,
        residencia_habitual: data.residencia_habitual,
        zona: data.zona,
        canton: data.canton,
        parroquia: data.parroquia,
        barrio: data.barrio,
        provincia: data.provincia,
        telefono: data.telefono,
        instruccion: data.instruccion,
        ocupacion: data.ocupacion,
        empresa_trabajo: data.empresa_trabajo,
        tipo_seguro_salud: data.tipo_seguro_salud,
        referido: data.referido,
        persona_emergencia1: data.persona_emergencia1,
        persona_emergencia2: data.persona_emergencia2,
        persona_emergencia3: data.persona_emergencia3,
        persona_emergencia4: data.persona_emergencia4,
      };
      await createPatient(payload);
      toast?.({ message: "Paciente creado correctamente", variant: "success" });
      setSelectedPatientCedula(String(data.cedula));
      await loadPatientIntoForm(data.cedula);
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error al crear paciente", variant: "error" });
    } finally {
      setAddingPatient(false);
    }
  }, [trigger, getValues, loadPatientIntoForm]);

  const onSubmit = async (data, completar = false) => {
    setSaving(true);
    try {
      const presionArterial = [data.presion_sistolica, data.presion_diastolica].map((p) => String(p || "").trim()).filter(Boolean).join("/") || data.presion_arterial || "";
      const payload = {
        ...data,
        presion_arterial: presionArterial,
        presion_sistolica: undefined,
        presion_diastolica: undefined,
        info: completar ? "guardar_completar" : "guardar",
        fecha_medicion: data.fecha_medicion || dayjs().format("YYYY-MM-DD"),
        fecha_admision: data.fecha_admision || dayjs().format("YYYY-MM-DD"),
        fecha: data.fecha || dayjs().format("YYYY-MM-DD"),
        hora: data.hora || dayjs().format("HH:mm:ss"),
      };
      const isUpdate = payload.id_ficha;
      if (isUpdate) {
        await updateMedicalRecord(payload);
      } else {
        await saveMedicalRecord(payload);
      }
      toast?.({ message: completar ? "Ficha completada" : "Ficha guardada", variant: "success" });
      navigate(`/pacientes/${data.cedula || dni}`);
    } catch (e) {
      toast?.({ message: e?.response?.data?.message || "Error al guardar", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={56} sx={{ mb: 2, maxWidth: 400 }} />
        <Skeleton variant="rounded" height={48} sx={{ mb: 3 }} />
        <Stack spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={72} />
          ))}
        </Stack>
      </Container>
    );
  }

  const selectedInstitution = institutions.find((i) => i.id === watch("id_cab_ficha_con")) || institutions[0];
  const isModoAnadir = dni === "nuevo";

  return (
    <Container maxWidth="lg" sx={{ py: 2, pb: { xs: 12, sm: 10 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Volver
      </Button>

      {isModoAnadir && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          {selectedPatientCedula && patient ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="body2">
                Paciente: <strong>{[patient.nombres, patient.apellido_paterno, patient.apellido_materno].filter(Boolean).join(" ")}</strong>
                {patient.cedula && ` (${patient.cedula})`}
              </Typography>
              <Button size="small" variant="outlined" onClick={() => { setSelectedPatientCedula(""); setPatient(null); reset({ ...defaultValues }); }}>
                Cambiar paciente
              </Button>
            </Box>
          ) : (
            <>
              <SearchableSelect
                label="Buscar y seleccionar paciente (cédula, nombre o teléfono)"
                placeholder="Escriba al menos 2 caracteres para buscar"
                items={patientOptions}
                value={selectedPatientCedula}
                onChange={handleSelectPatient}
                onSearchChange={handleSearchPatient}
                loading={searchingPatient}
                emptyOptionLabel="— Crear nuevo paciente —"
                getOptionLabel={(p) =>
                  [p.nombres, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(" ") +
                  (p.cedula != null ? ` — ${p.cedula}` : "")
                }
                getOptionValue={(p) => String(p.cedula ?? "")}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Seleccione un paciente existente para cargar sus datos, o bien &quot;Crear nuevo paciente&quot; / no seleccione nada para registrar paciente y ficha nuevos.
              </Typography>
            </>
          )}
        </Paper>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Assignment color="primary" />
        <Typography variant="h5">Ficha médica</Typography>
        {patient && (
          <Typography color="text.secondary" variant="body2">
            — {[patient.nombres, patient.apellido_paterno, patient.apellido_materno].filter(Boolean).join(" ")}
          </Typography>
        )}
        {isViewMode && (
          <Typography variant="body2" color="primary" sx={{ ml: 1, fontWeight: 600 }}>
            (Modo solo lectura)
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset disabled={isViewMode} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
        {/* Cabecera institucional */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="id_cab_ficha_con"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Institución</InputLabel>
                    <Select {...field} label="Institución">
                      {institutions.length === 0 && <MenuItem value={1}>Predeterminada</MenuItem>}
                      {institutions.map((i) => (
                        <MenuItem key={i.id} value={i.id}>
                          {i.institutionSystem || `#${i.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                value={selectedInstitution?.institutionSystem || ""}
                label="INSTITUCION DEL SISTEMA"
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                value={selectedInstitution?.operativeUnit || ""}
                label="UNIDAD OPERATIVA"
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField value={selectedInstitution?.codUO || ""} label="COD.UO" fullWidth size="small" InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField value={selectedInstitution?.locationCod || ""} label="COD LOCALIZACION" fullWidth size="small" InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Controller name="n_historia_clinica" control={control} render={({ field }) => (
                <TextField {...field} label="N° DE HISTORIA CLINICA" fullWidth size="small" />
              )} />
            </Grid>
          </Grid>
        </Paper>

        {/* 1 REGISTRO DE PRIMERA ADMISIÓN (Enfermero) */}
        {shouldShowPanel("1") && (
        <Accordion id="registro-admision" expanded={isAccordionExpanded("1")} onChange={handleAccordionChange("1")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>1 REGISTRO DE PRIMERA ADMISIÓN</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("1")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Cédula, nombres, apellidos y fecha de nacimiento son obligatorios.
                </Typography>
              </Grid>
              {/* Fila 1: Identificación */}
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="cedula"
                  control={control}
                  rules={{ required: "Cédula es requerida" }}
                  render={({ field }) => (
                    <TextField {...field} label="CÉDULA" fullWidth size="small" required error={!!errors.cedula} helperText={errors.cedula?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="apellido_paterno"
                  control={control}
                  rules={{
                    validate: (v, f) =>
                      (String(v || "").trim() || String(f.apellido_materno || "").trim()) ? true : "Al menos un apellido es requerido",
                  }}
                  render={({ field }) => (
                    <TextField {...field} label="APELLIDO PATERNO" fullWidth size="small" required error={!!errors.apellido_paterno} helperText={errors.apellido_paterno?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="apellido_materno" control={control} render={({ field }) => (
                  <TextField {...field} label="APELLIDO MATERNO" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="nombres1"
                  control={control}
                  rules={{
                    validate: (v, f) =>
                      (String(v || "").trim() || String(f.nombres2 || "").trim()) ? true : "Al menos un nombre es requerido",
                  }}
                  render={({ field }) => (
                    <TextField {...field} label="PRIMER NOMBRE" fullWidth size="small" required error={!!errors.nombres1} helperText={errors.nombres1?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="nombres2" control={control} render={({ field }) => (
                  <TextField {...field} label="SEGUNDO NOMBRE" fullWidth size="small" />
                )} />
              </Grid>
              {/* Fila 2: Dirección */}
              <Grid item xs={12} sm={6} md={4}>
                <Controller name="residencia_habitual" control={control} render={({ field }) => (
                  <TextField {...field} label="DIRECCIÓN DE RESIDENCIA HABITUAL" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="barrio" control={control} render={({ field }) => (
                  <TextField {...field} label="BARRIO" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="parroquia" control={control} render={({ field }) => (
                  <TextField {...field} label="PARROQUIA" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="canton" control={control} render={({ field }) => (
                  <TextField {...field} label="CANTÓN" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="provincia" control={control} render={({ field }) => (
                  <TextField {...field} label="PROVINCIA" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="zona" control={control} render={({ field }) => (
                  <TextField {...field} label="ZONA" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="telefono" control={control} render={({ field }) => (
                  <TextField {...field} label="TELÉFONO" fullWidth size="small" />
                )} />
              </Grid>
              {/* Fila 3: Datos personales */}
              <Grid item xs={12} sm={6} md={2}>
                <Controller
                  name="fecha_nacimiento"
                  control={control}
                  rules={{ required: "Fecha de nacimiento es requerida" }}
                  render={({ field }) => (
                    <TextField {...field} label="FECHA DE NACIMIENTO" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} required error={!!errors.fecha_nacimiento} helperText={errors.fecha_nacimiento?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="lugar_nacimiento" control={control} render={({ field }) => (
                  <TextField {...field} label="LUGAR DE NACIMIENTO" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="nacionalidad" control={control} render={({ field }) => (
                  <TextField {...field} label="NACIONALIDAD" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="grupo_cultural" control={control} render={({ field }) => (
                  <TextField {...field} label="GRUPO CULTURAL" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="tipo_sangre" control={control} render={({ field }) => (
                  <TextField {...field} label="TIPO DE SANGRE" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <Controller name="edad" control={control} render={({ field }) => (
                  <TextField {...field} label="EDAD" type="number" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="sexo" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>SEXO</InputLabel>
                    <Select {...field} label="SEXO">
                      <MenuItem value="">—</MenuItem>
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Femenino</MenuItem>
                    </Select>
                  </FormControl>
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="estado_civil" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>ESTADO CIVIL</InputLabel>
                    <Select {...field} label="ESTADO CIVIL">
                      <MenuItem value="">—</MenuItem>
                      <MenuItem value="Soltero">Soltero</MenuItem>
                      <MenuItem value="Casado">Casado</MenuItem>
                      <MenuItem value="Viudo">Viudo</MenuItem>
                      <MenuItem value="Divorciado">Divorciado</MenuItem>
                      <MenuItem value="Union libre">Unión libre</MenuItem>
                    </Select>
                  </FormControl>
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="instruccion" control={control} render={({ field }) => (
                  <TextField {...field} label="INSTRUCCIÓN" fullWidth size="small" />
                )} />
              </Grid>
              {/* Fila 4: Admisión y ocupación */}
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="fecha_admision" control={control} render={({ field }) => (
                  <TextField {...field} label="FECHA DE ADMISIÓN" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="ocupacion" control={control} render={({ field }) => (
                  <TextField {...field} label="OCUPACIÓN" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="empresa_trabajo" control={control} render={({ field }) => (
                  <TextField {...field} label="EMPRESA DONDE TRABAJA" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="tipo_seguro_salud" control={control} render={({ field }) => (
                  <TextField {...field} label="TIPO DE SEGURO DE SALUD" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="referido" control={control} render={({ field }) => (
                  <TextField {...field} label="REFERIDO DE" fullWidth size="small" />
                )} />
              </Grid>
              {/* Fila 5: Emergencia */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller name="persona_emergencia1" control={control} render={({ field }) => (
                  <TextField {...field} label="EN CASO DE EMERGENCIA LLAMAR A" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="persona_emergencia2" control={control} render={({ field }) => (
                  <TextField {...field} label="PARENTESCO" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller name="persona_emergencia3" control={control} render={({ field }) => (
                  <TextField {...field} label="DIRECCIÓN" fullWidth size="small" />
                )} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Controller name="persona_emergencia4" control={control} render={({ field }) => (
                  <TextField {...field} label="N° TELÉFONO" fullWidth size="small" placeholder="0969236901" />
                )} />
              </Grid>
              {/* ADMISIONISTA (código usuario) */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  value={user?.ci ?? ""}
                  label="ADMISIONISTA"
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {isModoAnadir && !selectedPatientCedula && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={addingPatient ? <CircularProgress size={18} /> : <PersonAdd />}
                    disabled={addingPatient}
                    onClick={handleAddPatient}
                  >
                    Agregar paciente
                  </Button>
                </Grid>
              )}
            </Grid>
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {/* 2 MOTIVO DE CONSULTA (Doctor) */}
        {shouldShowPanel("2") && (
        <Accordion expanded={isAccordionExpanded("2")} onChange={handleAccordionChange("2")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>2 MOTIVO DE CONSULTA</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("2")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="motivo_consulta" control={control} render={({ field }) => (
              <TextField {...field} label="Motivo de consulta" fullWidth multiline rows={3} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {/* 3 REPORTE INGRESO ENFERMERÍA (Enfermero) */}
        {shouldShowPanel("3") && (
        <Accordion expanded={isAccordionExpanded("3")} onChange={handleAccordionChange("3")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>3 REPORTE INGRESO DE ENFERMERIA</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("3")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="reporte_enfermeria" control={control} render={({ field }) => (
              <TextField {...field} label="Reporte ingreso" fullWidth multiline rows={3} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {sexo === "F" && shouldShowPanel("4") && (
          <Accordion expanded={isAccordionExpanded("4")} onChange={handleAccordionChange("4")} sx={{ "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
              <Typography fontWeight={600}>4 ANTECEDENTES GINECO - OBSTÉTRICOS</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <fieldset disabled={isPanelDisabledForRole("4")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="menarquia" control={control} render={({ field }) => (
                    <TextField {...field} label="MENARQUIA" fullWidth size="small" />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="ciclo_menstrual" control={control} render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>CICLO MENSTRUAL</InputLabel>
                      <Select {...field} label="CICLO MENSTRUAL">
                        <MenuItem value="">Seleccione</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Irregular">Irregular</MenuItem>
                        <MenuItem value="Amenorrea">Amenorrea</MenuItem>
                        <MenuItem value="Menopausia">Menopausia</MenuItem>
                        <MenuItem value="Otra">Otra</MenuItem>
                      </Select>
                    </FormControl>
                  )} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="gesta" control={control} render={({ field }) => (
                    <TextField {...field} label="GESTA" fullWidth size="small" />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="partos" control={control} render={({ field }) => (
                    <TextField {...field} label="PARTOS" type="number" fullWidth size="small" />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="abortos" control={control} render={({ field }) => (
                    <TextField {...field} label="ABORTOS" type="number" fullWidth size="small" />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="parejas_sexuales" control={control} render={({ field }) => (
                    <TextField {...field} label="PAREJAS SEXUALES" type="number" fullWidth size="small" />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller name="fum" control={control} render={({ field }) => (
                    <TextField {...field} label="FUM" fullWidth size="small" placeholder="Fecha última menstruación" />
                  )} />
                </Grid>
              </Grid>
              </fieldset>
            </AccordionDetails>
          </Accordion>
        )}

        {shouldShowPanel("5") && (
        <Accordion expanded={isAccordionExpanded("5")} onChange={handleAccordionChange("5")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "5" : "4"} ENFERMEDAD O PROBLEMA ACTUAL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("5")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="enfermedad_problema" control={control} render={({ field }) => (
              <TextField {...field} label="Enfermedad o problema actual" fullWidth multiline rows={3} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("6") && (
        <Accordion expanded={isAccordionExpanded("6")} onChange={handleAccordionChange("6")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "6" : "5"} ANTECEDENTES PERSONALES</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("6")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="antecedentes_personales" control={control} render={({ field }) => (
              <TextField {...field} label="Antecedentes personales" fullWidth multiline rows={3} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("7") && (
        <Accordion expanded={isAccordionExpanded("7")} onChange={handleAccordionChange("7")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "7" : "6"} ANTECEDENTES FAMILIARES</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("7")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Grid container spacing={2}>
              {[
                { name: "af_cardiopatia", label: "CARDIOPATÍA" },
                { name: "af_diabetes", label: "DIABETES" },
                { name: "af_enfer_c_vascular", label: "ENFER. C VASCULAR" },
                { name: "af_hipertension", label: "HIPERTENSIÓN" },
                { name: "af_cancer", label: "CÁNCER" },
                { name: "af_tuberculosis", label: "TUBERCULOSIS" },
                { name: "af_enfer_mental", label: "ENFERMEDAD MENTAL" },
                { name: "af_enfer_infecciosa", label: "ENFERMEDAD INFECCIOSA" },
                { name: "af_otro", label: "OTRO ANTECEDENTE" },
                { name: "af_sin_antecedente", label: "SIN ANTECEDENTE" },
              ].map(({ name, label }) => (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <Controller name={name} control={control} render={({ field: { value, onChange, ...rest } }) => (
                    <FormControlLabel control={<Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)} {...rest} />} label={label} />
                  )} />
                </Grid>
              ))}
            </Grid>
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("8") && (
        <Accordion expanded={isAccordionExpanded("8")} onChange={handleAccordionChange("8")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "8" : "7"} REVISIÓN ACTUAL DE ÓRGANOS Y SISTEMAS</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("8")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.5 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell align="center">CP</TableCell>
                  <TableCell align="center">SP</TableCell>
                  <TableCell>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  "ORGANOS DE LOS SENTIDOS",
                  "RESPIRATORIO",
                  "CARDIO VASCULAR",
                  "DIGESTIVO",
                  "GENITAL",
                  "URINARIO",
                  "MUSCULO ESQUELETICO",
                  "ENDOCRINO",
                  "HEMO LINFATICO",
                  "NERVIOSO",
                ].map((nombre, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{nombre}</TableCell>
                    <TableCell align="center">
                      <Controller name={`revision_ros_${i + 1}`} control={control} render={({ field }) => (
                        <Radio size="small" checked={field.value === "CP"} onChange={() => field.onChange("CP")} />
                      )} />
                    </TableCell>
                    <TableCell align="center">
                      <Controller name={`revision_ros_${i + 1}`} control={control} render={({ field }) => (
                        <Radio size="small" checked={field.value === "SP"} onChange={() => field.onChange("SP")} />
                      )} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`revision_desc_${i + 1}`} control={control} render={({ field }) => (
                        <TextField {...field} size="small" fullWidth variant="standard" placeholder="Descripción" />
                      )} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("9") && (
        <Accordion expanded={isAccordionExpanded("9")} onChange={handleAccordionChange("9")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "9" : "8"} SIGNOS VITALES Y ANTROPOMETRÍA</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("9")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Table size="small" sx={{ maxWidth: 720 }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: 200, verticalAlign: "middle", fontWeight: 500 }}>FECHA DE MEDICIÓN</TableCell>
                  <TableCell>
                    <Controller name="fecha_medicion" control={control} render={({ field }) => (
                      <TextField {...field} type="date" size="small" InputLabelProps={{ shrink: true }} sx={{ minWidth: 160 }} />
                    )} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ verticalAlign: "middle", fontWeight: 500 }}>TEMPERATURA °C</TableCell>
                  <TableCell>
                    <Controller name="temperatura" control={control} render={({ field }) => (
                      <TextField {...field} size="small" placeholder="Escribe aquí..." sx={{ minWidth: 200 }} />
                    )} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ verticalAlign: "middle", fontWeight: 500 }}>PRESIÓN ARTERIAL</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>Sistólica</Typography>
                        <Controller name="presion_sistolica" control={control} render={({ field }) => (
                          <TextField {...field} size="small" sx={{ width: 100 }} />
                        )} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>Diastólica</Typography>
                        <Controller name="presion_diastolica" control={control} render={({ field }) => (
                          <TextField {...field} size="small" sx={{ width: 100 }} />
                        )} />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ verticalAlign: "middle", fontWeight: 500 }}>PULSO min / FREC.RES</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Controller name="pulso" control={control} render={({ field }) => (
                        <TextField {...field} size="small" placeholder="Pulso" sx={{ width: 100 }} />
                      )} />
                      <Controller name="frec_respiratoria" control={control} render={({ field }) => (
                        <TextField {...field} size="small" placeholder="Frec. resp." sx={{ width: 100 }} />
                      )} />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ verticalAlign: "middle", fontWeight: 500 }}>PESO kg | TALLA cm</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Controller name="peso" control={control} render={({ field }) => (
                        <TextField {...field} size="small" placeholder="Peso" sx={{ width: 100 }} />
                      )} />
                      <Controller name="talla" control={control} render={({ field }) => (
                        <TextField {...field} size="small" placeholder="Talla" sx={{ width: 100 }} />
                      )} />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("10") && (
        <Accordion expanded={isAccordionExpanded("10")} onChange={handleAccordionChange("10")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "10" : "9"} EXAMEN FÍSICO REGIONAL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("10")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.5 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell align="center">CP</TableCell>
                  <TableCell align="center">SP</TableCell>
                  <TableCell>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {["CABEZA", "CUELLO", "TORAX", "ABDOMEN", "PELVIS", "EXTREMIDADES"].map((nombre, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{nombre}</TableCell>
                    <TableCell align="center">
                      <Controller name={`examen_reg_${i + 1}`} control={control} render={({ field }) => (
                        <Radio size="small" checked={field.value === "CP"} onChange={() => field.onChange("CP")} />
                      )} />
                    </TableCell>
                    <TableCell align="center">
                      <Controller name={`examen_reg_${i + 1}`} control={control} render={({ field }) => (
                        <Radio size="small" checked={field.value === "SP"} onChange={() => field.onChange("SP")} />
                      )} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`examen_desc_${i + 1}`} control={control} render={({ field }) => (
                        <TextField {...field} size="small" fullWidth variant="standard" placeholder="Descripción" />
                      )} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("11") && (
        <Accordion expanded={isAccordionExpanded("11")} onChange={handleAccordionChange("11")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "11" : "10"} POST CONSULTA</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("11")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="post_consulta" control={control} render={({ field }) => (
              <TextField {...field} label="Post consulta" fullWidth multiline rows={3} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("12") && (
        <Accordion expanded={isAccordionExpanded("12")} onChange={handleAccordionChange("12")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "12" : "11"} REPORTE EGRESO DE ENFERMERIA</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("12")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="reporte_egreso" control={control} render={({ field }) => (
              <TextField {...field} label="Reporte egreso" fullWidth multiline rows={3} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("13") && (
        <Accordion expanded={isAccordionExpanded("13")} onChange={handleAccordionChange("13")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>{sexo === "F" ? "13" : "12"} DIAGNÓSTICO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("13")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} key={i}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Controller name={`diagnostico_cie_${i}`} control={control} render={({ field }) => (
                      <TextField {...field} label="CIE" size="small" sx={{ minWidth: 280 }} placeholder="Buscar o ingresar código CIE-10" />
                    )} />
                    <Controller name={`diagnostico_tipo_${i}`} control={control} render={({ field }) => (
                      <FormControl component="fieldset" size="small">
                        <RadioGroup row value={field.value || ""} onChange={field.onChange}>
                          <FormControlLabel value="PRE" control={<Radio size="small" />} label="PRE" labelPlacement="start" />
                          <FormControlLabel value="DEF" control={<Radio size="small" />} label="DEF" labelPlacement="start" />
                        </RadioGroup>
                      </FormControl>
                    )} />
                  </Box>
                </Grid>
              ))}
            </Grid>
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {shouldShowPanel("14") && (
        <Accordion expanded={isAccordionExpanded("14")} onChange={handleAccordionChange("14")} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ChevronRightIcon sx={{ rotate: "90deg" }} />} sx={accordionHeaderSx}>
            <Typography fontWeight={600}>13 PLAN DE TRATAMIENTO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <fieldset disabled={isPanelDisabledForRole("14")} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
            <Controller name="plan_tratamiento" control={control} render={({ field }) => (
              <TextField {...field} label="Plan de tratamiento" fullWidth multiline rows={4} size="small" />
            )} />
            </fieldset>
          </AccordionDetails>
        </Accordion>
        )}

        {/* Footer */}
        <Paper variant="outlined" sx={{ p: 2, mt: 2, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
          <Controller name="fecha" control={control} render={({ field }) => (
            <TextField {...field} label="FECHA" size="small" type="date" sx={{ width: 140 }} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: isViewMode }} />
          )} />
          <Controller name="hora" control={control} render={({ field }) => (
            <TextField {...field} label="HORA" size="small" placeholder="HH:mm:ss" sx={{ width: 120 }} InputProps={{ readOnly: isViewMode }} />
          )} />
          <TextField
            value={[user?.firstName, user?.secondName, user?.firstLastName, user?.secondLastName].filter(Boolean).join(" ") || ""}
            label="PROFESIONAL"
            size="small"
            sx={{ minWidth: 220 }}
            InputProps={{ readOnly: true }}
          />
          <TextField value={user?.ci ?? ""} label="Código" size="small" sx={{ width: 120 }} InputProps={{ readOnly: true }} />
          <Controller name="n_hoja" control={control} render={({ field }) => (
            <TextField {...field} label="NÚMERO DE HOJA" size="small" type="number" sx={{ width: 140 }} InputProps={{ readOnly: isViewMode }} />
          )} />
        </Paper>
        </fieldset>
      </form>

      {/* Barra flotante de acciones - fija al hacer scroll */}
      {!isViewMode && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            flexWrap: "nowrap",
            width: { xs: "calc(100vw - 32px)", sm: "95%", md: 920 },
            maxWidth: 960,
            overflowX: "auto",
            "& > *": { flexShrink: 0 },
            zIndex: 1100,
            borderRadius: 2,
          }}
        >
          {hasRoleFilter && (
            <>
              <Button
                size="small"
                variant={filterByRole ? "contained" : "outlined"}
                startIcon={filterByRole ? <VisibilityOff /> : <Visibility />}
                onClick={() => setFilterByRole((v) => !v)}
                title={filterByRole ? "Ver todos los campos" : "Solo mis campos"}
              >
                {filterByRole ? "Ver todos" : "Solo míos"}
              </Button>
              <Divider orientation="vertical" flexItem />
            </>
          )}
          <Button
            size="small"
            variant="outlined"
            startIcon={allExpanded ? <UnfoldLess /> : <UnfoldMore />}
            onClick={handleExpandCollapseAll}
            title={allExpanded ? "Colapsar todos" : "Expandir todos"}
          >
            {allExpanded ? "Colapsar" : "Expandir"}
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            size="small"
            variant="outlined"
            disabled={saving}
            onClick={handleSubmit((d) => onSubmit(d, false))}
            startIcon={saving ? <CircularProgress size={18} /> : <Save />}
          >
            Guardar borrador
          </Button>
          <Button size="small" variant="outlined" startIcon={<NoteAdd />}>
            Generar Receta
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Save />}
            disabled={saving}
            onClick={handleSubmit((d) => onSubmit(d, true))}
          >
            Enviar Ficha
          </Button>
        </Paper>
      )}
    </Container>
  );
}
