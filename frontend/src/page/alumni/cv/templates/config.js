/**
 * Registro de plantillas de CV. Cada una define: id, nombre, descripción, secciones que incluye y componente.
 */
import TemplateCompleta from "./TemplateCompleta.jsx";
import TemplateResumida from "./TemplateResumida.jsx";

export const CV_TEMPLATES = [
  {
    id: "completa",
    name: "Plantilla completa",
    description: "Incluye todos los datos: foto CV, datos de contacto, datos personales, resumen, formación académica, experiencia docente, cursos/talleres, producción intelectual, libros, méritos, idiomas y experiencia profesional.",
    type: "Completa",
    sections: [
      "Foto y datos principales",
      "Datos de contacto",
      "Datos personales",
      "Resumen / Perfil",
      "Formación académica",
      "Experiencia docente",
      "Cursos y talleres",
      "Producción intelectual",
      "Libros",
      "Méritos",
      "Idiomas",
      "Experiencia profesional",
    ],
    component: TemplateCompleta,
  },
  {
    id: "resumida",
    name: "Plantilla resumida",
    description: "Versión corta: foto, datos personales, resumen, formación académica y experiencia profesional. Ideal para una página.",
    type: "Parcial",
    sections: [
      "Foto y datos principales",
      "Datos personales",
      "Resumen",
      "Formación académica",
      "Experiencia profesional",
    ],
    component: TemplateResumida,
  },
];

export function getTemplateById(id) {
  return CV_TEMPLATES.find((t) => t.id === id) || CV_TEMPLATES[0];
}
