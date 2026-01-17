# Project Structure

```
├── README.md
├── appConfig.js
├── cmd.js
├── package-lock.json
├── package.json
├── src
│   ├── App.jsx
│   ├── Components
│   │   ├── Acordions
│   │   │   └── AcordionBasic.jsx
│   │   ├── AllComponents
│   │   │   └── All.jsx
│   │   ├── ButtonsFloats
│   │   │   └── ReloadButtonSimulator.jsx
│   │   ├── Charts
│   │   │   ├── DoblePieChart.jsx
│   │   │   ├── Donutchart.jsx
│   │   │   ├── PieChart.jsx
│   │   │   └── SimpleCharts.jsx
│   │   ├── Dialogs
│   │   │   ├── SimpleDialog.jsx
│   │   │   └── UserDialog.jsx
│   │   ├── Forms
│   │   │   ├── AccountForm.jsx
│   │   │   ├── HotelForm.jsx
│   │   │   ├── LicenseForm.jsx
│   │   │   ├── LogsForm.jsx
│   │   │   ├── NivelHotelForm.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   └── UserForm.jsx
│   │   ├── HorizontalScroller.jsx
│   │   ├── NavBar
│   │   │   └── NavBar.jsx
│   │   ├── NoAccess.jsx
│   │   ├── NotificationList.jsx
│   │   ├── Papers
│   │   │   ├── Analisis.jsx
│   │   │   ├── InfoCuartos.jsx
│   │   │   └── RecepcionCuartos.jsx
│   │   ├── Preguntas.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Quiz
│   │   │   ├── CreatorQuizForm.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   └── ResponseForm.jsx
│   │   ├── Roles.jsx
│   │   ├── SearchableSelect.jsx
│   │   ├── Selects
│   │   │   ├── SelectData.jsx
│   │   │   └── SelectDataRoles.jsx
│   │   ├── Tables
│   │   │   ├── DataTable.jsx
│   │   │   ├── DataTableQuestions.jsx
│   │   │   ├── DataTableQuestionsSimulator.jsx
│   │   │   └── TablePro.jsx
│   │   ├── ThemeSwitcher.jsx
│   │   ├── Toast
│   │   │   ├── SimpleToast.jsx
│   │   │   └── Toast.js
│   │   ├── ViewModal
│   │   │   ├── BackupViewerModal.jsx
│   │   │   ├── CambiarRol.jsx
│   │   │   └── StudentViewerModal.jsx
│   │   └── VisuallyHiddenInput.js
│   ├── api
│   │   ├── accountRequest.js
│   │   ├── alumniRequest.js
│   │   ├── authRequest.js
│   │   ├── axios.js
│   │   ├── comandsRequest.js
│   │   ├── financeRequest.js
│   │   ├── formsRequest.js
│   │   ├── hotelRequest.js
│   │   ├── inventoryControlRequest.js
│   │   ├── nivelHotelRequest.js
│   │   ├── notificationsRequest.js
│   │   ├── ordersRequest.js
│   │   ├── quizRequest.js
│   │   └── userRequest.js
│   ├── context
│   │   ├── AuthContext.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicOnlyRoute.jsx
│   ├── helpers
│   │   ├── functions.js
│   │   └── isValidCI.js
│   ├── hooks
│   │   └── useNotificationSocket.js
│   ├── main.jsx
│   ├── page
│   │   ├── Accounts.jsx
│   │   ├── Comandos.jsx
│   │   ├── ControlPanel.jsx
│   │   ├── Donations.jsx
│   │   ├── Home.jsx
│   │   ├── Info.jsx
│   │   ├── Login.jsx
│   │   ├── Logs.jsx
│   │   ├── Notifications.jsx
│   │   ├── Profile.jsx
│   │   ├── Quiz.jsx
│   │   ├── Roles.jsx
│   │   ├── Tokens.jsx
│   │   ├── Users.jsx
│   │   ├── alumni
│   │   │   ├── Entidades
│   │   │   │   ├── CareerPage.jsx
│   │   │   │   ├── MatrizPage.jsx
│   │   │   │   └── PeriodPage.jsx
│   │   │   └── Home.jsx
│   │   ├── eddeli
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── PanaderiaPage.jsx
│   │   │   ├── PasteleriaPage.jsx
│   │   │   └── ReposteriaPage.jsx
│   │   ├── form
│   │   │   ├── admin
│   │   │   │   ├── AdminFormsList.jsx
│   │   │   │   ├── AssignForm.jsx
│   │   │   │   ├── FormQuestions.jsx
│   │   │   │   ├── FormResponsesCharts.jsx
│   │   │   │   └── FormViewer.jsx
│   │   │   ├── components
│   │   │   │   ├── AssignUserForm.jsx
│   │   │   │   ├── ClosedQuestionsTable.jsx
│   │   │   │   ├── DataTableFormCheck.jsx
│   │   │   │   └── Form.jsx
│   │   │   └── user
│   │   │       ├── FormAnswer.jsx
│   │   │       └── FormsList.jsx
│   │   ├── hotel
│   │   │   ├── Analytics.jsx
│   │   │   ├── InfoHotel.jsx
│   │   │   ├── NivelesHotel.jsx
│   │   │   ├── Recepcion.jsx
│   │   │   └── Reservas.jsx
│   │   ├── inventoryControl
│   │   │   ├── CatalogManagerPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── CustomerPage.jsx
│   │   │   ├── DashBoardPage.jsx
│   │   │   ├── FinancePage.jsx
│   │   │   ├── HomeLogout.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomeProduct.jsx
│   │   │   ├── MovementPage.jsx
│   │   │   ├── OrderPage.jsx
│   │   │   ├── ProductionManagerPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── RecipePage.jsx
│   │   │   ├── StoresManagerPage.jsx
│   │   │   ├── StoresPage.jsx
│   │   │   ├── UnitPage.jsx
│   │   │   └── components
│   │   │       ├── AutoCatalogLab.jsx
│   │   │       ├── Carousel3D.jsx
│   │   │       ├── CategoryForm.jsx
│   │   │       ├── Charts
│   │   │       │   ├── BarChartDays.jsx
│   │   │       │   ├── BarChartOp.jsx
│   │   │       │   ├── ChartCalendaryInfo.jsx
│   │   │       │   ├── ExpenseByDateLine.jsx
│   │   │       │   ├── ExpensePurchaseStats.jsx
│   │   │       │   └── LineChartMonth.jsx
│   │   │       ├── CostingAccordionTable.jsx
│   │   │       ├── CustomerForm.jsx
│   │   │       ├── CustomerOrderGroupsDemo.jsx
│   │   │       ├── CustomersAccordionTable.jsx
│   │   │       ├── DataTableFinance.jsx
│   │   │       ├── FinanceForm.jsx
│   │   │       ├── MovementForm.jsx
│   │   │       ├── OrderAccordionTable.jsx
│   │   │       ├── OrderCalendaryTable.jsx
│   │   │       ├── OrderForm.jsx
│   │   │       ├── ProductForm.jsx
│   │   │       ├── RecipeForm.jsx
│   │   │       ├── RenderFromIntermediate.jsx
│   │   │       ├── SimulateProduction.jsx
│   │   │       ├── StoresPanel.jsx
│   │   │       └── UnitForm.jsx
│   │   ├── mapa
│   │   │   ├── BasicMap.jsx
│   │   │   ├── OsmPointsMap.jsx
│   │   │   └── ProMap.jsx
│   │   ├── piano
│   │   │   ├── PianoPractice.jsx
│   │   │   ├── PianoRoll.jsx
│   │   │   ├── arrayMusic.js
│   │   │   └── midi.jsx
│   │   └── quiz
│   │       ├── admin
│   │       │   ├── AdminQuizList.jsx
│   │       │   ├── AssignQuiz.jsx
│   │       │   ├── QuizQuestions.jsx
│   │       │   ├── QuizResponsesCharts.jsx
│   │       │   └── QuizViewer.jsx
│   │       ├── components
│   │       │   ├── AssignUserForm.jsx
│   │       │   ├── DataTableFormCheck.jsx
│   │       │   ├── QuizForm.jsx
│   │       │   └── UserResponsesTable.jsx
│   │       └── user
│   │           ├── QuizAnswerEvaluation.jsx
│   │           ├── QuizAnswerPractice.jsx
│   │           ├── QuizAnswerSimulator.jsx
│   │           └── QuizList.jsx
│   └── theme
│       ├── ThemeModeProvider.jsx
│       ├── eddeliTheme.js
│       ├── getTheme.js
│       ├── getThemeAlumni.js
│       ├── theme.js
│       └── themeAlumni.js
└── vite.config.js
```
