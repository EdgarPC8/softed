import { Container, Typography, Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import ViewModule from "@mui/icons-material/ViewModule";
import CvMainInfo from "./components/CvMainInfo.jsx";
import CvSectionAccordion from "./components/CvSectionAccordion.jsx";
import {
  getAllAcademicTraining,
  addAcademicTraining,
  editAcademicTraining,
  deleteAcademicTraining,
  getAllTeachingExperience,
  addTeachingExperience,
  editTeachingExperience,
  deleteTeachingExperience,
  getAllCoursesWorkshops,
  addCoursesWorkshops,
  editCoursesWorkshops,
  deleteCoursesWorkshops,
  getAllIntellectualProduction,
  addIntellectualProduction,
  editIntellectualProduction,
  deleteIntellectualProduction,
  getAllBooks,
  addBooks,
  editBooks,
  deleteBooks,
  getAllMerits,
  addMerits,
  editMerits,
  deleteMerits,
  getAllLanguages,
  addLanguages,
  editLanguages,
  deleteLanguages,
  getAllProfessionalExperience,
  addProfessionalExperience,
  editProfessionalExperience,
  deleteProfessionalExperience,
} from "../../../api/cvRequest.js";

const sectionConfigs = [
  {
    title: "Formación académica",
    getAll: getAllAcademicTraining,
    add: addAcademicTraining,
    edit: editAcademicTraining,
    remove: deleteAcademicTraining,
    idParam: "academicId",
    dataColumns: [
      { field: "obtainedTitle", headerName: "Título", width: 200 },
      { field: "educationalInstitution", headerName: "Institución", width: 180 },
      { field: "date", headerName: "Fecha", width: 110 },
    ],
    formFields: [
      { name: "type", label: "Tipo" },
      { name: "date", label: "Fecha", type: "date" },
      { name: "place", label: "Lugar" },
      { name: "country", label: "País" },
      { name: "obtainedTitle", label: "Título obtenido" },
      { name: "educationalInstitution", label: "Institución" },
      { name: "senescytRegistrationN", label: "Registro SENESCYT" },
    ],
    initialValues: { type: "", date: "", place: "", country: "", obtainedTitle: "", educationalInstitution: "", senescytRegistrationN: "" },
  },
  {
    title: "Experiencia docente",
    getAll: getAllTeachingExperience,
    add: addTeachingExperience,
    edit: editTeachingExperience,
    remove: deleteTeachingExperience,
    idParam: "teachingId",
    dataColumns: [
      { field: "educationalInstitution", headerName: "Institución", width: 180 },
      { field: "subject", headerName: "Asignatura", width: 150 },
      { field: "startDate", headerName: "Inicio", width: 110 },
      { field: "endDate", headerName: "Fin", width: 110 },
    ],
    formFields: [
      { name: "educationalInstitution", label: "Institución" },
      { name: "subject", label: "Asignatura" },
      { name: "startDate", label: "Fecha inicio", type: "date" },
      { name: "endDate", label: "Fecha fin", type: "date" },
      { name: "modality", label: "Modalidad" },
      { name: "place", label: "Lugar" },
      { name: "country", label: "País" },
    ],
    initialValues: { educationalInstitution: "", subject: "", startDate: "", endDate: "", modality: "", place: "", country: "" },
  },
  {
    title: "Cursos, talleres y seminarios",
    getAll: getAllCoursesWorkshops,
    add: addCoursesWorkshops,
    edit: editCoursesWorkshops,
    remove: deleteCoursesWorkshops,
    idParam: "courseId",
    dataColumns: [
      { field: "name", headerName: "Nombre", width: 200 },
      { field: "type", headerName: "Tipo", width: 120 },
      { field: "organizedBy", headerName: "Organizado por", width: 150 },
    ],
    formFields: [
      { name: "type", label: "Tipo" },
      { name: "name", label: "Nombre" },
      { name: "organizedBy", label: "Organizado por" },
      { name: "place", label: "Lugar" },
      { name: "duration", label: "Duración" },
      { name: "startDate", label: "Fecha inicio" },
      { name: "endDate", label: "Fecha fin" },
    ],
    initialValues: { type: "", name: "", organizedBy: "", place: "", duration: "", startDate: "", endDate: "" },
  },
  {
    title: "Producción intelectual",
    getAll: getAllIntellectualProduction,
    add: addIntellectualProduction,
    edit: editIntellectualProduction,
    remove: deleteIntellectualProduction,
    idParam: "intellectualId",
    dataColumns: [
      { field: "name", headerName: "Nombre", width: 220 },
      { field: "type", headerName: "Tipo", width: 120 },
      { field: "date", headerName: "Fecha", width: 110 },
    ],
    formFields: [
      { name: "type", label: "Tipo" },
      { name: "name", label: "Nombre" },
      { name: "typeAuthorship", label: "Tipo autoría" },
      { name: "date", label: "Fecha" },
      { name: "webLink", label: "Enlace web" },
    ],
    initialValues: { type: "", name: "", typeAuthorship: "", date: "", webLink: "" },
  },
  {
    title: "Libros",
    getAll: getAllBooks,
    add: addBooks,
    edit: editBooks,
    remove: deleteBooks,
    idParam: "bookId",
    dataColumns: [
      { field: "title", headerName: "Título", width: 220 },
      { field: "type", headerName: "Tipo", width: 100 },
      { field: "year", headerName: "Año", width: 80 },
    ],
    formFields: [
      { name: "title", label: "Título" },
      { name: "type", label: "Tipo" },
      { name: "typeAuthorship", label: "Tipo autoría" },
      { name: "isbN", label: "ISBN" },
      { name: "editorialName", label: "Editorial" },
      { name: "editorialOrigin", label: "Origen editorial" },
      { name: "year", label: "Año" },
    ],
    initialValues: { title: "", type: "", typeAuthorship: "", isbN: "", editorialName: "", editorialOrigin: "", year: "" },
  },
  {
    title: "Méritos académicos y profesionales",
    getAll: getAllMerits,
    add: addMerits,
    edit: editMerits,
    remove: deleteMerits,
    idParam: "meritId",
    dataColumns: [
      { field: "name", headerName: "Nombre", width: 200 },
      { field: "type", headerName: "Tipo", width: 120 },
      { field: "date", headerName: "Fecha", width: 110 },
    ],
    formFields: [
      { name: "name", label: "Nombre" },
      { name: "date", label: "Fecha" },
      { name: "type", label: "Tipo" },
      { name: "grantedBy", label: "Otorgado por" },
      { name: "country", label: "País" },
      { name: "location", label: "Lugar" },
    ],
    initialValues: { name: "", date: "", type: "", grantedBy: "", country: "", location: "" },
  },
  {
    title: "Idiomas",
    getAll: getAllLanguages,
    add: addLanguages,
    edit: editLanguages,
    remove: deleteLanguages,
    idParam: "languageId",
    dataColumns: [
      { field: "name", headerName: "Idioma", width: 120 },
      { field: "typeCertification", headerName: "Certificación", width: 150 },
      { field: "speakingLevel", headerName: "Habla", width: 100 },
    ],
    formFields: [
      { name: "name", label: "Idioma" },
      { name: "typeCertification", label: "Tipo certificación" },
      { name: "speakingLevel", label: "Nivel habla" },
      { name: "writingLevel", label: "Nivel escritura" },
      { name: "comprehensionLevel", label: "Nivel comprensión" },
    ],
    initialValues: { name: "", typeCertification: "", speakingLevel: "", writingLevel: "", comprehensionLevel: "" },
  },
  {
    title: "Experiencia profesional",
    getAll: getAllProfessionalExperience,
    add: addProfessionalExperience,
    edit: editProfessionalExperience,
    remove: deleteProfessionalExperience,
    idParam: "experienceId",
    dataColumns: [
      { field: "companyInstitution", headerName: "Empresa / Institución", width: 180 },
      { field: "position", headerName: "Cargo", width: 150 },
      { field: "startDate", headerName: "Inicio", width: 110 },
      { field: "endDate", headerName: "Fin", width: 110 },
    ],
    formFields: [
      { name: "companyInstitution", label: "Empresa / Institución" },
      { name: "position", label: "Cargo" },
      { name: "responsibilities", label: "Responsabilidades" },
      { name: "immediateHead", label: "Jefe inmediato" },
      { name: "telephone", label: "Teléfono" },
      { name: "startDate", label: "Fecha inicio", type: "date" },
      { name: "endDate", label: "Fecha fin", type: "date" },
    ],
    initialValues: { companyInstitution: "", position: "", responsibilities: "", immediateHead: "", telephone: "", startDate: "", endDate: "" },
  },
];

export default function CVPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 8 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} spacing={1}>
        <Typography variant="h5">Hoja de vida</Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} to="/cv/plantillas" variant="outlined" size="small" startIcon={<ViewModule />}>
            Plantillas de CV
          </Button>
          <Button component={Link} to="/cv/ver" variant="contained" size="small" startIcon={<Visibility />}>
            Ver mi CV / PDF
          </Button>
        </Stack>
      </Stack>

      <CvMainInfo />

      <Box>
        {sectionConfigs.map((config) => (
          <CvSectionAccordion key={config.title} {...config} />
        ))}
      </Box>
    </Container>
  );
}
