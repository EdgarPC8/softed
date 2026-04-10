/** Valor inyectado desde vite.config.js (variable ACTIVE_APP). No edites aquí. */
const ACTIVE_APP_ID = import.meta.env.VITE_ACTIVE_APP ?? "softed";

/** API del shell SoftEd (Piano, Quiz, Forms, Alumni, CV, comandos) — puerto 3004. */
const SOFTED_MODULES_API_PATH = "softedapi";
const SOFTED_MODULES_API_PORT = 3004;

const appsInfo = {
  softed: {
    logo: "./android-chrome-512x512.png",
    name: "SoftEd",
    alias: "SoftEd",
    version: "1.0.0",
    description: "Inventario y ERP vía EdDeli API; piano, cuestionarios, alumni y CV vía SoftEd API.",
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "#f5f6fa",
    apiPath: "eddeliapi",
    apiPort: 3001,
    softedApiPath: SOFTED_MODULES_API_PATH,
    softedApiPort: SOFTED_MODULES_API_PORT,
  },

  alumni: {
    logo: "./logo_alumni.png",
    name: "Sistema Alumni",
    alias: "Alumni",
    version: "1.2.4",
    description: `
      Este sistema ha sido desarrollado para la gestión de usuarios, Bolsa de Empleo, encuestas y currículums
      de egresados y graduados.
    `,
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "#f5f6fa",
    apiPath: "alumniapi",
    apiPort: 3001,
  },

  turnos: {
    logo: "./android-chrome-512x512.png",
    name: "Turnos - Agendación",
    alias: "Turnos",
    version: "1.0.0",
    description: "Sistema de agendación de turnos para estética, uñas, pelo y más.",
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    apiPath: "turnosapi",
    apiPort: 3002,
  },

  enfermeria: {
    logo: "./android-chrome-512x512.png",
    name: "Sistema Clínico - Enfermería",
    alias: "Enfermería",
    version: "1.0.0",
    description: "Sistema clínico de gestión de pacientes, fichas médicas e instituciones.",
    author: "Patricio Briceño, Edgar Torres",
    year: new Date().getFullYear(),
    background: "linear-gradient(135deg, #1976D2 0%, #0D47A1 50%, #42A5F5 100%)",
    apiPath: "enfermeriaapi",
    apiPort: 3003,
  },

  musica: {
    logo: "./android-chrome-512x512.png",
    name: "Música",
    alias: "Música",
    version: "1.0.0",
    description: "Aplicación base: usuarios, roles, cuentas y notificaciones.",
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #880e4f 100%)",
    apiPath: "musicaapi",
    apiPort: 3002,
  },

  eddeli: {
    logo: "./logo.jpeg",
    name: "EdDeli - Panadería, Pastelería y Repostería",
    alias: "EdDeli",
    version: "1.0.0",
    socials: {
      whatsapp: "https://wa.me/593992371711",
      facebook: "https://facebook.com/profile.php?id=61581806494763",
      instagram: "https://instagram.com/panaderia_eddeli",
      tiktok: "https://tiktok.com/@panaderia_eddeli",
      email: "panaderiaeddeli@gmail.com",
    },
    description: `
      Sistema integral de gestión y control para la panadería EdDeli.
    `,
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "#fff8f2",
    apiPath: "eddeliapi",
    apiPort: 3001,
  },
};

const activeApp = appsInfo[ACTIVE_APP_ID] || appsInfo.softed;
const activeAppId = ACTIVE_APP_ID;
const basename = "/" + activeAppId;
const apiPath = activeApp.apiPath;
const softedApiPath = activeApp.softedApiPath ?? null;
const softedApiPort = activeApp.softedApiPort ?? null;

export default appsInfo;
export {
  activeApp,
  activeAppId,
  basename,
  apiPath,
  softedApiPath,
  softedApiPort,
  SOFTED_MODULES_API_PATH,
  SOFTED_MODULES_API_PORT,
};
