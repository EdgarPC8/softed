// pages/ProductionManagerPage.jsx
import { Container, Grid, Typography, Paper, Card, CardContent, Box,Stack} from "@mui/material";
import { useEffect, useState } from "react";
import TablePro from "../../Components/Tables/TablePro"
// OJO: ajusta las rutas según tu estructura real
import RenderFromFinal from "./components/SimulateProduction";
import RenderFromIntermediate from "./components/RenderFromIntermediate";
import { getAllProducts } from "../../api/inventoryControlRequest";


export default function ProductionManagerPage() {
  const [products, setProducts] = useState([]);

  const fetchdata = async () => {
    const { data } = await getAllProducts();
    const productsData = data
  .filter((p) => p.type !== "raw")
  .sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));

    setProducts(productsData);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const getColor = (stock) => {
    if (stock === 0) return "#f44336"; // rojo
    if (stock > 0 && stock <= 10) return "#ffeb3b"; // amarillo
    if (stock > 10) return "#4caf50"; // verde
    return "#e0e0e0"; // gris
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Producción — Intermedio & Producto Final
      </Typography>


      <Grid container spacing={3}>
        {/* Columna: flujo desde intermedio */}
        <Grid item xs={12} lg={12}>
    <TablePro 
      rows={products} 
      columns={[{ id: "name", label: "Nombre" }, { id: "stock", label: "Stock" }]}
      showSearch={false}
      showPagination={false}
      defaultRowsPerPage={5}
      />
        </Grid> 

        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
              Desde intermedio (masa)
            </Typography>
            <RenderFromIntermediate />
          </Paper>
        </Grid>

        {/* Columna: flujo desde producto final */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
              Desde producto final (árbol)
            </Typography>
            <RenderFromFinal fetchData={fetchdata}/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
