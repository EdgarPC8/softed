// RenderFromFinal.jsx
import React from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

// API (ajusta la ruta si hace falta)
import {
  getAllProducts,
  simulateProduction,
  registerProductionFinalFromPayload,
} from "../../../api/inventoryControlRequest";
import { useAuth } from "../../../context/AuthContext";

/* ---------------- Utils ---------------- */
const numberOrZero = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function toArray(req) {
  if (Array.isArray(req)) return req;
  if (req && Array.isArray(req.requiere)) return req.requiere;
  return [];
}
const clone = (obj) => JSON.parse(JSON.stringify(obj));

/** Aplica una actualización inmutable en la ruta dada (path) dentro del árbol. */
function applyAtPath(rootArray, path, updater) {
  const root = clone(rootArray);
  let cursor = root;

  for (let i = 0; i < path.length; i++) {
    const idx = path[i];

    if (i === path.length - 1) {
      cursor[idx] = updater(cursor[idx]);
    } else {
      const node = cursor[idx];
      const childArr = toArray(node.requiere);
      const nextChild = childArr.slice();
      cursor[idx] = { ...node, requiere: nextChild };
      cursor = nextChild;
    }
  }
  return root;
}

/* ---------- Editor de Árbol (integrado) ---------- */
/* ---------- Editor de Árbol (integrado) ---------- */
function TreeEditor({ requiere = [], level = 0, onChange }) {
  const [editValues, setEditValues] = React.useState({});
  const inputRefs = React.useRef({}); // refs por campo

  // Siempre trabajar sobre el array raíz actual
  const rootArray = React.useMemo(() => toArray(requiere), [requiere]);

  const getInputRef = (pathKey) => {
    if (!inputRefs.current[pathKey]) {
      inputRefs.current[pathKey] = React.createRef();
    }
    return inputRefs.current[pathKey];
  };

  const handleEditClick = (pathKey, initial) => {
    setEditValues((p) => ({ ...p, [pathKey]: { editing: true, ...initial } }));
    requestAnimationFrame(() => {
      inputRefs.current[pathKey]?.current?.focus?.();
    });
  };

  const handleValueChange = (pathKey, field, value) => {
    setEditValues((p) => ({ ...p, [pathKey]: { ...p[pathKey], [field]: value } }));
    requestAnimationFrame(() => {
      inputRefs.current[pathKey]?.current?.focus?.();
    });
  };

  const stopEditing = (pathKey) => {
    setEditValues((p) => ({ ...p, [pathKey]: { ...p[pathKey], editing: false } }));
  };

  const handleSaveClick = React.useCallback(
    (path, pathKey) => {
      const st = editValues[pathKey];
      if (!st) return;

      // ✅ Aplicar sobre el ARREGLO RAÍZ completo
      const updatedRoot = applyAtPath(rootArray, path, (item) => {
        const draft = { ...item };
        const qty = Number.parseFloat(st.cantidad ?? "");
        if (Number.isFinite(qty)) {
          if (draft.cantidadGramos !== undefined) draft.cantidadGramos = qty;
          else if (draft.cantidadUnidades !== undefined) draft.cantidadUnidades = qty;
        }
        const sobr = Number.parseFloat(st.sobrante ?? "");
        if (Number.isFinite(sobr)) draft.sobrante = sobr;
        return draft;
      });

      onChange?.(updatedRoot);
      stopEditing(pathKey);
    },
    [editValues, onChange, rootArray]
  );

  const RenderNode = ({ items, level, pathPrefix = [] }) => {
    if (!Array.isArray(items)) return null;

    return (
      <List dense sx={{ pl: level * 2 }}>
        {items.map((item, idx) => {
          if (!item) return null;
          const path = [...pathPrefix, idx];
          const pathKey = path.join(">");
          const editState = editValues[pathKey] || {};
          const editing = !!editState.editing;

          const cantidadOriginal = item.cantidadGramos ?? item.cantidadUnidades ?? 0;

          const rawStock = Number(item.stockActual || 0);
          const mostrarStock =
            item.unit === "unidad" || item.unitId === 1
              ? `${rawStock} unidades`
              : `${rawStock.toFixed(2)}g`;

          return (
            <Box
              key={item.id ?? pathKey}
              sx={{
                mb: 1,
                borderLeft: level > 0 ? "2px solid #ccc" : "none",
                pl: 2,
              }}
            >
              <ListItem
                secondaryAction={
                  editing ? (
                    <IconButton
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSaveClick(path, pathKey)}
                    >
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        handleEditClick(pathKey, {
                          cantidad: cantidadOriginal,
                          sobrante: item.sobrante ?? 0,
                        })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>{item.producto}</strong> —{" "}
                      {editing ? (
                        <>
                          <TextField
                            type="number"
                            size="small"
                            label="Cantidad"
                            value={editState.cantidad ?? ""}
                            onChange={(e) => handleValueChange(pathKey, "cantidad", e.target.value)}
                            sx={{ width: 110, mr: 1 }}
                            inputProps={{ step: "0.01", min: 0 }}
                            inputRef={getInputRef(pathKey)}
                            autoFocus
                            onWheel={(e) => e.target.blur()}
                          />
                          {item.sobrante !== undefined && (
                            <TextField
                              type="number"
                              size="small"
                              label="Sobrante"
                              value={editState.sobrante ?? ""}
                              onChange={(e) =>
                                handleValueChange(pathKey, "sobrante", e.target.value)
                              }
                              sx={{ width: 110 }}
                              inputProps={{ step: "0.01", min: 0 }}
                              onWheel={(e) => e.target.blur()}
                            />
                          )}
                        </>
                      ) : item.cantidadGramos !== undefined ? (
                        `${Number(item.cantidadGramos).toFixed(2)} g necesarios`
                      ) : (
                        `${item.cantidadUnidades} unidades necesarias`
                      )}
                    </Typography>
                  }
                  secondary={
                    <>
                      Stock disponible: {mostrarStock}
                      {item.esIntermedio && (
                        <>
                          {" • "}Lotes necesarios: <strong>{item.lotesNecesarios}</strong>
                          {item.productionYield !== undefined && (
                            <>
                              {" • "}Producción por lote:{" "}
                              <strong>{item.productionYield}</strong>
                              {item.unitId === 1 ? " unidades" : "g"}
                            </>
                          )}
                          {item.sobrante !== undefined && (
                            <>
                              {" • "}Sobrante estimado:{" "}
                              <strong>{Number(item.sobrante).toFixed(2)}</strong>
                              {item.unitId === 1 ? " unidades" : "g"}
                            </>
                          )}
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>

              {item.esIntermedio && item.requiere && (
                <RenderNode items={toArray(item.requiere)} level={level + 1} pathPrefix={path} />
              )}
            </Box>
          );
        })}
      </List>
    );
  };

  return <RenderNode items={rootArray} level={level} pathPrefix={[]} />;
}


/* ======================= Componente: RenderFromFinal ======================= */
export default function RenderFromFinal({ fetchData }) {
  const [products, setProducts] = React.useState([]);
  const [productId, setProductId] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resultado, setResultado] = React.useState(null);

  const { toast: toastAuth } = useAuth();

  /* --- Cargar productos finales --- */
  React.useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        const list = res?.data?.data ?? res?.data ?? [];
        const arr = Array.isArray(list) ? list : [];
        const finales = arr.filter((p) => !p.esIntermedio && p.type !== "raw");
        setProducts(finales);
        if (finales[0]) setProductId(String(finales[0].id));
      } catch (e) {
        console.error("Error cargando productos:", e);
      }
    })();
  }, []);

  /* --- Simular --- */
  const handleSimular = async () => {
    if (!productId || !quantity) return;
    setLoading(true);
    try {
      const res = await simulateProduction(Number(productId), Number(quantity));
      const r = res?.data?.resultado ?? res?.data ?? null;
      if (r) setResultado(clone(r));
    } catch (e) {
      console.error("Error en simulación:", e);
    } finally {
      setLoading(false);
    }
  };

  /* --- Procesar --- */
  const handleProcess = async () => {
    if (!resultado) return;

    const payload = {
      productId: Number(resultado.id ?? productId),
      quantity: Number(resultado.cantidadDeseada ?? quantity),
      simulated: resultado,
      type: "produccion",
      description: `Producción final de ${resultado.producto}`,
    };

    toastAuth({
      promise: registerProductionFinalFromPayload(payload),
      onSuccess: () => {
        fetchData?.();

        // ✅ resetear estados → limpia UI y cierra árbol
        setResultado(null);
        setQuantity("");
        setProductId(products[0] ? String(products[0].id) : "");

        return {
          title: "Producción",
          description: "Producción registrada correctamente",
        };
      },
    });
  };

  return (
    <Box>
      {/* Controles */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={7}>
            <TextField
              label="Producto final"
              select
              fullWidth
              variant="standard"
              value={productId}
              onChange={(e) => setProductId(String(e.target.value))}
              SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 320 } } } }}
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad a producir"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ step: "0.01", min: 0 }}
              onWheel={(e) => e.target.blur()} // evita cambios al hacer scroll
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSimular}
              disabled={!productId || !quantity || loading}
            >
              {loading ? <CircularProgress size={20} /> : "Simular"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Resultado con árbol */}
      {resultado && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              Simulación / Edición — <strong>{resultado.producto}</strong>
            </Typography>
            <Chip
              size="small"
              color="primary"
              label={`Cantidad: ${numberOrZero(
                resultado.cantidadDeseada
              )} ${resultado.unidad || "u"}`}
            />
          </Stack>

          <TreeEditor
            requiere={resultado.requiere}
            onChange={(newTree) => setResultado((prev) => ({ ...prev, requiere: newTree }))}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleProcess}
              disabled={!resultado || !resultado?.requiere}
            >
              Procesar producción
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
