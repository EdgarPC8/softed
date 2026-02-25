/** Valor inyectado desde vite.config.js (variable ACTIVE_APP). No edites aquí. */
const ACTIVE_APP_ID = import.meta.env.VITE_ACTIVE_APP ?? "softed";

const appsInfo = {
  softed: {
    logo: "./android-chrome-512x512.png",
    name: "SoftEd",
    alias: "SoftEd",
    version: "1.0.0",
    description: "Entorno unificado con todos los sistemas.",
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "#f5f6fa",
    apiPath: "eddeliapi",
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
  },
};

const activeApp = appsInfo[ACTIVE_APP_ID] || appsInfo.softed;
const activeAppId = ACTIVE_APP_ID;
const basename = "/" + activeAppId;
const apiPath = activeApp.apiPath;

export default appsInfo;
export { activeApp, activeAppId, basename, apiPath };
