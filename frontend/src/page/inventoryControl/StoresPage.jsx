// src/pages/Public/StoresPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Container,
  Paper,
  Grid,
  Box,
  Typography,
  CardMedia,
  CardContent,
  Stack,
  Chip,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

import { getStoresRequest, getStoreProductsRequest } from "../../api/inventoryControlRequest";
import { pathImg } from "../../api/axios";

/* =============== utils de mapa (sin API key) =============== */
function MapPreview({ latitude, longitude, address, city, province, height = 240 }) {
  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const zoom = 14;
  const src = hasCoords
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`
    : (() => {
        const q = [address, city, province].filter(Boolean).join(", ");
        if (!q) return null;
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
      })();

  if (!src) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <iframe
        title="Ubicación"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  );
}

function placeholderImg(mode) {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><rect width='100%' height='100%' fill='${
        mode === "dark" ? "#11161d" : "#eee"
      }'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='${
        mode === "dark" ? "#8aa" : "#666"
      }'>Sin imagen</text></svg>`
    )
  );
}

/* =============== diálogo Detalles =============== */
function StoreDetailsDialog({ open, onClose, store }) {
  const theme = useTheme();
  const borderTone = alpha(theme.palette.divider, 0.6);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden", border: `1px solid ${borderTone}` },
      }}
    >
      <DialogTitle sx={{ pr: 6, py: 1.25, fontWeight: 800, display: "flex", gap: 1 }}>
        {store?.name || "Punto de venta"}
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      {/* Imagen */}
      <Box sx={{ px: 2 }}>
        <Box
          component="img"
          src={
            store?.imageUrl
              ? `${pathImg}${store.imageUrl}`
              : placeholderImg(useTheme().palette.mode)
          }
          alt={store?.name || "store"}
          onError={(e) => (e.currentTarget.src = placeholderImg(useTheme().palette.mode))}
          sx={{
            width: "100%",
            height: 240,
            objectFit: "cover",
            borderRadius: 2,
            border: `1px solid ${borderTone}`,
          }}
        />
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={1.25}>
          {(store?.city || store?.province) && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {store?.city && <Chip size="small" label={store.city} />}
              {store?.province && <Chip size="small" label={store.province} />}
            </Stack>
          )}

          {store?.address && (
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <PlaceRoundedIcon fontSize="small" />
              <Typography variant="body2" sx={{ mt: "1px" }}>
                {store.address}
              </Typography>
            </Stack>
          )}

          {store?.phone && (
            <Stack direction="row" spacing={1.25} alignItems="center">
              <PhoneIphoneRoundedIcon fontSize="small" />
              <Button variant="text" size="small" href={`tel:${store.phone}`} sx={{ px: 0 }}>
                {store.phone}
              </Button>
            </Stack>
          )}

          {store?.email && (
            <Stack direction="row" spacing={1.25} alignItems="center">
              <EmailRoundedIcon fontSize="small" />
              <Button variant="text" size="small" href={`mailto:${store.email}`} sx={{ px: 0 }}>
                {store.email}
              </Button>
            </Stack>
          )}

          {store?.description && (
            <>
              <Divider />
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {store.description}
              </Typography>
            </>
          )}

          <MapPreview
            latitude={typeof store?.latitude === "number" ? store.latitude : undefined}
            longitude={typeof store?.longitude === "number" ? store.longitude : undefined}
            address={store?.address}
            city={store?.city}
            province={store?.province}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>
        <Button
          variant="contained"
          startIcon={<PlaceRoundedIcon />}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            [store?.address, store?.city, store?.province].filter(Boolean).join(", ")
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en Maps
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* =============== diálogo Productos =============== */
function StoreProductsDialog({ open, onClose, store, fetchStoreProducts }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!open || !store) return;
      if (typeof fetchStoreProducts !== "function") {
        setItems([]);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchStoreProducts(store.id);
        if (alive) setItems(Array.isArray(data) ? data : []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      setItems([]);
      setQ("");
    };
  }, [open, store, fetchStoreProducts]);

  const filteredItems = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter((it) => it.name?.toLowerCase().includes(s));
  }, [items, q]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6, py: 1.25, fontWeight: 800, display: "flex", gap: 1 }}>
        Productos — {store?.name || ""}
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          size="small"
          fullWidth
          placeholder="Buscar producto..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ mb: 1.25 }}
        />
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Cargando…
          </Typography>
        ) : filteredItems.length ? (
          <Stack spacing={1.25}>
            {filteredItems.map((p, i) => (
              <Stack
                key={p.id || i}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ borderBottom: "1px dashed", borderColor: "divider", pb: 1 }}
              >
                {p.imageUrl ? (
                  <Box
                    component="img"
                    src={p.imageUrl}
                    alt={p.name}
                    sx={{ width: 56, height: 56, objectFit: "cover", borderRadius: 1 }}
                    onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                  />
                ) : (
                  <Box sx={{ width: 56, height: 56, bgcolor: "action.hover", borderRadius: 1 }} />
                )}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={700} noWrap title={p.name}>
                    {p.name}
                  </Typography>
                  {typeof p.price === "number" && (
                    <Typography variant="caption" color="text.secondary">
                      {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(p.price)}
                    </Typography>
                  )}
                </Box>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            (Aún no hay productos vinculados a este punto de venta)
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

/* =============== Página pública =============== */
export default function StoresPage() {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  // filtros/búsqueda/orden
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [province, setProvince] = useState("all");
  const [sort, setSort] = useState("position"); // 'position' | 'name'

  // dialogs
  const [openDetails, setOpenDetails] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        const { data } = await getStoresRequest();
        if (alive) setRows(Array.isArray(data) ? data.filter((s) => !!s.isActive) : []);
      } catch (e) {
        if (alive) {
          setErr(e?.message || "No se pudo cargar puntos de venta");
          setRows([]);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cities = useMemo(() => {
    const u = new Set();
    rows.forEach((r) => r.city && u.add(r.city));
    return ["all", ...Array.from(u)];
  }, [rows]);

  const provinces = useMemo(() => {
    const u = new Set();
    rows.forEach((r) => r.province && u.add(r.province));
    return ["all", ...Array.from(u)];
  }, [rows]);

  const filtered = rows
    .filter((r) =>
      q
        ? [r.name, r.address, r.city, r.province]
            .filter(Boolean)
            .some((t) => String(t).toLowerCase().includes(q.toLowerCase()))
        : true
    )
    .filter((r) => (city === "all" ? true : r.city === city))
    .filter((r) => (province === "all" ? true : r.province === province))
    .sort((a, b) => {
      if (sort === "name") return String(a.name).localeCompare(String(b.name));
      const pa = Number.isFinite(a.position) ? a.position : 0;
      const pb = Number.isFinite(b.position) ? b.position : 0;
      if (pa !== pb) return pa - pb;
      return String(a.name).localeCompare(String(b.name));
    });

  const handleOpenDetails = (s) => {
    setActive(s);
    setOpenDetails(true);
  };
  const handleOpenProducts = (s) => {
    setActive(s);
    setOpenProducts(true);
  };

  // === fetch de productos por tienda (para el diálogo) ===
  const fetchStoreProducts = useCallback(async (storeId) => {
    const { data } = await getStoreProductsRequest(storeId, { activeOnly: true });
    // Backend: [{ linkId, storeId, productId, product: {...} }]
    return (Array.isArray(data) ? data : []).map((row) => {
      const p = row.product || {};
      return {
        id: row.productId ?? p.id ?? row.linkId,
        name: p.name ?? "Producto",
        price:
          typeof p.price === "string" || typeof p.price === "number"
            ? Number(p.price)
            : null,
        imageUrl: p.primaryImageUrl ? `${pathImg}${p.primaryImageUrl}` : null,
      };
    });
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Paper
        variant="panel"
        sx={{ p: 2, display: "grid", gap: 2, borderRadius: 2, overflow: "hidden" }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 800,
            color:
              theme.palette.customMode === "neon"
                ? theme.palette.secondary.main
                : theme.palette.text.primary,
          }}
        >
          Puntos de venta
        </Typography>

        {/* filtros */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, dirección, ciudad o provincia…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2.5}>
            <TextField fullWidth label="Ciudad" select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => (
                <MenuItem key={c} value={c}>
                  {c === "all" ? "Todas" : c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2.5}>
            <TextField
              fullWidth
              label="Provincia"
              select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              {provinces.map((p) => (
                <MenuItem key={p} value={p}>
                  {p === "all" ? "Todas" : p}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField fullWidth label="Orden" select value={sort} onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="position">Posición</MenuItem>
              <MenuItem value="name">Nombre</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* grid de tiendas */}
        <Grid container spacing={2}>
          {filtered.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${s.id ?? s.name}-${i}`}>
              <Paper
                variant="panel"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  transition: "transform 220ms ease, box-shadow 220ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 10px 22px rgba(0,0,0,.45)"
                        : "0 10px 22px rgba(0,0,0,.12)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={s.imageUrl ? `${pathImg}${s.imageUrl}` : placeholderImg(theme.palette.mode)}
                    alt={s.name}
                    sx={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 1.25,
                      mb: 0.75,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    }}
                    onError={(e) => (e.currentTarget.src = placeholderImg(theme.palette.mode))}
                  />
                </Box>

                <CardContent
                  sx={{
                    p: 0.5,
                    pt: 0.25,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    fontWeight={800}
                    fontSize="0.98rem"
                    lineHeight={1.1}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    title={s.name}
                  >
                    {s.name}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap">
                    {s.city && <Chip size="small" label={s.city} />}
                    {s.province && <Chip size="small" label={s.province} />}
                  </Stack>

                  {s.address && (
                    <Typography
                      fontSize="0.8rem"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={s.address}
                    >
                      {s.address}
                    </Typography>
                  )}
                </CardContent>

                {/* acciones */}
                <Stack direction="row" spacing={1} sx={{ px: 0.5, pb: 0.5 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<StorefrontOutlinedIcon />}
                    onClick={() => handleOpenDetails(s)}
                  >
                    Detalles
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<LocalMallOutlinedIcon />}
                    onClick={() => handleOpenProducts(s)}
                  >
                    Productos
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}

          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {err || "No hay puntos de venta para mostrar"}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Modales */}
      <StoreDetailsDialog open={openDetails} onClose={() => setOpenDetails(false)} store={active} />
      <StoreProductsDialog
        open={openProducts}
        onClose={() => setOpenProducts(false)}
        store={active}
        fetchStoreProducts={fetchStoreProducts}
      />
    </Container>
  );
}
