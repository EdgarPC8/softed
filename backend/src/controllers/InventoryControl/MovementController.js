// controllers/MovementController.js


import { InventoryMovement, InventoryProduct, InventoryRecipe } from '../../models/Inventory.js';

// Crear un movimiento y actualizar el stock del producto
export const registerMovement = async (req, res) => {
  try {
    const { productId, type, quantity, description } = req.body;

    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const product = await InventoryProduct.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Registrar el movimiento principal
    const mainMovement = await InventoryMovement.create({
      productId,
      type,
      quantity,
      description,
    });

    // Si es producción, descontar los insumos de la receta
    if (type === "production") {
      const recipe = await InventoryRecipe.findAll({ where: { productFinalId: productId } });

      for (const item of recipe) {
        const insumo = await InventoryProduct.findByPk(item.productRawId);
        if (!insumo) continue;

        const totalUsed = item.quantity * quantity; // cantidad usada por cada unidad * cantidad producida

        // Registrar movimiento de salida del insumo
        await InventoryMovement.create({
          productId: insumo.id,
          type: "exit",
          quantity: totalUsed,
          description: `Consumo para producción de ${quantity} unidad(es) de ${product.name}`,
        });

        // Descontar stock del insumo
        insumo.stock -= totalUsed;
        await insumo.save();
      }

      // Aumentar stock del producto final producido
      product.stock += quantity;
      await product.save();
    } else if (type === "entry") {
      product.stock += quantity;
      await product.save();
    } else if (type === "exit" || type === "adjustment") {
      product.stock -= quantity;
      await product.save();
    }

    res.status(201).json(mainMovement);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar movimiento", error });
  }
};

// Obtener movimientos por producto
export const getMovementsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const movements = await InventoryMovement.findAll({
      where: { productId },
      order: [['date', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener movimientos", error });
  }
};

export const getAllMovements = async (req, res) => {
  try {
    const movements = await InventoryMovement.findAll({
      include: [
        { model: InventoryProduct, attributes: ["id", "name"] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener todos los movimientos", error });
  }
};
