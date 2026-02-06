import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useEditor } from "../EditorProvider";
import SimpleDialog from "../../../../Components/Dialogs/SimpleDialog"; // ajusta ruta si hace falta

export default function LayersPanel() {
  const { state, dispatch, deleteLayer } = useEditor();
  const { doc, selected, dragId } = state;

  const [layerToDelete, setLayerToDelete] = useState(null);

  const selectedLayer =
    selected?.kind === "layer"
      ? doc.layers.find((l) => l.id === selected.id)
      : null;

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
      {/* BOTONES AGREGAR */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => dispatch({ type: "ADD_LAYER", layerType: "text" })}
        >
          + Text
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => dispatch({ type: "ADD_LAYER", layerType: "image" })}
        >
          + Image
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => dispatch({ type: "ADD_LAYER", layerType: "shape" })}
        >
          + Shape
        </Button>
      </Stack>

      {/* LISTA DE CAPAS */}
      <Stack spacing={0.7}>
        {sortedLayers.map((l) => (
          <Box
            key={l.id}
            draggable
            onDragStart={() =>
              dispatch({ type: "SET_DRAG_ID", dragId: l.id })
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={() =>
              dispatch({
                type: "REORDER_BY_DROP",
                fromId: dragId,
                toId: l.id,
              })
            }
            onClick={() =>
              dispatch({
                type: "SET_SELECTED",
                selected: { kind: "layer", id: l.id },
              })
            }
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
            {/* IZQUIERDA */}
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

            {/* DERECHA */}
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                value={l.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_LAYER",
                    layerId: l.id,
                    patch: { name: e.target.value },
                  })
                }
                sx={{ width: 140 }}
              />

              {/* ELIMINAR */}
              <Tooltip title="Eliminar capa">
                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLayerToDelete(l);
                  }}
                  sx={{ minWidth: 32 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* CONFIRMACIÓN */}
      <SimpleDialog
        open={!!layerToDelete}
        onClose={() => setLayerToDelete(null)}
        tittle="Eliminar capa"
        message={`¿Deseas eliminar la capa "${layerToDelete?.name}"? Esta acción no se puede deshacer.`}
        onClickAccept={() => {
          deleteLayer(layerToDelete.id);
          setLayerToDelete(null);
        }}
      />
    </Box>
  );
}
