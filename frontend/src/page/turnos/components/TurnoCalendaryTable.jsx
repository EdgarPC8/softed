import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Collapse,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import { deleteTurno } from "../../../api/turnosRequest";
import { useAuth } from "../../../context/AuthContext";

/* ---------------- Utils ---------------- */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const ESTADO_COLORS = {
  pendiente: "info",
  confirmado: "primary",
  en_curso: "warning",
  completado: "success",
  cancelado: "error",
  no_asistio: "error",
};

function getEstadoColor(estado, theme) {
  const colorKey = ESTADO_COLORS[estado] || "grey";
  return theme.palette[colorKey]?.main || theme.palette.grey[500];
}

/* ---------------- Component ---------------- */
const ESTADO_LABELS = { pendiente: "Pendiente", confirmado: "Confirmado", en_curso: "En curso", completado: "Completado", cancelado: "Cancelado", no_asistio: "No asistió" };

export default function TurnoCalendaryTable({ turnos, onReload, onEdit, onEstadoChange, readOnly = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { toast } = useAuth();

  const theme = useTheme();
  const tones = {
    state: theme.palette.mode === "dark" ? 0.4 : 0.2,
    stateHover: theme.palette.mode === "dark" ? 0.18 : 0.48,
    hoverNeutral: theme.palette.mode === "dark" ? 0.14 : 0.1,
    selected: theme.palette.mode === "dark" ? 0.25 : 0.5,
    outOfMonth: theme.palette.mode === "dark" ? 0.4 : 0.1,
    border: 0.6,
  };

  const handlePrevMonth = () => setCurrentDate((prev) => addMonths(prev, -1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const startDay = startOfMonth(currentDate);
  const endDay = endOfMonth(currentDate);
  const startWeek = startOfWeek(startDay, { weekStartsOn: 1 });
  const endWeek = endOfWeek(endDay, { weekStartsOn: 1 });
  const daysToShow = eachDayOfInterval({ start: startWeek, end: endWeek });
  const weeks = chunkArray(daysToShow, 7);

  const getTurnosForDate = (date) =>
    turnos.filter((t) => {
      if (!t.fechaHora) return false;
      const d = new Date(t.fechaHora);
      return isSameDay(d, date);
    });

  const selectedTurnos = selectedDate ? getTurnosForDate(selectedDate) : [];

  const handleDayClick = (date) => {
    if (selectedDate && isSameDay(date, selectedDate)) setSelectedDate(null);
    else setSelectedDate(date);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    toast?.({
      promise: deleteTurno(toDelete.id),
      successMessage: "Turno eliminado",
      onSuccess: () => {
        setOpenDelete(false);
        setToDelete(null);
        onReload?.();
      },
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <SimpleDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setToDelete(null);
        }}
        tittle="Eliminar turno"
        onClickAccept={handleDelete}
      >
        ¿Está seguro de eliminar este turno? Esta acción no se puede deshacer.
      </SimpleDialog>

      <Typography variant="h5" align="center" gutterBottom sx={{ textTransform: "capitalize" }}>
        {format(currentDate, "MMMM yyyy", { locale: es })}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button variant="outlined" startIcon={<ChevronLeftIcon />} onClick={handlePrevMonth}>
          Mes anterior
        </Button>
        <Button variant="outlined" endIcon={<ChevronRightIcon />} onClick={handleNextMonth}>
          Mes siguiente
        </Button>
      </Box>

      <Grid container spacing={1}>
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography variant="subtitle2" align="center">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {weeks.map((week, weekIndex) => {
        const shouldShowCollapse = selectedDate && week.some((day) => isSameDay(day, selectedDate));

        return (
          <React.Fragment key={weekIndex}>
            <Grid container spacing={1}>
              {week.map((date) => {
                const dailyTurnos = getTurnosForDate(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isOutOfMonth = !isSameMonth(date, currentDate);

                // Color según estados del día (prioridad: completado > en_curso > confirmado > pendiente > cancelado)
                const estados = dailyTurnos.map((t) => t.estado);
                const hasCompletado = estados.includes("completado");
                const hasEnCurso = estados.includes("en_curso");
                const hasConfirmado = estados.includes("confirmado");
                const hasPendiente = estados.includes("pendiente");
                const hasCancelado = estados.includes("cancelado") || estados.includes("no_asistio");

                let baseColor = theme.palette.primary.main;
                if (dailyTurnos.length === 0) baseColor = theme.palette.grey[400];
                else if (hasCompletado) baseColor = theme.palette.success.main;
                else if (hasEnCurso) baseColor = theme.palette.warning.main;
                else if (hasConfirmado) baseColor = theme.palette.primary.main;
                else if (hasPendiente) baseColor = theme.palette.info.main;
                else if (hasCancelado) baseColor = theme.palette.error.main;

                const dayBg = isOutOfMonth
                  ? alpha(theme.palette.action.disabledBackground, tones.outOfMonth)
                  : dailyTurnos.length > 0
                    ? alpha(baseColor, tones.state)
                    : "transparent";

                const selectedBg = dailyTurnos.length > 0
                  ? alpha(baseColor, Math.min(tones.state + 0.15, 0.9))
                  : alpha(theme.palette.primary.main, tones.selected);

                return (
                  <Grid item xs={12 / 7} key={date.toISOString()}>
                    <Paper
                      elevation={2}
                      onClick={() => handleDayClick(date)}
                      sx={{
                        minHeight: 100,
                        p: 1,
                        backgroundColor: isSelected ? selectedBg : dayBg,
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, tones.border),
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? (dailyTurnos.length > 0 ? alpha(baseColor, Math.min(tones.stateHover + 0.1, 1)) : alpha(theme.palette.primary.main, Math.min(1, tones.selected + 0.05)))
                            : dailyTurnos.length > 0
                              ? alpha(baseColor, tones.stateHover)
                              : alpha(theme.palette.primary.main, tones.hoverNeutral),
                        },
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {format(date, "d")}
                      </Typography>
                      {dailyTurnos.length > 0 ? (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {dailyTurnos.length} {dailyTurnos.length === 1 ? "turno" : "turnos"}
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.disabled">
                            Sin turnos
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Collapse in={shouldShowCollapse} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  mt: 1,
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Turnos del {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </Typography>
                {selectedTurnos.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No hay turnos este día.
                  </Typography>
                )}

                {selectedTurnos
                  .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                  .map((turno) => {
                    const estadoColor = getEstadoColor(turno.estado, theme);
                    const bgColor = alpha(estadoColor, tones.state);

                    return (
                      <Accordion
                        key={turno.id}
                        sx={{
                          mb: 1,
                          backgroundColor: bgColor,
                          border: "1px solid",
                          borderColor: alpha(theme.palette.divider, tones.border),
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", pr: 1 }}>
                            <Box>
                              <Typography variant="subtitle1">
                                {turno.cliente?.nombre || "—"} · {turno.servicio?.nombre || "—"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {turno.fechaHora && format(new Date(turno.fechaHora), "h:mm a", { locale: es })}
                                {turno.empleado?.user && ` · Con ${turno.empleado.user.firstName} ${turno.empleado.user.firstLastName}`}
                                {` · $${parseFloat(turno.precioTotal || 0).toFixed(2)} · ${turno.estado}`}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              {!readOnly && onEdit && (
                                <Tooltip title="Editar">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(turno);
                                    }}
                                    onFocus={(e) => e.stopPropagation()}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {!readOnly && (
                                <Tooltip title="Eliminar">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setToDelete(turno);
                                      setOpenDelete(true);
                                    }}
                                    onFocus={(e) => e.stopPropagation()}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Cliente:</strong> {turno.cliente?.nombre || "—"}
                            {turno.cliente?.telefono && ` · ${turno.cliente.telefono}`}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Servicio:</strong> {turno.servicio?.nombre || "—"} ({turno.duracionMin} min)
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Empleado:</strong>{" "}
                            {turno.empleado?.user
                              ? `${turno.empleado.user.firstName} ${turno.empleado.user.firstLastName}`
                              : "—"}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Precio total:</strong> ${parseFloat(turno.precioTotal || 0).toFixed(2)}
                          </Typography>
                          {!readOnly && onEstadoChange && (
                            <FormControl size="small" sx={{ minWidth: 140 }} fullWidth>
                              <InputLabel>Estado</InputLabel>
                              <Select
                                value={turno.estado || "pendiente"}
                                label="Estado"
                                onChange={(e) => onEstadoChange(turno, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {Object.entries(ESTADO_LABELS).map(([k, v]) => (
                                  <MenuItem key={k} value={k}>{v}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          {(turno.addons || []).length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              <strong>Extras:</strong>{" "}
                              {turno.addons.map((ta) => {
                                const nombre = ta.addon?.nombre || `#${ta.addonId}`;
                                const desde = ta.minutoInicio != null ? ta.minutoInicio : 0;
                                return `${nombre}${desde > 0 ? ` (desde min ${desde})` : ""}`;
                              }).join(", ")}
                            </Typography>
                          )}
                          {turno.notas && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Notas: {turno.notas}
                            </Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
              </Box>
            </Collapse>
          </React.Fragment>
        );
      })}
    </Box>
  );
}
