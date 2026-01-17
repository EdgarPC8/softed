# Code Snippets Index

> Auto-generated

## appConfig.js

```js
export default appsInfo;
export { activeApp };
```

## cmd.js

```js
import fs from "fs";
import path from "path";
    l.includes("import ") ||
    l.includes("export ") ||
    l.includes("module.exports") ||
    l.includes("class ") ||
    l.includes("app.get") || l.includes("app.post") ||
    l.includes("router.get") || l.includes("router.post") ||
    l.includes("@GetMapping") || l.includes("@PostMapping") ||
    l.includes("public class") ||
    l.includes("extends") ||
    l.includes("implements")
```

## src/App.jsx

```jsx
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
import FinancePage from "./page/inventoryControl/FinancePage.jsx";
import HomePageAlumni from "./page/alumni/Home.jsx";
import HomePageERP from "./page/inventoryControl/HomePage.jsx";
import DashBoardPageERP from "./page/inventoryControl/DashBoardPage.jsx";
import PianoPage from "./page/piano/midi.jsx";
import ProductionManagerPage from "./page/inventoryControl/ProductionManagerPage.jsx";
import BasicMap from "./page/mapa/BasicMap.jsx";
import ProMap from "./page/mapa/ProMap.jsx";
import HomeProductPage from "./page/inventoryControl/HomeProduct.jsx";
import StoresManagerPage from "./page/inventoryControl/StoresManagerPage.jsx";
import StoresPage from "./page/inventoryControl/StoresPage.jsx";
import HomeLogout from "./page/inventoryControl/HomeLogout.jsx";
import PanaderiaPage from "./page/eddeli/PanaderiaPage.jsx";
import CatalogManagerPage from "./page/inventoryControl/CatalogManagerPage.jsx";
import CatalogoPage from "./page/eddeli/CatalogPage.jsx";
export default App;
```

## src/Components/Acordions/AcordionBasic.jsx

```jsx
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom'; // Importar Link para la navegación
export default function AccordionBasic({ page }) {
```

## src/Components/AllComponents/All.jsx

```jsx
import React from 'react';
import { 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from "../../context/AuthContext";
import { deleteRolRequest, getRolRequest,updateRolRequest,addRolRequest } from "../../api/accountRequest.js";
export default function All() {
```

## src/Components/ButtonsFloats/ReloadButtonSimulator.jsx

```jsx
import React from 'react';
import { Fab } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
export default ReloadButtonSimulator;
```

## src/Components/Charts/DoblePieChart.jsx

```jsx
import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { PieChart } from "@mui/x-charts/PieChart";
export default function DoblePieChart({ data, displayMode = "value" }) {
```

## src/Components/Charts/Donutchart.jsx

```jsx
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme, useMediaQuery, Box, Typography, Grid } from '@mui/material';
export default function DonutChart() {
```

## src/Components/Charts/SimpleCharts.jsx

```jsx
import * as React from 'react';
import { useAnimate } from '@mui/x-charts/hooks';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
export default function LabelsAboveBars() {
```

## src/Components/Dialogs/SimpleDialog.jsx

```jsx
import {
  import IconButton from "@mui/material/IconButton";
  import CloseIcon from "@mui/icons-material/Close";
  export default SimpleDialog;
```

## src/Components/Dialogs/UserDialog.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { Person, Edit, Delete } from "@mui/icons-material";
  import { useNavigate } from "react-router-dom";
  import toast from "react-hot-toast";
import UserForm from "../Forms/UserForm";
  export default UserDialog;
```

## src/Components/Forms/AccountForm.jsx

```jsx
import { CloudUpload, Save } from "@mui/icons-material";
import {
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
import { getUsersRequest } from "../../api/userRequest";
import toast from "react-hot-toast";
import DataTable from "../Tables/DataTable";
import SelectDataRoles from "../Selects/SelectDataRoles";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useAuth } from "../../context/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
```

## src/Components/Forms/HotelForm.jsx

```jsx
import { CloudUpload, Save } from "@mui/icons-material";
import {
// import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
import toast from "react-hot-toast";
import {
export default HotelForm;
```

## src/Components/Forms/LicenseForm.jsx

```jsx
import { CloudUpload, Save } from "@mui/icons-material";
import {
// import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
import {  updateLicense,addLicense,getOneLicense } from "../../api/authRequest";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
export default UserForm;
```

## src/Components/Forms/LogsForm.jsx

```jsx
import { CloudUpload, Save } from "@mui/icons-material";
import {
// import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
export default UserForm;
```

## src/Components/Forms/NivelHotelForm.jsx

```jsx
import { CloudUpload, Save } from "@mui/icons-material";
import {
// import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
import toast from "react-hot-toast";
import {
export default NivelHotelForm;
```

## src/Components/Forms/ProfileForm.jsx

```jsx
import {
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
import {
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";
```

## src/Components/Forms/UserForm.jsx

```jsx
import { CloudUpload, Save } from "@mui/icons-material";
import {
// import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
export default UserForm;
```

## src/Components/HorizontalScroller.jsx

```jsx
import { Box, Stack } from "@mui/material";
import { memo } from "react";
export default memo(HorizontalScroller);
```

## src/Components/NavBar/NavBar.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import { getNotificationsByUser } from '../../api/notificationsRequest';
import SimpleDialog from '../Dialogs/SimpleDialog';
import CambiarRol from '../ViewModal/CambiarRol';
import NotificationList from '../NotificationList';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';
import {
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StraightenIcon from '@mui/icons-material/Straighten';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import FactoryIcon from "@mui/icons-material/Factory";
import StarRounded from "@mui/icons-material/StarRounded";
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import ThemeSwitcher from '../ThemeSwitcher';
import HomeIcon from "@mui/icons-material/Home";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import CakeIcon from "@mui/icons-material/Cake";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { activeApp } from '../../../appConfig';
import ViewModuleIcon from "@mui/icons-material/ViewModule";
```

## src/Components/NoAccess.jsx

```jsx
import * as React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import BlockIcon from '@mui/icons-material/Block';
import {
export default function NoAcces() {
```

## src/Components/NotificationList.jsx

```jsx
import { useState, useEffect } from "react";
import {
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate, useLocation } from "react-router-dom";
import {
import { useAuth } from "../context/AuthContext";
export default NotificationList;
```

## src/Components/Papers/Analisis.jsx

```jsx
import React from "react";
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
export default Analisis;
```

## src/Components/Papers/InfoCuartos.jsx

```jsx
import React from "react";
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
export default InfoCuartos;
```

## src/Components/Papers/RecepcionCuartos.jsx

```jsx
import React from "react";
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
```

## src/Components/Preguntas.jsx

```jsx
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
export default function Preguntas({ questions, setPage }) {
```

## src/Components/ProtectedRoute.jsx

```jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Center, Spinner } from "@chakra-ui/react";
// import NoAccess from "./NoAccess";
// export default ProtectedRoute;
```

## src/Components/Quiz/CreatorQuizForm.jsx

```jsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { saveForm } from '../../api/formsRequest';
export default CreatorQuizForm;
```

## src/Components/Quiz/Menu.jsx

```jsx
import { Container, Grid, Typography, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from "react";
import { getOptionsQuestions,addAllAnswersUsers } from "../../api/quizRequest.js";
import DataTableQuestionsSimulator from "../Tables/DataTableQuestionsSimulator.jsx";
```

## src/Components/Quiz/ResponseForm.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ aquí
import { getOneForm, submitFormAnswers } from '../../api/formsRequest.js';  // Corrección aquí
import {
export default ResponseForm;
```

## src/Components/Roles.jsx

```jsx
import {
  import DataTable from "./Tables/DataTable";
  import { useEffect, useState } from "react";
  import { deleteRolRequest, getRolRequest,updateRolRequest,addRolRequest } from "../api/accountRequest.js";
  import { Person, Edit, Delete,Send } from "@mui/icons-material";
  import toast from "react-hot-toast";
  import SimpleDialog from "./Dialogs/SimpleDialog";
  import UserForm from "./Forms/UserForm";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
  export default Roles;
```

## src/Components/SearchableSelect.jsx

```jsx
import React, { useState, useMemo, useRef } from "react";
import {
export default SearchableSelect;
```

## src/Components/Selects/SelectData.jsx

```jsx
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function SelectData({ Data, Label = "Seleccione", onChange }) {
```

## src/Components/Selects/SelectDataRoles.jsx

```jsx
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getRolRequest } from '../../api/accountRequest';
import { useEffect, useState } from "react";
export default function SelectDataRoles({ value, onChange }) {
```

## src/Components/Tables/DataTable.jsx

```jsx
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
export default DataTable;
```

## src/Components/Tables/DataTableQuestions.jsx

```jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { addAnswerUser } from "../../api/quizRequest";
import { useAuth } from "../../context/AuthContext";
export default function DataTableQuestions({ data = [] }) {
```

## src/Components/Tables/DataTableQuestionsSimulator.jsx

```jsx
import * as React from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Grid, Pagination, Badge } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import PushPinIcon from '@mui/icons-material/PushPin';
export default function DataTableQuestionsSimulator({
```

## src/Components/Tables/TablePro.jsx

```jsx
import React, { useState } from 'react';
import {
export default TablePro;
```

## src/Components/ThemeSwitcher.jsx

```jsx
import { useState } from "react";
import {
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckIcon from "@mui/icons-material/Check";
import { useThemeMode } from "../theme/ThemeModeProvider";
export default function ThemeSwitcher() {
```

## src/Components/Toast/SimpleToast.jsx

```jsx
import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
export default function IntegrationNotistack() {
```

## src/Components/ViewModal/BackupViewerModal.jsx

```jsx
import React, { useState } from "react";
import {
import DataTable from "../Tables/DataTable.jsx";
import { getUsersRequest } from "../../api/userRequest";
import { getMatriculas, addMatriculasBulk } from "../../api/alumniRequest.js";
import SimpleDialog from "../Dialogs/SimpleDialog";
import { useAuth } from "../../context/AuthContext.jsx";
export default function BackupViewerModal({ jsonData = [],onClose }) {
```

## src/Components/ViewModal/CambiarRol.jsx

```jsx
import { Button, Typography, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
export default function CambiarRol() {
```

## src/Components/ViewModal/StudentViewerModal.jsx

```jsx
import React, { useState } from "react";
import {
import DataTable from "../Tables/DataTable.jsx";
import { addUserRequest, addUsersBulk, getUsersRequest } from "../../api/userRequest.js";
import { isValidCI } from "../../helpers/isValidCI.js"; // asegúrate que esta función exista
import SimpleDialog from "../Dialogs/SimpleDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
export default function StudentViewerModal({ jsonData = [] }) {
```

## src/Components/VisuallyHiddenInput.js

```js
import { styled } from "@mui/material/styles";
export const VisuallyHiddenInput = styled("input")({
```

## src/api/accountRequest.js

```js
// import axios from "./axios.js";
// import { authorization } from "./axios.js";
import axios, { jwt } from "./axios.js";
export const addAccountRequest = async (data) =>
export const updateAccountRequest = async (id, data) =>
export const updateAccountUser = async (id,userId,rolId, data) =>
export const resetPassword = async (id, data) =>
export const getOneAccountRequest = async (id) =>
  export const getAccount = async (accountId,rolId) =>
export const deleteAccountRequest = async (id) =>
export const getAccountRequest = async (dni) =>
  export const addRolRequest = async (data) =>
export const updateRolRequest = async (id, data) =>
export const getOneRolRequest = async (id) =>
export const deleteRolRequest = async (id) =>
export const getRolRequest = async (dni) =>
```

## src/api/alumniRequest.js

```js
import axios, { jwt } from "./axios.js";
export const getCareers = async () =>
export const addCareer = async (data) =>
export const editCareer = async (id, data) =>
export const deleteCareer = async (id) =>
  export const getPeriods = async () =>
export const addPeriod = async (data) =>
export const editPeriod = async (id, data) =>
export const deletePeriod = async (id) =>
  export const getMatriz = async () =>
export const addMatriz = async (data) =>
export const editMatriz = async (id, data) =>
export const deleteMatriz = async (id) =>
  export const getMatriculas = async () =>
  export const getEspecialidades= async () =>
  export const getPeriodosAcademicos= async () =>
  export const addMatriculasBulk = async (data) =>
  export const filterUsers = async (data) =>
```

## src/api/authRequest.js

```js
import axios, { jwt } from "./axios.js";
export const changeRole = async (data) =>
  export const getLicenses = async () =>
  export const addLicense = async (data) =>
  export const getOneLicense = async (id) =>
export const deleteLicense = async (id) =>
  export const updateLicense = async (id, data) =>
export const loginByAccountRequest = async (data) =>
export const getAccountsByUsernameRequest = async (username) =>
```

## src/api/axios.js

```js
import axios from "axios";
import { io } from "socket.io-client";
export const urlRequestsApi = {
export const pathPhotos = `${url}/photos/`;
export const pathImg = `${url}/inventory/imgEdDeli/`;
export const socket = io(`${url}`); 
export const jwt = () => {
export default instance;
```

## src/api/comandsRequest.js

```js
import axios, { jwt } from "./axios.js";
export const sendBackUpRequest = async (back) =>
  export const reloadBD = async () =>
  export const saveBackup = async () =>
  export const getLogs = async () =>
  export const downloadBackup = async () => {
export const uploadBackup = (formData) =>
```

## src/api/financeRequest.js

```js
import axios, { jwt } from "./axios"; // Tu instancia base de axios
export const createIncomeRequest = async (data) => {
export const getAllIncomesRequest = async () => {
export const updateIncomeRequest = async (id, data) => {
export const deleteIncomeRequest = async (id) => {
export const createExpenseRequest = async (data) => {
export const getAllExpensesRequest = async () => {
export const updateExpenseRequest = async (id, data) => {
export const deleteExpenseRequest = async (id) => {
export const getFinanceSummaryRequest = async () => {
export const getOverViewRequest = async () => {
export const getWeeklySales = async () => {
export const getTopProductsDailySales = async () => {
export const getProductRotationAnalysis = async () => {
export const getIncomeExpenseBreakdown = async () => {
export const getCustomerSalesSummary = async () => {
export const getOrdersForCharts = async () => {
export const getExpensesForChart = async () => {
```

## src/api/formsRequest.js

```js
import axios, { jwt } from "./axios.js";
export const getForms = async () => 
  export const getUsersByFormAssign = async (id) =>
  export const deleteUsersByFormAssign = async (formId,userId) =>
  export const getQuestionsByForm = async (id) =>
export const assignUsersToForm = async (formId,userIds) =>
export const createForm = async (data) =>
export const editForm = async (id, data) =>
export const deleteForm = async (id) =>
export const addQuestionsToForm = async (id, questions) =>
export const getResponses = async (id) =>
export const respondeForm = async (id, response) =>
export const getFormsByUserId = async (userId) =>
export const cloneFormRequest = async (formId) =>
```

## src/api/hotelRequest.js

```js
import axios, { jwt } from "./axios.js";
export const getHotel = async () =>
  export const addHotel = async (data) =>
export const updateHotel= async (id, data) =>
  export const getOneHotel = async (id) =>
```

## src/api/inventoryControlRequest.js

```js
import axios, { jwt } from './axios.js';
export const getPopularProducts = (params = {}) =>
export const getAutoCatalogSeed = (params = {}) =>
export const getCatalogEntries = (params = {}) =>
export const createCatalogEntry = (payload) =>
export const updateCatalogEntry = (id, payload) =>
export const deleteCatalogEntry = (id) =>
export const getCatalogBySection = (section, params = {}) =>
export const getCatalogBySections = (sections = [], params = {}) => {
export const getAllProducts = async () =>
export const createProduct = async (data) =>
export const updateProduct = async (id, data) =>
export const deleteProduct = async (id) =>
export const registerMovement = async (data) =>
export const getMovementsByProduct = async (productId) =>
  export const getAllMovements = async () =>
export const simulateProduction = async (productId, cantidad) =>
  export const registerProductionIntermediateFromPayload = async (payload) =>
  export const registerProductionFinalFromPayload = async (payload) =>
export const simulateFromIntermediate = async (intermediateId) =>
export const getRecipeByProduct = async (productFinalId) =>
export const getRecipeCosting = (
export const createRecipeRequest = async (data) =>
export const updateRecipeRequest = async (id, data) =>
export const deleteRecipeRequest = async (id) =>
export const getCategories = (params = {}) =>
export const createCategoryRequest = async (data) =>
export const updateCategoryRequest = async (id, data) =>
```

## src/api/nivelHotelRequest.js

```js
import axios, { jwt } from "./axios.js";
export const getNivel = async () =>
  export const addNivel = async (data) =>
export const updateNivel= async (id, data) =>
  export const getOneNivel = async (id) =>
  export const deleteNivel = async (id) =>
```

## src/api/notificationsRequest.js

```js
import axios, { jwt } from "./axios.js";
export const getNotificationsByUser = async (userId) =>
export const getUnreadCountByUser = async (userId) =>
export const createNotification = async (data) =>
export const markNotificationAsSeen = async (id) =>
export const deleteNotification = async (id) =>
```

## src/api/ordersRequest.js

```js
import axios, { jwt } from "./axios.js";
export const createOrderRequest = async (data) =>
export const updateOrderStatusRequest = async (orderId, status) =>
export const getAllOrdersRequest = async () =>
  export const updateOrderRequest = async (id, data) =>
export const markItemAsDeliveredRequest = async (itemId) =>
export const markItemAsPaidRequest = async (itemId) =>
  export const updateOrderItemRequest = async (itemId, data) =>
export const getAllCustomersRequest = async () =>
export const createCustomerRequest = async (data) =>
export const updateCustomerRequest = async (id, data) =>
export const deleteCustomerRequest = async (id) =>
export const deleteOrder = async (id) =>
export const deleteOrderItem = async (id) =>
export const getFinanceWorkbenchAllRequest = async () =>
export const createItemGroupRequest = async (data) =>
export const updateItemGroupRequest = async (groupId, data) =>
export const deleteItemGroupRequest = async (groupId) =>
export const moveItemBetweenGroupsRequest = async (data) =>
export const payItemGroupRequest = async (groupId, data) =>
export const updateGroupPaymentRequest = async (paymentId, data) =>
export const deleteGroupPaymentRequest = async (paymentId) =>
```

## src/api/quizRequest.js

```js
import axios, { jwt } from "./axios.js";
export const getQuizzes = async () =>
export const createQuiz = async (data) =>
export const editQuiz = async (id, data) =>
export const deleteQuiz = async (id) =>
export const getQuestionsByQuiz = async (id) =>
export const addQuestionsToQuiz = async (quizId, payload) =>
export const getQuizResponses = async (quizId) =>
export const getQuizUserResponses = async (quizId) =>
export const getUsersByQuizAssign = async (quizId) =>
export const deleteUsersByQuizAssign = async (quizId, userId) =>
  export const filterUsersByRole = async (roleId) =>
  export const assignUsersToQuiz = async (quizId, payload) =>
  export const getQuizzesByUserId = async (userId) =>
  export const submitQuizAnswers = async (quizId, payload) =>
```

## src/api/userRequest.js

```js
// import axios from "./axios.js";
// import { authorization } from "./axios.js";
import axios, { jwt } from "./axios.js";
export const getSessionRequest = async () =>
export const loginRequest = async (data) => await axios.post("/login", data);
export const addUserRequest = async (data) =>
export const addUsersBulk = async (data) =>
export const addUserPhotoRequest = async (photo) =>
// export const updateUserPhotoRequest = async (id, photo) =>
  export const updateUserPhotoRequest = async (id, userData) =>
  export const deleteUserPhotoRequest = async (id) =>
export const getOneUserRequest = async (id) =>
export const deleteUserRequest = async (id) =>
  export const updateUserRequest = async (id, data) =>
export const getUsersRequest = async (dni) =>
```

## src/context/AuthContext.jsx

```jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
import { jwt, pathPhotos } from "../api/axios.js";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack"; // Importa useSnackbar
import { getAccount } from "../api/accountRequest.js";
import { changeRole as changeRoleRequest  } from "../api/authRequest.js";
```

## src/context/ProtectedRoute.jsx

```jsx
import { Navigate, Outlet } from "react-router-dom";
import * as React from 'react';
import { useAuth } from "../context/AuthContext";
import NoAcces from "../Components/NoAccess";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
export default ProtectedRoute;
```

## src/context/PublicOnlyRoute.jsx

```jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
export default PublicOnlyRoute;
```

## src/helpers/functions.js

```js
export function formatDate(fechaISO) {
export function anonimizarTextoChino(texto) {
```

## src/helpers/isValidCI.js

```js
export function isValidCI(ci) {
```

## src/hooks/useNotificationSocket.js

```js
import { useEffect } from "react";
import { socket } from "../api/axios";
export const useNotificationSocket = (userId, onNewNotification) => {
```

## src/main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeModeProvider } from "./theme/ThemeModeProvider.jsx";
import { activeApp } from "../appConfig.js"; // tu config global de la app
```

## src/page/Accounts.jsx

```jsx
import {
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import { deleteAccountRequest, getAccountRequest, resetPassword } from "../api/accountRequest.js";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import AccountForm from "../Components/Forms/AccountForm";
import Roles from "../Components/Roles";
import { useAuth } from "../context/AuthContext";
```

## src/page/Comandos.jsx

```jsx
import * as React from 'react';
import {
import { reloadBD, saveBackup, downloadBackup, uploadBackup } from '../api/comandsRequest';
import BackupIcon from '@mui/icons-material/Backup';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from "react";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import BackupViewerModal from '../Components/ViewModal/BackupViewerModal';
import StudentViewerModal from '../Components/ViewModal/StudentViewerModal';
import { useAuth } from "../context/AuthContext";   // 👈 IMPORTANTE
export default function Comandos() {
```

## src/page/ControlPanel.jsx

```jsx
import { useEffect, useState } from "react";
import { getUsersRequest } from "../api/userRequest";
import {
import {
import DataTable from "../Components/Tables/DataTable";
import { isValidCI } from "../helpers/isValidCI";
```

## src/page/Donations.jsx

```jsx
import React from "react";
import { Box, Typography, Grid, Card, CardContent, Divider, Avatar, Link } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
export default Donations;
```

## src/page/Home.jsx

```jsx
import React from 'react';
import {
// import bannerImage from './home_istms.png'; // Ajusta esta ruta
export default function HomeCourses() {
```

## src/page/Info.jsx

```jsx
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import appsInfo from "../../appConfig";
export default function Info({ app = "eddeli" }) {
```

## src/page/Login.jsx

```jsx
import React, { useState, useEffect } from "react";
import {
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bannerImage from "/home_edDeli.png"; // ajusta la ruta si está en otro lugar
export default Login;
```

## src/page/Logs.jsx

```jsx
import {
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import {  getLogs } from "../api/comandsRequest";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import LogsForm from "../Components/Forms/LogsForm";
export default Logs;
```

## src/page/Notifications.jsx

```jsx
import { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import NotificationList from "../Components/NotificationList";
export default NotificationsPage;
```

## src/page/Profile.jsx

```jsx
import React, { useState } from 'react';
import { Container, Box, Typography, Avatar, IconButton, Menu, MenuItem, Button,Grid } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material'; // Ícono de cámara
import toast from 'react-hot-toast'; // Para mostrar notificaciones
import {
} from '../api/userRequest'; // Ajusta el import para tu backend
import { pathPhotos } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import ProfileForm from "../Components/Forms/ProfileForm";
export default Profile;
```

## src/page/Quiz.jsx

```jsx
import {
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import { deleteUserRequest, getUsersRequest } from "../api/userRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import UserForm from "../Components/Forms/UserForm";
import { pathPhotos } from "../api/axios";
import { getQuizzes } from "../api/quizRequest";
export default Users;
```

## src/page/Roles.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { deleteRolRequest, getRolRequest,updateRolRequest,addRolRequest } from "../api/accountRequest.js";
  import { Person, Edit, Delete,Send } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import DataTable from "../Components/Tables/DataTable";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import UserForm from "../Components/Forms/UserForm.jsx";
  export default Roles;
```

## src/page/Tokens.jsx

```jsx
import * as React from 'react';
import {
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import {  getLicenses,deleteLicense } from "../api/authRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import LicenseForm from "../Components/Forms/LicenseForm";
import { formatDate } from "../helpers/functions";
export default function Tokens() {
```

## src/page/Users.jsx

```jsx
import {
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import { deleteUserRequest, getUsersRequest } from "../api/userRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import UserForm from "../Components/Forms/UserForm";
import { pathPhotos } from "../api/axios";
export default Users;
```

## src/page/alumni/Entidades/CareerPage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { Person, Edit, Delete, Send } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import DataTable from "../../../Components/Tables/DataTable";
import { getCareers, addCareer, editCareer, deleteCareer } from "../../../api/alumniRequest.js";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../../context/AuthContext";
export default CareerPage;
```

## src/page/alumni/Entidades/MatrizPage.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { Person, Edit, Delete,Send } from "@mui/icons-material";
  import { useForm } from "react-hook-form";
  import DataTable from "../../../Components/Tables/DataTable";
  import { getPeriods,addPeriod,editPeriod,deletePeriod, getMatriz } from "../../../api/alumniRequest.js";
  import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
  import { useAuth } from "../../../context/AuthContext";
```

## src/page/alumni/Entidades/PeriodPage.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { Person, Edit, Delete,Send } from "@mui/icons-material";
  import { useForm } from "react-hook-form";
  import DataTable from "../../../Components/Tables/DataTable";
  import { getPeriods,addPeriod,editPeriod,deletePeriod } from "../../../api/alumniRequest.js";
  import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
  import { useAuth } from "../../../context/AuthContext";
  export default PeriodPage;
```

## src/page/alumni/Home.jsx

```jsx
import React, { useEffect, useState } from 'react';
import {
import bannerImage from '/home_istms.png'; // Asegúrate de que esté en /public
import { getCareers } from '../../api/alumniRequest';
export default function HomePageAlumni() {
```

## src/page/eddeli/CatalogPage.jsx

```jsx
import React, { useEffect, useMemo, useState } from "react";
import {
import { useTheme,alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CalculateIcon from "@mui/icons-material/Calculate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getCatalogBySection, getCategories } from "../../api/inventoryControlRequest";
import { pathImg } from "../../api/axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
/// import SmartProductImage from "./SmartProductImage";
/// import PriceDisplay from "./PriceDisplay";
/// import WholesaleCalculator from "./WholesaleCalculator";
/// import { toImageSrc } from "../utils/toImageSrc";
```

## src/page/eddeli/PanaderiaPage.jsx

```jsx
import React, { useEffect, useMemo, useState } from "react";
import {
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CalculateIcon from "@mui/icons-material/Calculate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getCatalogBySection } from "../../api/inventoryControlRequest";
import { pathImg } from "../../api/axios";
```

## src/page/form/admin/AdminFormsList.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
import BarChart from "@mui/icons-material/BarChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import FormForm from "../components/Form";
import {
import { formatDate } from "../../../helpers/functions";
```

## src/page/form/admin/AssignForm.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import { getUsersByFormAssign, deleteUsersByFormAssign } from "../../../api/formsRequest";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import AssignUserForm from "../components/AssignUserForm";
import { useParams } from "react-router-dom";
import { anonimizarTextoChino } from "../../../helpers/functions";
export default AssignForm;
```

## src/page/form/admin/FormQuestions.jsx

```jsx
import {
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Add, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { addQuestionsToForm, getQuestionsByForm } from "../../../api/formsRequest";
import toast from "react-hot-toast";
```

## src/page/form/admin/FormResponsesCharts.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Typography, Box, Divider,Grid } from "@mui/material";
import axios from "axios";
import ClosedQuestionsTable from "../components/ClosedQuestionsTable";
import { getResponses } from "../../../api/formsRequest";
export default function FormResponsesCharts() {
```

## src/page/form/admin/FormViewer.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { getQuestionsByForm } from "../../../api/formsRequest";
  export default FormViewer;
```

## src/page/form/components/AssignUserForm.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import DataTable from "./DataTableFormCheck";
import { assignUsersToForm } from "../../../api/formsRequest";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { filterUsers, getCareers, getEspecialidades, getPeriodosAcademicos, getPeriods } from "../../../api/alumniRequest";
import SelectData from "../../../Components/Selects/SelectData";
import { anonimizarTextoChino } from "../../../helpers/functions";
```

## src/page/form/components/ClosedQuestionsTable.jsx

```jsx
import {
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';
export default function ClosedQuestionsTable({ questions }) {
```

## src/page/form/components/DataTableFormCheck.jsx

```jsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
export default function DataTable({ columns = [], rows = [], onSelectionChange }) {
```

## src/page/form/components/Form.jsx

```jsx
import {
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import dayjs from "dayjs";
  import { useForm, Controller } from "react-hook-form";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import toast from "react-hot-toast";
  import { useAuth } from "../../../context/AuthContext";
import { createForm,editForm } from "../../../api/formsRequest";
  export default FormForm;
```

## src/page/form/user/FormAnswer.jsx

```jsx
import {
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByForm, respondeForm } from "../../../api/formsRequest";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
export default FormAnswer;
```

## src/page/form/user/FormsList.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { QuestionAnswer } from "@mui/icons-material";
  import toast from "react-hot-toast";
  import DataTable from "../../../Components/Tables/DataTable";
  import { getFormsByUserId } from "../../../api/formsRequest";
import { useAuth } from "../../../context/AuthContext";
  export default FormsList;
```

## src/page/hotel/Analytics.jsx

```jsx
import * as React from 'react';
import Analisis from '../../Components/Papers/Analisis.jsx';
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
export default function Analytics() {
```

## src/page/hotel/InfoHotel.jsx

```jsx
import * as React from 'react';
import InfoCuartos from '../../Components/Papers/InfoCuartos.jsx';
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
import HotelForm from '../../Components/Forms/HotelForm.jsx';
import { getHotel } from "../../api/hotelRequest";
import { useEffect, useState } from "react";
export default function InfoHotel() {
```

## src/page/hotel/NivelesHotel.jsx

```jsx
import {
import DataTable from "../../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import { deleteNivel, getNivel } from "../../api/nivelHotelRequest";
import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import UserForm from "../../Components/Forms/UserForm";
import NivelHotelForm from "../../Components/Forms/NivelHotelForm";
export default NivelesHotel;
```

## src/page/hotel/Recepcion.jsx

```jsx
import * as React from 'react';
import RecepcionCuartos from '../../Components/Papers/RecepcionCuartos.jsx';
import { Paper, Typography, Grid, Box, Container } from "@mui/material";
export default function Recepcion() {
```

## src/page/hotel/Reservas.jsx

```jsx
import React, { useState } from 'react';
import {
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
export default Reservas;
```

## src/page/inventoryControl/CatalogManagerPage.jsx

```jsx
import React, { useEffect, useMemo, useState } from "react";
import {
import { Edit, Delete, Inventory } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import TablePro from "../../Components/Tables/TablePro";
import { pathImg } from "../../api/axios";
import {
import AutoCatalogLab from "./components/AutoCatalogLab";
```

## src/page/inventoryControl/CategoryPage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { Edit, Delete, Category } from "@mui/icons-material";
import toast from "react-hot-toast";
import CategoryForm from "./components/CategoryForm";
import {
import DataTable from "../../Components/Tables/DataTable";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
export default CategoryPage;
```

## src/page/inventoryControl/CustomerPage.jsx

```jsx
import {
  import { useEffect, useState } from 'react';
  import { Edit, Delete } from '@mui/icons-material';
  import toast from 'react-hot-toast';
  import DataTable from '../../Components/Tables/DataTable';
  import SimpleDialog from '../../Components/Dialogs/SimpleDialog';
  import CustomerForm from './components/CustomerForm';
import { getAllCustomersRequest,deleteCustomerRequest } from '../../api/inventoryControlRequest';
  export default CustomerPage;
```

## src/page/inventoryControl/DashBoardPage.jsx

```jsx
import React, { useState, useEffect } from "react";
import {
import ResponsiveTable from "./components/DataTableFinance";
import { getAllProducts } from "../../api/inventoryControlRequest";
import {
import { getAllOrdersRequest } from "../../api/ordersRequest";
import TablePro from "../../Components/Tables/TablePro";
import {
import DonutChart from "../../Components/Charts/Donutchart";
import SimpleCharts from "../../Components/Charts/SimpleCharts";
import BarChartDays from "./components/Charts/BarChartDays";
import LineChartMonth from "./components/Charts/LineChartMonth";
import DoblePieChart from "../../Components/Charts/DoblePieChart";
import OrderAccordionTable from "./components/OrderAccordionTable";
import CustomersAccordionTable from "./components/CustomersAccordionTable";
import BarChartOp from "./components/Charts/BarChartOp";
import ChartCalendaryInfo from "./components/Charts/ChartCalendaryInfo";
import ExpenseByDateLine from "./components/Charts/ExpenseByDateLine";
import ExpensePurchaseStats from "./components/Charts/ExpensePurchaseStats";
export const DashBoardPage = () => {
```

## src/page/inventoryControl/FinancePage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { Add, MonetizationOn, MoneyOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../Components/Tables/DataTable";
import TablePro from "../../Components/Tables/TablePro";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import FinanceForm from "./components/FinanceForm";
import {
import CustomerOrderGroupsDemo from "./components/CustomerOrderGroupsDemo";
```

## src/page/inventoryControl/HomeLogout.jsx

```jsx
import { useEffect, useState } from "react";
import {
import { useTheme } from "@mui/material/styles";
import Carousel3D from "./components/Carousel3D";
import StoresPanel from "./components/StoresPanel";
import { pathImg } from "../../api/axios";
import {
import { activeApp } from "../../../appConfig.js";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
export default function HomeLogout() {
```

## src/page/inventoryControl/HomePage.jsx

```jsx
import React, { useState, useEffect } from "react";
import {
import ResponsiveTable from "./components/DataTableFinance";
import { getAllProducts } from "../../api/inventoryControlRequest";
import {
import { getAllOrdersRequest } from "../../api/ordersRequest";
import TablePro from "../../Components/Tables/TablePro";
import {
export const HomePage = () => {
export default HomePage;
```

## src/page/inventoryControl/HomeProduct.jsx

```jsx
import {
  import { useEffect, useMemo, useState, useRef } from "react";
  import { Add, Edit, Delete } from "@mui/icons-material";
  import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
  import TablePro from "../../Components/Tables/TablePro";
  import {
  import { pathImg } from "../../api/axios";
  import { useAuth } from "../../context/AuthContext";
  import Cropper from "react-easy-crop";
```

## src/page/inventoryControl/MovementPage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import toast from "react-hot-toast";
import DataTable from "../../Components/Tables/DataTable";
import TablePro from "../../Components/Tables/TablePro";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import MovementForm from "./components/MovementForm";
import {
export default MovementPage;
```

## src/page/inventoryControl/OrderPage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import OrderForm from "./components/OrderForm";
import {
import OrderAccordionTable from "./components/OrderAccordionTable";
import OrderCalendaryTable from "./components/OrderCalendaryTable";
export default OrderPage;
```

## src/page/inventoryControl/ProductionManagerPage.jsx

```jsx
import { Container, Grid, Typography, Paper, Card, CardContent, Box,Stack} from "@mui/material";
import { useEffect, useState } from "react";
import TablePro from "../../Components/Tables/TablePro"
import RenderFromFinal from "./components/SimulateProduction";
import RenderFromIntermediate from "./components/RenderFromIntermediate";
import { getAllProducts } from "../../api/inventoryControlRequest";
export default function ProductionManagerPage() {
```

## src/page/inventoryControl/ProductsPage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Inventory } from "@mui/icons-material";
import toast from "react-hot-toast";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import ProductForm from "./components/ProductForm";
import {
import { pathImg } from "../../api/axios"; // 👈 importa el path base de imágenes
import TablePro from "../../Components/Tables/TablePro";
```

## src/page/inventoryControl/RecipePage.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { Edit, Delete, RestaurantMenu } from "@mui/icons-material";
import toast from "react-hot-toast";
import TablePro from "../../Components/Tables/TablePro";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import RecipeForm from "./components/RecipeForm";
import {
import CostingAccordionTable from "./components/CostingAccordionTable";
```

## src/page/inventoryControl/StoresManagerPage.jsx

```jsx
import {
import { useEffect, useMemo, useState, useRef } from "react";
import {
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import TablePro from "../../Components/Tables/TablePro";
import {
import { pathImg } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Cropper from "react-easy-crop";
```

## src/page/inventoryControl/StoresPage.jsx

```jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import {
import { alpha, useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { getStoresRequest, getStoreProductsRequest } from "../../api/inventoryControlRequest";
import { pathImg } from "../../api/axios";
```

## src/page/inventoryControl/UnitPage.jsx

```jsx
import {
  import { useEffect, useState } from "react";
  import { Edit, Delete, Straighten } from "@mui/icons-material";
  import toast from "react-hot-toast";
  import UnitForm from "./components/UnitForm.jsx";
import DataTable from "../../Components/Tables/DataTable";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { getUnits,deleteUnitRequest } from "../../api/inventoryControlRequest";
  export default UnitPage;
```

## src/page/inventoryControl/components/AutoCatalogLab.jsx

```jsx
import React, { useEffect, useMemo, useState } from "react";
import {
import { Add, ContentCopy, Star, TrendingUp, Layers } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getAutoCatalogSeed,createCatalogEntry } from "../../../api/inventoryControlRequest";
export default function AutoCatalogLab({ onSyncAfterSave }) {
```

## src/page/inventoryControl/components/Carousel3D.jsx

```jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
export default function Carousel3D({
```

## src/page/inventoryControl/components/CategoryForm.jsx

```jsx
import {
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import {
export default CategoryForm;
```

## src/page/inventoryControl/components/Charts/BarChartDays.jsx

```jsx
import * as React from 'react';
import { useAnimate } from '@mui/x-charts/hooks';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
export default function BarChartDays({dataDays=['L', 'M', 'W','J','V','S','D'],dataValues= [0,0,0,0,0,0,0]}) {
```

## src/page/inventoryControl/components/Charts/BarChartOp.jsx

```jsx
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Box, Button, Stack, Typography, Chip } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import {
import { es } from 'date-fns/locale';
export default function BarChartOp({
```

## src/page/inventoryControl/components/Charts/ChartCalendaryInfo.jsx

```jsx
import React, { useState, useMemo } from 'react';
import {
import {
import { es } from 'date-fns/locale';
export default function ChartCalendaryInfo({
```

## src/page/inventoryControl/components/Charts/ExpenseByDateLine.jsx

```jsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Stack, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
export default function ExpenseByDateLine({ sampleExpenses = [] }) {
```

## src/page/inventoryControl/components/Charts/ExpensePurchaseStats.jsx

```jsx
import * as React from 'react';
import {
import { parseISO, format, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';
export default function ExpensePurchaseStats({ sampleExpenses = [] }) {
```

## src/page/inventoryControl/components/Charts/LineChartMonth.jsx

```jsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
export default function StackedAreas({ data = [], seriesName = [] }) {
```

## src/page/inventoryControl/components/CostingAccordionTable.jsx

```jsx
import {
import { useState, memo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
export default function CostingAccordionTable({ data }) {
```

## src/page/inventoryControl/components/CustomerForm.jsx

```jsx
import {
  import { useForm } from 'react-hook-form';
  import { useEffect } from 'react';
  import { useAuth } from '../../../context/AuthContext';
import { createCustomerRequest,updateCustomerRequest } from '../../../api/ordersRequest.js';
  export default CustomerForm;
```

## src/page/inventoryControl/components/CustomerOrderGroupsDemo.jsx

```jsx
import React, { useEffect, useMemo, useState } from "react";
import {
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import {
import { useAuth } from "../../../context/AuthContext";
```

## src/page/inventoryControl/components/CustomersAccordionTable.jsx

```jsx
import React, { useEffect, useMemo, useState } from "react";
import {
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon   from "@mui/icons-material/KeyboardArrowUp";
import PaidIcon from "@mui/icons-material/AttachMoney";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCustomerSalesSummary } from "../../../api/financeRequest";
```

## src/page/inventoryControl/components/DataTableFinance.jsx

```jsx
import React from 'react';
import {
import { useTheme } from '@mui/material/styles';
export default ResponsiveTable;
```

## src/page/inventoryControl/components/FinanceForm.jsx

```jsx
import { useForm, Controller } from "react-hook-form";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useMemo } from "react";
import {
import { useAuth } from "../../../context/AuthContext";
export default FinanceForm;
```

## src/page/inventoryControl/components/MovementForm.jsx

```jsx
import {
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { registerMovement } from "../../../api/inventoryControlRequest";
import SimulateProductionComponent from "./SimulateProduction.jsx";
import SearchableSelect from "../../../Components/SearchableSelect.jsx";
export default MovementForm;
```

## src/page/inventoryControl/components/OrderAccordionTable.jsx

```jsx
import {
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
import {  formatDate } from '../../../helpers/functions';
import { useAuth } from "../../../context/AuthContext";
```

## src/page/inventoryControl/components/OrderCalendaryTable.jsx

```jsx
import React, { useState, useEffect } from 'react';
import {
import { alpha } from '@mui/material/styles';
import {
import { es } from 'date-fns/locale';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {
import { useAuth } from '../../../context/AuthContext';
import SimpleDialog from '../../../Components/Dialogs/SimpleDialog';
export default function OrderCalendarView({ orders, onReload }) {
```

## src/page/inventoryControl/components/OrderForm.jsx

```jsx
import { Grid, TextField, Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
import { getAllProducts } from "../../../api/inventoryControlRequest";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import SearchableSelect from "../../../Components/SearchableSelect";
```

## src/page/inventoryControl/components/ProductForm.jsx

```jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
import {
import { pathImg } from "../../../api/axios";
```

## src/page/inventoryControl/components/RecipeForm.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
import { useForm, Controller } from "react-hook-form";
export default RecipeForm;
```

## src/page/inventoryControl/components/RenderFromIntermediate.jsx

```jsx
import React from "react";
import {
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import {
import { useAuth } from "../../../context/AuthContext";
import SearchableSelect from "../../../Components/SearchableSelect";
```

## src/page/inventoryControl/components/SimulateProduction.jsx

```jsx
import React, { useState } from "react";
import {
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
import { useAuth } from "../../../context/AuthContext";
import SearchableSelect from "../../../Components/SearchableSelect";
```

## src/page/inventoryControl/components/StoresPanel.jsx

```jsx
import { useMemo, useState } from "react";
import {
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
export default function StoresPanel({
```

## src/page/inventoryControl/components/UnitForm.jsx

```jsx
import {
  import { useForm } from "react-hook-form";
  import { useEffect } from "react";
  import toast from "react-hot-toast";
  import { useAuth } from "../../../context/AuthContext";
import { createUnitRequest,updateUnitRequest } from "../../../api/inventoryControlRequest";
  export default UnitForm;
```

## src/page/mapa/BasicMap.jsx

```jsx
import { MapContainer, TileLayer, Popup, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
export default function OsmPointsMap() {
```

## src/page/mapa/OsmPointsMap.jsx

```jsx
import { MapContainer, TileLayer, Popup, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
export default function OsmPointsMap({
```

## src/page/mapa/ProMap.jsx

```jsx
import Map, { Marker, Popup } from "react-map-gl";
export default function ProMap() {
```

## src/page/piano/PianoPractice.jsx

```jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import * as Tone from 'tone';
import { notesToPlay as arrayNotes } from './arrayMusic';
```

## src/page/piano/PianoRoll.jsx

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
```

## src/page/piano/midi.jsx

```jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import * as Tone from 'tone';
import { notesToPlay as arrayNotes } from './arrayMusic';
```

## src/page/quiz/admin/AdminQuizList.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
import BarChart from "@mui/icons-material/BarChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import QuizForm from "../components/QuizForm";
import {
import { formatDate } from "../../../helpers/functions";
import DataTable from "../../../Components/Tables/DataTable";
export default AdminQuizList;
```

## src/page/quiz/admin/AssignQuiz.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { Person, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import {
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import AssignUserForm from "../components/AssignUserForm";
import { useParams } from "react-router-dom";
import { anonimizarTextoChino } from "../../../helpers/functions";
export default AssignQuiz;
```

## src/page/quiz/admin/QuizQuestions.jsx

```jsx
import {
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Add, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { addQuestionsToQuiz, getQuestionsByQuiz } from "../../../api/quizRequest";
import toast from "react-hot-toast";
```

## src/page/quiz/admin/QuizResponsesCharts.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { getQuizResponses, getQuizUserResponses } from "../../../api/quizRequest";
import UserResponsesTable from "../components/UserResponsesTable";
export default function QuizResponsesCharts() {
```

## src/page/quiz/admin/QuizViewer.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByQuiz } from "../../../api/quizRequest";
export default QuizViewer;
```

## src/page/quiz/components/AssignUserForm.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import DataTable from "./DataTableFormCheck";
import { assignUsersToQuiz, filterUsersByRole } from "../../../api/quizRequest.js";
import SelectData from "../../../Components/Selects/SelectData";
import { getRolRequest } from "../../../api/accountRequest";
export default AssignUserForm;
```

## src/page/quiz/components/DataTableFormCheck.jsx

```jsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
export default function DataTable({ columns = [], rows = [], onSelectionChange }) {
```

## src/page/quiz/components/QuizForm.jsx

```jsx
import {
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { createQuiz, editQuiz } from "../../../api/quizRequest";
export default QuizForm;
```

## src/page/quiz/components/UserResponsesTable.jsx

```jsx
import {
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';
export default function UserResponsesTable({ users }) {
```

## src/page/quiz/user/QuizAnswerEvaluation.jsx

```jsx
import {
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByQuiz, submitQuizAnswers } from "../../../api/quizRequest";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
export default QuizAnswerEvaluation;
```

## src/page/quiz/user/QuizAnswerPractice.jsx

```jsx
import {
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByQuiz } from "../../../api/quizRequest";
import { useAuth } from "../../../context/AuthContext";
export default QuizAnswerPractice;
```

## src/page/quiz/user/QuizAnswerSimulator.jsx

```jsx
import {
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByQuiz } from "../../../api/quizRequest";
import { useAuth } from "../../../context/AuthContext";
export default QuizSimulatorMode;
```

## src/page/quiz/user/QuizList.jsx

```jsx
import {
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionAnswer } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import { getQuizzesByUserId } from "../../../api/quizRequest";
import { useAuth } from "../../../context/AuthContext";
import QuizIcon from "@mui/icons-material/Quiz";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
export default QuizList;
```

## src/theme/ThemeModeProvider.jsx

```jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./getTheme";
export function useThemeMode() {
export function ThemeModeProvider({ children, defaultMode = "system" }) {
```

## src/theme/eddeliTheme.js

```js
import { createTheme } from "@mui/material/styles";
export default theme;
```

## src/theme/getTheme.js

```js
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
export function getTheme(mode = "light") {
```

## src/theme/getThemeAlumni.js

```js
import { createTheme } from "@mui/material/styles";
export function getTheme(mode = "light") {
```

## src/theme/theme.js

```js
import { createTheme } from "@mui/material";
// export default theme;
export default theme;
```

## src/theme/themeAlumni.js

```js
import { createTheme } from "@mui/material";
// export default theme;
export default theme;
```

## vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
```

