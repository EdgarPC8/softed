import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";

import { EditorProvider, useEditor } from "./EditorProvider";
import CanvasStage from "./canvas/CanvasStage";
import ExportPanel from "./panels/ExportPanel";
import { getCatalogTemplateItems } from "../../../api/inventoryControlRequest";
import { pathImg } from "../../../api/axios"; // ✅ usa tu base: http://IP:PORT/eddeliapi/img

export default function ProductTemplateStudio() {
  return (
    <EditorProvider>
      <StudioInner />
    </EditorProvider>
  );
}

// -----------------------
// helpers
// -----------------------
const getByPath = (obj, path) => {
  try {
    return String(path || "")
      .split(".")
      .reduce((acc, k) => acc?.[k], obj);
  } catch {
    return undefined;
  }
};

const normalizeKey = (k = "") => {
  const s = String(k || "").trim();
  if (!s) return "";

  // si ya viene con prefijos conocidos, lo respetamos
  if (
    s.startsWith("data.") ||
    s.startsWith("product.") ||
    s.startsWith("catalog.") ||
    s.startsWith("computed.")
  )
    return s;

  // si tiene puntos (product.xxx) lo respetamos
  if (s.includes(".")) return s;

  // si es simple (desc) lo asumimos dentro de data.*
  return `data.${s}`;
};

const resolveFieldValue = (docData, rawKey) => {
  const key = normalizeKey(rawKey);
  if (!key) return { key: "", value: undefined };
  const value = getByPath(docData || {}, key);
  return { key, value };
};

const isNonEmpty = (v) => v !== undefined && v !== null && String(v).trim() !== "";

// ✅ une URLs sin // dobles
const joinUrl = (base = "", p = "") =>
  `${String(base).replace(/\/+$/, "")}/${String(p).replace(/^\/+/, "")}`;

// ✅ detectar si ya es URL completa
const isAbsoluteUrl = (s = "") =>
  /^https?:\/\//i.test(String(s)) || /^data:image\//i.test(String(s)) || /^blob:/i.test(String(s));

/**
 * ✅ RESUELVE SRC FINAL:
 * 1) si value es absoluta -> value
 * 2) si hay bind.srcPrefix -> srcPrefix + value
 * 3) si no, usa pathImg + value
 * 4) fallback: props.src -> (si es relativa también se completa)
 * 5) fallback final: bind.fallbackSrc
 */
const resolveImageSrc = ({ layer, docData }) => {
  const rawKey = layer?.fieldKey || layer?.bind?.srcFrom || "";
  const { key, value } = resolveFieldValue(docData, rawKey);

  const srcPrefix = layer?.bind?.srcPrefix || "";
  const fallbackSrc = layer?.bind?.fallbackSrc || "";
  const defaultSrc = layer?.props?.src || "";

  // 1) value por fieldKey/bind
  if (isNonEmpty(value)) {
    const v = String(value);
    if (isAbsoluteUrl(v)) return { key, rawKey, src: v, from: "data(abs)" };
    if (srcPrefix) return { key, rawKey, src: joinUrl(srcPrefix, v), from: "data(prefix)" };
    return { key, rawKey, src: joinUrl(pathImg, v), from: "data(pathImg)" };
  }

  // 2) default props.src
  if (isNonEmpty(defaultSrc)) {
    const d = String(defaultSrc);
    if (isAbsoluteUrl(d)) return { key, rawKey, src: d, from: "default(abs)" };
    if (srcPrefix) return { key, rawKey, src: joinUrl(srcPrefix, d), from: "default(prefix)" };
    return { key, rawKey, src: joinUrl(pathImg, d), from: "default(pathImg)" };
  }

  // 3) fallbackSrc (normalmente ya es absoluto)
  if (isNonEmpty(fallbackSrc)) return { key, rawKey, src: String(fallbackSrc), from: "fallback" };

  return { key, rawKey, src: "", from: "empty" };
};

function StudioInner() {
  const { state, dispatch } = useEditor();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const selectedId = state?.doc?.data?.catalog?.id ?? "";

  // ✅ guardo el item completo en doc.data.data y product/catálogo
  const applySelection = useCallback(
    (it) => {
      if (!it) return;

      dispatch({ type: "SET_DOC_DATA_CATALOG", catalog: it });
      dispatch({ type: "SET_DOC_DATA_PRODUCT", product: it.product || null });

      dispatch({
        type: "SET_DOC_DATA_PATCH",
        patch: {
          data: it,              // data.imageUrl / data.displayName ...
          product: it.product||{}, // product.primaryImageUrl ...
          catalog: it
        },
      });
      
    },
    [dispatch]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await getCatalogTemplateItems();
        if (!alive) return;

        const arr = Array.isArray(data) ? data : [];
        setItems(arr);

        if ((!state?.doc?.data?.catalog || !state.doc.data.catalog?.id) && arr.length) {
          applySelection(arr[0]);
        }
      } catch (e) {
        console.error("getCatalogTemplateItems error:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applySelection]);

  const filtered = useMemo(() => {
    const q = String(search || "").toLowerCase().trim();
    if (!q) return items;

    return items.filter((it) => {
      const name = String(it?.name || it?.displayName || it?.title || it?.product?.name || "").toLowerCase();
      const badge = String(it?.badge || it?.label || "").toLowerCase();
      const section = String(it?.section || "").toLowerCase();
      return name.includes(q) || badge.includes(q) || section.includes(q);
    });
  }, [items, search]);

  const handleSelect = (id) => {
    const it = items.find((x) => String(x?.id) === String(id));
    applySelection(it);
  };

  // ✅ docData real
  const docData = state?.doc?.data || {};

  // ✅ layers
  const layers = state?.doc?.layers || [];
  const textLayers = useMemo(() => layers.filter((l) => l?.type === "text"), [layers]);
  const imageLayers = useMemo(() => layers.filter((l) => l?.type === "image"), [layers]);

  const [imgStatus, setImgStatus] = useState({});

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const next = {};

      for (const layer of imageLayers) {
        const { src } = resolveImageSrc({ layer, docData });

        if (!src) {
          next[layer?.id || ""] = false;
          continue;
        }

        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (!cancelled) next[layer?.id || ""] = true;
            resolve(true);
          };
          img.onerror = () => {
            if (!cancelled) next[layer?.id || ""] = false;
            resolve(false);
          };
          img.src = src;
        });
      }

      if (!cancelled) setImgStatus(next);
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [imageLayers, docData]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        overflow: "hidden",
        minHeight: 0,
        background: "#0b0f14",
      }}
    >
      {/* ===================== IZQUIERDA ===================== */}
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>Catálogo</Typography>

          <TextField
            size="small"
            label="Buscar (nombre, badge, sección)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <Box sx={{ height: 10 }} />

          <FormControl size="small" fullWidth>
            <InputLabel id="catalog-item-select">Seleccionar item</InputLabel>
            <Select
              labelId="catalog-item-select"
              label="Seleccionar item"
              value={selectedId}
              onChange={(e) => handleSelect(e.target.value)}
            >
              {loading && (
                <MenuItem value="">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={16} />
                    <span>Cargando...</span>
                  </Stack>
                </MenuItem>
              )}

              {!loading && filtered.length === 0 && <MenuItem value="">No hay items</MenuItem>}

              {!loading &&
                filtered.map((it) => {
                  const name = it?.name || it.displayName || it.title || it.product?.name || `Item #${it.id}`;
                  const sec = it.section ? `[${it.section}] ` : "";
                  const price =
                    typeof it.displayPrice !== "undefined"
                      ? ` — $${it.displayPrice}`
                      : typeof it.price !== "undefined"
                      ? ` — $${it.price}`
                      : "";
                  return (
                    <MenuItem key={it.id} value={it.id}>
                      {sec}
                      {name}
                      {price}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <Box sx={{ mt: 1, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
            Este Studio es solo <b>preview</b> + <b>export</b>.
          </Box>

          <Box sx={{ mt: 1, color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
            base pathImg: <span style={{ wordBreak: "break-all" }}>{String(pathImg)}</span>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* ===================== Vista rápida (capas) ===================== */}
        <Box sx={{ p: 2, overflow: "auto", minHeight: 0 }}>
          <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>Vista rápida (capas)</Typography>

          {/* TEXTOS */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 800, fontSize: 12, mb: 1 }}>
              Textos ({textLayers.length})
            </Typography>

            <Stack spacing={1}>
              {textLayers.map((l) => {
                const rawKey = l?.fieldKey || l?.bind?.textFrom || "";
                const { key, value } = resolveFieldValue(docData, rawKey);

                const fallback = l?.props?.text ?? "";
                const shown = isNonEmpty(value) ? String(value) : String(fallback);

                return (
                  <Box
                    key={l.id}
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: "wrap" }}>
                      <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>{l.id}</Typography>
                      <Chip size="small" label={rawKey || "sin fieldKey"} />
                      <Chip size="small" label={isNonEmpty(value) ? "data" : "default"} />
                    </Stack>

                    <Typography sx={{ color: "#fff", fontSize: 12 }}>
                      {shown || <span style={{ color: "rgba(255,255,255,0.45)" }}>(vacío)</span>}
                    </Typography>

                    {!!rawKey && (
                      <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
                        key: {key}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* IMÁGENES */}
          <Box>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 800, fontSize: 12, mb: 1 }}>
              Imágenes ({imageLayers.length})
            </Typography>

            <Stack spacing={1}>
              {imageLayers.map((l) => {
                const { key, rawKey, src, from } = resolveImageSrc({ layer: l, docData });
                const loaded = imgStatus[l?.id || ""] === true;

                return (
                  <Box
                    key={l.id}
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: "wrap" }}>
                      <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>{l.id}</Typography>
                      <Chip size="small" label={rawKey || "sin fieldKey"} />
                      <Chip size="small" label={src ? (loaded ? "✅ cargó" : "❌ error") : "sin src"} />
                      <Chip size="small" label={from} />
                    </Stack>

                    <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11, wordBreak: "break-all" }}>
                      {src || "(sin ruta)"}
                    </Typography>

                    {!!rawKey && (
                      <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
                        key: {key}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* ===================== DERECHA ===================== */}
      <Box
        sx={{
          height: "100%",
          minHeight: 0,
          display: "grid",
          gridTemplateRows: "1fr 260px",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, minHeight: 0, overflow: "hidden" }}>
          <CanvasStage />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.35)",
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <ExportPanel />
        </Box>
      </Box>
    </Box>
  );
}
