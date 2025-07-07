// controllers/financeController.js
import { Account } from "../../models/Account.js";
import { Income, Expense } from "../../models/Finance.js";
/**
 * Crear un nuevo ingreso
 * Se usa cuando se registra una venta u otro ingreso en el sistema
 */
export const createIncome = async (req, res) => {
  try {
    const { date, amount, concept, category, referenceId, referenceType } = req.body;
    const createdBy = req.accountId; // Se espera que el middleware de autenticación agregue accountId

    const income = await Income.create({
      date,
      amount,
      concept,
      category,
      referenceId,
      referenceType,
      createdBy,
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("Error al crear ingreso:", error);
    res.status(500).json({ message: "Error interno al crear ingreso" });
  }
};

/**
 * Crear un nuevo gasto
 * Se usa cuando se registra una compra, pago de servicios, etc.
 */
export const createExpense = async (req, res) => {
  try {
    const { date, amount, concept, category, referenceId, referenceType } = req.body;
    const createdBy = req.accountId;

    const expense = await Expense.create({
      date,
      amount,
      concept,
      category,
      referenceId,
      referenceType,
      createdBy,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error al crear gasto:", error);
    res.status(500).json({ message: "Error interno al crear gasto" });
  }
};

/**
 * Obtener todos los ingresos registrados
 * Se puede filtrar o expandir para búsquedas avanzadas
 */
export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({
      include: [{ model: Account }],
      order: [["date", "DESC"]],
    });
    res.json(incomes);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    res.status(500).json({ message: "Error interno al obtener ingresos" });
  }
};

/**
 * Obtener todos los gastos registrados
 * Se puede usar para mostrar el historial de egresos
 */
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [{ model: Account }],
      order: [["date", "DESC"]],
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    res.status(500).json({ message: "Error interno al obtener gastos" });
  }
};

/**
 * Obtener resumen general de finanzas
 * Devuelve total de ingresos, total de gastos y balance neto
 */
export const getFinanceSummary = async (req, res) => {
  try {
    const [totalIncome, totalExpense] = await Promise.all([
      Income.sum("amount"),
      Expense.sum("amount"),
    ]);

    res.json({
      totalIncome: totalIncome || 0,
      totalExpense: totalExpense || 0,
      balance: (totalIncome || 0) - (totalExpense || 0),
    });
  } catch (error) {
    console.error("Error al obtener resumen financiero:", error);
    res.status(500).json({ message: "Error interno al obtener resumen financiero" });
  }
};
