// src/config/appsInfo.js
const appsInfo = {
    
  alumni: {
    logo: "./android-chrome-512x512.png",
    name: "SoftEd Sistema Alumni",
    alias: "Alumni",
    version: "1.2.0",
    description: `
      Este sistema ha sido desarrollado para la gestión de usuarios, encuestas y currículums
      de egresados y graduados. Permite administrar roles, acceder a estadísticas y manejar
      información educativa de manera eficiente y segura.
    `,
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "#f5f6fa",
  },

  eddeli: {
    logo: "./eddeli/logo.jpeg",
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
      Permite administrar recetas, inventarios, producción, pedidos y ventas 
      con un diseño elegante y funcional. Incluye paneles de control, 
      reportes, simulaciones de producción y catálogo digital.
    `,
    author: "SoftEd",
    year: new Date().getFullYear(),
    background: "#fff8f2",
  },
};

const activeApp = appsInfo.eddeli; // o appsInfo.alumni

export default appsInfo;
export { activeApp };
