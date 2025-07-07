import axios, { jwt } from "./axios.js";

/// 🟢 Pedidos
// Crear un nuevo pedido con items
export const createOrderRequest = async (data) =>
  await axios.post("/orders", data, {
    headers: { Authorization: jwt() },
  });

// Cambiar estado del pedido (entregado, cancelado)
export const updateOrderStatusRequest = async (orderId, status) =>
  await axios.put(`/orders/${orderId}/status`, { status }, {
    headers: { Authorization: jwt() },
  });

// Obtener todos los pedidos (con cliente e items)
export const getAllOrdersRequest = async () =>
  await axios.get("/orders", {
    headers: { Authorization: jwt() },
  });
  export const updateOrderRequest = async (id, data) =>
  await axios.put(`/orders/${id}`, data, {
    headers: { Authorization: jwt() },
  });
// ✅ Marcar ítem como entregado
export const markItemAsDeliveredRequest = async (itemId) =>
  await axios.put(`/orders/order-items/${itemId}/mark-delivered`, {}, {
    headers: { Authorization: jwt() },
  });

// 💰 Marcar ítem como pagado
export const markItemAsPaidRequest = async (itemId) =>
  await axios.put(`/orders/order-items/${itemId}/mark-paid`, {}, {
    headers: { Authorization: jwt() },
  });
  export const updateOrderItemRequest = async (itemId, data) =>
  await axios.put(`/orders/order-items/${itemId}`, data, {
    headers: { Authorization: jwt() },
  });


export const getAllCustomersRequest = async () =>
  await axios.get('/orders/customers', { headers: { Authorization: jwt() } });

export const createCustomerRequest = async (data) =>
  await axios.post('/orders/customers', data, { headers: { Authorization: jwt() } });

export const updateCustomerRequest = async (id, data) =>
  await axios.put(`/orders/customers/${id}`, data, { headers: { Authorization: jwt() } });

export const deleteCustomerRequest = async (id) =>
  await axios.delete(`/orders/customers/${id}`, { headers: { Authorization: jwt() } });
