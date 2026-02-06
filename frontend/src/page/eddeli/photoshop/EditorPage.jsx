

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { useParams } from "react-router-dom";

import { EditorProvider, useEditor } from "./EditorProvider";
import CanvasStage from "./canvas/CanvasStage";

import InspectorPanel from "./panels/InspectorPanel";
import LayersPanel from "./panels/LayersPanel";
import ExportPanel from "./panels/ExportPanel";

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}

/* ========================================================= */
/* =================== LAYOUT + LOAD TEMPLATE =============== */
/* ========================================================= */

function EditorLayout() {
  const { id } = useParams(); // /editor/:id? (id puede ser undefined)
  const { loadTemplateById, state } = useEditor();

  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  // Debug: de dónde viene el doc (lo setea el Provider como __metaSource)
  const source = state?.doc?.__metaSource || (id ? "unknown" : "EMPTY/local");

  // ✅ evita refetch del mismo id (y corta duplicados de StrictMode en dev)
  const lastLoadedIdRef = useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError("");


        // si no hay id, no cargues del backend
        if (!id) {
          lastLoadedIdRef.current = null;
          if (alive) setLoading(false);
          return;
        }
        console.log("hola si cargoooooooooooo")

        // ✅ si ya cargaste este mismo id, no repitas
        if (lastLoadedIdRef.current === String(id)) {
          if (alive) setLoading(false);
          return;
        }

        lastLoadedIdRef.current = String(id);

        if (alive) setLoading(true);
        await loadTemplateById(id);
      } catch (e) {
        console.error(e);
        if (alive) setError("No se pudo cargar el template desde el backend.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };

    // ❗ IMPORTANTE:
    // NO ponemos loadTemplateById en deps para evitar loop si el Provider recrea la función.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 520px",
        overflow: "hidden",
      }}
    >
      {/* =================== COLUMNA IZQUIERDA =================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "1fr 260px",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* 🟨 ARRIBA: CANVAS */}
        <Box sx={{ p: 2, overflow: "hidden", position: "relative" }}>
          {/* Debug chip */}
          <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 20 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={`source: ${source}`} />
              {id ? <Chip size="small" label={`id: ${id}`} /> : <Chip size="small" label="sin id" />}
            </Stack>
          </Box>

          {loading ? (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              <Typography sx={{ color: "#fff", opacity: 0.85 }}>Cargando template...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              <Typography sx={{ color: "#ffb4b4", textAlign: "center" }}>{error}</Typography>
              <Typography sx={{ color: "#fff", opacity: 0.7, mt: 1, textAlign: "center" }}>
                (Revisa el id en la URL o el endpoint GET /editor/templates/:id)
              </Typography>
            </Box>
          ) : (
            <CanvasStage />
          )}
        </Box>

        {/* 🟥 ABAJO: EXPORTAR */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <ExportPanel />
        </Box>
      </Box>

      {/* =================== COLUMNA DERECHA =================== */}
      <RightColumn />
    </Box>
  );
}

/* ========================================================= */
/* =================== COLUMNA DERECHA ===================== */
/* ========================================================= */

function RightColumn() {
  const { layers, selectedId, setLayerMeta, updateLayerProps, toggleVisible, toggleLocked } = useEditor();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "220px 1fr",
        height: "100%",
        background: "rgba(0,0,0,0.35)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* 🟦 ARRIBA: PROPIEDADES */}
      <Box
        sx={{
          p: 2,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(6px)",
          overflow: "auto",
        }}
      >
        <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>Propiedades</Typography>

        <InspectorPanel
          selectedLayer={selectedId}
          layers={layers}
          setLayerMeta={setLayerMeta}
          updateLayerProps={updateLayerProps}
          toggleVisible={toggleVisible}
          toggleLocked={toggleLocked}
        />
      </Box>

      {/* 🟪 ABAJO: CAPAS */}
      <Box
        sx={{
          p: 2,
          overflow: "auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>Capas</Typography>
        <LayersPanel />
      </Box>
    </Box>
  );
}
