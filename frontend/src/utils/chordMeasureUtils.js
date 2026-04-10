/**
 * Convierte tiempo en ms a índice de pulso global (0 = inicio del tema).
 */
export function msToBeatIndex(ms, bpm) {
  const n = Number(bpm);
  if (!n || n < 30) return 0;
  const msPerBeat = 60000 / n;
  return ms / msPerBeat;
}

/**
 * Pulso global (fracción) → compás 1-based y pulso 1..beatsPerMeasure
 */
export function beatIndexToMeasureBeat(beatIndexFloat, beatsPerMeasure = 4) {
  const bpl = Math.max(1, Math.min(16, beatsPerMeasure | 0));
  const bi = Math.floor(beatIndexFloat);
  const measure = Math.floor(bi / bpl) + 1;
  const beat = (bi % bpl) + 1;
  return { measure, beat, beatIndexInt: bi };
}

export function msToMeasureBeat(ms, bpm, beatsPerMeasure = 4) {
  return beatIndexToMeasureBeat(msToBeatIndex(ms, bpm), beatsPerMeasure);
}

/** Duración en pulsos del BPM. */
export function msDurationToBeats(durationMs, bpm) {
  const n = Number(bpm);
  if (!n || n < 30) return 0;
  return durationMs / (60000 / n);
}

/**
 * Figura aproximada según duración en pulsos (4/4).
 */
export function durationBeatsToFigure(durationBeats) {
  const d = Number(durationBeats) || 0;
  if (d >= 3.5) return { code: "w", label: "Redonda", short: "𝅝" };
  if (d >= 1.75) return { code: "h", label: "Blanca", short: "𝅗𝅥" };
  if (d >= 0.85) return { code: "q", label: "Negra", short: "♩" };
  return { code: "e", label: "Corchea", short: "♪" };
}

export function formatMeasureBeat(measure, beat) {
  return `C${measure} · P${beat}`;
}
