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
import ProductionManagerPage from "./page/eddeli/inventoryControl/ProductionManagerPage.jsx";
import BasicMap from "./page/mapa/BasicMap.jsx";
import ProMap from "./page/mapa/ProMap.jsx";
import HomeProductPage from "./page/eddeli/inventoryControl/HomeProduct.jsx";
import StoresManagerPage from "./page/eddeli/inventoryControl/StoresManagerPage.jsx";
import StoresPage from "./page/eddeli/inventoryControl/StoresPage.jsx";
import HomeLogout from "./page/eddeli/inventoryControl/HomeLogout.jsx";

import CatalogManagerPage from "./page/eddeli/inventoryControl/CatalogManagerPage.jsx";
import CatalogoPage from "./page/eddeli/CatalogPage.jsx";
import ImgManagerPage from "./page/ImgManagerPage.jsx";
import AdTemplateEditor from "./page/eddeli/AdTemplateEditor.jsx";
import EditorPage from "./page/eddeli/photoshop/EditorPage.jsx";
import ProductTemplateStudio from "./page/eddeli/photoshop/ProductTemplateStudio.jsx";
import FilesManagerPage from "./page/FileManager.jsx";
import EditorTemplatesView from "./page/eddeli/photoshop/EditorTemplatesView.jsx";

// Home según app: alumni → Home Alumni, eddeli → Dashboard ERP, softed → SoftedHome (tech)
const HomePage =
  activeAppId === "alumni"
    ? HomePageAlumni
    : activeAppId === "eddeli"
    ? DashBoardPageERP
    : SoftedHome;

// Home público (/home cuando no estás logeado): en alumni mismo home que logueado; en eddeli/softed HomeLogout
const PublicHomePage = activeAppId === "alumni" ? HomePageAlumni : HomeLogout;

// Rutas que solo existen en eddeli o en softed (no en alumni)
const showEddeliRoutes = activeAppId === "eddeli" || activeAppId === "softed";
// Rutas que solo existen en alumni o en softed (no en eddeli)
const showAlumniRoutes = activeAppId === "alumni" || activeAppId === "softed";

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
                  {showEddeliRoutes && (
                    <>
                      <Route path="/catalogo" element={<CatalogoPage />} />
                      <Route path="/punto_venta" element={<StoresPage />} />
                    </>
                  )}
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Estudiante", "Administrador", "Programador", "Empresa", "Profesional"]} />
                  }
                >
                  <Route path="/" element={<HomePage />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/myforms" element={<FormsList />} />
                  <Route path="/myforms/:id" element={<FormAnswer />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/info" element={<Info />} />
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

                  <Route path="/panel_control" element={<ControlPanelPage />} />
                  <Route path="/notification-programs" element={<NotificationProgramsPage />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/cuentas" element={<Accounts />} />
                  <Route path="/roles" element={<Roles/>} />

                  <Route path="/forms" element={<AdminFormsList />} />
                  <Route path="/forms/manage/:id" element={<FormQuestions />} />
                  <Route path="/forms/assign/:id" element={<AssignForm />} />
                  <Route path="/forms/charts/:id" element={<FormResponsesCharts />} />
                  <Route path="/forms/view/:id" element={<FormViewer />} />

                  {showAlumniRoutes && (
                    <>
                      <Route path="/careers" element={<CareerPage />} />
                      <Route path="/periods" element={<PeriodPage />} />
                      <Route path="/matriz" element={<MatrizPage />} />
                    </>
                  )}

                  <Route path="/quizzes" element={<AdminQuizList />} />
                  <Route path="/quizzes/manage/:id" element={<QuizQuestions />} />
                  <Route path="/quizzes/view/:id" element={<QuizViewer/>} />
                  <Route path="/quizzes/charts/:id" element={<QuizResponsesCharts/>} />
                  <Route path="/quizzes/assign/:id" element={<AssignQuiz/>} />
                  <Route path="/myQuizzes" element={<QuizList/>} />
                  <Route path="/myQuizzes/evaluation/:id" element={<QuizAnswerEvaluation />} />
                  <Route path="/myQuizzes/simulator/:id" element={<QuizSimulatorMode />} />
                  <Route path="/myQuizzes/practice/:id" element={<QuizAnswerPractice />} />
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
