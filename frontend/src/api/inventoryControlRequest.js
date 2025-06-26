import axios, { jwt } from './axios.js';

// 🟢 PRODUCTOS

// Obtener todos los productos con categoría y unidad asociadas
export const getAllProducts = async () =>
  await axios.get('/inventory/products', {
    headers: { Authorization: jwt() },
  });

// Crear un nuevo producto
export const createProduct = async (data) =>
  await axios.post('/inventory/products', data, {
    headers: { Authorization: jwt() },
  });

// Editar un producto existente por ID
export const updateProduct = async (id, data) =>
  await axios.put(`/inventory/products/${id}`, data, {
    headers: { Authorization: jwt() },
  });

// Eliminar un producto por ID
export const deleteProduct = async (id) =>
  await axios.delete(`/inventory/products/${id}`, {
    headers: { Authorization: jwt() },
  });


// 🔁 MOVIMIENTOS

// Registrar un movimiento de inventario (entrada, salida, ajuste, producción)
// 🔁 MOVIMIENTOS DE INVENTARIO

// Crear movimiento
export const registerMovement = async (data) =>
  await axios.post('/inventory/movements', data, {
    headers: { Authorization: jwt() },
  });

// Obtener movimientos por producto
export const getMovementsByProduct = async (productId) =>
  await axios.get(`/inventory/movements/${productId}`, {
    headers: { Authorization: jwt() },
  });

  export const getAllMovements = async () =>
  await axios.get("/inventory/movements", {
    headers: { Authorization: jwt() },
  });




// 🔧 RECETAS

// Obtener receta de un producto final
export const getRecipeByProduct = async (productFinalId) =>
  await axios.get(`/inventory/recipes/${productFinalId}`, {
    headers: { Authorization: jwt() },
  });

// Crear receta (uno o varios ingredientes)
export const createRecipeRequest = async (data) =>
  await axios.post(`/inventory/recipes`, data, {
    headers: { Authorization: jwt() },
  });

// Editar una línea de receta (cantidad)
export const updateRecipeRequest = async (id, data) =>
  await axios.put(`/inventory/recipes/${id}`, data, {
    headers: { Authorization: jwt() },
  });

// Eliminar un ingrediente de la receta
export const deleteRecipeRequest = async (id) =>
  await axios.delete(`/inventory/recipes/${id}`, {
    headers: { Authorization: jwt() },
  });



// 🏷️ CATEGORÍAS

// Obtener todas las categorías
export const getCategories = async () =>
  await axios.get('/inventory/categories', {
    headers: { Authorization: jwt() },
  });

// Crear una nueva categoría
export const createCategoryRequest = async (data) =>
  await axios.post('/inventory/categories', data, {
    headers: { Authorization: jwt() },
  });

// Editar una categoría por ID
export const updateCategoryRequest = async (id, data) =>
  await axios.put(`/inventory/categories/${id}`, data, {
    headers: { Authorization: jwt() },
  });

// Eliminar una categoría por ID
export const deleteCategoryRequest = async (id) =>
  await axios.delete(`/inventory/categories/${id}`, {
    headers: { Authorization: jwt() },
  });


// 📏 UNIDADES

// Obtener todas las unidades
export const getUnits = async () =>
  await axios.get('/inventory/units', {
    headers: { Authorization: jwt() },
  });

// Crear una nueva unidad
export const createUnitRequest = async (data) =>
  await axios.post('/inventory/units', data, {
    headers: { Authorization: jwt() },
  });

// Editar una unidad por ID
export const updateUnitRequest = async (id, data) =>
  await axios.put(`/inventory/units/${id}`, data, {
    headers: { Authorization: jwt() },
  });

// Eliminar una unidad por ID
export const deleteUnitRequest = async (id) =>
  await axios.delete(`/inventory/units/${id}`, {
    headers: { Authorization: jwt() },
  });



export const getAllCustomersRequest = async () =>
  await axios.get('/inventory/customers', { headers: { Authorization: jwt() } });

export const createCustomerRequest = async (data) =>
  await axios.post('/inventory/customers', data, { headers: { Authorization: jwt() } });

export const updateCustomerRequest = async (id, data) =>
  await axios.put(`/inventory/customers/${id}`, data, { headers: { Authorization: jwt() } });

export const deleteCustomerRequest = async (id) =>
  await axios.delete(`/inventory/customers/${id}`, { headers: { Authorization: jwt() } });

