// components/RenderFromIntermediate.jsx
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Paper,
  Button,
  CircularProgress,
  Drawer,
  Fab,
  Badge,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

// ⚠️ Ajusta esta ruta a tu proyecto
import {
  getAllProducts,
  simulateFromIntermediate,
  simulateProduction,
  registerProductionIntermediateFromPayload,
} from "../../../api/inventoryControlRequest";
import { useAuth } from "../../../context/AuthContext";

/* --- Utils --- */
const numberOrZero = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/* ===== Helpers/Payload ===== */
const buildBackendPayload = ({ resultadoEditable, cart, insumosAggregatedMap }) => {
  const intermedioId = resultadoEditable?.id;
  const intermedioNombre = resultadoEditable?.producto;
  const masaConsumidaTotal = cart.reduce(
    (acc, it) => acc + numberOrZero(it.gramosPorUnidad) * numberOrZero(it.cantidad),
    0
  );

  const productosFinales = cart.map((it) => ({
    id: it.id,
    nombre: it.nombre,
    cantidad: numberOrZero(it.cantidad),
    gramosPorUnidadIntermedio: numberOrZero(it.gramosPorUnidad), // 0 si es transformación
    tipo: "final",
  }));

  const intermedioConsumido = {
    id: intermedioId,
    nombre: intermedioNombre,
    gramos: Number(masaConsumidaTotal.toFixed(2)),
    tipo: "intermedio",
  };

  const transformaciones = cart
    .filter((it) => it.transformOfParentId)
    .map((it) => ({
      hijoId: it.id,
      hijoNombre: it.nombre,
      cantidad: it.cantidad,
      padreId: it.transformOfParentId,
      unidadesPadrePorUnidadHijo: it.unitsPerChild,
    }));

  const insumos = Object.values(insumosAggregatedMap || {});

  return {
    intermedio: intermedioConsumido,
    productos: productosFinales,
    transformaciones,
    insumos,
  };
};

/* ====== Panel carrito ====== */
function CartSummary({
  cart,
  masaRestante,
  onRemove,
  onDistribute,
  resultadoEditable,
  insumosAggMap,
  onProcess,
}) {
  const totalUsado = cart.reduce(
    (acc, it) => acc + numberOrZero(it.gramosPorUnidad) * numberOrZero(it.cantidad),
    0
  );
  const payload = buildBackendPayload({
    resultadoEditable,
    cart,
    insumosAggregatedMap: insumosAggMap,
  });

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
        <Chip color="primary" label={`Usado: ${totalUsado.toFixed(2)} g`} />
        <Chip label={`Masa restante: ${numberOrZero(masaRestante).toFixed(2)} g`} />
      </Stack>

      {resultadoEditable && totalUsado > 0 && (
        <Box
          sx={{
            mb: 1,
            p: 1.2,
            borderRadius: 1,
            bgcolor: "grey.50",
            border: "1px dashed #e0e0e0",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Intermedio consumido
          </Typography>
          <Typography variant="body2">
            <strong>{resultadoEditable.producto}</strong>: {totalUsado.toFixed(2)} g
          </Typography>
        </Box>
      )}

      <List dense>
        {cart.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            El carrito está vacío.
          </Typography>
        )}
        {cart.map((it) => (
          <ListItem key={it._key || it.id} sx={{ borderBottom: "1px dashed #e0e0e0" }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 600 }}>{it.nombre}</Typography>
                  {it.transformOfParentId && <Chip size="small" label="Transformación" />}
                </Stack>
              }
              secondary={
                it.transformOfParentId ? (
                  <>
                    {it.cantidad} u (usa {it.unitsPerChild} u del padre c/u) — <strong>0.00 g</strong> de masa
                  </>
                ) : (
                  <>
                    {it.cantidad} u × {numberOrZero(it.gramosPorUnidad).toFixed(2)} g ={" "}
                    <strong>
                      {(numberOrZero(it.gramosPorUnidad) * numberOrZero(it.cantidad)).toFixed(2)} g
                    </strong>
                  </>
                )
              }
            />
            <Tooltip title="Quitar 1">
              <IconButton edge="end" onClick={() => onRemove(it)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onDistribute}
          disabled={numberOrZero(masaRestante) <= 0 || cart.length === 0}
        >
          Repartir masa restante
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => onProcess && onProcess(payload)}
          disabled={cart.length === 0}
        >
          Procesar (payload)
        </Button>
      </Stack>
    </Paper>
  );
}

/* =================== COMPONENTE INDEPENDIENTE =================== */
export default function RenderFromIntermediate({fetchData}) {
  // Productos (solo intermedios para el selector)
  const [products, setProducts] = React.useState([]);
  const [intermediateId, setIntermediateId] = React.useState("");
  const [loadingIntermediate, setLoadingIntermediate] = React.useState(false);

  // Resultado de simulación del intermedio (masa total y derivados)
  const [resultado, setResultado] = React.useState(null);
  const [masaRestante, setMasaRestante] = React.useState(0);

  // Carrito y agregación de insumos
  const [cart, setCart] = React.useState([]);
  const [insumosAggMap, setInsumosAggMap] = React.useState({});

  // Drawer móvil para carrito
  const [cartOpen, setCartOpen] = React.useState(false);
    const { toast: toastAuth } = useAuth();
  

  /* ---------- Init: cargar intermedios ---------- */
  React.useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        const list = res?.data?.data ?? res?.data ?? [];
        const arr = Array.isArray(list) ? list : [];
        // Solo intermedios para este flujo
        const inters = arr.filter((p) => p.type === "intermediate" || p.esIntermedio);
        setProducts(inters);
        if (inters.length) setIntermediateId(String(inters[0].id));
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    })();
  }, []);

  /* ---------- Helpers de insumos agregados ---------- */
  const mergeInsumo = React.useCallback((map, node, factor = 1) => {
    const id = node.id;
    const nombre = node.producto || node.nombre || "Insumo";
    const prev = map[id] || { id, nombre, gramos: 0, unidades: 0 };

    if (node.cantidadGramos !== undefined) {
      prev.gramos = numberOrZero(prev.gramos) + factor * numberOrZero(node.cantidadGramos);
    } else if (node.cantidadUnidades !== undefined) {
      prev.unidades = numberOrZero(prev.unidades) + factor * numberOrZero(node.cantidadUnidades);
    }
    map[id] = prev;
    return map;
  }, []);

  const walkRequiere = React.useCallback(
    (req, factor, map) => {
      if (!req) return;
      const arr = Array.isArray(req) ? req : req.requiere;
      if (!Array.isArray(arr)) return;
      for (const item of arr) {
        const esIntermedio = !!item.esIntermedio;
        if (!esIntermedio) mergeInsumo(map, item, factor); // solo insumos
        if (item.requiere) walkRequiere(item.requiere, factor, map);
      }
    },
    [mergeInsumo]
  );

  // Acumula insumos para producto final sumando (o restando) 1..n unidades
  const accumulateInsumosForFinal = React.useCallback(
    async (productId, deltaUnits) => {
      if (!deltaUnits) return;
      const abs = Math.abs(deltaUnits);
      const sign = Math.sign(deltaUnits);
      try {
        const res = await simulateProduction(Number(productId), Number(abs));
        const resultado = res?.data?.resultado ?? res?.data ?? null;
        const req = resultado?.requiere;
        if (!req) return;
        setInsumosAggMap((prev) => {
          const map = { ...prev };
          walkRequiere(req, sign, map);
          // limpiar ceros
          Object.keys(map).forEach((k) => {
            const v = map[k];
            if (Math.abs(numberOrZero(v.gramos)) < 1e-9) delete v.gramos;
            if (Math.abs(numberOrZero(v.unidades)) < 1e-9) delete v.unidades;
            if (!("gramos" in v) && !("unidades" in v)) delete map[k];
          });
          return map;
        });
      } catch (e) {
        console.error("Error acumulando insumos:", e);
      }
    },
    [walkRequiere]
  );

  /* ---------- Simular desde intermedio ---------- */
  const handleSimulateFromIntermediate = async () => {
    if (!intermediateId) return;
    setLoadingIntermediate(true);
    try {
      const res = await simulateFromIntermediate(Number(intermediateId));
      const r = res?.data ?? null;
      if (r) {
        const formatted = {
          ...r,
          cantidadDeseada: numberOrZero(r.producedGrams ?? r.cantidadDeseada),
          unidad: r.unidad ?? "gramos",
        };
        setResultado(formatted);
        setMasaRestante(numberOrZero(formatted.producedGrams));
        setCart([]);
        setInsumosAggMap({});
      }
    } catch (err) {
      console.error("Simulación intermedio error:", err);
    } finally {
      setLoadingIntermediate(false);
    }
  };

  /* ---------- Carrito: add / remove / distribuir ---------- */
  const handleAddToCart = async (producto, cantidad = 1, gramosOverride, opts = {}) => {
    if (!resultado) return;

    // Transformación: consume unidades del padre, NO masa
    if (opts.mode === "transform") {
      const unitsPerChild = numberOrZero(opts.unitsPerChild) || 1;
      const needUnits = unitsPerChild * numberOrZero(cantidad);
      const parentGrams = numberOrZero(opts.parentGramosPorUnidad);
      const parentId = opts.parentId;

      const parentItemNow = cart.find((c) => c.id === parentId);
      const haveUnits = numberOrZero(parentItemNow?.cantidad || 0);
      const deficit = Math.max(0, needUnits - haveUnits);
      const gramsNeededFromMass = deficit * parentGrams;

      // Autoproducir unidades del padre con masa si hace falta
      if (deficit > 0 && numberOrZero(masaRestante) < gramsNeededFromMass) {
        console.warn("No hay masa suficiente para producir unidades del padre requeridas.");
        return;
      }

      setCart((prev) => {
        let next = [...prev];

        // 1) Si falta padre, producirlo (consume masa más abajo)
        if (deficit > 0) {
          const existingParent = next.find((c) => c.id === parentId);
          if (existingParent) existingParent.cantidad += deficit;
          else
            next.push({
              id: parentId,
              nombre: opts.parentName || "Producto base",
              cantidad: deficit,
              gramosPorUnidad: parentGrams,
              tipo: "final",
            });
        }

        // 2) Descontar unidades del padre
        const parentLine = next.find((c) => c.id === parentId);
        if (parentLine) {
          parentLine.cantidad -= needUnits;
          if (parentLine.cantidad <= 0) next = next.filter((c) => c.id !== parentId);
        }

        // 3) Agregar el hijo transformado (consumo 0 g/u)
        const childExisting = next.find((c) => c.id === producto.id);
        if (childExisting) {
          childExisting.cantidad += cantidad;
          childExisting.gramosPorUnidad = 0;
          childExisting.transformOfParentId = parentId;
          childExisting.unitsPerChild = unitsPerChild;
          childExisting.parentGramosPorUnidad = parentGrams;
        } else {
          next.push({
            id: producto.id,
            nombre: producto.producto ?? producto.name ?? "Producto",
            cantidad: cantidad,
            gramosPorUnidad: 0,
            tipo: "final",
            transformOfParentId: parentId,
            unitsPerChild: unitsPerChild,
            parentGramosPorUnidad: parentGrams,
          });
        }

        return next;
      });

      // 4) Descontar masa solo si se autoprodujo el padre
      if (deficit > 0) setMasaRestante((prev) => numberOrZero(prev) - gramsNeededFromMass);

      // 5) Acumular insumos del hijo
      await accumulateInsumosForFinal(producto.id, +cantidad);
      return;
    }

    // Caso normal: consume masa directamente
    const gramosPorUnidad = numberOrZero(gramosOverride ?? producto.consumoPorUnidad);
    if (gramosPorUnidad <= 0) return;

    const disponiblesPorMasa = Math.floor(numberOrZero(masaRestante) / gramosPorUnidad);
    const cantidadAgregable = Math.max(0, Math.min(Number(cantidad) || 0, disponiblesPorMasa));
    if (cantidadAgregable <= 0) return;

    setCart((prev) => {
      const existe = prev.find((c) => c.id === producto.id);
      if (existe) {
        return prev.map((c) =>
          c.id === producto.id ? { ...c, cantidad: c.cantidad + cantidadAgregable, gramosPorUnidad } : c
        );
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.producto ?? producto.name ?? "Producto",
          cantidad: cantidadAgregable,
          gramosPorUnidad, // consumo de masa por unidad
          tipo: "final",
        },
      ];
    });

    setMasaRestante((prev) => numberOrZero(prev) - gramosPorUnidad * cantidadAgregable);
    await accumulateInsumosForFinal(producto.id, +cantidadAgregable);
  };

  const handleRemoveFromCart = async (itemOrId) => {
    const productoId = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    const itemActual =
      typeof itemOrId === "object" ? itemOrId : cart.find((c) => c.id === productoId);
    if (!itemActual) return;

    // Si es transformación: devolver unidades al padre (no tocar masa)
    if (itemActual.transformOfParentId) {
      const parentId = itemActual.transformOfParentId;
      const unitsPerChild = numberOrZero(itemActual.unitsPerChild) || 1;

      setCart((prev) => {
        let next = prev.map((c) => ({ ...c }));
        // 1) Reducir 1 del hijo
        const child = next.find((c) => c.id === itemActual.id);
        if (!child) return prev;
        child.cantidad -= 1;
        if (child.cantidad <= 0) next = next.filter((c) => c.id !== child.id);

        // 2) Devolver al padre
        const parent = next.find((c) => c.id === parentId);
        if (parent) {
          parent.cantidad += unitsPerChild;
        } else {
          next.push({
            id: parentId,
            nombre: "Producto base",
            cantidad: unitsPerChild,
            gramosPorUnidad: numberOrZero(itemActual.parentGramosPorUnidad),
            tipo: "final",
          });
        }
        return next;
      });

      // Ajustar insumos del hijo (-1)
      await accumulateInsumosForFinal(itemActual.id, -1);
      return;
    }

    // Caso normal: devolver masa correspondiente a 1 unidad
    setCart((prev) => {
      const current = prev.find((c) => c.id === productoId);
      if (!current) return prev;
      if (current.cantidad <= 1) {
        return prev.filter((c) => c.id !== productoId);
      }
      return prev.map((c) => (c.id === productoId ? { ...c, cantidad: c.cantidad - 1 } : c));
    });

    setMasaRestante((prev) => numberOrZero(prev) + numberOrZero(itemActual.gramosPorUnidad));
    await accumulateInsumosForFinal(productoId, -1);
  };

  const handleDistributeRemainingMass = () => {
    if (numberOrZero(masaRestante) <= 0 || cart.length === 0) return;
    const totalUnidades = cart.reduce((s, it) => s + numberOrZero(it.cantidad), 0);
    if (totalUnidades <= 0) return;

    const extraPorUnidad = numberOrZero(masaRestante) / totalUnidades;
    const nuevoCart = cart.map((item) => ({
      ...item,
      gramosPorUnidad: numberOrZero(item.gramosPorUnidad) + extraPorUnidad,
    }));
    setCart(nuevoCart);
    setMasaRestante(0);
  };

  const handleProcess = async () => {
    const payload = buildBackendPayload({
      resultadoEditable: resultado,
      cart,
      insumosAggregatedMap: insumosAggMap,
    });
       toastAuth({
          promise: registerProductionIntermediateFromPayload(payload),
          onSuccess: () => {
            fetchData()
       
            return {
              title: "Producción",
              description: "Producción Intermedia registrada correctamente",
            };
          },
        });

  };

  /* ----------------- UI: Tarjetas y derivados (recursivo) ----------------- */
  const [cantidades, setCantidades] = React.useState({});
  const [openMap, setOpenMap] = React.useState({});
  const getCantidadInt = React.useCallback(
    (k) => {
      const v = Number(cantidades[k] ?? 1);
      if (!Number.isFinite(v) || v < 1) return 1;
      return Math.floor(v);
    },
    [cantidades]
  );
  const toggleOpen = (k) => setOpenMap((p) => ({ ...p, [k]: !p[k] }));

  const RowDerivado = ({ item, parent, depth = 0, consumoAcumuladoPadre = null, pathKey = "" }) => {
    const isTransform = !!parent;

    const gramosBase = numberOrZero(item.consumoPorUnidad);
    const unitsPerChild = isTransform ? (gramosBase > 0 ? gramosBase : 1) : 0;
    const gramosPorUnidad =
      !isTransform
        ? (consumoAcumuladoPadre != null ? gramosBase * consumoAcumuladoPadre : gramosBase)
        : 0;

    const k = `${item.id}::${pathKey}`;
    const inputCantidad = getCantidadInt(k);

    const enCarrito = cart.find((c) => c.id === item.id);
    const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;

    const parentItem = isTransform ? cart.find((c) => c.id === parent.id) : null;
    const disponiblePorPadre = isTransform
      ? Math.floor(numberOrZero(parentItem?.cantidad || 0) / numberOrZero(unitsPerChild || 1))
      : Infinity;

    const maxAddable = isTransform
      ? disponiblePorPadre
      : gramosPorUnidad > 0
      ? Math.floor(numberOrZero(masaRestante) / gramosPorUnidad)
      : 0;

    const needParentUnits = isTransform ? inputCantidad * numberOrZero(unitsPerChild || 1) : 0;
    const sinPadre = isTransform && needParentUnits > numberOrZero(parentItem?.cantidad || 0);

    const hasChildren = Array.isArray(item.puedeProducir) && item.puedeProducir.length > 0;

    return (
      <>
        <ListItem
          sx={{ pl: 1 + depth * 2, alignItems: "flex-start" }}
          secondaryAction={
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title="Agregar cantidad indicada">
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    disabled={
                      isTransform
                        ? inputCantidad > maxAddable
                        : gramosPorUnidad <= 0 || inputCantidad > maxAddable
                    }
                    onClick={() =>
                      handleAddToCart(
                        { ...item, producto: item.producto },
                        getCantidadInt(k),
                        gramosPorUnidad,
                        isTransform
                          ? {
                              mode: "transform",
                              parentId: parent.id,
                              parentName: parent.producto,
                              unitsPerChild,
                              parentGramosPorUnidad: numberOrZero(consumoAcumuladoPadre),
                            }
                          : {}
                      )
                    }
                  >
                    <PlaylistAddCheckIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Agregar 1">
                <span>
                  <IconButton
                    size="small"
                    disabled={isTransform ? maxAddable <= 0 : gramosPorUnidad <= 0 || maxAddable <= 0}
                    onClick={() =>
                      handleAddToCart(
                        { ...item, producto: item.producto },
                        1,
                        gramosPorUnidad,
                        isTransform
                          ? {
                              mode: "transform",
                              parentId: parent.id,
                              parentName: parent.producto,
                              unitsPerChild,
                              parentGramosPorUnidad: numberOrZero(consumoAcumuladoPadre),
                            }
                          : {}
                      )
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
                {hasChildren && (
                  <IconButton
                    size="small"
                    onClick={() => toggleOpen(k)}
                    sx={{ mr: 0.5, transform: openMap[k] ? "rotate(180deg)" : "none", transition: "0.15s" }}
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                )}
                <Typography sx={{ fontWeight: 600 }}>{item.producto}</Typography>
                {isTransform ? (
                  <Chip size="small" label={`Consumo: ${unitsPerChild} u padre/u`} />
                ) : (
                  <Chip size="small" label={`Consumo: ${gramosPorUnidad.toFixed(2)} g/u`} />
                )}
                <Chip size="small" variant="outlined" label={`Máx: ${isTransform ? (maxAddable || 0) : maxAddable}`} />
                <Chip size="small" color={cantidadEnCarrito > 0 ? "primary" : "default"} label={`En carrito: ${cantidadEnCarrito}`} />
              </Stack>
            }
            secondary={
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <TextField
                  type="number"
                  size="small"
                  label="Cantidad"
                  value={cantidades[k] ?? 1}
                  onChange={(e) => setCantidades((prev) => ({ ...prev, [k]: e.target.value }))}
                  inputProps={{ step: 1, min: 1 }}
                  sx={{ width: 120 }}
                />
                {isTransform && sinPadre && (
                  <Typography variant="caption" color="error">
                    Necesitas {needParentUnits} u del padre.
                  </Typography>
                )}
              </Stack>
            }
          />
        </ListItem>

        {hasChildren && (
          <Collapse in={!!openMap[k]} timeout="auto" unmountOnExit>
            <List disablePadding dense>
              {item.puedeProducir.map((child) => (
                <RowDerivado
                  key={`${child.id}::${k}`}
                  item={child}
                  parent={item}
                  depth={depth + 1}
                  consumoAcumuladoPadre={isTransform ? 0 : gramosPorUnidad}
                  pathKey={`${k}>${child.id}`}
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  const CardsGrid = () => (
    <Grid container spacing={2} alignItems="flex-start">
      {resultado?.puedeProducir?.map((producto) => {
        const gramosBase = numberOrZero(producto.consumoPorUnidad); // g/u
        const gramosPorUnidad = gramosBase;

        const enCarrito = cart.find((c) => c.id === producto.id);
        const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
        const maxAddable =
          gramosPorUnidad > 0 ? Math.floor(numberOrZero(masaRestante) / gramosPorUnidad) : 0;
        const keyTop = `${producto.id}::top`;

        return (
          <Grid item xs={12}lg={6} key={keyTop} sx={{ alignSelf: "flex-start" }}>
            <Card elevation={3} sx={{ display: "flex", flexDirection: "column", overflow: "visible" }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                  }}
                  title={producto.producto}
                >
                  {producto.producto}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
                  <Chip size="small" label={`Consumo: ${gramosPorUnidad.toFixed(2)} g/u`} />
                  <Chip size="small" variant="outlined" label={`Máx a agregar: ${maxAddable}`} />
                  <Chip size="small" color={cantidadEnCarrito > 0 ? "primary" : "default"} label={`En carrito: ${cantidadEnCarrito}`} />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    type="number"
                    size="small"
                    label="Cantidad"
                    value={cantidades[keyTop] ?? 1}
                    onChange={(e) => setCantidades((p) => ({ ...p, [keyTop]: e.target.value }))}
                    inputProps={{ step: 1, min: 1 }}
                    sx={{ width: 140 }}
                  />
                  <Tooltip title="Agregar cantidad indicada">
                    <span>
                      <IconButton
                        color="primary"
                        disabled={
                          gramosPorUnidad <= 0 ||
                          numberOrZero(masaRestante) < gramosPorUnidad * getCantidadInt(keyTop)
                        }
                        onClick={() =>
                          handleAddToCart(
                            { ...producto, producto: producto.producto },
                            getCantidadInt(keyTop),
                            gramosPorUnidad,
                            {}
                          )
                        }
                      >
                        <PlaylistAddCheckIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Agregar 1">
                    <span>
                      <IconButton
                        disabled={maxAddable <= 0}
                        onClick={() =>
                          handleAddToCart({ ...producto, producto: producto.producto }, 1, gramosPorUnidad, {})
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </CardContent>

              {Array.isArray(producto.puedeProducir) && producto.puedeProducir.length > 0 && (
                <>
                  <Divider sx={{ mx: 2 }} />
                  <Box sx={{ px: 2, pt: 1, pb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                      Con {producto.producto} puedes producir:
                    </Typography>
                    <List dense disablePadding>
                      {producto.puedeProducir.map((child) => (
                        <RowDerivado
                          key={`${child.id}::${producto.id}`}
                          item={child}
                          parent={producto}
                          depth={0}
                          consumoAcumuladoPadre={gramosPorUnidad}
                          pathKey={`top>${producto.id}`}
                        />
                      ))}
                    </List>
                  </Box>
                </>
              )}

              <CardActions sx={{ pt: 0, px: 2, pb: 2 }} />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  /* -------------------- Render principal -------------------- */
  return (
    <Box>
      {/* Controles */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
   <TextField
  label="Intermedio"
  select
  fullWidth
  variant="standard"
  value={intermediateId}
  onChange={(e) => setIntermediateId(String(e.target.value))}
>
  {products.map((p) => (
    <MenuItem key={p.id} value={String(p.id)}>
      {p.name}
    </MenuItem>
  ))}
</TextField>


          <Button
            variant="contained"
            onClick={handleSimulateFromIntermediate}
            disabled={!intermediateId || loadingIntermediate}
            startIcon={<PlaylistAddCheckIcon />}
          >
            {loadingIntermediate ? <CircularProgress size={20} /> : "Simular"}
          </Button>
        </Stack>
      </Paper>

      {/* Resultado */}
      {resultado && (
        <Grid container spacing={2} alignItems="flex-start">
          {/* Izquierda: tarjetas */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  Desde <strong>{resultado.producto}</strong>
                </Typography>
                <Chip
                  size="small"
                  color="primary"
                  label={`Masa total: ${numberOrZero(resultado.producedGrams).toFixed(2)} g`}
                />
                <Chip size="small" label={`Restante: ${numberOrZero(masaRestante).toFixed(2)} g`} />
              </Stack>

              <CardsGrid />
            </Paper>
          </Grid>

          {/* Derecha: carrito */}
          <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Carrito
            </Typography>
            <CartSummary
              cart={cart}
              masaRestante={masaRestante}
              resultadoEditable={resultado}
              insumosAggMap={insumosAggMap}
              onRemove={handleRemoveFromCart}
              onDistribute={handleDistributeRemainingMass}
              onProcess={handleProcess}
            />
          </Grid>
        </Grid>
      )}

      {/* FAB + Drawer móvil */}
      {resultado && (
        <>
          <Box sx={{ position: "fixed", right: 16, bottom: 16, display: { xs: "block", md: "none" } }}>
            <Badge color="primary" badgeContent={cart.length} overlap="circular">
              <Fab color="secondary" onClick={() => setCartOpen(true)}>
                <ShoppingCartIcon />
              </Fab>
            </Badge>
          </Box>

          <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
            <Box sx={{ width: 340, p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Carrito
                </Typography>
                <IconButton onClick={() => setCartOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <CartSummary
                cart={cart}
                masaRestante={masaRestante}
                resultadoEditable={resultado}
                insumosAggMap={insumosAggMap}
                onRemove={handleRemoveFromCart}
                onDistribute={handleDistributeRemainingMass}
                onProcess={handleProcess}
              />
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
}
