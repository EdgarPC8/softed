/**
 * Utilidades para el módulo de Cobranzas (CollectionsWorkbench).
 */

export const safeFileName = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();

export const downloadTextFile = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const money = (n) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

export const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const sum = (arr, fn) =>
  (arr || []).reduce((acc, x) => acc + Number(fn(x) || 0), 0);

export const dayLabel = (iso) => iso;

/** itemGroupId o groupId real; si backend manda inGroup, tratamos como agrupado */
export const getItemGroupId = (it) =>
  it?.groupId ?? it?.itemGroupId ?? (it?.inGroup ? "__grouped__" : null);

export const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Cantidad cobrable (entregado - dañado - yapa) */
export const getBillableQty = (it) => {
  const delivered = toNum(it.qty ?? it.quantity, 0);
  const damaged = toNum(it.damagedQty, 0);
  const gift = toNum(it.giftQty, 0);
  return Math.max(0, delivered - damaged - gift);
};
