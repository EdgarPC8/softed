import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { VISIBLE_RANGE } from '../constants';
import {
  timeStrToBeats,
  durationToBeats,
  beatToMBT,
  beatsToDuration,
  normalizeNote,
} from '../utils/noteUtils';
import { HAND_COLORS } from '../constants';

const KEY_STRIP_WIDTH = 44;
const ROLL_MIN_HEIGHT = 320;
const MIN_BARS = 4;
const BEATS_PER_BAR = 4;
const RESIZE_HANDLE_WIDTH = 8;
const MIN_NOTE_BEATS = 0.25;

/**
 * Piano roll estilo FL Studio: tiempo izquierda → derecha, pitch vertical.
 * editable: seleccionar, mover con ratón, redimensionar desde el borde derecho, eliminar (Delete / clic derecho).
 * notes: [{ note, time, duration, hand }], onNotesChange(notes) cuando se edita.
 */
export default function PianoRollFL({
  notes = [],
  onNotesChange,
  bpm = 120,
  width = 1000,
  height = ROLL_MIN_HEIGHT,
  pxPerBeat = 24,
  showGrid = true,
  editable = true,
  playheadBeats = null,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const geometryRef = useRef({ gridLeft: KEY_STRIP_WIDTH, rollWidth: 0, rowHeight: 0, rowCount: 0, pxPerBeat: 24, noteRects: [] });

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);

  const noteToRow = useMemo(() => {
    const m = {};
    [...VISIBLE_RANGE].reverse().forEach((note, i) => {
      m[note] = i;
    });
    return m;
  }, []);

  const rowToNote = useMemo(() => {
    const arr = [...VISIBLE_RANGE].reverse();
    return (row) => arr[row];
  }, []);

  const { totalBeats, rollWidth } = useMemo(() => {
    let maxEnd = MIN_BARS * BEATS_PER_BAR;
    notes.forEach((n) => {
      const start = timeStrToBeats(n.time);
      const dur = durationToBeats(n.duration);
      if (!Number.isNaN(start)) maxEnd = Math.max(maxEnd, start + dur);
    });
    const totalBeats = Math.max(maxEnd, MIN_BARS * BEATS_PER_BAR);
    const rw = Math.max(width - KEY_STRIP_WIDTH, totalBeats * pxPerBeat);
    return { totalBeats, rollWidth: rw };
  }, [notes, width, pxPerBeat]);

  const rowCount = VISIBLE_RANGE.length;
  const rowHeight = height / rowCount;

  const noteRects = useMemo(() => {
    const gridLeft = KEY_STRIP_WIDTH;
    const rects = [];
    notes.forEach((n, index) => {
      const noteName = normalizeNote(n.note);
      const row = noteToRow[noteName];
      if (row === undefined) return;
      const startBeats = timeStrToBeats(n.time);
      if (Number.isNaN(startBeats)) return;
      const durBeats = durationToBeats(n.duration);
      const x = gridLeft + startBeats * pxPerBeat;
      const noteWidth = Math.max(durBeats * pxPerBeat, 4);
      const y = row * rowHeight + 1;
      const noteHeight = rowHeight - 2;
      rects.push({
        index,
        x,
        y,
        w: noteWidth,
        h: noteHeight,
        startBeats,
        durBeats,
        row,
        noteName,
      });
    });
    return rects;
  }, [notes, noteToRow, rowHeight, pxPerBeat]);

  geometryRef.current = {
    gridLeft: KEY_STRIP_WIDTH,
    rollWidth,
    rowHeight,
    rowCount,
    pxPerBeat,
    noteRects,
  };

  const getLocalXY = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const logicalW = canvas.width / dpr;
    const logicalH = canvas.height / dpr;
    return {
      x: ((e.clientX - rect.left) / rect.width) * logicalW,
      y: ((e.clientY - rect.top) / rect.height) * logicalH,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      if (!editable || !onNotesChange) return;
      const local = getLocalXY(e);
      if (!local || local.x < KEY_STRIP_WIDTH) return;
      const { noteRects: rects, rowHeight: rh, rowCount: rc, pxPerBeat: ppb, gridLeft } = geometryRef.current;
      const rowFromY = Math.floor(local.y / rh);
      const row = Math.max(0, Math.min(rc - 1, rowFromY));
      const noteRow = rc - 1 - row;
      const beatAtX = (local.x - gridLeft) / ppb;

      for (let i = rects.length - 1; i >= 0; i--) {
        const r = rects[i];
        if (local.x >= r.x && local.x <= r.x + r.w && local.y >= r.y && local.y <= r.y + r.h) {
          setSelectedIndex(r.index);
          if (local.x >= r.x + r.w - RESIZE_HANDLE_WIDTH) {
            setResizeState({
              index: r.index,
              startBeats: r.startBeats,
              startX: local.x,
            });
            setDragState(null);
          } else {
            setDragState({
              index: r.index,
              offsetBeats: beatAtX - r.startBeats,
              offsetRow: local.y / rh - r.row,
            });
            setResizeState(null);
          }
          return;
        }
      }
      setSelectedIndex(null);
      setDragState(null);
      setResizeState(null);
    },
    [editable, onNotesChange, getLocalXY, noteToRow, notes]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!editable || !onNotesChange) return;
      const local = getLocalXY(e);
      if (!local) return;
      const { noteRects: rects, rowHeight: rh, rowCount: rc, pxPerBeat: ppb, gridLeft } = geometryRef.current;

      if (resizeState !== null) {
        const beatAtX = (local.x - gridLeft) / ppb;
        const newDur = Math.max(MIN_NOTE_BEATS, beatAtX - resizeState.startBeats);
        const next = notes.map((n, i) =>
          i === resizeState.index
            ? { ...n, duration: beatsToDuration(newDur) }
            : n
        );
        onNotesChange(next);
        return;
      }

      if (dragState !== null) {
        const beatAtX = (local.x - gridLeft) / ppb;
        const newStartBeats = Math.max(0, beatAtX - dragState.offsetBeats);
        const rowIdx = (local.y / rh) - dragState.offsetRow;
        const row = Math.max(0, Math.min(rc - 1, Math.round(rowIdx)));
        const noteName = rowToNote(row);
        if (!noteName) return;
        const next = notes.map((n, i) =>
          i === dragState.index
            ? { ...n, time: beatToMBT(newStartBeats), note: noteName }
            : n
        );
        onNotesChange(next);
      }
    },
    [editable, onNotesChange, getLocalXY, resizeState, dragState, notes, rowToNote]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setResizeState(null);
  }, []);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      if (!editable || !onNotesChange || selectedIndex === null) return;
      const next = notes.filter((_, i) => i !== selectedIndex);
      onNotesChange(next);
      setSelectedIndex(null);
    },
    [editable, onNotesChange, notes, selectedIndex]
  );

  useEffect(() => {
    if (!editable) return;
    const onKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIndex === null) return;
        e.preventDefault();
        onNotesChange?.(notes.filter((_, i) => i !== selectedIndex));
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editable, selectedIndex, notes, onNotesChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = KEY_STRIP_WIDTH + rollWidth;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const gridLeft = KEY_STRIP_WIDTH;
    const beatsPerBar = BEATS_PER_BAR;

    for (let i = 0; i < rowCount; i++) {
      const y = i * rowHeight;
      const noteName = VISIBLE_RANGE[rowCount - 1 - i];
      const isBlack = noteName.includes('#');
      ctx.fillStyle = isBlack ? '#2d2d2d' : '#1a1a1a';
      ctx.fillRect(0, y, KEY_STRIP_WIDTH, rowHeight + 1);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(0, y, KEY_STRIP_WIDTH, rowHeight);
      ctx.fillStyle = isBlack ? '#888' : '#666';
      ctx.font = '10px monospace';
      ctx.fillText(noteName, 4, y + rowHeight - 4);
    }

    if (showGrid) {
      const numBars = Math.ceil(totalBeats / beatsPerBar);
      for (let bar = 0; bar <= numBars; bar++) {
        const x = gridLeft + bar * beatsPerBar * pxPerBeat;
        if (x < gridLeft) continue;
        ctx.strokeStyle = bar % 4 === 0 ? '#444' : '#333';
        ctx.lineWidth = bar % 4 === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let r = 0; r <= rowCount; r++) {
        const y = r * rowHeight;
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gridLeft, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    notes.forEach((n, idx) => {
      const noteName = normalizeNote(n.note);
      const row = noteToRow[noteName];
      if (row === undefined) return;
      const startBeats = timeStrToBeats(n.time);
      if (Number.isNaN(startBeats)) return;
      const durBeats = durationToBeats(n.duration);
      const x = gridLeft + startBeats * pxPerBeat;
      const noteWidth = Math.max(durBeats * pxPerBeat, 4);
      const y = row * rowHeight + 1;
      const noteHeight = rowHeight - 2;

      const hand = n.hand === 'L' ? 'L' : 'R';
      const isSelected = editable && selectedIndex === idx;
      ctx.fillStyle = HAND_COLORS[hand] || '#00fcd4';
      ctx.fillRect(x, y, noteWidth, noteHeight);
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, noteWidth, noteHeight);
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, noteWidth, noteHeight);
      }
    });

    // Línea de recorrido (playhead): izquierda → derecha
    if (playheadBeats != null && playheadBeats >= 0) {
      const playheadX = gridLeft + playheadBeats * pxPerBeat;
      if (playheadX >= gridLeft && playheadX <= w) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();
      }
    }
  }, [notes, totalBeats, rollWidth, rowHeight, rowCount, height, noteToRow, showGrid, pxPerBeat, editable, selectedIndex, playheadBeats]);

  return (
    <div ref={containerRef} style={{ overflow: 'auto', maxWidth: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          background: '#111',
          borderRadius: 4,
          cursor: editable ? (dragState || resizeState ? 'grabbing' : 'default') : 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
      {editable && (
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888' }}>
          Arrastra para mover · Borde derecho para duración · Clic derecho o Delete para eliminar
        </p>
      )}
    </div>
  );
}
