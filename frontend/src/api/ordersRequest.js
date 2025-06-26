import axios, { jwt } from "./axios.js";

/// 🔵 Clientes
export const createCustomerRequest = async (data) =>
  await axios.post("orders/customers", data, {
    headers: { Authorization: jwt() },
  });

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
