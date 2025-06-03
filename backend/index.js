import express from "express";
import cors from "cors";
import { sequelize } from "./src/database/connection.js";
import { insertData } from "./src/database/insertData.js";
import { loggerMiddleware } from "./src/middlewares/loggerMiddleware.js";
import UsersRoutes from "./src/routes/UsersRoutes.js";
import AuthRoutes from "./src/routes/AuthRoutes.js";
import ComandsRoutes from "./src/routes/ComandsRoutes.js";
import AccountsRoutes from "./src/routes/AccountsRoutes.js";
import QuizRoutes from "./src/routes/QuizRoutes.js";
import FormsRoutes from "./src/routes/FormsRoutes.js";
import AlumniRoutes from "./src/routes/AlumniRoutes.js";



const app = express();
const PORT = 4000;

// Middleware para parsear JSON
app.use(express.json());
app.use(loggerMiddleware);

const allowedOrigins = [
  "http://localhost",
  "http://localhost:8888",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://192.168.137.228:5174",
  "http://aplicaciones.marianosamaniego.edu.ec",
  "http://www.aplicaciones.marianosamaniego.edu.ec",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Verifica si el origen está en la lista de orígenes permitidos
    // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    // } else {
    //   callback(new Error("Acceso no permitido por CORS"));
    // }
  },
  optionsSuccessStatus: 200,
  credentials: true, // Permite el envío de cookies y encabezados de autenticación
};
app.use(cors(corsOptions));

app.use("/photos", express.static("src/img/photos"));
app.use("/api/users", UsersRoutes);
app.use("/api/quiz", QuizRoutes);
app.use("/api", AuthRoutes);
app.use("/api/comands", ComandsRoutes);
app.use("/api", AccountsRoutes);
app.use("/api/forms", FormsRoutes);
app.use("/api/alumni", AlumniRoutes);

export async function main() {
  try {
    // Autentificación con la base de datos
    // await sequelize.authenticate();

    // Sincronización de tablas (opcional: descomentar si es necesario)
    // await sequelize.sync({ force: true });
    // await insertData();

    console.log("Conexión realizada con éxito.");
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Backend escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error en la conexión a la base de datos:", error);
  }
}

main();
