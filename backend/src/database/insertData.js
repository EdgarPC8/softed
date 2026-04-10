import { promises as fs } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { Roles } from "../models/Roles.js";
import { Users } from "../models/Users.js";
import { Account, AccountRoles } from "../models/Account.js";
import { License } from "../models/License.js";
import { Logs } from "../models/Logs.js";
import { Notifications } from "../models/Notifications.js";
import {
  QuizQuizzes,
  QuizQuestions,
  QuizOptions,
  QuizAttempts,
  QuizAssignment,
  QuizAnswers,
} from "../models/Quiz.js";
import {
  Form,
  Question,
  Option,
  Response,
  Answer,
  UserForm,
} from "../models/Forms.js";
import { CvTemplate } from "../models/CvTemplate.js";
import { PianoSong } from "../models/PianoSong.js";
import { sequelize } from "./connection.js";

export const backupFilePath = resolve(__dirname, "backup.json");
export const backups = resolve(__dirname, "..", "backups");

const unwrapJsonString = (value, maxDepth = 12) => {
  let v = value;
  for (let i = 0; i < maxDepth; i++) {
    if (typeof v !== "string") break;
    const s = v.trim();
    const looksJson =
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]")) ||
      (s.startsWith('"') && s.endsWith('"'));
    if (!looksJson) break;
    try {
      v = JSON.parse(s);
    } catch {
      break;
    }
  }
  return v;
};

const BULK_OPT = { returning: false };

/** Respaldo / restore: cuentas, notificaciones, logs, licencias, encuestas, plantillas CV, cuestionarios y canciones Piano (tabla piano_songs). */
export const insertData = async () => {
  try {
    await fs.access(backupFilePath);
    const data = await fs.readFile(backupFilePath, "utf8");
    const jsonData = JSON.parse(data);

    if (Array.isArray(jsonData.QuizAnswers)) {
      jsonData.QuizAnswers = jsonData.QuizAnswers.map((row) => {
        if (typeof row.selectedOptionIds === "string") {
          const fixed = unwrapJsonString(row.selectedOptionIds);
          if (Array.isArray(fixed)) row.selectedOptionIds = fixed;
        }
        return row;
      });
    }

    const t = await sequelize.transaction();
    try {
      const opt = { ...BULK_OPT, transaction: t };

      await Roles.bulkCreate(jsonData.Roles || [], opt);
      await Users.bulkCreate(jsonData.Users || [], opt);
      await Account.bulkCreate(jsonData.Account || [], opt);
      await AccountRoles.bulkCreate(jsonData.AccountRoles || [], opt);
      await License.bulkCreate(jsonData.License || [], opt);

      await Form.bulkCreate(jsonData.Form || [], opt);
      await Question.bulkCreate(jsonData.Question || [], opt);
      await Option.bulkCreate(jsonData.Option || [], opt);
      await Response.bulkCreate(jsonData.Response || [], opt);
      await Answer.bulkCreate(jsonData.Answer || [], opt);
      await UserForm.bulkCreate(jsonData.UserForm || [], opt);

      await Notifications.bulkCreate(jsonData.Notifications || [], opt);

      if (Array.isArray(jsonData.CvTemplates) && jsonData.CvTemplates.length > 0) {
        await CvTemplate.bulkCreate(jsonData.CvTemplates, opt);
      }

      await QuizQuizzes.bulkCreate(jsonData.QuizQuizzes || [], opt);
      await QuizQuestions.bulkCreate(jsonData.QuizQuestions || [], opt);
      await QuizOptions.bulkCreate(jsonData.QuizOptions || [], opt);
      await QuizAttempts.bulkCreate(jsonData.QuizAttempts || [], opt);
      await QuizAnswers.bulkCreate(jsonData.QuizAnswers || [], opt);
      await QuizAssignment.bulkCreate(jsonData.QuizAssignment || [], opt);

      await PianoSong.bulkCreate(jsonData.PianoSongs || [], opt);

      await Logs.bulkCreate(jsonData.Logs || [], opt);

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
    console.log("Datos SoftEd insertados desde backup.json");
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(
        backupFilePath,
        JSON.stringify(
          {
            Roles: [],
            Users: [],
            Account: [],
            License: [],
            PianoSongs: [],
            Logs: [],
          },
          null,
          2
        )
      );
      console.log("Creado backup.json vacío (SoftEd)");
    } else {
      console.error("Error insertData SoftEd:", error);
    }
  }
};

export const saveBackup = async () => {
  try {
    const [
      rolesData,
      usersData,
      accountData,
      accountRolesData,
      licenseData,
      formData,
      questionData,
      optionData,
      responseData,
      answerData,
      userFormData,
      notificationsData,
      cvTemplatesData,
      quizQuizzesData,
      quizQuestionsData,
      quizOptionsData,
      quizAttemptsData,
      quizAnswersData,
      quizAssignmentData,
      pianoSongsData,
      logsData,
    ] = await Promise.all([
      Roles.findAll({ raw: true }),
      Users.findAll({ raw: true }),
      Account.findAll({ raw: true }),
      AccountRoles.findAll({ raw: true }),
      License.findAll({ raw: true }),
      Form.findAll({ raw: true }),
      Question.findAll({ raw: true }),
      Option.findAll({ raw: true }),
      Response.findAll({ raw: true }),
      Answer.findAll({ raw: true }),
      UserForm.findAll({ raw: true }),
      Notifications.findAll({ raw: true }),
      CvTemplate.findAll({ raw: true }),
      QuizQuizzes.findAll({ raw: true }),
      QuizQuestions.findAll({ raw: true }),
      QuizOptions.findAll({ raw: true }),
      QuizAttempts.findAll({ raw: true }),
      QuizAnswers.findAll({ raw: true }),
      QuizAssignment.findAll({ raw: true }),
      PianoSong.findAll({ raw: true }),
      Logs.findAll({ raw: true }),
    ]);

    const backupData = {
      Roles: rolesData,
      Users: usersData,
      Account: accountData,
      AccountRoles: accountRolesData,
      License: licenseData,
      Form: formData,
      Question: questionData,
      Option: optionData,
      Response: responseData,
      Answer: answerData,
      UserForm: userFormData,
      Notifications: notificationsData,
      CvTemplates: cvTemplatesData,
      QuizQuizzes: quizQuizzesData,
      QuizQuestions: quizQuestionsData,
      QuizOptions: quizOptionsData,
      QuizAttempts: quizAttemptsData,
      QuizAnswers: quizAnswersData,
      QuizAssignment: quizAssignmentData,
      PianoSongs: pianoSongsData,
      Logs: logsData,
    };

    await fs.mkdir(backups, { recursive: true });
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const backupPath = resolve(backups, `backup-${timestamp}.json`);

    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    await fs.writeFile(backupFilePath, JSON.stringify(backupData, null, 2));
    console.log("Backup SoftEd guardado:", backupPath);
    return backupPath;
  } catch (error) {
    console.error("Error saveBackup SoftEd:", error);
    throw error;
  }
};

export const downloadBackup = async (req, res) => {
  try {
    const backupPath = await saveBackup();
    res.download(backupPath, (err) => {
      if (err) {
        console.error("Error al enviar backup:", err);
        res.status(500).send("Error al enviar el archivo.");
      }
    });
  } catch (error) {
    console.error("Error downloadBackup:", error);
    res.status(500).send("Error al generar backup.");
  }
};
