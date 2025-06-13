import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";
import { Users } from "./Users.js";

const Quizzes = sequelize.define(
  "policia_quizzes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

const Questions = sequelize.define(
  "policia_questions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
    },
    text: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

const Options = sequelize.define(
  "policia_options",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionId: {
      type: DataTypes.INTEGER,
    },
    text: {
      type: DataTypes.TEXT,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);

const AnswersUsers = sequelize.define(
  "policia_answersUsers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    questionId: {
      type: DataTypes.INTEGER,
    },
    optionId: {
      type: DataTypes.INTEGER,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
    },
    intent: {
      type: DataTypes.INTEGER,
    },
    focus: {
      type: DataTypes.BOOLEAN,
    },
  }
);

// Relaciones
// Un usuario puede tener muchas respuestas
Users.hasMany(AnswersUsers, { foreignKey: "userId" });
AnswersUsers.belongsTo(Users, { foreignKey: "userId" });

// Un cuestionario puede tener muchas preguntas
Quizzes.hasMany(Questions, { foreignKey: "quizId" });
Questions.belongsTo(Quizzes, { foreignKey: "quizId" });

// Una pregunta puede tener muchas opciones
Questions.hasMany(Options, { foreignKey: "questionId" });
Options.belongsTo(Questions, { foreignKey: "questionId" });

// Una pregunta puede tener muchas respuestas de usuarios
Questions.hasMany(AnswersUsers, { foreignKey: "questionId" });
AnswersUsers.belongsTo(Questions, { foreignKey: "questionId" });

// Una opción puede ser seleccionada en muchas respuestas
Options.hasMany(AnswersUsers, { foreignKey: "optionId" });
AnswersUsers.belongsTo(Options, { foreignKey: "optionId" });

export {Quizzes, Questions, Options, AnswersUsers };
