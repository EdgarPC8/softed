// EditorProvider.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { editorReducer, initialState } from "./editorReducer";
import { resolveTemplate, resolveLayer } from "./bind/resolveTemplate";

// ✅ Fallback local template
import { template as LOCAL_TEMPLATE } from "./template";

// ✅ Backend requests
import {
  importEditorTemplate,
  getEditorTemplateById,
  getEditorDefaultTemplate,
  updateEditorTemplateDoc,
  deleteTemplateLayer,
  getEditorTemplateResolved

} from "../../../api/editorRequest";

const Ctx = createContext(null);

// ✅ FALLBACK fuerte
const BASE_TEMPLATE = LOCAL_TEMPLATE || {
  canvas: { width: 1920, height: 1080 },
  backgroundSrc: "",
  groups: [{ id: "group_main", x: 0, y: 0 }],
  layers: [],
  data: {},
  meta: { name: "BASE_TEMPLATE" },
};

const downloadDataUrl = (dataUrl, filename) => {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

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
    const scale =
      fit === "contain" ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = x + (w - sw) / 2;
    const dy = y + (h - sh) / 2;
    ctx.drawImage(im, dx, dy, sw, sh);
  }

  if (radius > 0) ctx.restore();
};

// ✅ Normaliza doc y preserva metas internas si vienen
const normalizeDoc = (doc) => {
  if (!doc || typeof doc !== "object") return { ...BASE_TEMPLATE, id: null };

  return {
    id: doc.id ?? null,
    canvas: doc.canvas || { width: 1920, height: 1080 },
    backgroundSrc: doc.backgroundSrc || "",
    groups: Array.isArray(doc.groups) ? doc.groups : [],
    layers: Array.isArray(doc.layers) ? doc.layers : [],
    data: doc.data || {},
    meta: doc.meta || { name: doc.name || "Template" },
    ...doc,
  };
};

// ✅ soporta row DB o doc ya resuelto
const mapDbTemplateToDoc = (row) => {
  if (row?.canvas?.width && Array.isArray(row?.layers)) {
    return normalizeDoc({
      ...row,
      id:
        row?.id ??
        row?.templateId ??
        row?.template?.id ??
        row?.resolved?.templateId ??
        null,
    });
  }

  const groups = Array.isArray(row?.groups)
    ? row.groups.map((g) => ({
        id: g.key || g.id,
        x: g.x || 0,
        y: g.y || 0,
        locked: !!g.locked,
        visible: g.visible !== false,
      }))
    : [];

  const layers = Array.isArray(row?.layers)
    ? row.layers.map((l) => ({
        id: l.key || l.id,
        groupId: l.group?.key || l.groupId || null,
        type: l.type,
        x: l.x || 0,
        y: l.y || 0,
        w: l.w || 100,
        h: l.h || 100,
        zIndex: l.zIndex || 1,
        name: l.name || l.key || l.id,
        visible: l.visible !== false,
        locked: !!l.locked,
        props: l.props && !Array.isArray(l.props) ? l.props : {},
        bind: l.bind || undefined,
      }))
    : [];

  return normalizeDoc({
    id: row?.id ?? null,
    canvas: { width: row?.canvasWidth || 1920, height: row?.canvasHeight || 1080 },
    backgroundSrc: row?.backgroundSrc || "",
    groups,
    layers,
    meta: { name: row?.name || "Template" },
    app: row?.app ?? null,
    format: row?.format ?? null,
    isDefault: row?.isDefault ?? false,
    isActive: row?.isActive ?? true,
  });
};



export function EditorProvider({ children, designId = null, autoload = true }) {
  const [state, dispatch] = useReducer(
    editorReducer,
    BASE_TEMPLATE,
    (tpl) => initialState(normalizeDoc(tpl))
  );

  const didLoadRef = useRef(false);

  const layers = state.doc?.layers || [];
  const groups = state.doc?.groups || [];
  const selectedId = state.selected?.kind === "layer" ? state.selected.id : null;

  const setLayerMeta = (id, patch) =>
    dispatch({ type: "UPDATE_LAYER", layerId: id, patch });

  const updateLayerProps = (id, propsPatch) =>
    dispatch({ type: "UPDATE_LAYER_PROPS", layerId: id, propsPatch });

  const toggleVisible = (id) => dispatch({ type: "TOGGLE_VISIBLE", layerId: id });
  const toggleLocked = (id) => dispatch({ type: "TOGGLE_LOCKED", layerId: id });



  const setDoc = (doc, source = "local") => {
    dispatch({
      type: "SET_DOC",
      doc: { ...normalizeDoc(doc), __metaSource: source },
    });
  };

  const getTemplateId = () => {
    const a = state?.doc?.__metaTemplateId;
    if (a != null && a !== "") return Number(a);
    const b = state?.doc?.id;
    if (b != null && b !== "") return Number(b);
    return null;
  };

  const saveTemplateDoc = async () => {
    const templateId = getTemplateId();
    if (!templateId) {
      console.error("[saveTemplateDoc] state.doc:", state?.doc);
      throw new Error("No hay templateId para guardar.");
    }

    const { __metaSource, __metaTemplateId, ...docClean } = state.doc || {};
    await updateEditorTemplateDoc(templateId, docClean);
    return templateId;
  };
  const deleteLayer = async (layerId) => {
    const templateId = getTemplateId();
  
    // 🔴 si no hay template, solo borra local
    if (!templateId) {
      dispatch({ type: "DELETE_LAYER", layerId });
      return;
    }
  
    try {
      await deleteTemplateLayer(templateId, layerId);
      dispatch({ type: "DELETE_LAYER", layerId });
    } catch (err) {
      console.error("Error eliminando capa:", err);
    }
  };
  

  const loadTemplateById = async (id) => {
    if (!id) return null;
  
    const res = await getEditorTemplateResolved(id);
    const row = res?.data ?? res;
  
    // 🔑 CLAVE: usar resolved si existe
    const rawDoc = row?.resolved ?? row;
  
    // normalizar
    const doc = mapDbTemplateToDoc(rawDoc);
  
    // 🔑 RESOLVER el template
    const resolvedDoc = resolveTemplate(doc, doc.data || {});
  
    const templateId = Number(row?.id ?? doc?.id ?? id);
  
    setDoc(
      {
        ...resolvedDoc,
        id: resolvedDoc.id ?? templateId,
        __metaTemplateId: templateId,
      },
      "backend(loadById)"
    );
  
    return resolvedDoc;
  };
  

  const loadDefaultFromBackend = async () => {
    const res = await getEditorDefaultTemplate();
    const row = res?.data ?? res;

    const rawDoc = row?.resolved ?? row;
    const doc = mapDbTemplateToDoc(rawDoc);

    const templateId = Number(row?.templateId ?? row?.template?.id ?? doc?.id ?? null);

    const fixed = {
      ...doc,
      id: doc.id ?? templateId ?? null,
      __metaTemplateId: templateId ?? doc.id ?? null,
    };

    setDoc(fixed, "backend(default)");
    return fixed;
  };

  useEffect(() => {
    if (!autoload) return;
    if (didLoadRef.current) return;
    didLoadRef.current = true;

    const run = async () => {
      try {
        if (designId) {
          await loadTemplateById(designId);
        } else {
          try {
            await loadDefaultFromBackend();
          } catch (e) {
            console.warn("[EditorProvider] default backend no disponible → LOCAL_TEMPLATE", e);
            setDoc({ ...BASE_TEMPLATE, __metaTemplateId: null }, "local(template.js)");
          }
        }
      } catch (err) {
        console.error("[EditorProvider] autoload FAIL → fallback local", err);
        setDoc({ ...BASE_TEMPLATE, __metaTemplateId: null }, "local(template.js)");
      }
    };

    run();
  }, [autoload, designId]);

  const resetToLocalTemplate = () => {
    setDoc({ ...BASE_TEMPLATE, __metaTemplateId: null }, "local(template.js)");
  };

  const copyTemplate = async () => {
    const txt = `export const template = ${JSON.stringify(state.doc, null, 2)};\n`;
    await copyToClipboard(txt);
  };

  const copyOps = async () => {
    const txt = `const ops = ${JSON.stringify(state.ops || [], null, 2)};\n`;
    await copyToClipboard(txt);
  };

  const downloadTemplateJson = () => {
    const json = JSON.stringify(state.doc, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `template_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importTemplateJson = async (textOrObj, extra = {}) => {
    const parsed = typeof textOrObj === "string" ? JSON.parse(textOrObj) : textOrObj;

    let createdId = null;
    try {
      const res = await importEditorTemplate(parsed, {
        name: parsed?.meta?.name || extra?.name || "Template importado",
        ...extra,
      });
      const data = res?.data ?? res;
      createdId = data?.id || data?.templateId || null;
    } catch (err) {
      console.warn("Backend import failed, se cargará local:", err);
    }

    if (createdId) {
      try {
        const full = await getEditorTemplateById(createdId);
        const row = full?.data ?? full;
        const doc = mapDbTemplateToDoc(row);

        setDoc({ ...doc, __metaTemplateId: Number(createdId) }, "backend(import)");
        return { id: createdId, doc };
      } catch (err) {
        console.warn("No se pudo traer template por id, usando parsed:", err);
      }
    }

    setDoc({ ...normalizeDoc(parsed), __metaTemplateId: null }, "local(import)");
    return { id: createdId, doc: normalizeDoc(parsed) };
  };

  // ✅ EXPORT AS IMAGE CORREGIDO: usa resolveTemplate para background y layers
  const exportAsImage = async (type = "png") => {
    const data = state.doc;
    if (!data?.canvas) return;

    const W = data.canvas.width;
    const H = data.canvas.height;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    try {
      const resolvedDoc = resolveTemplate(data, data.data); // ✅ layers + background resuelto

      // Background
      if (resolvedDoc.backgroundSrc) {
        const bg = await loadImage(resolvedDoc.backgroundSrc);
        ctx.drawImage(bg, 0, 0, W, H);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
      }

      const gmap = new Map((resolvedDoc.groups || []).map((g) => [g.id, g]));

      const visibleLayers = [...(resolvedDoc.layers || [])]
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
            drawImageFit(
              ctx,
              im,
              x,
              y,
              w,
              h,
              layer.props?.fit || "cover",
              layer.props?.borderRadius || 0
            );
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
    } catch (err) {
      console.error("exportAsImage failed", err);
    }
  };

  const value = useMemo(
    () => ({
      state,
      dispatch,

      layers,
      groups,
      selectedId,

      setLayerMeta,
      updateLayerProps,
      toggleVisible,
      toggleLocked,
      deleteLayer,

      exportAsImage,
      copyTemplate,
      copyOps,

      downloadTemplateJson,
      importTemplateJson,

      loadTemplateById,
      loadDefaultFromBackend,
      resetToLocalTemplate,
      setDoc,

      saveTemplateDoc,
      getTemplateId,
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
