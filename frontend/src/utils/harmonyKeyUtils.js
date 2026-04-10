import { Key, Note } from "tonal";
import { get as getChord } from "@tonaljs/chord";

const ES_NOTE_PREFIXES = [
  ["solb", "Gb"],
  ["lab", "Ab"],
  ["sib", "Bb"],
  ["dob", "Cb"],
  ["fab", "Fb"],
  ["mib", "Eb"],
  ["reb", "Db"],
  ["do", "C"],
  ["re", "D"],
  ["mi", "E"],
  ["fa", "F"],
  ["sol", "G"],
  ["la", "A"],
  ["si", "B"],
];

/** Mayor longitud primero para no confundir «si» con «sib», «la» con «lab», etc. */
const ES_PREFIXES_SORTED = [...ES_NOTE_PREFIXES].sort((a, b) => b[0].length - a[0].length);

function spanishStartToEnglishToken(s) {
  const low = s.toLowerCase().replace(/♯/g, "#").replace(/♭/g, "b");
  for (const [es, en] of ES_PREFIXES_SORTED) {
    if (low.startsWith(es)) {
      return en + low.slice(es.length);
    }
  }
  return low;
}

/**
 * Convierte solo el prefijo de nota (Do, Sol#, Lam…) a notación inglesa; el resto (m, 7, maj7…) se mantiene.
 */
function normalizePitchPrefix(raw) {
  const t = String(raw).trim();
  if (!t) return t;
  const low = t.toLowerCase().replace(/♯/g, "#").replace(/♭/g, "b");
  for (const [es, en] of ES_PREFIXES_SORTED) {
    if (low.startsWith(es)) {
      return en + t.slice(es.length);
    }
  }
  return t;
}

/**
 * Un token de la línea de acordes (p. ej. «Lam», «Sol», «D7/F#», «Fa#») a un símbolo que @tonaljs/chord entiende.
 * @returns {string|null}
 */
export function normalizeChordTokenForTonal(token) {
  const t = String(token).trim();
  if (!t || t === "-" || /^n\.?c\.?$/i.test(t)) return null;

  const slash = t.indexOf("/");
  const leftRaw = slash === -1 ? t : t.slice(0, slash).trim();
  const rightRaw = slash === -1 ? "" : t.slice(slash + 1).trim();

  const leftEng = normalizePitchPrefix(leftRaw).replace(/\s+/g, "");
  const leftCompact = leftRaw.replace(/\s+/g, "");
  const rightEng = rightRaw ? normalizePitchPrefix(rightRaw).replace(/\s+/g, "") : "";
  const rightCompact = rightRaw.replace(/\s+/g, "");

  const attempts = [];
  if (rightRaw) {
    attempts.push(`${leftCompact}/${rightCompact}`, `${leftEng}/${rightEng}`, `${leftEng}/${rightCompact}`, `${leftCompact}/${rightEng}`);
  } else {
    attempts.push(leftCompact, leftEng, t.replace(/\s+/g, ""));
  }

  const seen = new Set();
  for (const sym of attempts) {
    if (!sym || seen.has(sym)) continue;
    seen.add(sym);
    const c = getChord(sym);
    if (!c.empty) return sym;
  }
  return null;
}

/**
 * @param {string} raw
 * @returns {{ valid: boolean, tonic: string, mode: "major"|"minor", triads: string[], chordsHarmonicFunction: string[], label: string, scale: string[] }}
 */
export function resolveKeyContext(raw) {
  const empty = {
    valid: false,
    tonic: "",
    mode: "major",
    triads: [],
    chordsHarmonicFunction: [],
    label: "",
    scale: [],
  };
  if (!raw || typeof raw !== "string") return empty;

  let s = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!s) return empty;

  const minorByWord = /\bmenor\b|\bminor\b|\bmin\b/.test(s);
  s = s.replace(/\b(mayor|menor|major|minor|min)\b/g, " ").replace(/\s+/g, " ").trim();

  let compact = s.replace(/\s/g, "").replace(/♯/g, "#").replace(/♭/g, "b");
  let minorBySuffix = false;
  if (!minorByWord && compact.length > 1 && compact.endsWith("m") && !/maj|dim|aug|sus|add/i.test(compact)) {
    minorBySuffix = true;
    compact = compact.slice(0, -1);
  }

  let eng = spanishStartToEnglishToken(compact);
  const m = eng.match(/^([a-g])([#b]?)/i);
  if (!m) return empty;

  const tonic = (m[1].toUpperCase() + (m[2] || "")) ;
  const isMinor = minorByWord || minorBySuffix;

  if (isMinor) {
    const k = Key.minorKey(tonic);
    if (!k?.tonic) return empty;
    const scale = k.natural;
    return {
      valid: true,
      tonic: k.tonic,
      mode: "minor",
      triads: [...scale.triads],
      chordsHarmonicFunction: [...scale.chordsHarmonicFunction],
      scale: [...scale.scale],
      label: `${k.tonic} menor (natural)`,
    };
  }

  const k = Key.majorKey(tonic);
  if (!k?.tonic) return empty;
  return {
    valid: true,
    tonic: k.tonic,
    mode: "major",
    triads: [...k.triads],
    chordsHarmonicFunction: [...k.chordsHarmonicFunction],
    scale: [...k.scale],
    label: `${k.tonic} mayor`,
  };
}

/**
 * Grado aproximado en la tonalidad (por clase de altura de la fundamental).
 * @param {string} keyRaw
 * @param {string} chordSymbol
 * @returns {"diatonic"|"chromatic"|"unknown"}
 */
export function chordDegreeInKey(keyRaw, chordSymbol) {
  const ctx = resolveKeyContext(keyRaw);
  if (!ctx.valid || !chordSymbol?.trim()) return "unknown";
  let c = getChord(chordSymbol.trim());
  if (c.empty) c = getChord(chordSymbol.trim().replace(/\s+/g, ""));
  if (c.empty || c.tonic == null) return "unknown";
  const rootChroma = Note.chroma(c.tonic);
  if (rootChroma == null || rootChroma === undefined) return "unknown";
  const inScale = ctx.scale.some((n) => Note.chroma(n) === rootChroma);
  return inScale ? "diatonic" : "chromatic";
}

export function chordsArrayToLine(symbols) {
  return (symbols || []).map((s) => String(s).trim()).filter(Boolean).join("  ");
}

export function parseChordLineToArray(line) {
  if (!line || !String(line).trim()) return [];
  return String(line)
    .split(/[\s|,\n\r\t]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Misma lista de tokens que la UI (`parseChordLineToArray`), resolviendo nombres en español para la vista previa.
 */
export function parseChordSymbolsFromLine(line) {
  const tokens = parseChordLineToArray(line);
  const out = [];
  for (const tok of tokens) {
    let sym = normalizeChordTokenForTonal(tok);
    if (!sym) {
      const compact = tok.replace(/\s+/g, "");
      let c = getChord(compact);
      if (!c.empty) sym = compact;
      else {
        c = getChord(tok.trim());
        if (!c.empty) sym = tok.replace(/\s+/g, " ").trim();
      }
    }
    if (sym) out.push(sym);
  }
  return out;
}

/**
 * Reparte `barBeats` pulsos entre `count` acordes (enteros ≥1). Si hay más acordes que pulsos de compás, cada uno vale 1 pulso (varios compases).
 * @param {number} count
 * @param {number} barBeats pulsos por compás (p. ej. 4)
 */
export function equalSplitBeats(count, barBeats) {
  const c = Math.max(0, Math.floor(Number(count)));
  if (c === 0) return [];
  const bar = Math.max(1, Math.min(32, Math.floor(Number(barBeats) || 4)));
  if (c >= bar) {
    return Array.from({ length: c }, () => 1);
  }
  const q = Math.floor(bar / c);
  const r = bar % c;
  return Array.from({ length: c }, (_, i) => Math.max(1, q + (i < r ? 1 : 0)));
}

/**
 * @param {number} symbolsLength
 * @param {unknown} stored array guardado o undefined
 * @param {number} barBeats
 * @returns {number[]}
 */
export function normalizeChordBeatsArray(symbolsLength, stored, barBeats) {
  const n = Math.max(0, Math.floor(symbolsLength));
  if (n === 0) return [];
  const bar = Math.max(1, Math.min(32, Math.floor(Number(barBeats) || 4)));
  const arr = Array.isArray(stored)
    ? stored.map((x) => Math.max(1, Math.min(32, Math.floor(Number(x)) || 1)))
    : [];
  if (arr.length === n) return arr;
  if (arr.length === 0) {
    return Array.from({ length: n }, () => bar);
  }
  if (arr.length > n) return arr.slice(0, n);
  const last = arr[arr.length - 1];
  return [...arr, ...Array.from({ length: n - arr.length }, () => last)];
}

/**
 * Al cambiar la lista de acordes, conserva pulsos donde el símbolo coincide en la misma posición.
 * Lo nuevo hereda el pulso del acorde anterior en la nueva lista (o pulsos/compás si es el primero).
 */
export function reconcileChordBeats(prevTokens, nextTokens, prevBeats, beatsPerBar = 4) {
  const o = (prevTokens || []).map((s) => String(s).trim());
  const nu = (nextTokens || []).map((s) => String(s).trim());
  const b = Array.isArray(prevBeats)
    ? prevBeats.map((x) => Math.max(1, Math.min(32, Math.floor(Number(x)) || 1)))
    : [];
  const bar = Math.max(1, Math.min(32, Math.floor(Number(beatsPerBar) || 4)));
  const out = [];
  for (let i = 0; i < nu.length; i++) {
    if (i < o.length && i < b.length && o[i] === nu[i]) {
      out.push(b[i]);
    } else {
      let def = bar;
      if (out.length > 0) def = out[out.length - 1];
      else if (b.length > 0) def = b[0];
      out.push(Math.max(1, Math.min(32, def)));
    }
  }
  return out;
}

/**
 * Sílaba efectiva de un acorde (mismo criterio que el desplegable de la UI).
 * @param {number[]} anchors
 * @param {number} slotIndex0Based
 * @param {number} totalSyllables
 * @returns {number}
 */
export function effectiveSyllableAt(anchors, slotIndex0Based, totalSyllables) {
  const ts = Math.max(0, Math.floor(Number(totalSyllables)) || 0);
  if (ts <= 0) return 0;
  const v = Math.floor(Number(anchors[slotIndex0Based])) || 0;
  if (v >= 1 && v <= ts) return v;
  return Math.min(slotIndex0Based + 1, ts);
}

/**
 * Máximo de sílabas efectivas en [0, endExclusive).
 */
export function maxEffectiveSyllableInRange(anchors, endExclusive, totalSyllables) {
  let m = 0;
  const arr = anchors || [];
  for (let k = 0; k < endExclusive; k++) {
    m = Math.max(m, effectiveSyllableAt(arr, k, totalSyllables));
  }
  return m;
}

/**
 * Siguiente sílaba al añadir un acorde al final: una más que el máximo ya usado
 * en toda la progresión (no solo el acorde inmediato anterior).
 */
export function suggestNextSyllableForAppend(anchorArr, progressionLengthBeforeAppend, totalSyllables) {
  const ts = Math.max(0, Math.floor(Number(totalSyllables)) || 0);
  if (ts <= 0) return 0;
  if (progressionLengthBeforeAppend <= 0) return 1;
  const maxSo = maxEffectiveSyllableInRange(anchorArr, progressionLengthBeforeAppend, ts);
  return Math.min(maxSo + 1, ts);
}

/**
 * Tras editar la sílaba en `editedIndex`, sube hacia adelante las que quedaron
 * por debajo del mínimo encadenado (p. ej. siguen en 1 tras poner el 3.º en 15 → 16, 17…).
 * No baja valores que ya son mayores que el mínimo requerido.
 */
export function cascadeForwardAfterSyllableEdit(anchors, editedIndex, progressionLength, totalSyllables) {
  const ts = Math.max(0, Math.floor(Number(totalSyllables)) || 0);
  const len = Math.max(progressionLength, (anchors || []).length);
  const out = (anchors || []).slice(0, len);
  while (out.length < progressionLength) out.push(0);
  if (ts <= 0) return out.slice(0, progressionLength);
  if (editedIndex < 0 || editedIndex >= progressionLength) return out.slice(0, progressionLength);

  let prev = effectiveSyllableAt(out, editedIndex, ts);
  for (let j = editedIndex + 1; j < progressionLength; j++) {
    const needed = Math.min(prev + 1, ts);
    const cur = effectiveSyllableAt(out, j, ts);
    if (cur < needed) out[j] = needed;
    prev = effectiveSyllableAt(out, j, ts);
  }
  return out.slice(0, progressionLength);
}

/**
 * Tras añadir acordes al final, recoloca hacia adelante desde el acorde con la sílaba más alta
 * entre las posiciones 0 … (última-1), para corregir anteriores que quedaron en 1 u otras bajas.
 */
export function cascadeForwardFromHighestEarlier(anchors, progressionLength, totalSyllables) {
  const ts = Math.max(0, Math.floor(Number(totalSyllables)) || 0);
  if (ts <= 0) return (anchors || []).slice(0, progressionLength);
  const len = progressionLength;
  const arr = (anchors || []).slice();
  while (arr.length < len) arr.push(0);
  if (len < 2) return arr.slice(0, len);
  let bestI = 0;
  let bestV = -1;
  for (let i = 0; i < len - 1; i++) {
    const e = effectiveSyllableAt(arr, i, ts);
    if (e >= bestV) {
      bestV = e;
      bestI = i;
    }
  }
  return cascadeForwardAfterSyllableEdit(arr, bestI, len, ts);
}

/**
 * Mantiene anclajes por sílaba al editar la línea de acordes. Acordes nuevos encadenan +1.
 * Índices 1-based; 0 = sin letra o sin asignar.
 * @param {string[]} prevTokens
 * @param {string[]} nextTokens
 * @param {number[]} prevAnchors
 * @param {number} totalSyllables
 * @returns {number[]}
 */
/**
 * Tras cambiar la letra (distinto número de sílabas): reclampea cada ancla a [1…ts]
 * y evita que un acorde posterior quede “antes” en la letra que uno anterior
 * (repite índice de sílaba si hace falta).
 * @param {number[]} rawAnchors
 * @param {number} progressionLength
 * @param {number} totalSyllables
 * @returns {number[]}
 */
export function clampAndMonotonicChordAnchors(rawAnchors, progressionLength, totalSyllables) {
  const ts = Math.max(0, Math.floor(Number(totalSyllables)) || 0);
  const len = Math.max(0, Math.floor(Number(progressionLength)) || 0);
  const src = Array.isArray(rawAnchors) ? rawAnchors : [];
  const out = [];
  for (let i = 0; i < len; i++) {
    out.push(Math.max(0, Math.floor(Number(src[i])) || 0));
  }
  if (ts <= 0) {
    return out.map(() => 0);
  }
  for (let j = 0; j < len; j++) {
    let v = out[j];
    if (v < 1) v = Math.min(j + 1, ts);
    out[j] = Math.min(Math.max(1, v), ts);
  }
  let prevEff = 0;
  for (let j = 0; j < len; j++) {
    let eff = effectiveSyllableAt(out, j, ts);
    if (j > 0 && eff < prevEff) {
      out[j] = prevEff;
      eff = effectiveSyllableAt(out, j, ts);
    }
    prevEff = Math.max(prevEff, eff);
  }
  return out;
}

export function reconcileChordSyllableAnchors(prevTokens, nextTokens, prevAnchors, totalSyllables) {
  const o = (prevTokens || []).map((s) => String(s).trim());
  const nu = (nextTokens || []).map((s) => String(s).trim());
  const a = Array.isArray(prevAnchors) ? prevAnchors.map((x) => Math.max(0, Math.floor(Number(x)) || 0)) : [];
  const ts = Math.max(0, Math.floor(Number(totalSyllables)) || 0);
  const out = [];
  for (let i = 0; i < nu.length; i++) {
    if (i < o.length && i < a.length && o[i] === nu[i]) {
      let v = a[i];
      if (ts > 0) {
        if (v < 1) v = Math.min(i + 1, ts);
        v = Math.min(Math.max(1, v), ts);
      } else {
        v = 0;
      }
      out.push(v);
    } else {
      let def = 0;
      if (ts > 0) {
        if (i === 0) def = 1;
        else {
          const maxSo = maxEffectiveSyllableInRange(out, i, ts);
          def = Math.min(maxSo + 1, ts);
        }
      }
      out.push(def);
    }
  }
  return out;
}
