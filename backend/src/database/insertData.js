import { promises as fs } from 'fs';
import { resolve } from 'path';
import { Roles } from '../models/Roles.js';
import { Users } from '../models/Users.js';
import { Quizzes,
  Questions,
  Options,
  AnswersUsers } from '../models/Quiz.js';
import { Account } from '../models/Account.js';
import { sequelize } from './connection.js';
import { Careers, Matriz, Periods } from '../models/Alumni.js';
import { Form,
Question,
  Option,
  Response,
  Answer,
  UserForm } from '../models/Forms.js';

  




const backupFilePath = resolve('./src/database/backup.json'); // Ruta del archivo de respaldo principal
const backups = resolve('./src/backups'); // Ruta para guardar copias de seguridad

export const insertData = async () => {

  try {
    // await clearTables()
    // Verifica si el archivo de respaldo ya existe

    await fs.access(backupFilePath);
    console.log("El archivo de respaldo ya existe.");

    // Si existe, lee los datos del archivo de respaldo
    const data = await fs.readFile(backupFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Inserta los datos en la base de datos
    await Roles.bulkCreate(jsonData.Roles, { returning: true });
    await Users.bulkCreate(jsonData.Users, { returning: true });
    await Account.bulkCreate(jsonData.Account, { returning: true });
    await Quizzes.bulkCreate(jsonData.Quizzes, { returning: true });
    await Questions.bulkCreate(jsonData.Questions, { returning: true });
    await Options.bulkCreate(jsonData.Options, { returning: true });
    await AnswersUsers.bulkCreate(jsonData.AnswersUsers, { returning: true });
    await Careers.bulkCreate(jsonData.Careers, { returning: true });
    await Periods.bulkCreate(jsonData.Periods, { returning: true });
    await Form.bulkCreate(jsonData.Form, { returning: true });
    await Question.bulkCreate(jsonData.Question, { returning: true });
    await Option.bulkCreate(jsonData.Option, { returning: true });
    await Response.bulkCreate(jsonData.Response, { returning: true });
    await Answer.bulkCreate(jsonData.Answer, { returning: true });
    await UserForm.bulkCreate(jsonData.UserForm, { returning: true });
    await Matriz.bulkCreate(jsonData.Matriz, { returning: true });

    console.log("Datos insertados correctamente desde el archivo de respaldo.");
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si el archivo no existe, crea el archivo de respaldo vacío
      await fs.writeFile(backupFilePath, JSON.stringify({ Roles: [], Users: [], Account: [] }, null, 2));
      console.log("Archivo de respaldo creado: backup.json");
    } else {
      console.error("Error al insertar datos:", error);
    }
  }
};


export const saveBackup = async () => {
  try {
    // Obtener los datos actuales de los modelos
    const rolesData = await Roles.findAll();
    const usersData = await Users.findAll();
    const accountData = await Account.findAll();
    const quizzesData = await Quizzes.findAll();
    const questionsData = await Questions.findAll();
    const optionsData = await Options.findAll();
    const answersUsersData = await AnswersUsers.findAll();
    const careersData = await Careers.findAll();
    const periodsData = await Periods.findAll();
    const FormData = await Form.findAll();
    const QuestionData = await Question.findAll();
    const OptionData = await Option.findAll();
    const ResponseData = await Response.findAll();
    const AnswerData = await Answer.findAll();
    const UserFormData = await UserForm.findAll();
    const MatrizData = await Matriz.findAll();

    const backupData = {
      Roles: rolesData,
      Users: usersData,
      Account: accountData,
      Quizzes: quizzesData,
      Questions: questionsData,
      Options: optionsData,
      AnswersUsers: answersUsersData,
      Careers: careersData,
      Periods: periodsData,
      Form: FormData,
      Question: QuestionData,
      Option: OptionData,
      Response: ResponseData,
      Answer: AnswerData,
      UserForm: UserFormData,
      Matriz: MatrizData,
    };

    await fs.mkdir(backups, { recursive: true });

    // Fecha legible
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    const backupFileName = `backup-${timestamp}.json`;
    const backupPath = resolve(backups, backupFileName);

    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    console.log("Backup guardado correctamente en:", backupPath);

    await fs.writeFile(backupFilePath, JSON.stringify(backupData, null, 2));
    console.log("Archivo de respaldo principal actualizado:", backupFilePath);

    return backupPath;
  } catch (error) {
    console.error("Error al guardar el backup:", error);
    throw error;
  }
};



export const downloadBackup = async (req, res) => {
  try {
    const backupData = await saveBackup(); // Guarda el backup y obtiene los datos

    // Enviar los datos como respuesta JSON
    res.status(200).json(backupData);
  } catch (error) {
    console.error("Error al realizar el backup:", error);
    res.status(500).send("Error al realizar el backup.");
  }
};
