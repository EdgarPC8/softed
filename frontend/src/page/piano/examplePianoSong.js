import { notesToPlay } from './arrayMusic';

const DEFAULT_DURATION = '8n';

/**
 * Misma partitura que `arrayMusic.js` / `song.json`: demo larga para reproducir y guardar en BD.
 */
export function getExamplePianoSongEditorState() {
  const notes = notesToPlay.map((n) => ({
    note: String(n.note).trim(),
    time: typeof n.time === 'string' ? n.time : '0:0:0',
    duration: n.duration || DEFAULT_DURATION,
    hand: n.hand === 'L' ? 'L' : 'R',
  }));
  return {
    title: 'Canción completa (ejemplo)',
    bpm: 120,
    notes,
    chordsByBar: [],
    keySignature: 'F',
  };
}
