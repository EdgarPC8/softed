import {
  Container,
  IconButton,
  Button,
  Tooltip,
  Grid,
  Typography,
  Paper,

} from "@mui/material";
import { useEffect, useState } from "react";
import { Add, MonetizationOn, MoneyOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../Components/Tables/DataTable";
import TablePro from "../../Components/Tables/TablePro";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import FinanceForm from "./components/FinanceForm";
import {
  getAllIncomesRequest,
  getAllExpensesRequest,
  getFinanceSummaryRequest,
  deleteIncomeRequest,
  deleteExpenseRequest,
} from "../../api/financeRequest";



function FinancePage() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formType, setFormType] = useState("income");
  const [titleUserDialog, setTitleUserDialog] = useState("");
  const [dataToEdit, setDataToEdit] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});

  const fetchData = async () => {
    const incomeRes = await getAllIncomesRequest();
    const expenseRes = await getAllExpensesRequest();
    const summaryRes = await getFinanceSummaryRequest();
    setIncomes(incomeRes.data);
    setExpenses(expenseRes.data);
    setSummary(summaryRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDialogUser = () => setOpenDialog(!openDialog);
  const handleDialogDelete = () => setOpenDeleteDialog(!openDeleteDialog);

  const deleteData = async () => {
    const fn = formType === "income" ? deleteIncomeRequest : deleteExpenseRequest;
    toast.promise(fn(dataToDelete.id), {
      loading: "Eliminando...",
      success: "Registro eliminado con éxito",
      error: "Ocurrió un error",
    });
    fetchData();
    handleDialogDelete();
  };

// 1) commonColumns: maneja params y stopPropagation
const commonColumns = [
  { label: "Fecha", id: "date" },
  { label: "Concepto", id: "concept" },
  { label: "Categoría", id: "category" },
  { label: "Monto", id: "amount" },
  {
    label: "Acciones",
    id: "actions",
    // Si tu TablePro usa 'renderCell', pásalo también/además:
    render: (params) => {
      const row = params?.row ?? params; // tolera ambas formas
      if (!row) return null;
      return (
        <>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // 🔒 no dejes que la fila consuma el click
                setFormType(row.type || "income");
                setIsEditing(true);
                setDataToEdit(row);
                setTitleUserDialog("Editar " + (row.type === "expense" ? "Gasto" : "Ingreso"));
                setOpenDialog(true);
              }}
            >
              <MonetizationOn />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // 🔒
                setFormType(row.type || "income");
                setDataToDelete(row);
                setOpenDeleteDialog(true);
              }}
            >
              <MoneyOff />
            </IconButton>
          </Tooltip>
        </>
      );
    },
    // renderCell: ... // si tu TablePro usa esta prop, duplica el mismo contenido aquí
  },
];


  return (
    <Container>
      {/* Dialog Eliminar */}
      <SimpleDialog
        open={openDeleteDialog}
        onClose={handleDialogDelete}
        tittle="Eliminar Registro"
        onClickAccept={deleteData}
      >
        ¿Está seguro de eliminar este registro?
      </SimpleDialog>

      {/* Dialog Crear/Editar */}
      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <FinanceForm
          type={formType}
          data={dataToEdit}
          onClose={handleDialogUser}
          onSaved={fetchData}
        />
      </SimpleDialog>

      <Grid container spacing={2} mb={4} mt={2}>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6">💰 Total Dinero</Typography>
            <Typography variant="h5">${(summary.totalIncome - summary.totalExpense).toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6">📈 Total Ingresos</Typography>
            <Typography variant="h5">${summary.totalIncome.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6">📉 Total Gastos</Typography>
            <Typography variant="h5">${summary.totalExpense.toFixed(2)}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              setFormType("income");
              setTitleUserDialog("Registrar Ingreso");
              setIsEditing(false);
              setDataToEdit(null);
              handleDialogUser();
            }}
            sx={{ mr: 2 }}
          >
            Registrar Ingreso
          </Button>
          <TablePro
            rows={incomes.map(i => ({ ...i, type: "income" }))} 
            columns={commonColumns}
            defaultRowsPerPage={5}
            title="Ingresos"
            tableMaxHeight={200}
          />
        </Grid>
        <Grid item xs={12} md={6}>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Add />}
            onClick={() => {
              setFormType("expense");
              setTitleUserDialog("Registrar Gasto");
              setIsEditing(false);
              setDataToEdit(null);
              handleDialogUser();
            }}
          >
            Registrar Gasto
          </Button>
          {/* <DataTable data={expenses.map(e => ({ ...e, type: "expense" }))} columns={commonColumns} /> */}
                    <TablePro
            rows={expenses.map(e => ({ ...e, type: "expense" }))} 
            columns={commonColumns}
            defaultRowsPerPage={5}
            title="Gastos"
            tableMaxHeight={200}
          />
        </Grid>
      </Grid>

    </Container>
  );
}

export default FinancePage;
