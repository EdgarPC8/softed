// PanaderiaPage.jsx (solo consumidor, con backend)
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Divider,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
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

const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

const applyWholesale = (basePrice, qty, tiers = []) => {
  if (!qty || qty <= 0) return { unitPrice: basePrice, discountApplied: 0 };
  let discount = 0;
  tiers?.forEach((t) => {
    if (qty >= t.minQty && t.discountPercent > discount) {
      discount = t.discountPercent;
    }
  });
  const unitPrice = basePrice * (1 - discount / 100);
  return { unitPrice, discountApplied: discount };
};

function StatusBadge({ status }) {
  const s = status || "";
  const icon =
    s === "Listo ahora" ? (
      <CheckCircleIcon fontSize="inherit" />
    ) : s.toLowerCase().includes("hornea") ? (
      <WhatshotIcon fontSize="inherit" />
    ) : (
      <AccessTimeIcon fontSize="inherit" />
    );

  const color =
    s === "Listo ahora" ? "success" : s.toLowerCase().includes("hornea") ? "warning" : "default";

  return (
    <Chip
      icon={icon}
      label={s || "—"}
      color={color}
      size="small"
      variant={color === "default" ? "outlined" : "filled"}
      sx={{ fontWeight: 600 }}
    />
  );
}

function PriceDisplay({ product, qty = 0 }) {
  const base = Number(product.price || 0);
  const { unitPrice, discountApplied } = applyWholesale(base, qty, product.wholesaleTiers);
  const hasDiscount = discountApplied > 0;

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" fontWeight={800}>
          {currency(unitPrice)}
        </Typography>
        {hasDiscount && (
          <Chip size="small" color="success" label={`-${discountApplied}% mayorista`} />
        )}
      </Stack>
      {hasDiscount && (
        <Typography variant="caption" color="text.secondary">
          Precio base: {currency(base)}
        </Typography>
      )}
    </Stack>
  );
}

function WholesaleCalculator({ product }) {
  const [qty, setQty] = useState(12);
  const base = Number(product.price || 0);
  const { unitPrice, discountApplied } = applyWholesale(base, qty, product.wholesaleTiers);
  const total = unitPrice * qty;

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalculateIcon fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Calculadora mayorista
          </Typography>
          <Tooltip title="Ingresa una cantidad y te mostramos el precio por unidad con el descuento aplicado.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Stack>

        <TextField
          type="number"
          size="small"
          label="Cantidad"
          value={qty}
          onChange={(e) => setQty(Math.max(0, parseInt(e.target.value || 0, 10)))}
          inputProps={{ min: 0, step: 1 }}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">
            Unidad {discountApplied ? `(desc. ${discountApplied}%)` : ""}:
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {currency(unitPrice)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">Total estimado:</Typography>
          <Typography variant="body1" fontWeight={800}>
            {currency(total)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

const toImageSrc = (maybeFilenameOrUrl) => {
  if (!maybeFilenameOrUrl) return "";
  if (
    /^https?:\/\//i.test(maybeFilenameOrUrl) ||
    maybeFilenameOrUrl.startsWith("data:") ||
    maybeFilenameOrUrl.startsWith("/")
  ) {
    return maybeFilenameOrUrl;
  }
  return `${pathImg}${maybeFilenameOrUrl}`;
};

function ProductCard({ entry }) {
  const p = entry.product || {};
  const overrideImg = toImageSrc(entry.imageUrl);
  const productImg = toImageSrc(p.primaryImageUrl);
  const img = overrideImg || productImg || "";

  // 🔹 reglas efectivas catálogo > producto
  const wholesaleTiers =
    entry.wholesaleOverrideRules && entry.wholesaleOverrideRules.length > 0
      ? entry.wholesaleOverrideRules
      : Array.isArray(p.wholesaleRules)
      ? p.wholesaleRules
      : typeof p.wholesaleRules === "string"
      ? JSON.parse(p.wholesaleRules || "[]")
      : [];

  const weight = p.standardWeightGrams > 0 ? `${p.standardWeightGrams} g` : undefined;
  const [qtyCalc, setQtyCalc] = useState(0);

  return (
    <Card sx={{ borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        image={img}
        alt={p.name}
        height="160"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='#777'>${p.name || "Producto"}</text></svg>`
            );
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1} flexWrap="wrap">
          {entry.badge && (
            <Chip size="small" color="primary" label={entry.badge} sx={{ fontWeight: 700 }} />
          )}
          {p.isUniqueToday && (
            <Chip
              size="small"
              color="warning"
              icon={<StarIcon />}
              label="ÚNICO del día"
              sx={{ fontWeight: 700 }}
            />
          )}
          <StatusBadge status={p.status} />
        </Stack>

        <Typography variant="h6" fontWeight={800} gutterBottom>
          {entry.title || p.name}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={1}>
          {p.unitAbbr && <Chip size="small" icon={<BakeryDiningIcon />} label={p.unitAbbr} />}
          {weight && <Chip size="small" icon={<Inventory2Icon />} label={weight} />}
          {p.tags?.map((t) => (
            <Chip key={t} size="small" label={t} />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <TextField
            type="number"
            size="small"
            label="Cant. para cálculo"
            value={qtyCalc}
            onChange={(e) => setQtyCalc(Math.max(0, parseInt(e.target.value || 0, 10)))}
            inputProps={{ min: 0, step: 1 }}
            sx={{ width: 150 }}
          />
          <PriceDisplay product={{ ...p, wholesaleTiers }} qty={qtyCalc} />
        </Stack>

        <WholesaleCalculator product={{ ...p, wholesaleTiers }} />
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, pt: 1 }}>
        <Button variant="contained" startIcon={<AddShoppingCartIcon />}>
          Agregar
        </Button>
        <Button variant="text">Detalles</Button>
      </CardActions>
    </Card>
  );
}

// ------------------------------------------------------------
const SECTIONS = [
  { value: "home", label: "Inicio" },
  { value: "ofertas", label: "Ofertas" },
  { value: "recomendados", label: "Recomendados" },
  { value: "bajo_pedido", label: "Bajo pedido" },
  { value: "novedades", label: "Novedades" },
  { value: "descuentos", label: "Descuentos" },
  { value: "populares", label: "Populares" },
  { value: "temporada", label: "Temporada" },
  { value: "especiales", label: "Especiales" },
  { value: "limitados", label: "Limitados" },
];

export default function PanaderiaPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [sort, setSort] = useState("default");
  const [section, setSection] = useState("home");

  const categories = [
    { value: "todas", label: "Todas" },
    { value: "panes", label: "Panes" },
    { value: "bolleria", label: "Bollería" },
    { value: "integrales", label: "Integrales" },
  ];

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSection = async (sec) => {
    setLoading(true);
    try {
      const { data } = await getCatalogBySection(sec, { onlyActive: true });
      const rows = Array.isArray(data) ? data : [];
      rows.sort((a, b) => (a.position || 0) - (b.position || 0));
      setEntries(rows);
    } catch (e) {
      console.error("Error cargando sección:", e);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection(section);
  }, [section]);

  const filtered = useMemo(() => {
    let list = [...entries];

    if (category !== "todas") {
      list = list.filter((e) => e.product?.categorySlug === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.product?.name?.toLowerCase().includes(q) ||
          e.title?.toLowerCase().includes(q) ||
          e.product?.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "priceAsc") {
      list.sort((a, b) => Number(a.product?.price) - Number(b.product?.price));
    } else if (sort === "priceDesc") {
      list.sort((a, b) => Number(b.product?.price) - Number(a.product?.price));
    } else if (sort === "uniqueFirst") {
      list.sort((a, b) => Number(b.product?.isUniqueToday) - Number(a.product?.isUniqueToday));
    }
    return list;
  }, [entries, category, query, sort]);

  const uniqueToday = filtered.filter((e) => e.product?.isUniqueToday);
  const regularList = filtered;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <BakeryDiningIcon />
          <Typography variant="h5" fontWeight={800}>Panadería</Typography>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <Tabs value={section} onChange={(_, val) => setSection(val)} variant="scrollable" scrollButtons="auto" sx={{ px: 1 }}>
          {SECTIONS.map((s) => (
            <Tab key={s.value} label={s.label} value={s.value} />
          ))}
        </Tabs>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Buscar producto o etiqueta…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small"><SearchIcon /></IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={category} label="Categoría" onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Ordenar</InputLabel>
            <Select value={sort} label="Ordenar" onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="default">Recomendados</MenuItem>
              <MenuItem value="uniqueFirst">Únicos primero</MenuItem>
              <MenuItem value="priceAsc">Precio ↑</MenuItem>
              <MenuItem value="priceDesc">Precio ↓</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {uniqueToday.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <StarIcon color="warning" />
            <Typography variant="h6" fontWeight={800}>Únicos del día</Typography>
          </Stack>
          <Grid container spacing={2}>
            {uniqueToday.map((e) => (
              <Grid key={e.id} item xs={12} sm={6} md={4} lg={3}>
                <ProductCard entry={e} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <LocalOfferIcon />
        <Typography variant="h6" fontWeight={800}>
          {SECTIONS.find((s) => s.value === section)?.label || "Catálogo"}
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {(loading ? Array.from({ length: 8 }) : regularList).map((e, idx) => (
          <Grid key={e?.id || idx} item xs={12} sm={6} md={4} lg={3}>
            {loading ? (
              <Paper sx={{ height: 320, borderRadius: 3, bgcolor: "action.hover" }} />
            ) : (
              <ProductCard entry={e} />
            )}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body2">
          Tip: usa la calculadora mayorista dentro de cada producto para cotizar cantidades grandes al instante.
        </Typography>
      </Box>
    </Box>
  );
}
