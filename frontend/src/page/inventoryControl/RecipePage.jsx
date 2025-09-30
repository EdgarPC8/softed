import {
  Container,
  Button,
  IconButton,
  Tooltip,
  MenuItem,
  TextField,
  Grid,
  Typography,
  Box,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { Edit, Delete, RestaurantMenu } from "@mui/icons-material";
import toast from "react-hot-toast";

import TablePro from "../../Components/Tables/TablePro";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import RecipeForm from "./components/RecipeForm";
import {
  getAllProducts,
  getRecipeByProduct,
  deleteRecipeRequest,
  getRecipeCosting,
} from "../../api/inventoryControlRequest";
import CostingAccordionTable from "./components/CostingAccordionTable";

function RecipePage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  // Costeo (plano)
  const [costRows, setCostRows] = useState([]);
  const [costSummary, setCostSummary] = useState(null);

  // Árbol
  const [costTreeData, setCostTreeData] = useState(null);

  // Loading
  const [loadingCost, setLoadingCost] = useState(false);

  // Parámetros UI (porcentajes como enteros)
  const [uiParams, setUiParams] = useState({
    extrasPercent: 20,
    laborPercent: 45,
    producedQty: 0,
  });

  const handleDialog = () => setOpen(!open);
  const handleDialogUser = () => setOpenDialog(!openDialog);

  const fetchProducts = async () => {
    const { data } = await getAllProducts();
    setProducts(data.filter((p) => p.type === "final" || p.type === "intermediate"));
  };

  const fetchRecipe = async (productId) => {
    const { data } = await getRecipeByProduct(productId);
    setRecipe(data);
  };

  const fetchCosting = async (productId) => {
    if (!productId) return;
    try {
      setLoadingCost(true);
      const params = {
        extrasPercent: Number(uiParams.extrasPercent) || 0,
        laborPercent: Number(uiParams.laborPercent) || 0,
        producedQty: Number(uiParams.producedQty) || 0,
      };
      const { data } = await getRecipeCosting(productId, params);
      setCostRows(data.rows || []);
      setCostSummary(data.summary || null);
    } catch (e) {
      toast.error("Error al calcular el costeo");
    } finally {
      setLoadingCost(false);
    }
  };

  const fetchCostingTree = async (productId) => {
    if (!productId) return;
    try {
      setLoadingCost(true);
      const params = {
        extrasPercent: Number(uiParams.extrasPercent) || 0,
        laborPercent: Number(uiParams.laborPercent) || 0,
        producedQty: Number(uiParams.producedQty) || 0,
      };
      const { data } = await getRecipeCosting(productId, params);
      // data: { tree, summary, rows }
      setCostTreeData(data);
    } catch (e) {
      toast.error("Error al calcular el costeo (árbol)");
    } finally {
      setLoadingCost(false);
    }
  };

  const deleteData = async () => {
    toast.promise(
      deleteRecipeRequest(dataToDelete.id),
      {
        loading: "Eliminando...",
        success: "Insumo eliminado con éxito",
        error: "Ocurrió un error",
      },
      { position: "top-right", style: { fontFamily: "roboto" } }
    );
    setRecipe((prev) => prev.filter((item) => item.id !== dataToDelete.id));
    handleDialog();
    // Recalcula ambos costos
    fetchCosting(selectedProduct);
    fetchCostingTree(selectedProduct);
  };

  // columnas receta (izquierda)
  const columns = [
    { label: "Insumo", id: "rawProduct", width: 120, render: (row) => row.rawProduct?.name },
    { label: "Cantidad", id: "quantity", width: 80 },
    { label: "¿En gramos?", id: "isQuantityInGrams", width: 100, render: (row) => (row.isQuantityInGrams ? "Sí" : "No") },
    { label: "Tipo", id: "itemType", width: 90 },
    {
      label: "Acciones",
      id: "actions",
      width: 140,
      render: (params) => (
        <>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => {
                setDatos(params);
                setIsEditing(true);
                settitleUserDialog("Editar Insumo");
                handleDialogUser();
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => {
                handleDialog();
                setDataToDelete(params);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // columnas costeo (derecha)
  const costColumns = [
    { label: "Nombre", id: "nombre", width: 140 },
    { label: "Tipo", id: "tipo", width: 88, render: (r) => (r.tipo === "material" ? "Material" : "Insumo") },
    { label: "Precio Neto", id: "precioNeto", width: 110, render: (r) => r?.precioNeto != null ? Number(r.precioNeto).toFixed(2) : "" },
    { label: "Peso/Unid Empaque", id: "pesoNeto", width: 130, render: (r) => r?.pesoNeto ?? "" },
    {
      label: "Uso en receta",
      id: "uso",
      width: 120,
      render: (r) => (r.tipo === "material" ? r?.cantidadUsada ?? "" : r?.pesoEnMasa ?? ""),
    },
    {
      label: "Precio Unit Base",
      id: "precioUnitBase",
      width: 140,
      render: (r) => r?.precioUnitBase != null ? Number(r.precioUnitBase).toFixed(6) : "",
    },
    { label: "Valor", id: "valor", width: 100, render: (r) => r?.valor != null ? Number(r.valor).toFixed(2) : "" },
  ];

  // helpers para mostrar números seguros
  const fmt = (n, d = 2) => (typeof n === "number" && !isNaN(n) ? n.toFixed(d) : "0.00");
  const t = costSummary?.totales || {};
  const acc = costSummary?.acumulados || {};

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ 2) Deja un solo effect para recargar todo cuando cambie el producto o los params
  useEffect(() => {
    if (!selectedProduct) return;
    fetchRecipe(selectedProduct);
    fetchCosting(selectedProduct);
    fetchCostingTree(selectedProduct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, uiParams.extrasPercent, uiParams.laborPercent, uiParams.producedQty]);

  return (
    <Container>
      {/* Diálogos */}
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Insumo"
        onClickAccept={deleteData}
      >
        ¿Está seguro de eliminar este insumo?
      </SimpleDialog>

      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <RecipeForm
          onClose={() => {
            handleDialogUser();
            fetchRecipe(selectedProduct);
            fetchCosting(selectedProduct);
            fetchCostingTree(selectedProduct);
          }}
          isEditing={isEditing}
          datos={datos}
          reload={() => fetchRecipe(selectedProduct)}
          productFinalId={selectedProduct}
        />
      </SimpleDialog>

      <Grid container spacing={2}>
        {/* Fila 1: Select de producto final */}
        <Grid item xs={12} mt={2}>
          <TextField
            label="Seleccionar Producto Final"
            select
            fullWidth
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {products.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>
                {prod.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Fila 2: dos columnas */}
        <Grid item xs={12} md={12}>
          {/* Botón + tabla receta */}
          <Button
            variant="text"
            endIcon={<RestaurantMenu />}
            onClick={() => {
              setIsEditing(false);
              settitleUserDialog("Agregar Insumo");
              handleDialogUser();
            }}
            disabled={!selectedProduct}
            sx={{ mb: 1 }}
          >
            Agregar Insumo
          </Button>

          <TablePro
            rows={recipe}
            columns={columns}
            defaultRowsPerPage={10}
            title="Receta"
            tableMaxHeight={360}
            showIndex={true}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          {/* Controles + cálculo */}
          <Box sx={{ p: 1, borderRadius: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", rowGap: 1 }}>
              <TextField
                label="Extras %"
                type="number"
                size="small"
                value={uiParams.extrasPercent}
                onChange={(e) =>
                  setUiParams((p) => ({ ...p, extrasPercent: Number(e.target.value || 0) }))
                }
                sx={{ width: 120 }}
                inputProps={{ min: 0, step: 1 }}
              />

              <TextField
                label="Mano de obra %"
                type="number"
                size="small"
                value={uiParams.laborPercent}
                onChange={(e) =>
                  setUiParams((p) => ({ ...p, laborPercent: Number(e.target.value || 0) }))
                }
                sx={{ width: 140 }}
                inputProps={{ min: 0, step: 1 }}
              />

              <TextField
                label="Cant. producida"
                type="number"
                size="small"
                value={uiParams.producedQty}
                onChange={(e) =>
                  setUiParams((p) => ({ ...p, producedQty: Number(e.target.value || 0) }))
                }
                sx={{ width: 160 }}
                inputProps={{ min: 0, step: 1 }}
              />

              <Button
                variant="contained"
                onClick={() => {
                  // ✅ 3) Dispara ambos cálculos
                  fetchCosting(selectedProduct);
                  fetchCostingTree(selectedProduct);
                }}
                disabled={!selectedProduct || loadingCost}
              >
                {loadingCost ? "Calculando..." : "Calcular"}
              </Button>
            </Stack>

            {/* Resumen (plano) */}
            {costSummary && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Resumen</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Subtotal de insumos (valor): <b>{fmt(t.subtotalInsumos)}</b>
                    </Typography>
                    <Typography variant="body2">
                      Subtotal en gramos (insumos): <b>{fmt(acc.totalPesoEnMasaGr, 2)} g</b>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Extras ({t.extrasPercentInt ?? 0}%): <b>{fmt(t.extras)}</b>
                    </Typography>
                    <Typography variant="body2">
                      Mano de obra ({t.laborPercentInt ?? 0}%): <b>{fmt(t.labor)}</b>
                    </Typography>
                    <Typography variant="body2">
                      Total del lote: <b>{fmt(t.totalLote)}</b>
                    </Typography>
                    <Typography variant="body2">
                      Costo unitario (/{t.producedQty ?? 0}): <b>{fmt(t.costoUnitario, 4)}</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}


            {/* Árbol de costos con acordeones */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Árbol de Costos (intermedios → insumos/materiales)
              </Typography>
              {costTreeData && <CostingAccordionTable data={costTreeData} />}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RecipePage;
