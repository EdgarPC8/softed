// components/HorizontalScroller.jsx
import { Box, Stack } from "@mui/material";
import { memo } from "react";

/**
 * HorizontalScroller
 * - Encapsula su propio scroll horizontal.
 * - No afecta ni usa el scroll de la página.
 *
 * Props:
 *  - children: elementos a renderizar en fila (cards, chips, etc.)
 *  - gap: separación entre ítems (default 2 — unidades MUI)
 *  - px, py: padding horizontal/vertical internos (default px=2, py=1.5)
 *  - height: alto fijo opcional (si lo necesitas para carruseles) — ej: 160
 *  - ariaLabel: etiqueta accesible para lectores de pantalla
 */
function HorizontalScroller({
  children,
  gap = 2,
  px = 2,
  py = 1.5,
  height,
  ariaLabel = "Horizontal scroller",
}) {
  return (
    <Box
      role="region"
      aria-label={ariaLabel}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        ...(height ? { height } : {}),
        overflowX: "auto",          // <-- scroll SOLO aquí
        overflowY: "hidden",
        px,
        py,
        // Aísla layout/pintura para no “ensuciar” el contenedor padre
        contain: "layout paint style",
        // Scrollbar (opcional, comenta si no quieres estilizar)
        "&::-webkit-scrollbar": { height: 8 },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,.3)",
        },
        // Mejor experiencia al arrastrar con trackpad/mouse
        WebkitOverflowScrolling: "touch",
        // Opcional: scroll-snap si tus hijos lo usan
        scrollSnapType: "x proximity",
      }}
    >
      <Stack
        direction="row"
        spacing={gap}
        sx={{
          width: "max-content",     // ocupa solo lo necesario del contenido
          minHeight: "100%",
          // Permite que cada hijo se alinee si usa scrollSnapAlign
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}

export default memo(HorizontalScroller);
