import { InventoryCategory } from "../../models/Inventory.js";

// controllers/inventoryCategoryController.js
// Crear categoría
export const createCategory = async (req, res) => {
  try {
    const category = await InventoryCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear categoría', error: err });
  }
};

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const categories = await InventoryCategory.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err });
  }
};

// Editar categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InventoryCategory.update(req.body, { where: { id } });
    res.json({ message: 'Categoría actualizada', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar categoría', error: err });
  }
};

// Eliminar categoría
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await InventoryCategory.destroy({ where: { id } });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: err });
  }
};

