/**
 * API SoftEd — base (users/roles/accounts/notifications/logs), Piano, Quiz, Forms, CV y comandos.
 * Sin módulo Alumni (usa el backend alumni). EdDeli: inventario/pedidos/finanzas/editor.
 */
import express from "express";
import cors from "cors";

import { sequelize } from "./src/database/connection.js";
import "./src/database/insertData.js";
import { loggerMiddleware } from "./src/middlewares/loggerMiddleware.js";

import PianoRoutes from "./src/routes/PianoRoutes.js";
import QuizRoutes from "./src/routes/QuizRoutes.js";
import FormsRoutes from "./src/routes/FormsRoutes.js";
import CvRoutes from "./src/routes/cvRoutes.js";
import ComandsRoutes from "./src/routes/ComandsRoutes.js";

const app = express();
const api = "softedapi";
const PORT = Number(process.env.SOFTED_API_PORT || 3004);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
  "http://localhost:8888",
  "http://192.168.1.102:8888",
  "http://192.168.1.102:5173",
  "http://192.168.1.102:5174",
  "https://aplicaciones.marianosamaniego.edu.ec",
  "https://www.aplicaciones.marianosamaniego.edu.ec",
];

app.use(express.json());
app.use(loggerMiddleware);

const corsOptions = {
  origin(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("Acceso no permitido por CORS"));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(`/${api}/piano`, PianoRoutes);
app.use(`/${api}/quiz`, QuizRoutes);
app.use(`/${api}/forms`, FormsRoutes);
app.use(`/${api}/cv`, CvRoutes);
app.use(`/${api}/comands`, ComandsRoutes);

app.get(`/${api}/health`, (_, res) => {
  res.json({ ok: true, service: "softed", api });
});

async function main() {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`🟣 SoftEd API (${api}) puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ SoftEd: error de conexión a la base de datos:", error);
    process.exit(1);
  }
}

main();
