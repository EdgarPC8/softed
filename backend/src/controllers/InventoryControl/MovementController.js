// controllers/MovementController.js
import { verifyJWT, getHeaderToken } from "../../libs/jwt.js";



import { InventoryMovement, InventoryProduct, InventoryRecipe } from '../../models/Inventory.js';

// Crear un movimiento y actualizar el stock del producto
export const registerMovement = async (req, res) => {
  try {
    const { productId, type, quantity, description } = req.body;
    const token = getHeaderToken(req);
    const user = await verifyJWT(token); // para createdBy
    let quantityGramos=0
    // console.log("-------------------------------------------------------------------------------------------",user)

    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const product = await InventoryProduct.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Registrar el movimiento principal
  

    // Si es producción, descontar los insumos de la receta
    if (type === "produccion") {
      
      // 1. Obtener la receta del producto final
      const recipe = await InventoryRecipe.findAll({
        where: { productFinalId: productId },
      });
    
      // 2. Procesar cada insumo de la receta
      for (const item of recipe) {
        const insumo = await InventoryProduct.findByPk(item.productRawId);
        if (!insumo) continue;
    
        // 3. Calcular la cantidad total usada según las unidades producidas
      
        const totalUsed = parseFloat(item.quantity) * parseFloat(quantity); // receta base (en gramos) * unidades a producir
        if (insumo.unitId == 1) {
          // console.log("-------------------------------------------------------",insumo)
          totalUsed = Math.ceil(totalUsed); // redondea hacia arriba solo si es unidad
        }
        // 4. Registrar el movimiento de salida del insumo
        await InventoryMovement.create({
          productId: insumo.id,
          type: "salida",
          quantity: totalUsed,
          description: `Consumo de ${totalUsed}g para producir ${quantity} unidad(es) de ${product.name}`,
          createdBy: user.accountId, // ✅ opcional: registra quién lo hizo
        });
    
        // 5. Descontar del stock del insumo
        insumo.stock -= totalUsed;
        quantityGramos+=totalUsed
        await insumo.save();
      }
    
      // 6. Aumentar el stock del producto final (en unidades)
      // product.stock += quantity;
      // await product.save();
    }
    
    else if (type === "entrada") {
      product.stock += quantity;
      await product.save();
    } else if (type === "salida") {
      product.stock -= quantity;
      await product.save();
    }else if (type === "ajuste") {
      product.stock = quantity; // se ajusta el stock directamente
      await product.save();
    }

    const mainMovement = await InventoryMovement.create({
      productId,
      type,
      quantity:quantityGramos,
      description,
      createdBy:user.accountId
    });

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
