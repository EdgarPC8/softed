import { InventoryProduct } from "../../models/Inventory.js";
import { Customer, Order, OrderItem } from "../../models/Orders.js";

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
      items.map(async (item) => {
        return await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      })
    );

    res.status(201).json({ order, items: createdItems });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error });
  }
};

// Editar un pedido y su cliente
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, notes, items } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    // Actualizar cliente
    const cliente = await Customer.findByPk(order.customerId);
    if (cliente) {
      await cliente.update({
        name: customer.name,
        phone: customer.phone,
      });
    }

    // Actualizar pedido
    order.notes = notes;
    await order.save();

    // Eliminar items anteriores y recrear
    await OrderItem.destroy({ where: { orderId: order.id } });
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        return await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      })
    );

    res.json({ order, items: updatedItems });
  } catch (error) {
    res.status(500).json({ message: 'Error al editar pedido', error });
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
        { model: Customer },
        {
          model: OrderItem,
          include: [{ model: InventoryProduct }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};
