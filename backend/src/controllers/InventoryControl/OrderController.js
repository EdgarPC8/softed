import { verifyJWT, getHeaderToken } from "../../libs/jwt.js";

import { InventoryMovement, InventoryProduct } from "../../models/Inventory.js";
import { Customer, Order, OrderItem } from "../../models/Orders.js";
import { Income } from "../../models/Finance.js";
export const markItemAsPaid = async (req, res) => {
  try {
    const { itemId } = req.params;
    const token = getHeaderToken(req);
    const user = await verifyJWT(token);

    const item = await OrderItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.paidAt) {
      return res.status(400).json({ message: 'This item is already marked as paid' });
    }

    item.paidAt = new Date();
    await item.save();

    // Check if all items in the order are paid
    const allItems = await OrderItem.findAll({ where: { orderId: item.orderId } });
    const allPaid = allItems.every(i => !!i.paidAt);

    if (allPaid) {
      const order = await Order.findByPk(item.orderId);
      order.status = 'pagado';
      await order.save();

      // Check for existing income
      const existingIncome = await Income.findOne({
        where: {
          referenceId: order.id,
          referenceType: 'order',
        }
      });

      if (!existingIncome) {
        const total = allItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        await Income.create({
          date: new Date(),
          amount: total,
          concept: `Order #${order.id} payment`,
          category: 'Sales',
          referenceId: order.id,
          referenceType: 'order',
          createdBy: user.accountId,
        });
      }
    }

    res.json({ message: 'Item marked as paid', item });

  } catch (error) {
    console.error("Error in markItemAsPaid:", error);
    res.status(500).json({ message: 'Error marking item as paid', error });
  }
};

export const markItemAsDelivered = async (req, res) => {
  try {
    const { itemId } = req.params;
    const token = getHeaderToken(req);
    const user = await verifyJWT(token);

    const item = await OrderItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.deliveredAt) {
      return res.status(400).json({ message: 'Este ítem ya fue marcado como entregado' });
    }
    
    const product = await InventoryProduct.findByPk(item.productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: 'Stock insuficiente para entregar este ítem' });
    }
    

    // 1. Deduct stock
    product.stock -= item.quantity;
    await product.save();

    // 2. Record stock movement
    await InventoryMovement.create({
      productId: item.productId,
      quantity: item.quantity,
      type: "salida",
      referenceType: "order",
      referenceId: item.orderId,
      date: new Date(),
      createdBy: user.accountId
    });

    // 3. Mark as delivered (set delivery timestamp)
    item.deliveredAt = new Date();
    await item.save();

    // 4. Check if all items are delivered
    const allItems = await OrderItem.findAll({ where: { orderId: item.orderId } });
    const allDelivered = allItems.every(i => !!i.deliveredAt);

    if (allDelivered) {
      const order = await Order.findByPk(item.orderId);
      if (order.status !== 'paid') {
        order.status = 'entregado';
        await order.save();
      }
    }

    res.json({ message: 'Item delivered, stock updated, and movement recorded', item });

  } catch (error) {
    console.error("Error delivering item:", error);
    res.status(500).json({ message: 'Error delivering item', error });
  }
};



// Crear un nuevo cliente
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente', error });
  }
};

// Crear un nuevo pedido
export const createOrder = async (req, res) => {
  try {
    const { customerId, notes, items } = req.body;
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Faltan datos del pedido' });
    }

    const order = await Order.create({ customerId, notes });

    const createdItems = await Promise.all(
      items.map((item) =>
        OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          statusEntrega: false,
          statusPago: false,
        })
      )
    );

    res.status(201).json({ order, items: createdItems });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error });
  }
};

export const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    if (order.status === 'pagado') {
      return res.status(400).json({ message: 'El pedido ya está marcado como pagado' });
    }

    order.status = 'pagado';
    await order.save();

    res.json({ message: 'Pedido marcado como pagado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar pedido como pagado', error });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Ítem no encontrado" });
    await item.destroy();
    res.json({ message: "Ítem eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ítem", error });
  }
};


// Editar un pedido y su cliente
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, notes, items } = req.body;

    const token = getHeaderToken(req);
    const user = await verifyJWT(token);
    const order = await Order.findByPk(id);
    // ❌ Bloquea si el pedido ya está cerrado
    if (
      ['entregado', 'pagado'].includes(order.status) &&
      !['Administrador', 'Programador'].includes(user.loginRol) // asumiendo que tienes acceso al rol
    ) {
      return res.status(403).json({
        message: `No tiene permisos para editar pedidos ${order.status}`,
      });
    }

    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });



    order.customerId = customerId;
    order.notes = notes;
    await order.save();

    await OrderItem.destroy({ where: { orderId: id } });

    const updatedItems = await Promise.all(
      items.map((item) =>
        OrderItem.create({
          orderId: id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          statusEntrega: false,
          statusPago: false,
        })
      )
    );

    res.json({ message: 'Pedido actualizado', order, items: updatedItems });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pedido', error });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, price } = req.body;

    const item = await OrderItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Ítem no encontrado' });

    item.quantity = quantity;
    item.price = price;
    await item.save();

    res.json({ message: 'Ítem actualizado correctamente', item });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ítem', error });
  }
};


// Cambiar el estado del pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    order.status = status;
    await order.save();
    res.json({ message: 'Estado actualizado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado del pedido', error });
  }
};

// Obtener todos los pedidos con sus items y cliente
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: "ERP_customer"
        },
        {
          model: OrderItem,
          as: "ERP_order_items",
          include: [
            {
              model: InventoryProduct,
              as: "ERP_inventory_product"
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};

