import React, { useEffect } from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PIANO_HEIGHT,
  WHITE_KEY_NOTES,
  BLACK_KEY_NOTES,
  HAND_COLORS,
  OVERLAY_KEY_COLOR,
} from '../constants';

/** Teclado dibujado en canvas (blancas + negras) */
export default function PianoCanvas({
  pianoCanvasRef,
  highlightedKeys = {},
  overlayNotes = new Set(),
  currentHandByNote = {},
  overlayVersion = 0,
}) {
  useEffect(() => {
    const canvas = pianoCanvasRef?.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const whiteKeyWidth = CANVAS_WIDTH / WHITE_KEY_NOTES.length;

    WHITE_KEY_NOTES.forEach((note, i) => {
      const x = i * whiteKeyWidth;
      let fillColor = 'white';
      if (highlightedKeys[note]) fillColor = highlightedKeys[note];
      else if (overlayNotes.has?.(note)) fillColor = OVERLAY_KEY_COLOR;

      ctx.fillStyle = fillColor;
      ctx.fillRect(x, CANVAS_HEIGHT - PIANO_HEIGHT, whiteKeyWidth, PIANO_HEIGHT);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, CANVAS_HEIGHT - PIANO_HEIGHT, whiteKeyWidth, PIANO_HEIGHT);

      const hand = currentHandByNote[note];
      const labelColor = hand ? HAND_COLORS[hand] : fillColor === 'white' ? 'black' : 'white';
      ctx.fillStyle = labelColor;
      ctx.font = '10px Arial';
      ctx.fillText(note, x + 4, CANVAS_HEIGHT - 10);
    });

    BLACK_KEY_NOTES.forEach((note) => {
      const base = note.replace('#', '').slice(0, 1);
      const octave = note.match(/-?\d+$/)?.[0] ?? '';
      const idx = WHITE_KEY_NOTES.findIndex((k) => k === base + octave);
      if (idx !== -1 && base !== 'E' && base !== 'B') {
        const w = CANVAS_WIDTH / WHITE_KEY_NOTES.length;
        const x = (idx + 1) * w - w / 4;
        const bw = w / 2;

        let fillColor = 'black';
        if (highlightedKeys[note]) fillColor = highlightedKeys[note];
        else if (overlayNotes.has?.(note)) fillColor = OVERLAY_KEY_COLOR;

        ctx.fillStyle = fillColor;
        ctx.fillRect(x, CANVAS_HEIGHT - PIANO_HEIGHT, bw, PIANO_HEIGHT * 0.6);

        const hand = currentHandByNote[note];
        const labelColor = hand ? HAND_COLORS[hand] : 'white';
        ctx.fillStyle = labelColor;
        ctx.font = '10px Arial';
        ctx.fillText(note, x + 2, CANVAS_HEIGHT - PIANO_HEIGHT + 15);
      }
    });
  }, [pianoCanvasRef, highlightedKeys, overlayNotes, currentHandByNote, overlayVersion]);

  return (
    <canvas
      ref={pianoCanvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: 'auto',
        pointerEvents: 'none',
      }}
    />
  );
}
