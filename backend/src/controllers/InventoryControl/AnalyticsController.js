import { Customer, Order, OrderItem } from "../../models/Orders.js";
import { Op, fn, col,literal } from 'sequelize';
const dias = ['L', 'M', 'W', 'J', 'V', 'S', 'D'];
import { startOfDay, endOfDay, subMonths, format, addDays, differenceInDays, parseISO  } from 'date-fns';

import { InventoryMovement, InventoryProduct } from "../../models/Inventory.js";

import { Income, Expense } from "../../models/Finance.js"; 

// controllers/OrdersController.js (o donde tengas tus controladores)



export const getCustomerSalesSummary = async (req, res) => {
  const toNum = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };

  const maxDate = (dates) => {
    const valid = dates
      .map(d => (d ? new Date(d) : null))
      .filter(d => d && !Number.isNaN(d.getTime()));
    if (!valid.length) return null;
    return new Date(Math.max(...valid.map(d => d.getTime())));
  };

  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              include: [
                {
                  model: InventoryProduct,
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    });

    const data = customers.map((c) => {
      const orders = Array.isArray(c.ERP_orders) ? c.ERP_orders : [];

      let totalQuantity = 0; // suma de quantity (todas las líneas)
      let totalPrice = 0;    // suma de la columna price (como viene en OrderItem)
      let totalAmount = 0;   // suma de quantity * price
      let paidFromOrders = 0; // suma de paidAmount en órdenes (si existe)
      let totalOrdersNoPaid=0
      let totalAmountDeuda=0

      // Agregación por producto
      const productMap = new Map();

      orders.forEach((o) => {
        paidFromOrders += toNum(o?.paidAmount, 0);

        const items = Array.isArray(o.ERP_order_items) ? o.ERP_order_items : [];
        items.forEach((item) => {
          const qty = toNum(item.quantity);
          const price = toNum(item.price);
          const amt = qty * price;

          totalQuantity += qty;
          totalPrice += price;
          totalAmount += amt;
          
          item.paidAt==null?totalOrdersNoPaid++:0
          item.paidAt==null?totalAmountDeuda+=item.quantity*item.price:0

          const p = item.ERP_inventory_product || {};
          const productId = p?.id ?? item.productId ?? null;
          const key = String(productId);

          if (!productMap.has(key)) {
            productMap.set(key, {
              productId,
              name: p?.name ?? '(sin nombre)',
              totalQuantity: 0,
              totalPrice: 0,   // suma de la columna price
              totalAmount: 0,  // suma de (quantity * price)
            });
          }
          const agg = productMap.get(key);
          agg.totalQuantity += qty;
          agg.totalPrice += price;
          agg.totalAmount += amt;
        });
      });

      const productSummary = Array.from(productMap.values())
        .sort((a, b) => b.totalAmount - a.totalAmount);

      const revenuePending = Math.max(0, totalAmount - paidFromOrders);

      const lastOrderAt =
        maxDate(
          orders.map(o => o?.date ?? o?.createdAt ?? o?.updatedAt ?? null)
        ) || null;

      return {
        customerId: c.id,
        customer: {
          id: c.id,
          name: c.name,
          phone: c.phone ?? null,
          email: c.email ?? null,
        },
        totalQuantity,
        totalPrice,
        totalAmount,
        totalOrdersNoPaid,
        totalAmountDeuda,
        revenuePending,  // lo que deben (no pagado)
        lastOrderAt,     // útil para mostrar en la tabla
        orders,          // por si quieres revisar detalle
        productSummary,  // para el accordion de productos
      };
    });

    return res.json(data);
  } catch (error) {
    console.error('Error en getCustomerSalesSummary:', error);
    return res.status(500).json({
      message: 'Error al obtener resumen por cliente',
      error: String(error?.message || error),
    });
  }
};


export const getIncomeExpenseBreakdown = async (req, res) => {
  // Utils locales (dentro del controlador)
  const toNum = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const round2 = (n) => Number.parseFloat(toNum(n).toFixed(2));

  try {
    // --- Filtros opcionales por fecha: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    const { startDate, endDate } = req.query;

    let dateWhere; // para createdAt
    if (startDate || endDate) {
      const start = startDate ? startOfDay(parseISO(startDate)) : undefined;
      const end = endDate ? endOfDay(parseISO(endDate)) : undefined;

      if (start && end) dateWhere = { [Op.between]: [start, end] };
      else if (start) dateWhere = { [Op.gte]: start };
      else if (end) dateWhere = { [Op.lte]: end };
    }

    const commonWhere = dateWhere ? { createdAt: dateWhere } : {};

    // --- Totales globales (crudos)
    const [totalIncomeRaw, totalExpenseRaw] = await Promise.all([
      Income.sum("amount", { where: commonWhere }),
      Expense.sum("amount", { where: commonWhere }),
    ]);

    const totalIncome = round2(totalIncomeRaw || 0);
    const totalExpense = round2(totalExpenseRaw || 0);
    const totalOverall = round2(totalIncome + totalExpense);

    // --- Sumas por categoría (crudo)
    const [incomeCats, expenseCats] = await Promise.all([
      Income.findAll({
        attributes: ["category", [fn("SUM", col("amount")), "total"]],
        where: commonWhere,
        group: ["category"],
      }),
      Expense.findAll({
        attributes: ["category", [fn("SUM", col("amount")), "total"]],
        where: commonWhere,
        group: ["category"],
      }),
    ]);

    // --- Subgrupos crudos (NO porcentaje)
    const incomeGroup = incomeCats.map((row) => {
      const cat = row.get("category") ?? "Sin categoría";
      const total = round2(row.get("total") || 0);
      return { label: String(cat), value: total }; // value = monto crudo
    });

    const expenseGroup = expenseCats.map((row) => {
      const cat = row.get("category") ?? "Sin categoría";
      const total = round2(row.get("total") || 0);
      return { label: String(cat), value: total }; // value = monto crudo
    });

    // --- Plataformas crudas (NO porcentaje)
    const platforms = [
      { label: "Ingresos", value: totalIncome }, // value = monto crudo
      { label: "Gastos", value: totalExpense },  // value = monto crudo
    ];

    // --- Payload crudo para que el frontend calcule % según necesite
    const payload = {
      platforms, // montos por plataforma
      groups: {
        Ingresos: incomeGroup, // montos por categoría de ingresos
        Gastos: expenseGroup,  // montos por categoría de gastos
      },
      meta: {
        totals: {
          income: totalIncome,
          expense: totalExpense,
          overall: totalOverall,
        },
        range: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
    };

    return res.json(payload);
  } catch (error) {
    console.error("Error en getIncomeExpenseBreakdown:", error);
    return res.status(500).json({
      message: "Error al obtener desglose de Ingresos/Gastos por categoría",
      error,
    });
  }
};
export const getProductRotationAnalysis = async (req, res) => {
  try {
    const products = await InventoryProduct.findAll();

    const results = [];

    for (const product of products) {
      const movements = await InventoryMovement.findAll({
        where: {
          productId: product.id,
        },
        order: [["date", "ASC"]],
      });

      let stock = 0;
      const entradas = [];
      const agotamientos = [];

      for (const move of movements) {
        if (move.type === "entrada") {
          entradas.push({ date: move.date, quantity: move.quantity });
          stock += move.quantity;
        } else if (["salida", "produccion"].includes(move.type)) {
          stock -= move.quantity;
          if (stock <= 0) {
            agotamientos.push({ date: move.date });
            stock = 0;
          }
        }
      }

      // Necesitamos al menos una entrada y un agotamiento para calcular
      if (entradas.length === 0 || agotamientos.length === 0) continue;

      const ultimaEntrada = entradas[entradas.length - 1].date;
      const ultimoAgotamiento = agotamientos[agotamientos.length - 1].date;

      const diasHastaAgotar = differenceInDays(ultimoAgotamiento, ultimaEntrada);
      const cantidadConsumida = entradas[entradas.length - 1].quantity;

      const consumoPromedioPorDia =
        diasHastaAgotar > 0 ? cantidadConsumida / diasHastaAgotar : 0;

      // Calcular ciclos entre entradas y agotamientos (mínimo 2 eventos cada uno)
      const ciclos = Math.min(entradas.length, agotamientos.length);
      const ciclosDias = [];

      for (let i = 0; i < ciclos; i++) {
        const dias = differenceInDays(
          parseISO(agotamientos[i].date.toISOString()),
          parseISO(entradas[i].date.toISOString())
        );
        if (dias > 0) ciclosDias.push(dias);
      }

      const cicloPromedio = ciclosDias.length
        ? ciclosDias.reduce((a, b) => a + b, 0) / ciclosDias.length
        : 0;

      results.push({
        producto: product.name,
        ultimaCompra: format(new Date(ultimaEntrada), "yyyy-MM-dd"),
        ultimoAgotamiento: format(new Date(ultimoAgotamiento), "yyyy-MM-dd"),
        diasHastaAgotar,
        consumoPromedioPorDia: parseFloat(consumoPromedioPorDia.toFixed(2)),
        cicloPromedio: parseFloat(cicloPromedio.toFixed(2)),
        unidad: product.unitId === 1 ? "unidades/día" : "kg/día", // puedes ajustar según tu lógica
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error en getProductRotationAnalysis:", error);
    res.status(500).json({
      message: "Error al calcular rotación de productos",
      error,
    });
  }
};

export const getTopProductsDailySales = async (req, res) => {
  try {
    const today = new Date();
    const startDate = startOfDay(subMonths(today, 1)); // mismo día del mes anterior
    const endDate = endOfDay(today);

    // 1. Obtener los 5 productos más vendidos
    const topProductsData = await OrderItem.findAll({
      attributes: ['productId', [fn('SUM', col('quantity')), 'totalSold']],
      include: [
        {
          model: Order,
          attributes: [],
          where: {
            status: 'pagado',
            createdAt: { [Op.between]: [startDate, endDate] },
          },
        },
      ],
      group: ['productId'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 5,
    });

    const topProductIds = topProductsData.map(p => p.productId);

    // 2. Obtener los nombres de los productos
    const products = await InventoryProduct.findAll({
      where: { id: topProductIds },
    });

    const productMap = {};
    for (const product of products) {
      productMap[product.id] = product.name;
    }

    // 3. Generar dataset por día
    const dataset = [];
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= totalDays; i++) {
      const day = addDays(startDate, i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const dataPoint = {
        date: format(day, 'yyyy-MM-dd'), // ✅ solo fecha
      };

      const items = await OrderItem.findAll({
        attributes: ['productId', [fn('SUM', col('quantity')), 'sold']],
        include: [
          {
            model: Order,
            attributes: [],
            where: {
              status: 'pagado',
              createdAt: { [Op.between]: [dayStart, dayEnd] },
            },
          },
        ],
        where: {
          productId: { [Op.in]: topProductIds },
        },
        group: ['productId'],
      });

      // Añadir los vendidos ese día
      for (const productId of topProductIds) {
        const item = items.find(i => i.productId === productId);
        const sold = item ? parseFloat(item.get('sold')) : 0;
        dataPoint[productId] = sold;
      }

      // Asegurar que todos los productos tengan clave
      topProductIds.forEach(id => {
        if (!(id in dataPoint)) {
          dataPoint[id] = 0;
        }
      });

      dataset.push(dataPoint);
    }

    // 4. Armar lista de productos con id y nombre
    const productList = topProductIds
      .map(id => {
        const name = productMap[id];
        if (!name) return null;
        return { id, name };
      })
      .filter(p => p !== null);

    res.json({
      products: productList,
      dataset,
    });

  } catch (error) {
    console.error("Error en getTopProductsDailySales:", error);
    res.status(500).json({
      message: "Error al obtener ventas diarias por producto",
      error,
    });
  }
};

export const getWeeklySales = async (req, res) => {
  try {
    const today = new Date();
    const todayIndex = (today.getDay() + 6) % 7; // lunes = 0, domingo = 6

    const labels = [];
    const values = [];

    for (let i = 0; i < 7; i++) {
      const offset = i <= todayIndex ? i - todayIndex : i - todayIndex - 7;
      const day = new Date(today);
      day.setDate(today.getDate() + offset);

      const label = `${dias[i]} ${format(day, 'dd/MM')}`;
      labels.push(label);

      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const orders = await Order.findAll({
        where: {
          status: 'pagado',
          createdAt: {
            [Op.between]: [dayStart, dayEnd],
          },
        },
        include: [
          {
            model: OrderItem,
            as: 'ERP_order_items',
          },
        ],
      });

      const total = orders.reduce((sum, order) => {
        const orderTotal = order.ERP_order_items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        return sum + orderTotal;
      }, 0);

      values.push(total);
    }

    res.json({ labels, values });
  } catch (error) {
    console.error("Error al obtener ventas semanales:", error);
    res.status(500).json({ message: "Error al obtener ventas diarias", error });
  }
};


export const getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: { model: OrderItem, as: "ERP_order_items" }
    });

    let totalUnpaid = 0;
    let totalPaidUndelivered = 0;
    let totalUnpaidUndelivered = 0;
    let totalDeliveredUnpaid = 0;

    for (const order of orders) {
      const items = order.ERP_order_items;

      const allPaid = items.every(i => !!i.paidAt);
      const allDelivered = items.every(i => !!i.deliveredAt);

      if (!allPaid) totalUnpaid += 1;
      if (allPaid && !allDelivered) totalPaidUndelivered += 1;
      if (!allPaid && !allDelivered) totalUnpaidUndelivered += 1;
      if (allDelivered && !allPaid) totalDeliveredUnpaid += 1;
    }

    const analyticsData = [
      { id: 'unpaidOrders', label: 'No Pagados', value: totalUnpaid },
      { id: 'paidUndeliveredOrders', label: 'Pagados no Entregados', value: totalPaidUndelivered },
      { id: 'unpaidUndeliveredOrders', label: 'No Pagados ni Entregados', value: totalUnpaidUndelivered },
      { id: 'deliveredUnpaidOrders', label: 'Entregados no Pagados', value: totalDeliveredUnpaid }
    ];

    res.json(analyticsData);

  } catch (error) {
    console.error("Error en getOrderAnalytics:", error);
    res.status(500).json({ message: "Error al calcular estadísticas", error });
  }
};


