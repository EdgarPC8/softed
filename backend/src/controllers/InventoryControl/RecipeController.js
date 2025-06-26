import { InventoryRecipe,InventoryProduct } from "../../models/Inventory.js";

// controllers/RecipeController.js
// Obtener la receta completa de un producto final
export const getRecipe = async (req, res) => {
  try {
    const { productFinalId } = req.params;
    const recipe = await InventoryRecipe.findAll({
      where: { productFinalId },
      include: [
        { model: InventoryProduct, as: 'rawProduct', attributes: ['id', 'name', 'unitId'] }
      ]
    });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener receta', error });
  }
};

// Crear una receta (varios ingredientes a la vez)
export const createRecipe = async (req, res) => {
  try {
    const data = req.body; // arreglo de objetos [{productFinalId, productRawId, quantity}]
    const created = await InventoryRecipe.bulkCreate(data);
    res.status(201).json("created");
  } catch (error) {
    res.status(500).json({ message: 'Error al crear receta', error });
  }
};

// Actualizar un insumo en la receta
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InventoryRecipe.update(req.body, { where: { id } });
    res.json({ message: 'Ingrediente actualizado', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar receta', error });
  }
};

// Eliminar un insumo de la receta
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    await InventoryRecipe.destroy({ where: { id } });
    res.json({ message: 'Ingrediente eliminado de la receta' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar receta', error });
  }
};
