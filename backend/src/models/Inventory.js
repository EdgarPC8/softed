import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { Account } from './Account.js';




// Tabla de movimientos de inventario (entrada, salida, ajuste)
export const InventoryMovement = sequelize.define('ERP_inventory_movements', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT},
  price: {
  type: DataTypes.FLOAT,
  allowNull: true, // solo se usa para entradas normalmente
},

  type: { type: DataTypes.ENUM("entrada", "salida","ajuste","produccion"), allowNull: false },
  referenceType: { type: DataTypes.STRING, allowNull: true }, // ej: "order"
  
  referenceId: { type: DataTypes.INTEGER, allowNull: true },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }
});


// Tabla de recetas: define qué productos (insumos) componen un producto final
export const InventoryRecipe = sequelize.define('ERP_inventory_recipes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  productFinalId: { type: DataTypes.INTEGER, allowNull: false }, // Producto final
  productRawId: { type: DataTypes.INTEGER, allowNull: false },   // Insumo
  quantity: { type: DataTypes.FLOAT, allowNull: false },         // Cantidad del insumo
  isQuantityInGrams: { type: DataTypes.BOOLEAN,defaultValue:false}       // Cantidad del insumo
}, {
  timestamps: false
});

export const InventoryCategory = sequelize.define("ERP_inventory_categories", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: { type: DataTypes.TEXT },

}, {
  timestamps: false
});

export const InventoryUnit = sequelize.define('ERP_inventory_units', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  abbreviation: { type: DataTypes.STRING, allowNull: false }, // Ej: kg, l, un
  description: { type: DataTypes.STRING },
  factor: { type: DataTypes.FLOAT, defaultValue: 0 },

}, {
  timestamps: false
});

// Tabla principal de productos o insumos
export const InventoryProduct = sequelize.define('ERP_inventory_products', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: { type: DataTypes.STRING, allowNull: false },
  type: {
    type: DataTypes.ENUM('raw', 'intermediate','final'),
    defaultValue: 'raw'
  },
  unitId: {
    type: DataTypes.INTEGER,
    references: {
      model: InventoryUnit,
      key: 'id'
    },
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ERP_inventory_categories',
      key: 'id'
    }
  },
  standardWeightGrams: { type: DataTypes.FLOAT, defaultValue: 0 },
  stock: { type: DataTypes.FLOAT, defaultValue: 0 },
  minStock: { type: DataTypes.FLOAT, defaultValue: 0 },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
  timestamps: true
});


InventoryCategory.hasMany(InventoryProduct, {
  foreignKey: "categoryId",
  onDelete: "SET NULL"
});
InventoryProduct.belongsTo(InventoryCategory, {
  foreignKey: "categoryId"
});


// Relación para producto final → receta
InventoryProduct.hasMany(InventoryRecipe, { foreignKey: 'productFinalId', as: 'recipe' });
InventoryRecipe.belongsTo(InventoryProduct, { foreignKey: 'productFinalId', as: 'finalProduct' });

// Relación para insumo en receta
InventoryProduct.hasMany(InventoryRecipe, { foreignKey: 'productRawId', as: 'usedInRecipes' });
InventoryRecipe.belongsTo(InventoryProduct, { foreignKey: 'productRawId', as: 'rawProduct' });

InventoryProduct.hasMany(InventoryMovement, { foreignKey: 'productId', onDelete: 'CASCADE' });
InventoryMovement.belongsTo(InventoryProduct, { foreignKey: 'productId' });
InventoryUnit.hasMany(InventoryProduct, { foreignKey: 'unitId' });
InventoryProduct.belongsTo(InventoryUnit, { foreignKey: 'unitId' });

InventoryMovement.belongsTo(Account, { foreignKey: "createdBy" });




