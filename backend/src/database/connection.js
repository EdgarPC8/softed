import Sequelize from "sequelize";

const sequelize = new Sequelize("graduates", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export { sequelize };
