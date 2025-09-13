import axios, { jwt } from "./axios"; // Tu instancia base de axios

// ✅ Ingresos

// Crear un nuevo ingreso
export const createIncomeRequest = async (data) => {
  return await axios.post("/finance/incomes", data, {
    headers: { Authorization: jwt() },
  });
};

// Obtener todos los ingresos
export const getAllIncomesRequest = async () => {
  return await axios.get("/finance/incomes", {
    headers: { Authorization: jwt() },
  });
};

// Actualizar un ingreso
export const updateIncomeRequest = async (id, data) => {
  return await axios.put(`/finance/incomes/${id}`, data, {
    headers: { Authorization: jwt() },
  });
};

// Eliminar un ingreso
export const deleteIncomeRequest = async (id) => {
  return await axios.delete(`/finance/incomes/${id}`, {
    headers: { Authorization: jwt() },
  });
};

// ✅ Gastos

// Crear un nuevo gasto
export const createExpenseRequest = async (data) => {
  return await axios.post("/finance/expenses", data, {
    headers: { Authorization: jwt() },
  });
};

// Obtener todos los gastos
export const getAllExpensesRequest = async () => {
  return await axios.get("/finance/expenses", {
    headers: { Authorization: jwt() },
  });
};

// Actualizar un gasto
export const updateExpenseRequest = async (id, data) => {
  return await axios.put(`/finance/expenses/${id}`, data, {
    headers: { Authorization: jwt() },
  });
};

// Eliminar un gasto
export const deleteExpenseRequest = async (id) => {
  return await axios.delete(`/finance/expenses/${id}`, {
    headers: { Authorization: jwt() },
  });
};

// 📊 Resumen financiero

// Obtener resumen de ingresos, gastos y balance
export const getFinanceSummaryRequest = async () => {
  return await axios.get("/finance/summary", {
    headers: { Authorization: jwt() },
  });
};
export const getOverViewRequest = async () => {
  return await axios.get("/finance/overview", {
    headers: { Authorization: jwt() },
  });
};
export const getWeeklySales = async () => {
  return await axios.get("/finance/getWeeklySales", {
    headers: { Authorization: jwt() },
  });
};
export const getTopProductsDailySales = async () => {
  return await axios.get("/finance/getTopProductsDailySales", {
    headers: { Authorization: jwt() },
  });
};
export const getProductRotationAnalysis = async () => {
  return await axios.get("/finance/getProductRotationAnalysis", {
    headers: { Authorization: jwt() },
  });
};
export const getIncomeExpenseBreakdown = async () => {
  return await axios.get("/finance/getIncomeExpenseBreakdown", {
    headers: { Authorization: jwt() },
  });
};
export const getCustomerSalesSummary = async () => {
  return await axios.get("/finance/getCustomerSalesSummary", {
    headers: { Authorization: jwt() },
  });
};
