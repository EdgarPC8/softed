// routes/financeRoutes.js
import { Router } from "express";
import {
  createIncome,
  createExpense,
  getAllIncomes,
  getAllExpenses,
  getFinanceSummary,
} from "../controllers/InventoryControl/FinanceController.js";
import { isAuthenticated } from "../middlewares/authMiddelware.js";


// Puedes agregar un middleware de autenticación si lo usas, ejemplo:

const router =new Router();

// Registrar un nuevo ingreso
router.post("/incomes", isAuthenticated,createIncome);
router.get("/incomes", isAuthenticated,getAllIncomes);
router.post("/expenses", isAuthenticated,createExpense);
router.get("/expenses", isAuthenticated,getAllExpenses);
router.get("/summary", isAuthenticated,getFinanceSummary);

export default router;
