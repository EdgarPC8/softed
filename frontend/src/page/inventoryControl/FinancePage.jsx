import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Avatar,
  List, ListItem, ListItemText, Divider, LinearProgress
} from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import {
  getFinanceSummaryRequest,
  getAllIncomesRequest,
  getAllExpensesRequest
} from "../../api/financeRequest";

export const FinancePage = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });
  const [transactions, setTransactions] = useState([]);

  const balance = summary.totalIncome - summary.totalExpense;
  const percentExpense = summary.totalIncome
    ? (summary.totalExpense / summary.totalIncome) * 100
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSummary, resIncomes, resExpenses] = await Promise.all([
          getFinanceSummaryRequest(),
          getAllIncomesRequest(),
          getAllExpensesRequest()
        ]);

        setSummary(resSummary.data);

        // combinamos ingresos y gastos como 'transacciones'
        const combined = [
          ...resIncomes.data.map(i => ({
            name: "Ingreso",
            description: i.concept,
            date: i.date,
            amount: i.amount,
            status: "Ingreso"
          })),
          ...resExpenses.data.map(e => ({
            name: "Gasto",
            description: e.concept,
            date: e.date,
            amount: e.amount,
            status: "Gasto"
          }))
        ];

        // orden por fecha descendente
        const sorted = combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(sorted.slice(0, 10)); // los últimos 10

      } catch (err) {
        console.error("Error al cargar datos financieros:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Finanzas</Typography>

      {/* Resumen financiero */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar><SavingsIcon /></Avatar>
                <Box>
                  <Typography variant="h6">${balance}</Typography>
                  <Typography variant="body2">Balance Estimado</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar><TrendingUpIcon /></Avatar>
                <Box>
                  <Typography variant="h6">${summary.totalIncome}</Typography>
                  <Typography variant="body2">Total de Ingresos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar><TrendingDownIcon /></Avatar>
                <Box>
                  <Typography variant="h6">${summary.totalExpense}</Typography>
                  <Typography variant="body2">Total de Gastos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2">Porcentaje de gasto</Typography>
              <Typography variant="h6">{percentExpense.toFixed(1)}%</Typography>
              <LinearProgress variant="determinate" value={percentExpense} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Historial de transacciones */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Historial de Transacciones (Últimos registros)
        </Typography>
        <List>
          {transactions.map((tx, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <ListItemText
                  primary={`${tx.name} - ${tx.description}`}
                  secondary={`${tx.date} - $${parseFloat(tx.amount).toFixed(2)} - ${tx.status}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default FinancePage;
