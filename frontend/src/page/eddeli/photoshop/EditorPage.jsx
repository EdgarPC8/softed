import React from "react";
import { Box, Typography } from "@mui/material";
import { EditorProvider, useEditor } from "./EditorProvider";
import CanvasStage from "./canvas/CanvasStage";

import InspectorPanel from "./panels/InspectorPanel";
import LayersPanel from "./panels/LayersPanel";
import ExportPanel from "./panels/ExportPanel";

export default function EditorPage() {
  return (
    <EditorProvider>
      <Box
        sx={{
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 520px", // 👈 2 columnas
          overflow: "hidden",
        }}
      >
        {/* =================== COLUMNA IZQUIERDA =================== */}
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "1fr 260px", // 👈 Canvas / Export
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* 🟨 ARRIBA: CANVAS */}
          <Box sx={{ p: 2, overflow: "hidden"}}>
            <CanvasStage />
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
    </EditorProvider>
  );
}

/* ========================================================= */
/* =================== COLUMNA DERECHA ===================== */
/* ========================================================= */

function RightColumn() {
  const {
    layers,
    selectedId,
    setLayerMeta,
    updateLayerProps,
    toggleVisible,
    toggleLocked,
  } = useEditor();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "220px 1fr", // 👈 Propiedades / Capas
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
        <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>
          Propiedades
        </Typography>

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
        <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>
          Capas
        </Typography>

        <LayersPanel />
      </Box>
    </Box>
  );
}
