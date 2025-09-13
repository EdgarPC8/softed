import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Grid, Paper, Collapse, TextField, IconButton, Tooltip,
  Accordion, AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
import {
  format, addMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, startOfWeek, endOfWeek,
  isSameDay, parse, isSameMonth
} from 'date-fns';
import { es } from 'date-fns/locale';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import {
  updateOrderItemRequest,
  markItemAsPaidRequest,
  markItemAsDeliveredRequest,
  deleteOrder,
  deleteOrderItem,
  updateOrderRequest
} from '../../../api/ordersRequest';
import { useAuth } from '../../../context/AuthContext';
import SimpleDialog from '../../../Components/Dialogs/SimpleDialog';

/* ---------------- Utils ---------------- */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function getColorByStatus(orderItems) {
  const allPaid = orderItems.every(item => item.paidAt);
  const allDelivered = orderItems.every(item => item.deliveredAt);

  if (allPaid && allDelivered) return '#d0f8ce';
  if (!orderItems.some(item => item.paidAt || item.deliveredAt)) return '#ffcccc';
  if (orderItems.some(item => item.deliveredAt && !item.paidAt)) return '#fff9c4';
  if (orderItems.some(item => item.paidAt && !item.deliveredAt)) return '#ffe0b2';
  return 'white';
}

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const buildFullDate = (dateStr, hh, mm, ss) => {
  if (!dateStr || hh === '' || mm === '' || ss === '') return null;
  const str = `${dateStr}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

/* ---------------- Component ---------------- */
export default function OrderCalendarView({ orders, onReload }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [fields, setFields] = useState({});
  const [editMode, setEditMode] = useState({});

  // Edición de orden (date y notes)
  const [orderEditMode, setOrderEditMode] = useState({});
  const [orderFields, setOrderFields] = useState({});

  // Dialogs de eliminación
  const [openDeleteOrder, setOpenDeleteOrder] = useState(false);
  const [openDeleteItem, setOpenDeleteItem] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { user, toast: toastAuth } = useAuth();

  const handlePrevMonth = () => setCurrentDate((prev) => addMonths(prev, -1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const startDay = startOfMonth(currentDate);
  const endDay = endOfMonth(currentDate);
  const startWeek = startOfWeek(startDay, { weekStartsOn: 1 });
  const endWeek = endOfWeek(endDay, { weekStartsOn: 1 });
  const daysToShow = eachDayOfInterval({ start: startWeek, end: endWeek });
  const weeks = chunkArray(daysToShow, 7);

  const handleDeliver = async (itemId) => {
    toastAuth({
      promise: markItemAsDeliveredRequest(itemId),
      onSuccess: () => {
        setTimeout(() => onReload?.(), 300);
        return { title: "Producto", description: "Ítem entregado" };
      },
      onError: (res) => ({ title: "Producto", description: res.response?.data?.message || "Error" }),
    });
  };

  const handlePaid = async (itemId) => {
    toastAuth({
      promise: markItemAsPaidRequest(itemId),
      onSuccess: () => {
        setTimeout(() => onReload?.(), 300);
        return { title: "Producto", description: "Ítem pagado" };
      },
      onError: (res) => ({ title: "Producto", description: res.response?.data?.message || "Error" }),
    });
  };

  // Abrir diálogos
  const openOrderDialog = (order) => {
    setOrderToDelete(order);
    setOpenDeleteOrder(true);
  };
  const openItemDialog = (item) => {
    setItemToDelete(item);
    setOpenDeleteItem(true);
  };

  // Confirmar eliminaciones
  const confirmDeleteOrder = () => {
    if (!orderToDelete) return;
    toastAuth({
      promise: deleteOrder(orderToDelete.id),
      onSuccess: () => {
        setOpenDeleteOrder(false);
        setOrderToDelete(null);
        setTimeout(() => onReload?.(), 300);
        return { title: 'Orden', description: 'Orden eliminada correctamente' };
      },
      onError: (res) => ({
        title: 'Orden',
        description: res.response?.data?.message || 'No se pudo eliminar la orden',
      }),
    });
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    toastAuth({
      promise: deleteOrderItem(itemToDelete.id),
      onSuccess: () => {
        setOpenDeleteItem(false);
        setItemToDelete(null);
        setTimeout(() => onReload?.(), 300);
        return { title: 'Ítem', description: 'Ítem eliminado correctamente' };
      },
      onError: (res) => ({
        title: 'Ítem',
        description: res.response?.data?.message || 'No se pudo eliminar el ítem',
      }),
    });
  };

  const selectedOrders = selectedDate
    ? orders.filter(order =>
        isSameDay(parse(order.date, 'dd/MM/yyyy HH:mm:ss', new Date()), selectedDate)
      )
    : [];

  const handleDayClick = (date) => {
    if (selectedDate && isSameDay(date, selectedDate)) setSelectedDate(null);
    else setSelectedDate(date);
  };

  const handleChange = (itemId, field, value) => {
    setFields((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const buildDate = (date, hour, minute, second) => {
    if (!date || hour === '' || minute === '' || second === '') return null;
    const str = `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    const result = new Date(str);
    return isNaN(result.getTime()) ? null : result;
  };

  const handleConfirm = async (itemId) => {
    const f = fields[itemId] || {};
    const paidAt = buildDate(f?.paidDate, f?.paidHour, f?.paidMinute, f?.paidSecond);
    const deliveredAt = buildDate(f?.deliveredDate, f?.deliveredHour, f?.deliveredMinute, f?.deliveredSecond);
    const quantity = Math.max(0, toNumber(f?.quantity, 0));
    const price = Math.max(0, toNumber(f?.price, 0));

    await updateOrderItemRequest(itemId, { paidAt, deliveredAt, quantity, price });
  };

  const toggleOrderEdit = (orderId) => {
    setOrderEditMode(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleConfirmOrder = async (orderId) => {
    const f = orderFields[orderId] || {};
    const newDate = buildFullDate(f.date, f.hour, f.minute, f.second);
    const payload = { date: newDate ? newDate.toISOString() : null, notes: f.notes ?? '' };

    await toastAuth({
      promise: updateOrderRequest(orderId, payload),
      onSuccess: () => {
        setTimeout(() => onReload?.(), 300);
        return { title: 'Orden', description: 'Orden actualizada' };
      },
      onError: (res) => ({
        title: 'Orden',
        description: res.response?.data?.message || 'No se pudo actualizar la orden',
      }),
    });
  };

  useEffect(() => {
    const newFields = {};
    const newOrderFields = {};

    orders.forEach(order => {
      // Ítems
      order.ERP_order_items.forEach(item => {
        const paidDate = item.paidAt ? parse(item.paidAt, 'dd/MM/yyyy HH:mm:ss', new Date()) : null;
        const deliveredDate = item.deliveredAt ? parse(item.deliveredAt, 'dd/MM/yyyy HH:mm:ss', new Date()) : null;
        newFields[item.id] = {
          paidDate: paidDate ? format(paidDate, 'yyyy-MM-dd') : '',
          paidHour: paidDate ? String(paidDate.getHours()).padStart(2, '0') : '',
          paidMinute: paidDate ? String(paidDate.getMinutes()).padStart(2, '0') : '',
          paidSecond: paidDate ? String(paidDate.getSeconds()).padStart(2, '0') : '',
          deliveredDate: deliveredDate ? format(deliveredDate, 'yyyy-MM-dd') : '',
          deliveredHour: deliveredDate ? String(deliveredDate.getHours()).padStart(2, '0') : '',
          deliveredMinute: deliveredDate ? String(deliveredDate.getMinutes()).padStart(2, '0') : '',
          deliveredSecond: deliveredDate ? String(deliveredDate.getSeconds()).padStart(2, '0') : '',
          quantity: item.quantity ?? '',
          price: item.price ?? '',
        };
      });

      // Orden (date + notes)
      const orderDate = order.date ? parse(order.date, 'dd/MM/yyyy HH:mm:ss', new Date()) : null;
      newOrderFields[order.id] = {
        date: orderDate ? format(orderDate, 'yyyy-MM-dd') : '',
        hour: orderDate ? String(orderDate.getHours()).padStart(2, '0') : '',
        minute: orderDate ? String(orderDate.getMinutes()).padStart(2, '0') : '',
        second: orderDate ? String(orderDate.getSeconds()).padStart(2, '0') : '',
        notes: order.notes ?? '',
      };
    });

    setFields(newFields);
    setOrderFields(newOrderFields);
  }, [orders]);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Dialogs globales */}
      <SimpleDialog
        open={openDeleteOrder}
        onClose={() => { setOpenDeleteOrder(false); setOrderToDelete(null); }}
        tittle="Eliminar Orden"
        onClickAccept={confirmDeleteOrder}
      >
        ¿Está seguro de eliminar la orden
        {orderToDelete ? ` #${orderToDelete.id}` : ''}? Esta acción no se puede deshacer.
      </SimpleDialog>

      <SimpleDialog
        open={openDeleteItem}
        onClose={() => { setOpenDeleteItem(false); setItemToDelete(null); }}
        tittle="Eliminar Ítem"
        onClickAccept={confirmDeleteItem}
      >
        ¿Está seguro de eliminar este ítem
        {itemToDelete && itemToDelete.ERP_inventory_product
          ? ` (${itemToDelete.ERP_inventory_product.name})`
          : ''}? Esta acción no se puede deshacer.
      </SimpleDialog>

      <Typography variant="h5" align="center" gutterBottom>
        {format(currentDate, 'MMMM yyyy', { locale: es })}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={handlePrevMonth}>Mes Anterior</Button>
        <Button variant="contained" onClick={handleNextMonth}>Mes Siguiente</Button>
      </Box>

      <Grid container spacing={1}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography variant="subtitle2" align="center">{day}</Typography>
          </Grid>
        ))}
      </Grid>

      {weeks.map((week, weekIndex) => {
        const shouldShowCollapse = selectedDate && week.some(day => isSameDay(day, selectedDate));

        return (
          <React.Fragment key={weekIndex}>
            <Grid container spacing={1}>
              {week.map((date) => {
                const dailyOrders = orders.filter(order =>
                  isSameDay(parse(order.date, 'dd/MM/yyyy HH:mm:ss', new Date()), date)
                );
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const colorByStatus = dailyOrders.length > 0
                  ? getColorByStatus(dailyOrders.flatMap(order => order.ERP_order_items))
                  : isSameMonth(date, currentDate) ? 'white' : '#f5f5f5';

                return (
                  <Grid item xs={12 / 7} key={date.toISOString()}>
                    <Paper
                      elevation={3}
                      onClick={() => handleDayClick(date)}
                      sx={{
                        minHeight: 100,
                        p: 1,
                        backgroundColor: isSelected ? '#d0f0ff' : colorByStatus,
                        cursor: 'pointer',
                        transition: '0.2s',
                        '&:hover': { backgroundColor: '#e3f2fd' },
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        {format(date, 'd')}
                      </Typography>

                      {dailyOrders.length > 0 ? (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            {dailyOrders.length} {dailyOrders.length === 1 ? 'pedido' : 'pedidos'}
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.disabled">
                            Sin pedidos
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Collapse in={shouldShowCollapse} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 1, mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" gutterBottom>
                  Pedidos del {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
                </Typography>
                {selectedOrders.length === 0 && (
                  <Typography variant="body2" color="textSecondary">No hay pedidos este día.</Typography>
                )}

                {selectedOrders.map((order) => {
                  const orderItems = order.ERP_order_items;
                  const orderColor = getColorByStatus(orderItems);
                  const isProgrammer = user?.loginRol === 'Programador';

                  return (
                    <Accordion key={order.id} sx={{ mb: 1, backgroundColor: orderColor }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ alignItems: 'center' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              Cliente: {order.ERP_customer?.name}
                            </Typography>
                            <Typography variant="caption">
                              Pedido #{order.id} – Total: $
                              {orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                            </Typography>
                          </Box>

                          {/* Acciones de la orden */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {isProgrammer && (
                              <Tooltip title={orderEditMode[order.id] ? "Cancelar edición" : "Editar orden"}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOrderEdit(order.id);
                                  }}
                                  onFocus={(e) => e.stopPropagation()}
                                >
                                  {orderEditMode[order.id] ? <CloseIcon /> : <EditNoteIcon />}
                                </IconButton>
                              </Tooltip>
                            )}

                            {isProgrammer && (
                              <Tooltip title="Eliminar orden">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openOrderDialog(order);
                                  }}
                                  onFocus={(e) => e.stopPropagation()}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        {/* Bloque de edición de la ORDEN */}
                     {orderEditMode[order.id] && (
  <Box
    sx={{
      mb: 2,
      p: 1.5,
      border: '1px dashed',
      borderColor: 'rgba(0,0,0,0.2)',
      borderRadius: 1,
      backgroundColor: orderColor, // <- usa el color del estado (verde/amarillo/rojo)
    }}
  >

                            <Typography variant="subtitle2" gutterBottom>Editar orden</Typography>

                            <Grid container spacing={1} alignItems="flex-end">
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  label="Fecha del pedido"
                                  type="date"
                                  fullWidth
                                  value={orderFields[order.id]?.date || ''}
                                  onChange={(e) => setOrderFields(prev => ({
                                    ...prev, [order.id]: { ...prev[order.id], date: e.target.value }
                                  }))}
                                />
                              </Grid>
                              <Grid item xs={4} sm={2}>
                                <TextField
                                  label="Hora"
                                  type="number"
                                  inputProps={{ min: 0, max: 23 }}
                                  fullWidth
                                  value={orderFields[order.id]?.hour || ''}
                                  onChange={(e) => setOrderFields(prev => ({
                                    ...prev, [order.id]: { ...prev[order.id], hour: e.target.value }
                                  }))}
                                />
                              </Grid>
                              <Grid item xs={4} sm={2}>
                                <TextField
                                  label="Min"
                                  type="number"
                                  inputProps={{ min: 0, max: 59 }}
                                  fullWidth
                                  value={orderFields[order.id]?.minute || ''}
                                  onChange={(e) => setOrderFields(prev => ({
                                    ...prev, [order.id]: { ...prev[order.id], minute: e.target.value }
                                  }))}
                                />
                              </Grid>
                              <Grid item xs={4} sm={2}>
                                <TextField
                                  label="Seg"
                                  type="number"
                                  inputProps={{ min: 0, max: 59 }}
                                  fullWidth
                                  value={orderFields[order.id]?.second || ''}
                                  onChange={(e) => setOrderFields(prev => ({
                                    ...prev, [order.id]: { ...prev[order.id], second: e.target.value }
                                  }))}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <TextField
                                  label="Notas"
                                  fullWidth
                                  multiline
                                  minRows={2}
                                  value={orderFields[order.id]?.notes ?? ''}
                                  onChange={(e) => setOrderFields(prev => ({
                                    ...prev, [order.id]: { ...prev[order.id], notes: e.target.value }
                                  }))}
                                />
                              </Grid>

                              <Grid item xs={12} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleConfirmOrder(order.id);
                                    toggleOrderEdit(order.id);
                                  }}
                                >
                                  Guardar cambios
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<CloseIcon />}
                                  onClick={(e) => { e.stopPropagation(); toggleOrderEdit(order.id); }}
                                >
                                  Cancelar
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        )}

                        {/* Notas de la orden (solo lectura) */}
                        {!orderEditMode[order.id] && order.notes && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Notas de la orden: {order.notes}
                            </Typography>
                          </Box>
                        )}

                        {/* Lista de productos */}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2" gutterBottom>Productos:</Typography>

                          {order.ERP_order_items.map((item, idx) => {
                            const itemId = item.id;
                            const f = fields[itemId] || {};
                            const isEditing = !!editMode[itemId];
                            const isProgrammer = user?.loginRol === 'Programador';

                            const toggleEdit = () => {
                              setEditMode(prev => ({ ...prev, [itemId]: !prev[itemId] }));
                            };

                            const liveQty = isEditing ? toNumber(f?.quantity, item.quantity) : item.quantity;
                            const livePrice = isEditing ? toNumber(f?.price, item.price) : item.price;
                            const liveTotal = (liveQty * livePrice).toFixed(2);

                            return (
                              <Box key={idx} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                  <Box>
                                    <Typography variant="body2"><strong>{item.ERP_inventory_product?.name}</strong></Typography>
                                    {!isEditing && (
                                      <Typography variant="caption">
                                        Cantidad: {item.quantity} × ${item.price.toFixed(2)} = {(item.quantity * item.price).toFixed(2)}
                                      </Typography>
                                    )}
                                  </Box>

                                  {/* Eliminar ítem (solo Programador y fuera de edición) */}
                                  {isProgrammer && !isEditing && (
                                    <Tooltip title="Eliminar ítem">
                                      <IconButton
                                        size="small"
                                        onClick={() => openItemDialog(item)}
                                      >
                                        <DeleteOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>

                                {/* Acciones rápidas si no está en edición */}
                                {!item.paidAt && !isEditing && (
                                  <Tooltip title="Marcar como Pagado">
                                    <IconButton onClick={() => handlePaid(itemId)}>
                                      <MonetizationOnIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {!item.deliveredAt && !isEditing && (
                                  <Tooltip title="Marcar como Entregado">
                                    <IconButton onClick={() => handleDeliver(itemId)}>
                                      <LocalShippingIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}

                                {/* Botón Editar solo para Programador */}
                                {isProgrammer && !isEditing && (
                                  <Box sx={{ mt: 1 }}>
                                    <Button size="small" onClick={toggleEdit} variant="outlined">
                                      Editar
                                    </Button>
                                  </Box>
                                )}

                                {/* Modo edición: fechas + cantidad/precio */}
                                {isEditing && (
                                  <Box sx={{ mt: 2 }}>
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="caption" gutterBottom>Detalles de ítem:</Typography>
                                      <Grid container spacing={1} alignItems="flex-end">
                                        <Grid item xs={12} sm={3}>
                                          <TextField
                                            label="Cantidad"
                                            type="number"
                                            inputProps={{ min: 0, step: 1 }}
                                            fullWidth
                                            value={f?.quantity ?? ''}
                                            onChange={(e) => handleChange(itemId, 'quantity', e.target.value)}
                                          />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                          <TextField
                                            label="Precio (USD)"
                                            type="number"
                                            inputProps={{ min: 0, step: '0.01' }}
                                            fullWidth
                                            value={f?.price ?? ''}
                                            onChange={(e) => handleChange(itemId, 'price', e.target.value)}
                                          />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                          <Typography variant="body2" sx={{ pl: { sm: 1 } }}>
                                            Total: ${liveTotal}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Box>

                                    {['paid', 'delivered'].map((prefix) => (
                                      <Box key={prefix} sx={{ mb: 1 }}>
                                        <Typography variant="caption" gutterBottom>
                                          {prefix === 'paid' ? 'Pagado' : 'Entregado'}:
                                        </Typography>
                                        <Grid container spacing={1}>
                                          <Grid item xs={12} sm={3}>
                                            <TextField
                                              label="Fecha"
                                              type="date"
                                              fullWidth
                                              value={f[`${prefix}Date`] || ''}
                                              onChange={(e) => handleChange(itemId, `${prefix}Date`, e.target.value)}
                                            />
                                          </Grid>
                                          <Grid item xs={4} sm={3}>
                                            <TextField
                                              label="Hora"
                                              type="number"
                                              inputProps={{ min: 0, max: 23 }}
                                              fullWidth
                                              value={f[`${prefix}Hour`] || ''}
                                              onChange={(e) => handleChange(itemId, `${prefix}Hour`, e.target.value)}
                                            />
                                          </Grid>
                                          <Grid item xs={4} sm={3}>
                                            <TextField
                                              label="Minuto"
                                              type="number"
                                              inputProps={{ min: 0, max: 59 }}
                                              fullWidth
                                              value={f[`${prefix}Minute`] || ''}
                                              onChange={(e) => handleChange(itemId, `${prefix}Minute`, e.target.value)}
                                            />
                                          </Grid>
                                          <Grid item xs={4} sm={3}>
                                            <TextField
                                              label="Segundo"
                                              type="number"
                                              inputProps={{ min: 0, max: 59 }}
                                              fullWidth
                                              value={f[`${prefix}Second`] || ''}
                                              onChange={(e) => handleChange(itemId, `${prefix}Second`, e.target.value)}
                                            />
                                          </Grid>
                                        </Grid>
                                      </Box>
                                    ))}

                                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={async () => {
                                          await handleConfirm(itemId);
                                          toggleEdit();
                                          onReload?.();
                                        }}
                                      >
                                        Confirmar
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={toggleEdit}
                                      >
                                        Cancelar
                                      </Button>
                                    </Box>
                                  </Box>
                                )}

                                {order.notes && !isEditing && (
                                  <>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                      Notas: {order.notes}
                                    </Typography>
                                  </>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
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
