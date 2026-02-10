/** Convierte Db3 -> C#3, etc. */
export function normalizeNote(note) {
  const flats = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };
  const m = note.match(/^([A-G])b(\d)$/);
  if (m) return flats[m[1] + 'b'] + m[2];
  return note;
}

/** Desplaza octava: C4 + 1 -> C5 */
export function shiftNoteOctave(noteName, shiftOctaves = 0) {
  if (!shiftOctaves) return noteName;
  const m = noteName.match(/^([A-G]#?)(-?\d+)$/);
  if (!m) return noteName;
  const pitch = m[1];
  const oct = parseInt(m[2], 10);
  return `${pitch}${oct + shiftOctaves}`;
}

/** "0:4:2" -> beats numéricos */
export function timeStrToBeats(t) {
  const parts = String(t).split(':');
  if (parts.length !== 3) return NaN;
  const [bars = 0, beats = 0, six = 0] = parts.map(Number);
  return bars * 4 + beats + six / 4;
}

/** Beats -> segundos */
export function beatsToSeconds(beats, bpmValue) {
  return (beats * 60) / bpmValue;
}

/** Duración (número, "4n", "0:0:2") -> segundos. Usa BPM explícito para no depender del Transport. */
export function durationToSeconds(dur, bpmValue) {
  if (typeof dur === 'number') return beatsToSeconds(dur, bpmValue);
  if (typeof dur === 'string') {
    if (dur.includes(':')) {
      const [bars = 0, beats = 0, six = 0] = dur.split(':').map(Number);
      const totalBeats = bars * 4 + beats + six / 4;
      return beatsToSeconds(totalBeats, bpmValue);
    }
    // "4n", "8n", etc. -> beats -> segundos con BPM actual
    const beats = durationToBeats(dur);
    return beatsToSeconds(beats, bpmValue);
  }
  return 0.5;
}

/** MIDI number -> note name (C4, etc.) */
export function midiToNoteName(midi) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const name = names[midi % 12];
  return `${name}${octave}`;
}

/** Duración "4n", "8n", "1n"... -> beats (4/4: 4n = 1 beat) */
export function durationToBeats(dur) {
  if (typeof dur === 'number') return dur;
  const map = { '1n': 4, '2n': 2, '4n': 1, '8n': 0.5, '16n': 0.25, '3n': 1.5 };
  return map[String(dur)] ?? 0.5;
}

/** Beats (número) -> MBT "m:b:s" (compás 4/4) */
export function beatToMBT(beat) {
  const b = Math.max(0, Number(beat));
  const bar = Math.floor(b / 4);
  const rest = b - bar * 4;
  const beatIdx = Math.floor(rest);
  const six = Math.round((rest - beatIdx) * 4) % 4;
  return `${bar}:${beatIdx}:${six}`;
}

/** Beats (número) -> duración más cercana "16n"|"8n"|"4n"|"2n"|"1n" */
export function beatsToDuration(beats) {
  const b = Math.max(0.25, Number(beats));
  if (b <= 0.25) return '16n';
  if (b <= 0.5) return '8n';
  if (b <= 1) return '4n';
  if (b <= 2) return '2n';
  return '1n';
}

/** Segundos desde el inicio + BPM -> tiempo MBT "m:b:s" (compás 4/4) */
export function secondsToMBT(seconds, bpmValue) {
  const totalBeats = (seconds * bpmValue) / 60;
  const total16 = Math.max(0, Math.round(totalBeats * 4));
  const m = Math.floor(total16 / 16);
  const r = total16 % 16;
  const b = Math.floor(r / 4);
  const s = r % 4;
  return `${m}:${b}:${s}`;
}
