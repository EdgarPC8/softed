/** @typedef {'on' | 'before' | 'after'} ChordAnchorPlacement */

export const CHORD_PLACEMENT_IDS = /** @type {const} */ (["on", "before", "after"]);

export const CHORD_PLACEMENT_LABELS = {
  on: "Encima de la sílaba",
  before: "Antes (hueco / entre palabras)",
  after: "Después (hueco / espacio)",
};

/**
 * @param {unknown} v
 * @returns {ChordAnchorPlacement}
 */
export function normalizeChordPlacement(v) {
  if (v === "before" || v === "after") return v;
  return "on";
}

/**
 * @param {unknown} raw
 * @returns {ChordAnchorPlacement[]}
 */
export function parseChordPlacementArray(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => normalizeChordPlacement(x)).slice(0, 64);
}

/**
 * Al cambiar tokens de acordes, conserva placement cuando el símbolo coincide.
 * @param {string[]} prevTokens
 * @param {string[]} nextTokens
 * @param {unknown[]} prevPlacement
 * @returns {ChordAnchorPlacement[]}
 */
export function reconcileChordAnchorPlacement(prevTokens, nextTokens, prevPlacement) {
  const o = (prevTokens || []).map((s) => String(s).trim());
  const nu = (nextTokens || []).map((s) => String(s).trim());
  const p = parseChordPlacementArray(prevPlacement);
  const out = [];
  for (let i = 0; i < nu.length; i++) {
    if (i < o.length && i < p.length && o[i] === nu[i]) {
      out.push(p[i]);
    } else {
      out.push("on");
    }
  }
  return out;
}
