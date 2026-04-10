import { BrowserRouter, Route, Routes } from "react-router-dom";
import { basename, activeAppId } from "../appConfig.js";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Login from "./page/Login";
import Comandos from "./page/Comandos";
import Analytics from "./page/hotel/Analytics.jsx";
import NavBar from "./Components/NavBar/NavBar.jsx";
import Reservas from "./page/hotel/Reservas.jsx";
import Recepcion from "./page/hotel/Recepcion.jsx";
import Users from "./page/Users.jsx";
import InfoHotel from "./page/hotel/InfoHotel.jsx";
import All from "./Components/AllComponents/All.jsx";
import NivelesHotel from "./page/hotel/NivelesHotel.jsx";
import Profile from "./page/Profile.jsx";
import Accounts from "./page/Accounts.jsx";
import { SnackbarProvider } from 'notistack';
import Logs from "./page/Logs.jsx";
import Quiz from "./page/Quiz.jsx";
import AdminFormsList from "./page/form/admin/AdminFormsList.jsx";
import FormsList from "./page/form/user/FormsList.jsx";
import FormQuestions from "./page/form/admin/FormQuestions.jsx";
import AssignForm from "./page/form/admin/AssignForm.jsx";
import FormAnswer from "./page/form/user/FormAnswer.jsx";
import FormResponsesCharts from "./page/form/admin/FormResponsesCharts.jsx";
import CareerPage from "./page/alumni/Entidades/CareerPage.jsx";
import PeriodPage from "./page/alumni/Entidades/PeriodPage.jsx";
import MatrizPage from "./page/alumni/Entidades/MatrizPage.jsx";
import FormViewer from "./page/form/admin/FormViewer.jsx";
import Tokens from "./page/Tokens.jsx";
import NotificationsPage from "./page/Notifications.jsx";
import NotificationProgramsPage from "./page/NotificationProgramsPage.jsx";
import PublicOnlyRoute from "./context/PublicOnlyRoute.jsx";
import Roles from "./page/Roles.jsx";
import ControlPanelPage from "./page/ControlPanel.jsx";
import Info from "./page/Info.jsx";
import Donations from "./page/Donations.jsx";
import AdminQuizList from "./page/quiz/admin/AdminQuizList.jsx";

import QuizQuestions from "./page/quiz/admin/QuizQuestions.jsx";
import QuizViewer from "./page/quiz/admin/QuizViewer.jsx";
import QuizResponsesCharts from "./page/quiz/admin/QuizResponsesCharts.jsx";
import AssignQuiz from "./page/quiz/admin/AssignQuiz.jsx";
import QuizList from "./page/quiz/user/QuizList.jsx";
import QuizAnswerEvaluation from "./page/quiz/user/QuizAnswerEvaluation.jsx";
import QuizSimulatorMode from "./page/quiz/user/QuizAnswerSimulator.jsx";
import QuizAnswerPractice from "./page/quiz/user/QuizAnswerPractice.jsx";
import ProductsPage from "./page/eddeli/inventoryControl/ProductsPage.jsx";
import CategoryPage from "./page/eddeli/inventoryControl/CategoryPage.jsx";
import UnitPage from "./page/eddeli/inventoryControl/UnitPage.jsx";
import MovementPage from "./page/eddeli/inventoryControl/MovementPage.jsx";
import RecipePage from "./page/eddeli/inventoryControl/RecipePage.jsx";
import OrderPage from "./page/eddeli/inventoryControl/OrderPage.jsx";
import CustomerPage from "./page/eddeli/inventoryControl/CustomerPage.jsx";
import FinancePage from "./page/eddeli/inventoryControl/FinancePage.jsx";
import CollectionsPage from "./page/eddeli/inventoryControl/CollectionsPage.jsx";
import HomePageAlumni from "./page/alumni/Home.jsx";
import CVPage from "./page/alumni/cv/CVPage.jsx";
import CvVer from "./page/alumni/cv/CvVer.jsx";
import CvPlantillas from "./page/alumni/cv/CvPlantillas.jsx";
import BolsaEmpleoHome from "./page/alumni/bolsaEmpleo/BolsaEmpleoHome.jsx";
import OfertaDetalle from "./page/alumni/bolsaEmpleo/OfertaDetalle.jsx";
import MisPostulaciones from "./page/alumni/bolsaEmpleo/MisPostulaciones.jsx";
import PerfilEmpresa from "./page/alumni/bolsaEmpleo/PerfilEmpresa.jsx";
import MisOfertasEmpresa from "./page/alumni/bolsaEmpleo/MisOfertasEmpresa.jsx";
import FormOfertaEmpresa from "./page/alumni/bolsaEmpleo/FormOfertaEmpresa.jsx";
import PostulantesOferta from "./page/alumni/bolsaEmpleo/PostulantesOferta.jsx";
import AdminEmpresasBolsa from "./page/alumni/bolsaEmpleo/AdminEmpresasBolsa.jsx";
import HomePageERP from "./page/eddeli/inventoryControl/HomePage.jsx";
import DashBoardPageERP from "./page/eddeli/inventoryControl/DashBoardPage.jsx";
import PianoPage from "./page/piano/index.jsx";
import PianoProPracticePage from "./page/pianoProPractice/index.jsx";
import SoftedHome from "./page/SoftedHome.jsx";
import TurnosHome from "./page/turnos/TurnosHome.jsx";
import TurnosHomeLogout from "./page/turnos/TurnosHomeLogout.jsx";
import ClientesPage from "./page/turnos/ClientesPage.jsx";
import EmpleadosPage from "./page/turnos/EmpleadosPage.jsx";
import ServiciosPage from "./page/turnos/ServiciosPage.jsx";
import AddonsPage from "./page/turnos/AddonsPage.jsx";
import TurnosPage from "./page/turnos/TurnosPage.jsx";
import EnfermeriaHome from "./page/enfermeria/EnfermeriaHome.jsx";
import PacientesPage from "./page/enfermeria/PacientesPage.jsx";
import PacienteDetallePage from "./page/enfermeria/PacienteDetallePage.jsx";
import InstitucionesPage from "./page/enfermeria/InstitucionesPage.jsx";
import Cie10Page from "./page/enfermeria/Cie10Page.jsx";
import LogsPage from "./page/enfermeria/LogsPage.jsx";
import FichaPage from "./page/enfermeria/FichaPage.jsx";
import AnadirFichaPage from "./page/enfermeria/AnadirFichaPage.jsx";
import FichaEstadisticasPage from "./page/enfermeria/FichaEstadisticasPage.jsx";
import FichaEstructuraPage from "./page/enfermeria/FichaEstructuraPage.jsx";
import HistorialClinicoPage from "./page/enfermeria/HistorialClinicoPage.jsx";
import TutorialEnfermeriaPage from "./page/enfermeria/TutorialEnfermeriaPage.jsx";
import ProductionManagerPage from "./page/eddeli/inventoryControl/ProductionManagerPage.jsx";
import BasicMap from "./page/mapa/BasicMap.jsx";
import ProMap from "./page/mapa/ProMap.jsx";
import HomeProductPage from "./page/eddeli/inventoryControl/HomeProduct.jsx";
import StoresManagerPage from "./page/eddeli/inventoryControl/StoresManagerPage.jsx";
import StoresPublicPage from "./page/eddeli/inventoryControl/StoresPublicPage.jsx";
import HomeLogout from "./page/eddeli/inventoryControl/HomeLogout.jsx";

import CatalogManagerPage from "./page/eddeli/inventoryControl/CatalogManagerPage.jsx";
import CatalogoPage from "./page/eddeli/CatalogPage.jsx";
import ImgManagerPage from "./page/ImgManagerPage.jsx";
import AdTemplateEditor from "./page/eddeli/AdTemplateEditor.jsx";
import EditorPage from "./page/eddeli/photoshop/EditorPage.jsx";
import ProductTemplateStudio from "./page/eddeli/photoshop/ProductTemplateStudio.jsx";
import FilesManagerPage from "./page/FileManager.jsx";
import EditorTemplatesView from "./page/eddeli/photoshop/EditorTemplatesView.jsx";
import MusicaHome from "./page/musica/MusicaHome.jsx";
import MusicaPianoProPage from "./page/musica/pianoPro/index.jsx";
import ChordSongsListPage from "./page/musica/chordSongs/ChordSongsListPage.jsx";
import ChordSongStructurePage from "./page/musica/chordSongs/ChordSongStructurePage.jsx";

// Home según app: alumni → Home Alumni, eddeli → Dashboard ERP, turnos → TurnosHome, enfermeria → EnfermeriaHome, musica → MusicaHome, softed → SoftedHome
const HomePage =
  activeAppId === "alumni"
    ? HomePageAlumni
    : activeAppId === "eddeli"
    ? DashBoardPageERP
    : activeAppId === "turnos"
    ? TurnosHome
    : activeAppId === "enfermeria"
    ? EnfermeriaHome
    : activeAppId === "musica"
    ? MusicaHome
    : SoftedHome;

// Home público (/home cuando no estás logeado): en alumni mismo home; en turnos TurnosHomeLogout; en enfermeria EnfermeriaHome; en musica MusicaHome; en eddeli/softed HomeLogout
const PublicHomePage =
  activeAppId === "alumni"
    ? HomePageAlumni
    : activeAppId === "turnos"
    ? TurnosHomeLogout
    : activeAppId === "enfermeria"
    ? EnfermeriaHome
    : activeAppId === "musica"
    ? MusicaHome
    : HomeLogout;

// Rutas que solo existen en eddeli o en softed (no en alumni)
const showEddeliRoutes = (activeAppId === "eddeli" || activeAppId === "softed") && activeAppId !== "turnos";
// Rutas que solo existen en alumni o en softed (no en eddeli)
const showAlumniRoutes = (activeAppId === "alumni" || activeAppId === "softed") && activeAppId !== "turnos";
// Rutas base para turnos (usuarios, roles, cuentas, comandos, logs, img)
const showTurnosRoutes = activeAppId === "turnos";
// Rutas para enfermería (pacientes, instituciones, logs)
const showEnfermeriaRoutes = activeAppId === "enfermeria";
// Rutas base app Música (usuarios, roles, cuentas, panel; sin módulos eddeli/alumni)
const showMusicaRoutes = activeAppId === "musica";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <AuthProvider>
          <BrowserRouter basename={basename}>
            <NavBar>

              <Routes>
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={<PublicHomePage />} />
                  {showTurnosRoutes && <Route path="/consultar" element={<TurnosHomeLogout />} />}
                </Route>
                {/* Catálogo y PV: fuera de PublicOnlyRoute (si no, la primera coincidencia redirige a "/" al estar logueado) */}
                {showEddeliRoutes && (
                  <>
                    <Route path="/catalogo" element={<CatalogoPage />} />
                    <Route path="/punto_venta" element={<StoresPublicPage />} />
                  </>
                )}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Estudiante", "Administrador", "Programador", "Empresa", "Profesional", "Empleado", "Doctor/a", "Enfermero/a", "Pasante", "Moderador"]} />
                  }
                >
                  <Route path="/" element={<HomePage />} />
                  {showEddeliRoutes && (
                    <Route path="/inicio" element={<HomeLogout />} />
                  )}
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/myforms" element={<FormsList />} />
                  <Route path="/myforms/:id" element={<FormAnswer />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/info" element={<Info />} />
                  {showEnfermeriaRoutes && <Route path="/tutorial" element={<TutorialEnfermeriaPage />} />}
                  <Route path="/donations" element={<Donations />} />
                  <Route path="/cv" element={<CVPage />} />
                  <Route path="/cv/ver" element={<CvVer />} />
                  <Route path="/cv/plantillas" element={<CvPlantillas />} />
                  {/* Bolsa de empleo */}
                  <Route path="/bolsa-empleo" element={<BolsaEmpleoHome />} />
                  <Route path="/bolsa-empleo/oferta/:id" element={<OfertaDetalle />} />
                  <Route path="/bolsa-empleo/mis-postulaciones" element={<MisPostulaciones />} />
                  <Route path="/bolsa-empleo/empresa/perfil" element={<PerfilEmpresa />} />
                  <Route path="/bolsa-empleo/empresa/ofertas" element={<MisOfertasEmpresa />} />
                  <Route path="/bolsa-empleo/empresa/oferta/nueva" element={<FormOfertaEmpresa />} />
                  <Route path="/bolsa-empleo/empresa/oferta/:id/editar" element={<FormOfertaEmpresa />} />
                  <Route path="/bolsa-empleo/empresa/oferta/:id/postulantes" element={<PostulantesOferta />} />
                  <Route path="/bolsa-empleo/admin/empresas" element={<AdminEmpresasBolsa />} />
                  {showMusicaRoutes && (
                    <>
                      <Route path="/canciones" element={<ChordSongsListPage />} />
                      <Route path="/canciones/:id/estructura" element={<ChordSongStructurePage />} />
                    </>
                  )}
                </Route>

                {/* CIE-10: roles clínicos y admin de enfermería */}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Doctor/a", "Enfermero/a", "Pasante", "Administrador", "Moderador", "Programador"]} />
                  }
                >
                  {showEnfermeriaRoutes && <Route path="/cie10" element={<Cie10Page />} />}
                </Route>

                {/* Estructura de ficha: Admin, Enfermero, Pasante, Doctor (sin ver datos clínicos) */}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Doctor/a", "Enfermero/a", "Pasante", "Administrador", "Moderador", "Programador"]} />
                  }
                >
                  {showEnfermeriaRoutes && <Route path="/ficha/estructura" element={<FichaEstructuraPage />} />}
                </Route>

                {/* Añadir ficha: Doctor, Enfermero, Pasante */}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Doctor/a", "Enfermero/a", "Pasante"]} />
                  }
                >
                  {showEnfermeriaRoutes && <Route path="/ficha/anadir" element={<AnadirFichaPage />} />}
                  {showEnfermeriaRoutes && <Route path="/ficha/nuevo/:page" element={<FichaPage />} />}
                </Route>

                {/* Ver ficha, estadísticas e historial: solo Doctor, Moderador, Programador (datos clínicos) */}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Doctor/a", "Moderador", "Programador"]} />
                  }
                >
                  {showEnfermeriaRoutes && <Route path="/ficha/estadisticas" element={<FichaEstadisticasPage />} />}
                  {showEnfermeriaRoutes && <Route path="/ficha/:dni/:page" element={<FichaPage />} />}
                  {showEnfermeriaRoutes && <Route path="/pacientes/:dni/historial" element={<HistorialClinicoPage />} />}
                </Route>

                {/* Pacientes: Doctor, Enfermero, Pasante, Admin, Moderador, Programador */}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Doctor/a", "Enfermero/a", "Pasante", "Administrador", "Moderador", "Programador"]} />
                  }
                >
                  {showEnfermeriaRoutes && <Route path="/pacientes" element={<PacientesPage />} />}
                  {showEnfermeriaRoutes && <Route path="/pacientes/:dni" element={<PacienteDetallePage />} />}
                </Route>

                {/* Logs enfermería: Administrador, Moderador, Programador */}
                <Route element={<ProtectedRoute requiredRol={["Administrador", "Moderador", "Programador"]} />}>
                  {showEnfermeriaRoutes && <Route path="/logs" element={<LogsPage />} />}
                </Route>

                {/* Rutas solo Programador (no aparecen en menú Admin) */}
                <Route element={<ProtectedRoute requiredRol={["Programador"]} />}>
                  <Route path="/comandos" element={<Comandos />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/img" element={<ImgManagerPage />} />
                  <Route path="/file" element={<FilesManagerPage />} />
                  <Route path="/componentes" element={<All />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/tokens" element={<Tokens />} />
                </Route>

                {/* Rutas Administrador + Programador */}
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Administrador", "Programador"]} />
                  }
                >
                  {showEddeliRoutes && (
                    <>
                      <Route path="/piano" element={<PianoPage />} />
                      <Route path="/pianoPro" element={<PianoProPracticePage />} />
                      <Route path="/mapa" element={<BasicMap />} />
                      <Route path="/backery" element={<CatalogoPage />} />
                      <Route path="/catalog_manager" element={<CatalogManagerPage />} />
                      <Route path="/publicity_edit" element={<AdTemplateEditor />} />
                      <Route path="/publicidad" element={<ProductTemplateStudio />} />
                      <Route path="/editorDefault" element={<EditorPage />} />
                      <Route path="/editor/:id?" element={<EditorPage />} />
                      <Route path="/templates" element={<EditorTemplatesView />} />
                      <Route path="/analisis" element={<Analytics />} />
                      <Route path="/reservas" element={<Reservas />} />
                      <Route path="/recepcion" element={<Recepcion />} />
                      <Route path="/infoHotel" element={<InfoHotel />} />
                      <Route path="/nivel" element={<NivelesHotel />} />
                      <Route path="/inventory/products" element={<ProductsPage />} />
                      <Route path="/inventory/categories" element={<CategoryPage />} />
                      <Route path="/inventory/units" element={<UnitPage />} />
                      <Route path="/inventory/movement" element={<MovementPage />} />
                      <Route path="/inventory/recipes" element={<RecipePage />} />
                      <Route path="/inventory/orders" element={<OrderPage />} />
                      <Route path="/inventory/customers" element={<CustomerPage />} />
                      <Route path="/inventory/finance" element={<FinancePage />} />
                      <Route path="/inventory/collections" element={<CollectionsPage />} />
                      <Route path="/inventory/production" element={<ProductionManagerPage />} />
                      <Route path="/inventory/productos-destacados" element={<HomeProductPage />} />
                      <Route path="/inventory/puntos-venta" element={<StoresManagerPage />} />
                    </>
                  )}

                  {showMusicaRoutes && (
                    <>
                      <Route path="/pianoPro" element={<MusicaPianoProPage />} />
                    </>
                  )}

                  {(showTurnosRoutes || showEddeliRoutes || showAlumniRoutes || showEnfermeriaRoutes) && (
                    <>
                      <Route path="/panel_control" element={<ControlPanelPage />} />
                      <Route path="/notification-programs" element={<NotificationProgramsPage />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/cuentas" element={<Accounts />} />
                      <Route path="/roles" element={<Roles />} />
                    </>
                  )}
                  {showMusicaRoutes && (
                    <>
                      <Route path="/panel_control" element={<ControlPanelPage />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/cuentas" element={<Accounts />} />
                      <Route path="/roles" element={<Roles />} />
                    </>
                  )}
                  {showTurnosRoutes && (
                    <>
                      <Route path="/clientes" element={<ClientesPage />} />
                      <Route path="/empleados" element={<EmpleadosPage />} />
                      <Route path="/servicios" element={<ServiciosPage />} />
                      <Route path="/servicio-extra" element={<AddonsPage />} />
                    </>
                  )}
                  {showEnfermeriaRoutes && (
                    <Route path="/instituciones" element={<InstitucionesPage />} />
                  )}
                </Route>

                {/* Clientes para Empleado (agregar clientes) */}
                <Route element={<ProtectedRoute requiredRol={["Empleado"]} />}>
                  {showTurnosRoutes && <Route path="/clientes" element={<ClientesPage />} />}
                </Route>

                {/* Agenda: Admin/Programador (gestión completa) y Empleado (solo ver sus turnos) */}
                <Route element={<ProtectedRoute requiredRol={["Administrador", "Programador", "Empleado"]} />}>
                  {showTurnosRoutes && <Route path="/agenda" element={<TurnosPage />} />}

                  {!showTurnosRoutes && !showMusicaRoutes && (
                    <>
                      <Route path="/forms" element={<AdminFormsList />} />
                      <Route path="/forms/manage/:id" element={<FormQuestions />} />
                      <Route path="/forms/assign/:id" element={<AssignForm />} />
                      <Route path="/forms/charts/:id" element={<FormResponsesCharts />} />
                      <Route path="/forms/view/:id" element={<FormViewer />} />
                    </>
                  )}

                  {showAlumniRoutes && (
                    <>
                      <Route path="/careers" element={<CareerPage />} />
                      <Route path="/periods" element={<PeriodPage />} />
                      <Route path="/matriz" element={<MatrizPage />} />
                    </>
                  )}

                  {!showTurnosRoutes && !showMusicaRoutes && (
                    <>
                      <Route path="/quizzes" element={<AdminQuizList />} />
                      <Route path="/quizzes/manage/:id" element={<QuizQuestions />} />
                      <Route path="/quizzes/view/:id" element={<QuizViewer />} />
                      <Route path="/quizzes/charts/:id" element={<QuizResponsesCharts />} />
                      <Route path="/quizzes/assign/:id" element={<AssignQuiz />} />
                      <Route path="/myQuizzes" element={<QuizList />} />
                      <Route path="/myQuizzes/evaluation/:id" element={<QuizAnswerEvaluation />} />
                      <Route path="/myQuizzes/simulator/:id" element={<QuizSimulatorMode />} />
                      <Route path="/myQuizzes/practice/:id" element={<QuizAnswerPractice />} />
                    </>
                  )}
                </Route>
              </Routes>
            </NavBar>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  );
}

export default App;
