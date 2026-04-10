import { get as getChord } from "@tonaljs/chord";

/** Quita el bajo tras / para leer la cifra como acorde (la tríada va en posición fundamental). */
export function chordSymbolWithoutSlashBass(symbol) {
  if (!symbol || typeof symbol !== "string") return "";
  const s = symbol.trim();
  const i = s.indexOf("/");
  if (i === -1) return s;
  return s.slice(0, i).trim();
}

/**
 * Convierte símbolo de acorde tipo "Am", "G", "D7/F#" en notas para Tone.js.
 */
export function chordSymbolToNoteNames(symbol) {
  if (!symbol || typeof symbol !== "string") return [];
  const s = symbol.trim();
  if (!s) return [];
  const c = getChord(s);
  if (c.empty || !Array.isArray(c.notes) || c.notes.length === 0) {
    const c2 = getChord(s.replace(/\s+/g, ""));
    if (!c2.empty && c2.notes?.length) return withOctave(c2.notes);
    return [];
  }
  return withOctave(c.notes);
}

/**
 * Tríada (máx. 3 notas: fundamental, tercera, quinta) para piano guía — más clara y audible.
 * Los símbolos con séptima u otras tensiones se reducen a la tríada base.
 */
export function chordSymbolToTriadNoteNames(symbol) {
  if (!symbol || typeof symbol !== "string") return [];
  const s = symbol.trim();
  if (!s) return [];
  const head = chordSymbolWithoutSlashBass(s) || s;
  let c = getChord(head);
  if (c.empty || !Array.isArray(c.notes) || c.notes.length === 0) {
    c = getChord(head.replace(/\s+/g, ""));
  }
  if (c.empty || !Array.isArray(c.notes) || c.notes.length === 0) return [];
  // Fundamental, tercera y quinta; séptimas u otras tensiones se omiten.
  const triadPcs = c.notes.slice(0, 3);
  return triadWithOctave(triadPcs);
}

function withOctave(notes) {
  return notes.map((n, i) => {
    if (/\d/.test(n)) return n;
    const oct = i === 0 ? "3" : "4";
    return `${n}${oct}`;
  });
}

/** Voicing compacto: fundamental ~C3, tercera y quinta ~C4 (se oye bien en altavoces). */
function triadWithOctave(pcs) {
  return pcs.map((n, i) => {
    if (/\d/.test(n)) return n;
    const oct = i === 0 ? "3" : "4";
    return `${n}${oct}`;
  });
}
