import React, { useMemo } from "react";
import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { useEditor } from "../EditorProvider";

export default function LayersPanel() {
  const { state, dispatch } = useEditor();
  const { doc, selected, dragId } = state;

  const selectedLayer =
    selected?.kind === "layer" ? doc.layers.find((l) => l.id === selected.id) : null;

  const sortedLayers = useMemo(() => {
    return [...doc.layers].sort((a, b) => {
      const za = a.zIndex || 0;
      const zb = b.zIndex || 0;
      if (za !== zb) return zb - za;
      return String(a.id).localeCompare(String(b.id));
    });
  }, [doc.layers]);

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" variant="contained" onClick={() => dispatch({ type: "ADD_LAYER", layerType: "text" })}>
          + Text
        </Button>
        <Button size="small" variant="contained" onClick={() => dispatch({ type: "ADD_LAYER", layerType: "image" })}>
          + Image
        </Button>
        <Button size="small" variant="contained" onClick={() => dispatch({ type: "ADD_LAYER", layerType: "shape" })}>
          + Shape
        </Button>
      </Stack>

      <Stack spacing={0.7}>
        {sortedLayers.map((l) => (
          <Box
            key={l.id}
            draggable
            onDragStart={() => dispatch({ type: "SET_DRAG_ID", dragId: l.id })}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dispatch({ type: "REORDER_BY_DROP", fromId: dragId, toId: l.id })}
            onClick={() => dispatch({ type: "SET_SELECTED", selected: { kind: "layer", id: l.id } })}
            sx={{
              p: 1,
              borderRadius: 1,
              border:
                selectedLayer?.id === l.id
                  ? "2px solid #00E5FF"
                  : "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "TOGGLE_VISIBLE", layerId: l.id });
                }}
              >
                {l.visible ? "👁" : "🙈"}
              </Button>

              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "TOGGLE_LOCKED", layerId: l.id });
                }}
              >
                {l.locked ? "🔒" : "🔓"}
              </Button>

              <Chip size="small" label={l.type} />
            </Stack>

            <TextField
              size="small"
              value={l.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                dispatch({ type: "UPDATE_LAYER", layerId: l.id, patch: { name: e.target.value } })
              }
              sx={{ width: 160 }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
