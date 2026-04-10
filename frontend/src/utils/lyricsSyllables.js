/**
 * Separación silábica para español (ortográfica, reglas habituales: hiato, diptongo,
 * CC entre vocales, etc.). Garantiza que todos los caracteres de la palabra aparezcan
 * en alguna sílaba (nada se “pierde” en la vista letra + acordes).
 */

/**
 * @param {string} ch
 * @returns {boolean}
 */
function isStrongVowel(ch) {
  return /[aeoáéó]/i.test(ch);
}

/**
 * @param {string} ch
 * @returns {boolean}
 */
function isWeakVowel(ch) {
  return /[iuüíú]/i.test(ch);
}

/**
 * @param {string} ch
 * @returns {boolean}
 */
function isAnyVowelLetter(ch) {
  return /[aeiouáéíóúü]/i.test(ch);
}

/**
 * Hiato: dos vocales en núcleos distintos (no forman diptongo).
 * @param {string} a — carácter anterior (minúscula)
 * @param {string} b — siguiente
 * @param {string} aRaw
 * @param {string} bRaw
 */
function isHiatusBetween(a, b, aRaw, bRaw) {
  if (!a || !b) return false;
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  if (al === bl) return true;
  if (isStrongVowel(al) && isStrongVowel(bl)) return true;
  if (/[íúý]/i.test(aRaw) && isWeakVowel(al) && isStrongVowel(bl)) return true;
  if (isStrongVowel(al) && /[íúý]/i.test(bRaw) && isWeakVowel(bl)) return true;
  return false;
}

/**
 * ¿Forman diptongo típico (se quedan en un solo núcleo)?
 */
function isDiphthongPair(a, b, aRaw, bRaw) {
  if (!a || !b) return false;
  if (isHiatusBetween(a, b, aRaw, bRaw)) return false;
  if (isAnyVowelLetter(a) && isAnyVowelLetter(b)) return true;
  return false;
}

/**
 * y vocal (hoy, muy, rey) vs y consonántica (yo, yate, enlace).
 * @param {number} i
 * @param {string} lower
 */
function isYAsVowel(i, lower) {
  if (lower[i] !== "y" && lower[i] !== "Y") return false;
  const prev = i > 0 ? lower[i - 1] : "";
  const next = i + 1 < lower.length ? lower[i + 1] : "";
  const prevIsV = i > 0 && (isAnyVowelLetter(prev) || prev === "y");
  const nextIsV = i + 1 < lower.length && (isAnyVowelLetter(next) || next === "y");
  if (prevIsV || nextIsV) return false;
  return true;
}

/**
 * @param {number} i
 * @param {string} lower
 * @param {string} raw
 * @returns {boolean}
 */
function isVowelAt(i, lower, raw) {
  if (i < 0 || i >= lower.length) return false;
  if (isAnyVowelLetter(raw[i])) return true;
  return isYAsVowel(i, lower);
}

/**
 * Núcleos vocálicos [start, end) en índices de `word`.
 * @param {string} word
 * @returns {[number, number][]}
 */
function findVowelNuclei(word) {
  const raw = word;
  const lower = raw.toLowerCase();
  const n = raw.length;
  const nuclei = [];
  let i = 0;
  while (i < n) {
    if (!isVowelAt(i, lower, raw)) {
      i++;
      continue;
    }
    const start = i;
    i++;
    while (i < n && isVowelAt(i, lower, raw)) {
      const a = lower[i - 1];
      const b = lower[i];
      if (isHiatusBetween(a, b, raw[i - 1], raw[i])) break;
      if (!isDiphthongPair(a, b, raw[i - 1], raw[i])) break;
      i++;
    }
    nuclei.push([start, i]);
  }
  return nuclei;
}

/**
 * Trocea el núcleo de la palabra (solo letras / guión / apóstrofo interno).
 * @param {string} core
 * @returns {string[]}
 */
function splitSpanishCore(core) {
  if (!core) return [];
  const nuclei = findVowelNuclei(core);
  if (nuclei.length === 0) return [core];

  const parts = [];
  let start = 0;
  for (let k = 0; k < nuclei.length; k++) {
    const [, ne] = nuclei[k];
    const nextNs = k + 1 < nuclei.length ? nuclei[k + 1][0] : core.length;
    const consBetween = nextNs - ne;

    let end;
    if (k === nuclei.length - 1) {
      end = core.length;
    } else if (consBetween === 0) {
      end = ne;
    } else if (consBetween === 1) {
      end = ne;
    } else if (consBetween === 2) {
      end = ne + 1;
    } else {
      end = ne + consBetween - 1;
    }

    parts.push(core.slice(start, end));
    start = end;
  }

  if (start < core.length) parts.push(core.slice(start));
  return parts.filter(Boolean);
}

/**
 * Separa prefijo no-alfabético, núcleo silábico y sufijo (puntuación, etc.).
 * @param {string} word
 * @returns {{ core: string, prefix: string, suffix: string }}
 */
function peelWordEdges(word) {
  const w = String(word);
  const m = w.match(/^([^\p{L}\p{M}0-9'-]*)([\p{L}\p{M}0-9'-]*)([^\p{L}\p{M}0-9'-]*)$/u);
  if (!m) return { prefix: "", core: w, suffix: "" };
  return { prefix: m[1] || "", core: m[2] || "", suffix: m[3] || "" };
}

/**
 * Parte una palabra en sílabas; conserva prefijos/sufijos (comas, «…», etc.).
 * @param {string} word
 * @returns {string[]}
 */
export function splitWordToSyllables(word) {
  const s = String(word).trim();
  if (!s) return [];

  const { prefix, core, suffix } = peelWordEdges(s);
  if (!core) return [s];

  const syllables = splitSpanishCore(core);
  if (syllables.length === 0) return [s];

  if (prefix) syllables[0] = prefix + syllables[0];
  if (suffix) syllables[syllables.length - 1] = syllables[syllables.length - 1] + suffix;

  return syllables;
}

/**
 * @param {string} word
 * @returns {number}
 */
export function countSyllablesInWord(word) {
  return splitWordToSyllables(word).length;
}

/**
 * Lista plana de sílabas con índice global 1-based (para anclar acordes).
 * @param {string} text
 * @returns {{ index: number, text: string, lineIndex: number }[]}
 */
export function lyricsToSyllableTokens(text) {
  const lines = String(text || "").split(/\r?\n/);
  const flat = [];
  let idx = 1;
  for (let li = 0; li < lines.length; li++) {
    const words = lines[li].trim().split(/\s+/).filter(Boolean);
    for (const w of words) {
      for (const part of splitWordToSyllables(w)) {
        flat.push({ index: idx++, text: part, lineIndex: li });
      }
    }
  }
  return flat;
}

/**
 * @param {string} text
 * @returns {number}
 */
export function lyricsToSyllableCount(text) {
  return lyricsToSyllableTokens(text).length;
}

/**
 * Líneas originales (incluye vacías) para maquetar la vista previa.
 * @param {string} text
 * @returns {string[]}
 */
export function lyricsRawLines(text) {
  return String(text || "").split(/\r?\n/);
}

/**
 * Segmentos por línea para vista letra+acordes: espacios tal cual (`\s`) y sílabas con el mismo
 * índice global 1-based que {@link lyricsToSyllableTokens}.
 * @param {string} text
 * @returns {({ type: 'space', text: string } | { type: 'syllable', text: string, index: number })[][]}
 */
export function lyricsToPreviewSegmentLines(text) {
  const lines = String(text || "").split(/\r?\n/);
  let globalIdx = 1;
  return lines.map((line) => {
    const segments = [];
    const chunks = line.match(/\S+|\s+/gu) || [];
    for (const ch of chunks) {
      if (/^\s+$/.test(ch)) {
        segments.push({ type: "space", text: ch });
      } else {
        for (const syl of splitWordToSyllables(ch)) {
          segments.push({ type: "syllable", text: syl, index: globalIdx++ });
        }
      }
    }
    return segments;
  });
}
