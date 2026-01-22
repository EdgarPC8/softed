// bind/resolveTemplate.js
import { pathImg } from "../../../../api/axios";

// -------------------- utils --------------------
const joinUrl = (base = "", p = "") =>
  `${String(base).replace(/\/+$/, "")}/${String(p).replace(/^\/+/, "")}`;

const isAbsoluteUrl = (s = "") =>
  /^https?:\/\//i.test(String(s)) ||
  /^data:image\//i.test(String(s)) ||
  /^blob:/i.test(String(s));

const isNonEmpty = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "";

const getByPath = (obj, path) => {
  try {
    return String(path || "")
      .split(".")
      .reduce((acc, k) => acc?.[k], obj);
  } catch {
    return undefined;
  }
};

// ✅ "desc" -> "data.desc" (compat)
// ✅ "product.x" queda igual
// ✅ "data.xxx" queda igual
const normalizeKey = (k = "") => {
  const s = String(k || "").trim();
  if (!s) return "";

  if (
    s.startsWith("data.") ||
    s.startsWith("product.") ||
    s.startsWith("catalog.") ||
    s.startsWith("computed.")
  ) return s;

  if (s.includes(".")) return s;

  // si quieres que "desc" sea directo (sin data.), cambia esto a: return s;
  return `data.${s}`;
};

/**
 * ✅ busca en:
 * 1) docData (el que pasas desde CanvasStage)
 * 2) doc.data (compat)
 * y con compat extra:
 * - si te dan "product.x" y realmente está en data.product.x
 */
const resolveValue = (doc, docData, rawKey) => {
  const key = normalizeKey(rawKey);
  if (!key) return undefined;

  const root = docData && typeof docData === "object" ? docData : (doc?.data || {});

  // 1) directo
  let v = getByPath(root, key);
  if (isNonEmpty(v)) return v;

  // 2) compat: si key NO empieza con data., intenta data.key
  if (!key.startsWith("data.")) {
    v = getByPath(root, `data.${key}`);
    if (isNonEmpty(v)) return v;
  }

  // 3) compat extra: a veces el root real está dentro de root.data
  // (cuando guardas { data: it, product:..., catalog:... })
  if (root?.data && typeof root.data === "object") {
    v = getByPath(root.data, key);
    if (isNonEmpty(v)) return v;

    if (!key.startsWith("data.")) {
      v = getByPath(root.data, `data.${key}`);
      if (isNonEmpty(v)) return v;
    }
  }

  return undefined;
};

// ✅ construye src final con prioridad:
// value -> srcPrefix -> pathImg
const buildImageSrc = (value, srcPrefix) => {
  if (!isNonEmpty(value)) return "";
  const v = String(value);

  if (isAbsoluteUrl(v)) return v;

  // si viene "EdDeli/xxx.png"
  if (srcPrefix) return joinUrl(srcPrefix, v);

  return joinUrl(pathImg, v);
};

// -------------------- MAIN --------------------
export const resolveLayer = (doc, docData, layer) => {
  if (!layer) return layer;

  // ✅ prioridad real de key:
  // - primero fieldKey (si el usuario lo editó en Inspector)
  // - si no hay, usa bind.*
  const keyForImage = layer?.fieldKey || layer?.bind?.srcFrom || "";
  const keyForText = layer?.fieldKey || layer?.bind?.textFrom || "";

  // =========================
  // IMAGE
  // =========================
  if (layer.type === "image") {
    const value = resolveValue(doc, docData, keyForImage);

    const srcPrefix = layer.bind?.srcPrefix || ""; // si existe en template úsalo
    const fallbackSrc = layer.bind?.fallbackSrc || "";
    const defaultSrc = layer.props?.src || "";

    // ✅ prioridad:
    // 1) value del fieldKey/bind
    // 2) default props.src (si es relativo también se completa)
    // 3) fallbackSrc (tal cual)
    let finalSrc = "";

    if (isNonEmpty(value)) {
      finalSrc = buildImageSrc(value, srcPrefix);
    } else if (isNonEmpty(defaultSrc)) {
      // si el default es relativo, lo completamos igual
      finalSrc = buildImageSrc(defaultSrc, srcPrefix);
    } else if (isNonEmpty(fallbackSrc)) {
      finalSrc = String(fallbackSrc);
    }

    return {
      ...layer,
      props: { ...(layer.props || {}), src: finalSrc },
    };
  }

  // =========================
  // TEXT
  // =========================
  if (layer.type === "text") {
    const value = resolveValue(doc, docData, keyForText);

    // si no hay value => NO pisa el default
    if (!isNonEmpty(value)) return layer;

    const maxLen = Number(layer.bind?.maxLen || 0);
    let text = String(value);

    if (maxLen > 0 && text.length > maxLen) text = text.slice(0, maxLen);

    return {
      ...layer,
      props: { ...(layer.props || {}), text },
    };
  }

  return layer;
};
