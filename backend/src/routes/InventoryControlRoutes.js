// routes/inventoryRoutes.js
import express from 'express';
import { isAuthenticated } from "../middlewares/authMiddelware.js";

// Product Controllers
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/InventoryControl/ProductController.js';

// Movement and Recipe Controllers (aún en InventoryController.js)
import { 
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/InventoryControl/RecipeController.js';

// Category Controllers
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/InventoryControl/CategoryController.js';

// Unit Controllers
import {
  createUnit,
  getAllUnits,
  updateUnit,
  deleteUnit,
} from '../controllers/InventoryControl/UnitController.js';


import {
  registerMovement,
  getMovementsByProduct,
  getAllMovements,
  registerProductionIntermediateFromPayload,
  registerProductionFinalFromPayload
} from '../controllers/InventoryControl/MovementController.js';


// routes/customerRoutes.js
import { 
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
 } from '../controllers/InventoryControl/CustomerController.js';
import { simulateFromIntermediate, simulateProductionController } from '../controllers/InventoryControl/ProductionManagerController.js';



const router = express.Router();

// ----------------------------------
// 🔁 CLIENTES
// ----------------------------------

router.get('/customers', isAuthenticated, getAllCustomers);
router.post('/customers', isAuthenticated, createCustomer);
router.put('/customers/:id', isAuthenticated, updateCustomer);
router.delete('/customers/:id', isAuthenticated, deleteCustomer);
// ----------------------------------
// 📦 PRODUCTOS
// ----------------------------------
router.post('/products', isAuthenticated, createProduct);            // Crear producto
router.get('/products', isAuthenticated, getAllProducts);           // Obtener todos los productos
router.put('/products/:id', isAuthenticated, updateProduct);        // Editar producto
router.delete('/products/:id', isAuthenticated, deleteProduct);     // Eliminar producto

// ----------------------------------
// 🔁 MOVIMIENTOS
// ----------------------------------
// Registrar un nuevo movimiento de inventario
router.post('/movements', isAuthenticated, registerMovement);
router.get("/simulate-production", isAuthenticated,simulateProductionController);
router.get("/simulateFromIntermediate", isAuthenticated,simulateFromIntermediate);

// Obtener todos los movimientos por producto
router.get('/movements',isAuthenticated, getAllMovements);
router.get('/movements/:productId',isAuthenticated, getMovementsByProduct);

router.post("/registerProductionIntermediateFromPayload", isAuthenticated,registerProductionIntermediateFromPayload);
router.post("/registerProductionFinalFromPayload", isAuthenticated,registerProductionFinalFromPayload);

// ----------------------------------
// 🍳 RECETAS (opcional)
// ----------------------------------


// Obtener receta de un producto final
router.get('/recipes/:productFinalId', isAuthenticated, getRecipe);

// Crear receta completa (uno o varios insumos)
router.post('/recipes', isAuthenticated, createRecipe);

// Editar cantidad de un insumo en la receta
router.put('/recipes/:id', isAuthenticated, updateRecipe);

// Eliminar un insumo de la receta
router.delete('/recipes/:id', isAuthenticated, deleteRecipe);

// ----------------------------------
// 🏷️ CATEGORÍAS
// ----------------------------------
router.post('/categories', isAuthenticated, createCategory);        // Crear categoría
router.get('/categories', isAuthenticated, getAllCategories);       // Listar categorías
router.put('/categories/:id', isAuthenticated, updateCategory);     // Editar categoría
router.delete('/categories/:id', isAuthenticated, deleteCategory);  // Eliminar categoría

// ----------------------------------
// 📏 UNIDADES
// ----------------------------------
router.post('/units', isAuthenticated, createUnit);                 // Crear unidad
router.get('/units', isAuthenticated, getAllUnits);                 // Listar unidades
router.put('/units/:id', isAuthenticated, updateUnit);              // Editar unidad
router.delete('/units/:id', isAuthenticated, deleteUnit);           // Eliminar unidad




export default router;
