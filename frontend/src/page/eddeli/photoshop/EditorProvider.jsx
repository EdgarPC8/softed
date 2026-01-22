import React, { createContext, useContext, useMemo, useReducer } from "react";
import { template } from "./template";
import { editorReducer, initialState } from "./editorReducer";
import { resolveLayer } from "./bind/resolveTemplate"; // ✅ ya lo usas en LayerRenderer

const Ctx = createContext(null);

// ✅ descarga
const downloadDataUrl = (dataUrl, filename) => {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// ✅ copiar
const copyToClipboard = async (txt) => {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
};

// ✅ CORS igual a tu versión vieja
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });

const roundRectPath = (ctx, x, y, w, h, r) => {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};

const drawImageFit = (ctx, im, x, y, w, h, fit = "cover", radius = 0) => {
  if (radius > 0) {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.clip();
  }

  const iw = im.width;
  const ih = im.height;

  if (fit === "fill") {
    ctx.drawImage(im, x, y, w, h);
  } else {
    const scale = fit === "contain" ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = x + (w - sw) / 2;
    const dy = y + (h - sh) / 2;
    ctx.drawImage(im, dx, dy, sw, sh);
  }

  if (radius > 0) ctx.restore();
};

export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(editorReducer, template, initialState);

  // ====== selectors útiles para paneles ======
  const layers = state.doc?.layers || [];
  const groups = state.doc?.groups || [];
  const selectedId = state.selected?.kind === "layer" ? state.selected.id : null;

  // ====== acciones (para InspectorPanel) ======
  const setLayerMeta = (id, patch) =>
    dispatch({ type: "UPDATE_LAYER", layerId: id, patch });

  const updateLayerProps = (id, propsPatch) =>
    dispatch({ type: "UPDATE_LAYER_PROPS", layerId: id, propsPatch });
    

  const toggleVisible = (id) => dispatch({ type: "TOGGLE_VISIBLE", layerId: id });
  const toggleLocked = (id) => dispatch({ type: "TOGGLE_LOCKED", layerId: id });

  // ====== copiar ======
  const copyTemplate = async () => {
    const txt = `export const template = ${JSON.stringify(state.doc, null, 2)};\n`;
    await copyToClipboard(txt);
  };

  const copyOps = async () => {
    const txt = `const ops = ${JSON.stringify(state.ops || [], null, 2)};\n`;
    await copyToClipboard(txt);
  };

  // ✅ EXPORT COMO TU VERSIÓN QUE FUNCIONABA (render a canvas)
  const exportAsImage = async (type = "png") => {
    const data = state.doc;
    if (!data?.canvas) return;

    const W = data.canvas.width;
    const H = data.canvas.height;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // fondo
    try {
      const bg = await loadImage(data.backgroundSrc);
      ctx.drawImage(bg, 0, 0, W, H);
    } catch (err) {
      console.warn("BG load failed:", err);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    // mapa grupos
    const gmap = new Map((data.groups || []).map((g) => [g.id, g]));

    // layers: abajo->arriba por zIndex
    const visibleLayers = [...(data.layers || [])]
      .map((l) => resolveLayer(data, l))
      .filter((l) => l.visible !== false)
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (const layer of visibleLayers) {
      const g = gmap.get(layer.groupId) || { x: 0, y: 0 };
      const x = (g.x || 0) + (layer.x || 0);
      const y = (g.y || 0) + (layer.y || 0);
      const w = layer.w || 0;
      const h = layer.h || 0;

      if (layer.type === "shape") {
        const fill = layer.props?.fill || "rgba(0,0,0,0.35)";
        const r = layer.props?.borderRadius || 0;

        ctx.save();
        ctx.fillStyle = fill;

        if (r > 0) {
          roundRectPath(ctx, x, y, w, h, r);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, w, h);
        }

        ctx.restore();
      }

      if (layer.type === "image") {
        const src = layer.props?.src;
        if (!src) continue;
        try {
          const im = await loadImage(src);
          drawImageFit(ctx, im, x, y, w, h, layer.props?.fit || "cover", layer.props?.borderRadius || 0);
        } catch (err) {
          console.warn("Image load failed:", src, err);
        }
      }

      if (layer.type === "text") {
        const text = String(layer.props?.text ?? "");
        const fontSize = Number(layer.props?.fontSize || 32);
        const fontWeight = layer.props?.fontWeight || 700;
        const fontFamily = layer.props?.fontFamily || "Inter, system-ui, Arial";
        const color = layer.props?.color || "#fff";
        const align = layer.props?.align || "left";

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = "middle";
        ctx.textAlign = align;

        let tx = x;
        if (align === "center") tx = x + w / 2;
        if (align === "right") tx = x + w;

        ctx.fillText(text, tx, y + h / 2);
        ctx.restore();
      }
    }

    const mime = type === "jpg" ? "image/jpeg" : "image/png";
    const ext = type === "jpg" ? "jpg" : "png";
    const url = canvas.toDataURL(mime, type === "jpg" ? 0.92 : 1);

    downloadDataUrl(url, `banner_${Date.now()}.${ext}`);
  };

  const value = useMemo(
    () => ({
      state,
      dispatch,

      // selectors
      layers,
      groups,
      selectedId,

      // actions (inspector)
      setLayerMeta,
      updateLayerProps,
      toggleVisible,
      toggleLocked,

      // export/copy
      exportAsImage,
      copyTemplate,
      copyOps,
    }),
    [state, layers, groups, selectedId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditor debe usarse dentro de EditorProvider");
  return ctx;
}
