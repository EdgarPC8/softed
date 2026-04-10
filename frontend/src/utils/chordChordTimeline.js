/**
 * Construye tiempos de cada acorde a partir de BPM y pulsos por línea:
 * cada línea ocupa beatsPerLine pulsos; dentro de la línea, la posición del acorde
 * (atCharIndex / largo texto) reparte el tiempo de esa línea.
 *
 * Cada evento incluye endMs y durationMs: el acorde “vive” desde startMs hasta el
 * inicio del siguiente acorde (o el final de la canción). Así el piano y la guía
 * respetan el mismo tempo que el metrónomo (ms derivados del BPM).
 *
 * Nota: es un modelo **regular** (mismo tiempo por línea). No sustituye marcas manuales
 * sobre una pista real si la canción acelera o el canto no va línea = X compases.
 */
/**
 * @param {object} [chordRhythm] Opcional: `{ durationsByEventId: { [eventId]: pulsos } }` — prioriza ritmo sobre el hueco hasta el siguiente acorde.
 */
export function buildChordTimeline(flatLines, bpm, beatsPerLine, chordRhythm) {
  const n = Number(bpm);
  const bpl = Math.max(1, Math.min(32, Number(beatsPerLine) || 4));
  if (!flatLines?.length || !n || n < 30 || n > 320) return [];

  const msPerBeat = 60000 / n;
  const lineMs = bpl * msPerBeat;
  const events = [];

  for (const line of flatLines) {
    const gi = line.globalIndex ?? 0;
    const lineStart = gi * lineMs;
    const text = line.text || "";
    const len = Math.max(text.length, 1);
    const chords = [...(line.chords || [])].sort(
      (a, b) => (a.atCharIndex || 0) - (b.atCharIndex || 0)
    );

    chords.forEach((c, i) => {
      const frac = Math.min(1, Math.max(0, (c.atCharIndex || 0) / len));
      const sym = String(c.symbol || "").trim();
      if (!sym) return;
      events.push({
        id: `${gi}-${i}-${sym}-${c.atCharIndex ?? 0}`,
        startMs: lineStart + frac * lineMs,
        lineIndex: gi,
        atCharIndex: c.atCharIndex || 0,
        symbol: sym,
      });
    });
  }

  const sorted = events.sort((a, b) => a.startMs - b.startMs);
  const songEndMs = flatLines.length * lineMs;
  const minDur = Math.max(40, msPerBeat * 0.25);
  const durMap = chordRhythm?.durationsByEventId;

  for (let i = 0; i < sorted.length; i++) {
    const e = sorted[i];
    const next = sorted[i + 1];
    let endMs = next ? next.startMs : songEndMs;
    if (endMs <= e.startMs) {
      endMs = e.startMs + minDur;
    }
    e.endMs = Math.min(endMs, songEndMs);
    e.durationMs = Math.max(minDur, e.endMs - e.startMs);
  }

  if (durMap && typeof durMap === "object") {
    for (let i = 0; i < sorted.length; i++) {
      const e = sorted[i];
      const beats = Number(durMap[e.id]);
      if (!beats || beats <= 0 || Number.isNaN(beats)) continue;
      const next = sorted[i + 1];
      const cap = next ? next.startMs : songEndMs;
      const wantEnd = e.startMs + beats * msPerBeat;
      let endMs = Math.min(wantEnd, cap, songEndMs);
      if (endMs <= e.startMs) endMs = e.startMs + minDur;
      e.endMs = endMs;
      e.durationMs = Math.max(minDur, endMs - e.startMs);
    }
  }

  return sorted;
}

/** Duración total del modelo (última línea × tiempo por línea). */
export function getSongTimelineDurationMs(flatLines, bpm, beatsPerLine) {
  const n = Number(bpm);
  const bpl = Math.max(1, Math.min(32, Number(beatsPerLine) || 4));
  if (!flatLines?.length || !n || n < 30 || n > 320) return 0;
  const msPerBeat = 60000 / n;
  return flatLines.length * bpl * msPerBeat;
}

/** Último acorde cuyo startMs <= timeMs (tiempo del audio en ms). */
export function getActiveChordEvent(events, timeMs) {
  if (!events?.length) return null;
  let active = null;
  for (const e of events) {
    if (e.startMs <= timeMs) active = e;
    else break;
  }
  return active;
}

/** Acorde que suena en `timeMs` según [startMs, endMs) — respeta duración y silencios entre acordes. */
export function getActiveChordEventInWindow(events, timeMs) {
  if (!events?.length) return null;
  for (const e of events) {
    const end = e.endMs ?? e.startMs;
    if (timeMs >= e.startMs && timeMs < end) return e;
  }
  return null;
}
