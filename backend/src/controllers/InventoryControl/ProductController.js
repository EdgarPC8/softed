// controllers/ProductController.js
import { InventoryProduct } from '../../models/Inventory.js';
import { InventoryCategory } from '../../models/Inventory.js';
import { InventoryUnit } from '../../models/Inventory.js';

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const product = await InventoryProduct.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

// Obtener todos los productos con categoría y unidad
export const getAllProducts = async (req, res) => {
  try {
    const products = await InventoryProduct.findAll({
      include: [
        { model: InventoryCategory, attributes: ["id", "name"] },
        { model: InventoryUnit, attributes: ["id", "name", "abbreviation"] }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// Editar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InventoryProduct.update(req.body, { where: { id } });
    res.json({ message: "Producto actualizado", updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await InventoryProduct.destroy({ where: { id } });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};
