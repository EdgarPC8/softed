/** Configuración compartida del módulo Piano */

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 600;
export const PIANO_HEIGHT = 100;

/** Rango visible: 4 octavas C2 a B5 */
export const VISIBLE_RANGE = [
  'C2','C#2','D2','D#2','E2','F2','F#2','G2','G#2','A2','A#2','B2',
  'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
  'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4',
  'C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5',
];

export const WHITE_KEY_NOTES = VISIBLE_RANGE.filter((n) => !n.includes('#'));
export const BLACK_KEY_NOTES = VISIBLE_RANGE.filter((n) => n.includes('#'));

export const HAND_COLORS = { L: '#ff5555', R: '#00fcd4' };
export const OVERLAY_KEY_COLOR = '#f39c12';

export const STOP_TOLERANCE_PX = 6;
export const EARLY_HIT_WINDOW_SEC = 0.18;
