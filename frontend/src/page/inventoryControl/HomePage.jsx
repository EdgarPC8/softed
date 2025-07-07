import React ,{useState,useEffect} from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import ResponsiveTable from "./components/DataTableFinance";
import { getAllProducts } from "../../api/inventoryControlRequest";
import {
    getFinanceSummaryRequest,
    getAllIncomesRequest,
    getAllExpensesRequest
  } from "../../api/financeRequest";


const paperStyle = {
    padding: "16px",
    textAlign: "center",
    height: "100%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};




const rows = [
    { name: 'Coca-Cola', stock: 10, precio: '$1.50' },
    { name: 'Pepsi', stock: 4, precio: '$1.40' },
    { name: 'Agua', stock: 20, precio: '$0.80' },
];

export const HomePage = () => {
  const [dataProducts, setDataProducts] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });
  const [transactions, setTransactions] = useState([]);
  const balance = summary.totalIncome - summary.totalExpense;
  const percentExpense = summary.totalIncome
    ? (summary.totalExpense / summary.totalIncome) * 100
    : 0;

    const fetchProducts = async () => {
        const { data } = await getAllProducts();
        const productsByAgotarse = data.filter(p => p.stock <= p.minStock);

        setDataProducts(productsByAgotarse);
        console.log(productsByAgotarse)
      };

  useEffect(() => {
    fetchProducts();
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
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={2}>
                {/* FILA 1 - TOTALES */}
                <Grid item xs={12} md={3}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">💰 Total Dinero</Typography>
                        <Typography variant="h5">${balance}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">📈 Total Ingresos</Typography>
                        <Typography variant="h5">${summary.totalIncome}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">📉 Total Gastos</Typography>
                        <Typography variant="h5">${summary.totalExpense}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">📦 Total Pedidos</Typography>
                        <Typography variant="h5">0 pedidos</Typography>
                    </Paper>
                </Grid>

                {/* FILA 2 - GRÁFICOS */}
                <Grid item xs={12} md={6}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">📊 Ventas en el tiempo</Typography>
                        <Box mt={2}>[Gráfico de líneas aquí]</Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper style={paperStyle}>
                        <ResponsiveTable 
                            columns={
                                [
                                    { id: 'name', label: 'Producto' },
                                    { id: 'stock', label: 'Stock', align: 'right' },
                                    { id: 'price', label: 'Precio', align: 'right' },
                                ]
                            }
                            rows={dataProducts}
                            title="⚠️ Productos por agotarse"
                        />
                    </Paper>
                </Grid>

                {/* FILA 3 - PRODUCTOS Y PEDIDOS */}
                <Grid item xs={12} md={6}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">🛒 Productos más vendidos</Typography>
                        <Box mt={2}>[Gráfico de líneas aquí o tabla aqui]</Box>

                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">📋 Pedidos por estado</Typography>
                        <Box mt={2}>[Entregados, pendientes, por cancelar]</Box>
                    </Paper>
                </Grid>

                {/* FILA 4 - CATEGORÍA Y ALERTAS */}
                <Grid item xs={12} md={6}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">📂 Ventas por categoría</Typography>
                        <Box mt={2}>[Gráfico de barras]</Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper style={paperStyle}>
                        <Typography variant="h6">🚨 Alertas del sistema</Typography>
                        <Box mt={2}>
                            - Producto X queda 1 unidad<br />
                            - Pedido #123 lleva 5 días pendiente
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;
