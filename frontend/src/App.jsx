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
import Home from "./page/Home";
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
        <BrowserRouter basename="/softed">
          <NavBar>
            <Routes>
              <Route path="/login" element={<Login />} />
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

              <Route path="/" element={<Home />} />
              <Route path="/comandos" element={<Comandos />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/componentes" element={<All />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/cuentas" element={<Accounts />} />
              <Route path="/logs" element={<Logs />} />
              




              <Route path="/forms" element={<AdminFormsList />} />
              <Route path="/forms/manage/:id" element={<FormQuestions />} />
              <Route path="/forms/assign/:id" element={<AssignForm />} />
              <Route path="/forms/charts/:id" element={<FormResponsesCharts />} />
              <Route path="/forms/view/:id" element={<FormViewer />} />
              <Route path="/myforms" element={<FormsList />} />
              <Route path="/myforms/:id" element={<FormAnswer />} />
              <Route path="/careers" element={<CareerPage />} />
              <Route path="/periods" element={<PeriodPage />} />
              <Route path="/matriz" element={<MatrizPage />} />


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
