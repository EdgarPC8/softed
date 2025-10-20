import { useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  CardMedia,
  CardContent,
  Button,
  Box,
  Paper as CardPaper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

/** items: [{ id, name, address, description, city, province, phone, email, img, latitude, longitude, ... }] */
export default function StoresPanel({
  title = "Puntos de venta",
  items = [],
  maxVisible = 4,
  onStoreClick, // opcional: callback(store) cuando se abre el diálogo
}) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const hasOverflow = useMemo(() => items.length > maxVisible, [items.length, maxVisible]);
  const visibleItems = expanded || !hasOverflow ? items : items.slice(0, maxVisible);

  // Alturas de la tarjeta
  const CARD_H = 180;
  const IMG_H = 100;

  // Colores
  const titleColor =
    theme.palette.customMode === "neon"
      ? theme.palette.secondary.main
      : theme.palette.text.primary;

  const nameColor =
    theme.palette.mode === "light"
      ? theme.palette.text.primary
      : alpha(theme.palette.common.white, 0.95);

  const addressColor =
    theme.palette.mode === "light"
      ? alpha(theme.palette.text.primary, 0.75)
      : alpha(theme.palette.common.white, 0.85);

  const borderTone = alpha(theme.palette.divider, 0.5);

  const placeholderImg = (mode) =>
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><rect width='100%' height='100%' fill='${
        mode === "dark" ? "#11161d" : "#eee"
      }'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='${
        mode === "dark" ? "#8aa" : "#666"
      }'>Sin imagen</text></svg>`
    );

  const handleOpen = (store) => {
    setActive(store);
    setOpen(true);
    if (typeof onStoreClick === "function") onStoreClick(store);
  };
  const handleClose = () => setOpen(false);

  // URL para abrir Google Maps (preferir coords > texto)
  const mapsHref = (store) => {
    if (!store) return "https://www.google.com/maps";
    const hasCoords =
      typeof store.latitude === "number" &&
      typeof store.longitude === "number" &&
      Number.isFinite(store.latitude) &&
      Number.isFinite(store.longitude);

    if (hasCoords) {
      // precisión máxima
      return `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;
    }

    const q = encodeURIComponent(
      [store?.address, store?.city, store?.province].filter(Boolean).join(", ")
    );
    return `https://www.google.com/maps/search/?api=1&query=${q || "Ecuador"}`;
  };

  // URL para iframe de previsualización (coords > texto). No requiere API key.
  const mapsEmbedSrc = (store) => {
    if (!store) return null;

    const hasCoords =
      typeof store.latitude === "number" &&
      typeof store.longitude === "number" &&
      Number.isFinite(store.latitude) &&
      Number.isFinite(store.longitude);

    const zoom = 14;
    if (hasCoords) {
      // Vista centrada en lat/lng
      return `https://maps.google.com/maps?q=${store.latitude},${store.longitude}&z=${zoom}&output=embed`;
    }

    const q = encodeURIComponent(
      [store?.address, store?.city, store?.province].filter(Boolean).join(", ")
    );
    if (!q) return null;
    return `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`;
  };

  return (
    <>
      <Paper
        variant="panel"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 1, color: titleColor }}>
          {title}
        </Typography>

        <Grid container spacing={2}>
          {visibleItems.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${s.id ?? s.name}-${i}`}>
              <CardPaper
                role="button"
                aria-label={`Ver detalles de ${s.name}`}
                onClick={() => handleOpen(s)}
                variant="panel"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  overflow: "hidden",
                  textAlign: "center",
                  height: CARD_H,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  cursor: "pointer",
                  transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
                  border: `1px solid ${borderTone}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 10px 22px rgba(0,0,0,.45)"
                        : "0 10px 22px rgba(0,0,0,.12)",
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={s.img || placeholderImg(theme.palette.mode)}
                    alt={s.name}
                    sx={{
                      width: "100%",
                      height: IMG_H,
                      objectFit: "cover",
                      borderRadius: 1.25,
                      mb: 0.75,
                      flexShrink: 0,
                      border: `1px solid ${borderTone}`,
                    }}
                    onError={(e) => {
                      e.currentTarget.src = placeholderImg(theme.palette.mode);
                    }}
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
                    fontSize="0.92rem"
                    lineHeight={1.1}
                    sx={{
                      color: nameColor,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    title={s.name}
                  >
                    {s.name}
                  </Typography>

                  <Typography
                    fontSize="0.78rem"
                    lineHeight={1.1}
                    sx={{
                      color: addressColor,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mt: 0.3,
                    }}
                    title={s.address}
                  >
                    {s.address}
                  </Typography>
                </CardContent>
              </CardPaper>
            </Grid>
          ))}
        </Grid>

        {hasOverflow && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="ctrl" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Mostrar menos" : `Ver más (${items.length - maxVisible})`}
            </Button>
          </Box>
        )}
      </Paper>

      {/* ===== Diálogo de detalle ===== */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          },
        }}
      >
        {/* Header con botón cerrar */}
        <DialogTitle
          sx={{
            pr: 6,
            py: 1.25,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {active?.name || "Punto de venta"}
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Cerrar">
            <IconButton onClick={handleClose} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        {/* Imagen grande */}
        <Box sx={{ px: 2 }}>
          <Box
            component="img"
            src={active?.img || placeholderImg(theme.palette.mode)}
            alt={active?.name || "store"}
            onError={(e) => {
              e.currentTarget.src = placeholderImg(theme.palette.mode);
            }}
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              borderRadius: 12,
              border: `1px solid ${borderTone}`,
            }}
          />
        </Box>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={1.25}>
            {/* Chips de ubicación */}
            {(active?.city || active?.province) && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {active?.city && <Chip size="small" label={active.city} />}
                {active?.province && <Chip size="small" label={active.province} />}
              </Stack>
            )}

            {/* Dirección */}
            {active?.address && (
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <PlaceRoundedIcon fontSize="small" />
                <Typography variant="body2" sx={{ mt: "1px" }}>
                  {active.address}
                </Typography>
              </Stack>
            )}

            {/* Teléfono */}
            {active?.phone && (
              <Stack direction="row" spacing={1.25} alignItems="center">
                <PhoneIphoneRoundedIcon fontSize="small" />
                <Button
                  variant="text"
                  size="small"
                  href={`tel:${active.phone}`}
                  sx={{ textTransform: "none", px: 0 }}
                >
                  {active.phone}
                </Button>
              </Stack>
            )}

            {/* Email */}
            {active?.email && (
              <Stack direction="row" spacing={1.25} alignItems="center">
                <EmailRoundedIcon fontSize="small" />
                <Button
                  variant="text"
                  size="small"
                  href={`mailto:${active.email}`}
                  sx={{ textTransform: "none", px: 0 }}
                >
                  {active.email}
                </Button>
              </Stack>
            )}

            {/* Mini mapa (si hay datos suficientes) */}
            {(() => {
              const src = mapsEmbedSrc(active || {});
              if (!src) return null;
              return (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      width: "100%",
                      height: 220,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${borderTone}`,
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
                </>
              );
            })()}

            {/* Descripción */}
            {active?.description && (
              <>
                <Divider />
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {active.description}
                </Typography>
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button
            variant="contained"
            href={mapsHref(active || {})}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<PlaceRoundedIcon />}
          >
            Ver en Maps
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
