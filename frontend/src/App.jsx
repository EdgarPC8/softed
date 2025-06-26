import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import PublicOnlyRoute from "./context/PublicOnlyRoute.jsx";
import Roles from "./page/Roles.jsx";
import ControlPanelPage from "./page/ControlPanel.jsx";
import HomePageAlumni from "./page/alumni/Home.jsx";
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
import ProductsPage from "./page/inventoryControl/ProductsPage.jsx";
import CategoryPage from "./page/inventoryControl/CategoryPage.jsx";
import UnitPage from "./page/inventoryControl/UnitPage.jsx";
import MovementPage from "./page/inventoryControl/MovementPage.jsx";
import RecipePage from "./page/inventoryControl/RecipePage.jsx";
import OrderPage from "./page/inventoryControl/OrderPage.jsx";
import CustomerPage from "./page/inventoryControl/CustomerPage.jsx";








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
          <BrowserRouter basename="/alumni">
            <NavBar>
              <Routes>
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/login" element={<Login />} />
                </Route>
                <Route
                  element={
                    <ProtectedRoute requiredRol={["Estudiante", "Administrador", "Programador"]} />
                  }
                >
                  <Route path="/" element={<HomePageAlumni />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/myforms" element={<FormsList />} />
                  <Route path="/myforms/:id" element={<FormAnswer />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/donations" element={<Donations />} />

                </Route>

                <Route
                  element={
                    <ProtectedRoute requiredRol={["Administrador", "Programador"]} />
                  }
                >
                  <Route path="/analisis" element={<Analytics />} />
                  <Route path="/reservas" element={<Reservas />} />
                  <Route path="/recepcion" element={<Recepcion />} />
                  <Route path="/infoHotel" element={<InfoHotel />} />
                  <Route path="/nivel" element={<NivelesHotel />} />

                  <Route path="/panel_control" element={<ControlPanelPage />} />
                  <Route path="/comandos" element={<Comandos />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/componentes" element={<All />} />
                  <Route path="/cuentas" element={<Accounts />} />
                  <Route path="/roles" element={<Roles/>} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/tokens" element={<Tokens />} />

                  <Route path="/forms" element={<AdminFormsList />} />
                  <Route path="/forms/manage/:id" element={<FormQuestions />} />
                  <Route path="/forms/assign/:id" element={<AssignForm />} />
                  <Route path="/forms/charts/:id" element={<FormResponsesCharts />} />
                  <Route path="/forms/view/:id" element={<FormViewer />} />
                  <Route path="/careers" element={<CareerPage />} />
                  <Route path="/periods" element={<PeriodPage />} />
                  <Route path="/matriz" element={<MatrizPage />} />


                  <Route path="/quizzes" element={<AdminQuizList />} />
                  <Route path="/quizzes/manage/:id" element={<QuizQuestions />} />
                  <Route path="/quizzes/view/:id" element={<QuizViewer/>} />
                  <Route path="/quizzes/charts/:id" element={<QuizResponsesCharts/>} />
                  <Route path="/quizzes/assign/:id" element={<AssignQuiz/>} />
                  <Route path="/myQuizzes" element={<QuizList/>} />
                  <Route path="/myQuizzes/evaluation/:id" element={<QuizAnswerEvaluation />} />
                  <Route path="/myQuizzes/simulator/:id" element={<QuizSimulatorMode />} />
                  <Route path="/myQuizzes/practice/:id" element={<QuizAnswerPractice />} />

                  <Route path="/inventory/products" element={<ProductsPage />} />
                  <Route path="/inventory/categories" element={<CategoryPage />} />
                  <Route path="/inventory/units" element={<UnitPage />} />
                  <Route path="/inventory/movement" element={<MovementPage />} />
                  <Route path="/inventory/recipes" element={<RecipePage />} />
                  <Route path="/inventory/orders" element={<OrderPage />} />
                  <Route path="/inventory/customers" element={<CustomerPage />} />

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
