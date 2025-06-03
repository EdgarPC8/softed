import { sequelize } from "../database/connection.js";
import { DataTypes } from "sequelize";
import { Users } from "./Users.js";
import { Roles } from "./Roles.js";

export const Account = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
      },
    userId: {
    type: DataTypes.INTEGER,
    },
    rolId: {
    type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

Users.hasMany(Account, {
    foreignKey: "userId",
    sourceKey: "id",
  });
  
  Account.belongsTo(Users, {
    foreignKey: "userId",
    sourceKey: "id",
  });

  Roles.hasMany(Account, {
    foreignKey: "rolId",
    sourceKey: "id",
  });
  
  Account.belongsTo(Roles, {
    foreignKey: "rolId",
    sourceKey: "id",
  });

