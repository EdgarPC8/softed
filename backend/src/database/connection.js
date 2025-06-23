import Sequelize from "sequelize";

const sequelize = new Sequelize("softed", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export { sequelize };
