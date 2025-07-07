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

// 📊 Resumen financiero

// Obtener resumen de ingresos, gastos y balance
export const getFinanceSummaryRequest = async () => {
  return await axios.get("/finance/summary", {
    headers: { Authorization: jwt() },
  });
};
