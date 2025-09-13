import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import * as Tone from 'tone';
import { notesToPlay as arrayNotes } from './arrayMusic';

const SynthesiaRoll = () => {
  // ================== Refs de canvas ==================
  const rollCanvasRef = useRef(null);   // capa 1: notas + rejilla (RAF)
  const pianoCanvasRef = useRef(null);  // capa 2: teclado (repinta bajo demanda)
  const containerRef = useRef(null);

  // ===== Fases =====
  const [phase, setPhase] = useState('idle'); // idle | playing | paused | finished
  const isPlaying = phase === 'playing';

  // ===== Simulación / Práctica =====
  const [autoSim, setAutoSim] = useState(false);

  // ===== Reloj =====
  const [startTime, setStartTime] = useState(null);
  const [pauseOffset, setPauseOffset] = useState(0);
  const pauseStartRef = useRef(null);

  // ===== Audio/visuales =====
  const [highlightedKeys, setHighlightedKeys] = useState({});
  const [bpm, setBpm] = useState(120);
  const samplerRef = useRef(null);

  // Sensibilidad simultaneidad (ms) – acordes
  const [chordWindowMs, setChordWindowMs] = useState(120);
  const CHORD_WINDOW_SEC = useMemo(() => Math.max(0, Number(chordWindowMs) || 0) / 1000, [chordWindowMs]);

  // Hold (ms) en la línea del teclado
  const [holdMs, setHoldMs] = useState(150);
  const HOLD_AT_KEY_SEC = useMemo(() => Math.max(0, Number(holdMs) || 0) / 1000, [holdMs]);

  // Progreso por grupos
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [noteReady, setNoteReady] = useState(false);

  // Overlay (teclas presionadas por MIDI)
  const overlayPressedNotesRef = useRef(new Set());
  const [overlayVersion, setOverlayVersion] = useState(0); // fuerza repintado del piano
  const bumpOverlay = () => setOverlayVersion(v => v + 1);
  const overlayKeyColor = '#f39c12';

  // MIDI
  const [midiStatus, setMidiStatus] = useState('MIDI no conectado');
  const midiAccessRef = useRef(null);
  const [midiOctaveShift, setMidiOctaveShift] = useState(0);

  // Canvas (dimensiones lógicas)
  const canvasWidth = 1000;
  const canvasHeight = 600;
  const pianoHeight = 100;

  const fallSpeed = useMemo(() => 80 * (bpm / 120), [bpm]);

  // Tolerancias
  const STOP_TOLERANCE_PX = 6;
  const EARLY_HIT_WINDOW_SEC = 0.18;

  // Acorde simultáneo (modo práctica)
  const chordWindowStartRef = useRef(null);
  const chordHitsRef = useRef(new Map()); // noteName -> { time, target }

  // ✅ Guard para autosim (evita doble avance)
  const lastAutoAdvancedGroupRef = useRef(-1);

  const midiActiveNotesRef = useRef(new Set());

  const handColors = { L: '#ff5555', R: '#00fcd4' };

  // estado mutable para notas/lineas
  // noteMeta[index] = { currentStopY, pressed, flashUntil, pressedAt, holdUntil }
  const noteMetaRef = useRef({});
  const lineMetaRef = useRef({});
  const lastNowRef = useRef(null);

  // ==== helpers tiempo ====
  const timeStrToBeats = (t) => {
    const parts = String(t).split(':');
    if (parts.length !== 3) return NaN;
    const [bars = 0, beats = 0, six = 0] = parts.map(Number);
    return bars * 4 + beats + (six / 4);
  };
  const beatsToSeconds = (beats, bpmValue) => (beats * 60) / bpmValue;
  const durationToSeconds = (dur, bpmValue) => {
    if (typeof dur === 'number') return beatsToSeconds(dur, bpmValue);
    if (typeof dur === 'string') {
      if (dur.includes(':')) {
        const [bars=0, beats=0, six=0] = dur.split(':').map(Number);
        const totalBeats = bars * 4 + beats + six/4;
        return beatsToSeconds(totalBeats, bpmValue);
      }
      return Tone.Time(dur).toSeconds(); // '4n', '8n', etc.
    }
    return 0.5;
  };

  // ===== Helpers notas =====
  const normalizeNote = (note) => {
    const flats = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };
    const m = note.match(/^([A-G])b(\d)$/);
    if (m) return flats[m[1] + 'b'] + m[2];
    return note;
  };
  const shiftNoteOctave = (noteName, shiftOctaves = 0) => {
    if (!shiftOctaves) return noteName;
    const m = noteName.match(/^([A-G]#?)(-?\d+)$/);
    if (!m) return noteName;
    const pitch = m[1];
    const oct = parseInt(m[2], 10);
    return `${pitch}${oct + shiftOctaves}`;
  };

  // ===== Partitura =====
  const rawNotes = useMemo(() => arrayNotes, []);
  const notesToPlay = useMemo(() => {
    return rawNotes.map((n, idx) => {
      const nn = normalizeNote(n.note);
      return { ...n, note: nn, _idx: idx }; // ← sin 'key' (no PC)
    });
  }, [rawNotes]);

  // Rango visible 4 octavas: C2 a B5
  const visibleRange = useMemo(() => ([
    'C2','C#2','D2','D#2','E2','F2','F#2','G2','G#2','A2','A#2','B2',
    'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
    'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4',
    'C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5'
  ]), []);
  const whiteKeyNotes = useMemo(() => visibleRange.filter(n => !n.includes('#')), [visibleRange]);
  const blackKeyNotes = useMemo(() => visibleRange.filter(n => n.includes('#')), [visibleRange]);

  // Agrupar por time
  const groups = useMemo(() => {
    const map = new Map();
    notesToPlay.forEach((n, idx) => {
      const groupKey = n.time;
      const groupBeats = timeStrToBeats(n.time);
      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey).push({ ...n, index: idx, groupKey, groupBeats });
    });
    const keys = Array.from(map.keys()).sort((a, b) => timeStrToBeats(a) - timeStrToBeats(b));
    return keys.map(k => map.get(k));
  }, [notesToPlay]);

  // Fin de canción
  useEffect(() => {
    if (currentGroupIdx >= groups.length && groups.length > 0) setPhase('finished');
  }, [currentGroupIdx, groups.length]);

  // ===== Sampler (más notas base para mejor calidad/menos latencia)
useEffect(() => {
  const sampler = new Tone.Sampler({
    urls: { C4:'C4.mp3', E4:'E4.mp3', G4:'G4.mp3', C5:'C5.mp3' },
    release: 1,
    baseUrl: 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/',
    onload: () => {/* opcional: setIsSamplerReady(true) */}
  }).toDestination();
  samplerRef.current = sampler;
  return () => { try { sampler.dispose(); } catch {} };
}, []);



  // mano del grupo actual
  const currentHandByNote = useMemo(() => {
    const map = {};
    const g = groups[currentGroupIdx] || [];
    for (const n of g) map[n.note] = n.hand || 'R';
    return map;
  }, [groups, currentGroupIdx]);

  // --------- Capa 2: dibujo del teclado ----------
  const drawPiano = () => {
    const canvas = pianoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const overlayNotes = overlayPressedNotesRef.current;
    const whiteKeyWidth = canvasWidth / whiteKeyNotes.length;

    // BLANCAS
    whiteKeyNotes.forEach((note, i) => {
      const x = i * whiteKeyWidth;
      let fillColor = 'white';
      if (highlightedKeys[note]) fillColor = highlightedKeys[note];
      else if (overlayNotes.has(note)) fillColor = overlayKeyColor;

      ctx.fillStyle = fillColor;
      ctx.fillRect(x, canvasHeight - pianoHeight, whiteKeyWidth, pianoHeight);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, canvasHeight - pianoHeight, whiteKeyWidth, pianoHeight);

      const hand = currentHandByNote[note];
      const labelColor = hand ? handColors[hand] : (fillColor === 'white' ? 'black' : 'white');
      ctx.fillStyle = labelColor;
      ctx.font = '10px Arial';
      ctx.fillText(note, x + 4, canvasHeight - 10);
    });

    // NEGRAS (parsing robusto)
    blackKeyNotes.forEach((note) => {
      const base = note.replace('#','').slice(0,1); // 'C'..'B'
      const octave = note.match(/-?\d+$/)?.[0] ?? '';
      const idx = whiteKeyNotes.findIndex(k => k === base + octave);
      if (idx !== -1 && base !== 'E' && base !== 'B') {
        const w = canvasWidth / whiteKeyNotes.length;
        const x = (idx + 1) * w - w / 4;
        const bw = w / 2;

        let fillColor = 'black';
        if (highlightedKeys[note]) fillColor = highlightedKeys[note];
        else if (overlayNotes.has(note)) fillColor = overlayKeyColor;

        ctx.fillStyle = fillColor;
        ctx.fillRect(x, canvasHeight - pianoHeight, bw, pianoHeight * 0.6);

        const hand = currentHandByNote[note];
        const labelColor = hand ? handColors[hand] : 'white';
        ctx.fillStyle = labelColor;
        ctx.font = '10px Arial';
        ctx.fillText(note, x + 2, canvasHeight - pianoHeight + 15);
      }
    });
  };

  useEffect(() => { drawPiano(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedKeys, overlayVersion, currentGroupIdx, whiteKeyNotes, blackKeyNotes]);

  // --------- Capa 1: rejilla + notas ----------
  const addAlpha = (hex, alpha = 0.6) => {
    const c = hex.replace('#', '');
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const getNoteXAndWidth = (noteName, whiteKeyWidth) => {
    const isBlack = noteName.includes('#');
    if (!isBlack) {
      const iWhite = whiteKeyNotes.findIndex(k => k === noteName);
      if (iWhite === -1) return null;
      return { x: iWhite * whiteKeyWidth, width: whiteKeyWidth, isBlack: false };
    }
    const base = noteName.replace('#','').slice(0,1);
    const octave = noteName.match(/-?\d+$/)?.[0] ?? '';
    const idx = whiteKeyNotes.findIndex(k => k === base + octave);
    if (idx === -1) return null;
    const x = (idx + 1) * whiteKeyWidth - whiteKeyWidth / 4;
    return { x, width: whiteKeyWidth / 2, isBlack: true };
  };

  const getLineMeta = (key, desiredStopY, dt) => {
    const m = lineMetaRef.current[key] || { currentStopY: desiredStopY };
    m.currentStopY = Math.min(desiredStopY, m.currentStopY + fallSpeed * dt);
    lineMetaRef.current[key] = m;
    return m;
  };

  const drawGrid = (ctx, tNow, currentGroupStartSec, dt) => {
    const beatsPerMeasure = 4;
    const beatDur = 60 / bpm;
    const measureDur = beatsPerMeasure * beatDur;

    // Alinear al primer compás del primer grupo
    const firstGroupBeats = groups[0]?.[0]?.groupBeats ?? 0;
    const firstMeasureBeats = Math.floor(firstGroupBeats / 4) * 4;
    const firstMeasureTime = beatsToSeconds(firstMeasureBeats, bpm);

    const currentMeasureIdx = Math.floor((currentGroupStartSec - firstMeasureTime) / measureDur);

    const PAST_BUFFER_MEASURES = 4;
    const maxFutureSeconds = (canvasHeight - pianoHeight) / fallSpeed;
    const maxFutureTime = currentGroupStartSec + maxFutureSeconds;
    const lastVisibleMeasureIdx = Math.floor((maxFutureTime - firstMeasureTime) / measureDur);

    const firstIdx = Math.max(0, currentMeasureIdx - PAST_BUFFER_MEASURES);
    const lastIdx = Math.max(firstIdx, lastVisibleMeasureIdx);

    ctx.save();

    for (let mi = firstIdx; mi <= lastIdx; mi++) {
      const measureTime = firstMeasureTime + mi * measureDur;

      const yFalling = (tNow - measureTime) * fallSpeed;
      const delta = Math.max(0, measureTime - currentGroupStartSec);
      const desiredStopY = (canvasHeight - pianoHeight) - delta * fallSpeed;
      if (desiredStopY < 0) continue;

      const meta = getLineMeta(`M:${measureTime}`, desiredStopY, dt);
      const yClamped = Math.min(Math.max(yFalling, 0), meta.currentStopY);

      // compás
      ctx.strokeStyle = '#9aa0a6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, yClamped);
      ctx.lineTo(canvasWidth, yClamped);
      ctx.stroke();

      // beats internos
      for (let b = 1; b < beatsPerMeasure; b++) {
        const beatTime = measureTime + b * beatDur;
        const yFallingBeat = (tNow - beatTime) * fallSpeed;
        const deltaB = Math.max(0, beatTime - currentGroupStartSec);
        const desiredStopYBeat = (canvasHeight - pianoHeight) - deltaB * fallSpeed;
        if (desiredStopYBeat < 0) continue;

        const metaB = getLineMeta(`B:${beatTime}`, desiredStopYBeat, dt);
        const yClampedBeat = Math.min(Math.max(yFallingBeat, 0), metaB.currentStopY);

        ctx.strokeStyle = '#5f6368';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, yClampedBeat);
        ctx.lineTo(canvasWidth, yClampedBeat);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  const drawRoll = (ctx, dt) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const now = Tone.now();
    const tNow = (startTime == null) ? 0 : (now - startTime - pauseOffset);
    const whiteKeyWidth = canvasWidth / whiteKeyNotes.length;

    const currentGroup = groups[currentGroupIdx] || [];
    const currentGroupStartSec = currentGroup.length
      ? beatsToSeconds(currentGroup[0].groupBeats, bpm)
      : 0;

    drawGrid(ctx, tNow, currentGroupStartSec, dt);

    let currentGroupAllAtKey = true;

    groups.forEach((group, gIdx) => {
      group.forEach((note) => {
        const startSec = beatsToSeconds(timeStrToBeats(note.time), bpm);
        const duration = durationToSeconds(note.duration, bpm);
        const timeSinceStart = tNow - startSec;

        const geom = getNoteXAndWidth(note.note, whiteKeyWidth);
        if (!geom) return;
        const { x, width: noteWidth } = geom;

        const height = Math.max(duration * fallSpeed, 8);
        const atKeyY = (canvasHeight - pianoHeight - height);
        const yFalling = timeSinceStart * fallSpeed - height;

        const noteStartSec = beatsToSeconds(note.groupBeats, bpm);
        const delta = Math.max(0, noteStartSec - currentGroupStartSec);
        const desiredStopY = (canvasHeight - pianoHeight - height) - delta * fallSpeed;

        const m = noteMetaRef.current[note.index] || { currentStopY: desiredStopY, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
        m.currentStopY = Math.min(desiredStopY, m.currentStopY + fallSpeed * dt);
        noteMetaRef.current[note.index] = m;

        if (m.pressed && yFalling > canvasHeight) return; // ya salió

        let yClamped;
        if (m.pressed) {
          if (now < (m.holdUntil || 0)) {
            yClamped = Math.min(Math.max(yFalling, -height), atKeyY);
          } else {
            yClamped = yFalling; // cae detrás del piano
          }
        } else {
          yClamped = Math.min(Math.max(yFalling, -height), m.currentStopY);
        }

        if (gIdx === currentGroupIdx && !m.pressed) {
          const distToKey = atKeyY - yClamped;
          if (distToKey > STOP_TOLERANCE_PX) currentGroupAllAtKey = false;
        }

        const baseColor = handColors[note.hand] || '#888';
        const isFutureGroup = gIdx > currentGroupIdx;
        const fill = isFutureGroup ? addAlpha(baseColor, 0.55) : baseColor;

        const isFlashing = now < (m.flashUntil || 0);
        if (isFlashing) {
          ctx.save();
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 20;
          ctx.fillStyle = fill;
          ctx.fillRect(x, yClamped, noteWidth, height);
          ctx.restore();
        } else {
          ctx.fillStyle = fill;
          ctx.fillRect(x, yClamped, noteWidth, height);
        }

        // etiqueta (mejor contraste)
        ctx.fillStyle = '#eee';
        ctx.font = '10px Arial';
        ctx.fillText(note.note, x + 2, yClamped + height - 4);
      });
    });

    if (currentGroupAllAtKey && !noteReady) setNoteReady(true);
    if (!currentGroupAllAtKey && noteReady) setNoteReady(false);

    // ===== AUTOSIMULACIÓN: ilumina + suena + HOLD + avanza =====
    if (isPlaying && autoSim && (groups[currentGroupIdx] || []).length && currentGroupAllAtKey) {
      if (lastAutoAdvancedGroupRef.current !== currentGroupIdx) {
        const updates = {};
        for (const n of groups[currentGroupIdx]) {
          updates[n.note] = handColors[n.hand];
          // sonido
          samplerRef.current?.triggerAttackRelease(n.note, n.duration);

          // meta: pressed + hold
          const meta = noteMetaRef.current[n.index] || { currentStopY: 0, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
          meta.pressed = true;
          meta.pressedAt = now;
          meta.holdUntil = now + HOLD_AT_KEY_SEC;
          meta.flashUntil = now + 0.2;
          noteMetaRef.current[n.index] = meta;
        }
        setHighlightedKeys(prev => ({ ...prev, ...updates }));
        setTimeout(() => {
          setHighlightedKeys(prev => {
            const copy = { ...prev };
            for (const n of groups[currentGroupIdx]) {
              if (copy[n.note] === handColors[n.hand]) delete copy[n.note];
            }
            return copy;
          });
        }, 220);

        lastAutoAdvancedGroupRef.current = currentGroupIdx; // ← clave
        setCurrentGroupIdx(i => i + 1);
        setNoteReady(false);
      }
    }
  };

  // ===== Aceptación manual (modo práctica) =====
  const canAcceptHitNow = () => {
    if (!isPlaying) return false;
    if (noteReady) return true;
    const now = Tone.now();
    const tNow = (startTime == null) ? 0 : (now - startTime - pauseOffset);
    const currentGroup = groups[currentGroupIdx] || [];
    if (!currentGroup.length) return false;
    const startSec = beatsToSeconds(currentGroup[0].groupBeats, bpm);
    const timeToKey = (canvasHeight - pianoHeight) / fallSpeed;
    const timeSinceGroupStart = tNow - startSec;
    return (timeSinceGroupStart >= timeToKey - EARLY_HIT_WINDOW_SEC);
  };

  const isNoteAtKeyNow = (target) => {
    const now = Tone.now();
    const tNow = (startTime == null) ? 0 : (now - startTime - pauseOffset);
    const startSec = beatsToSeconds(timeStrToBeats(target.time), bpm);
    const duration = durationToSeconds(target.duration, bpm);

    const timeSinceStart = tNow - startSec;
    const height = Math.max(duration * fallSpeed, 8);
    const atKeyY = (canvasHeight - pianoHeight - height);
    const yFalling = timeSinceStart * fallSpeed - height;

    const currentGroup = groups[currentGroupIdx] || [];
    const currentGroupStartSec = currentGroup.length ? beatsToSeconds(currentGroup[0].groupBeats, bpm) : 0;
    const delta = Math.max(0, beatsToSeconds(target.groupBeats, bpm) - currentGroupStartSec);

    const desiredStopY = (canvasHeight - pianoHeight - height) - delta * fallSpeed;

    const m = noteMetaRef.current[target.index] || { currentStopY: desiredStopY, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
    const yClamped = m.pressed
      ? Math.min(Math.max(yFalling, -height), atKeyY)
      : Math.min(Math.max(yFalling, -height), m.currentStopY);

    const distToKey = atKeyY - yClamped;
    return distToKey <= STOP_TOLERANCE_PX;
  };

  // ===== Refs estables para MIDI =====
  const phaseRef = useRef(phase);
  const groupsRef = useRef(groups);
  const currentGroupIdxRef = useRef(currentGroupIdx);
  const noteReadyRef = useRef(noteReady);
  const startTimeRef = useRef(startTime);
  const pauseOffsetRef = useRef(pauseOffset);
  const bpmRef = useRef(bpm);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { groupsRef.current = groups; }, [groups]);
  useEffect(() => { currentGroupIdxRef.current = currentGroupIdx; }, [currentGroupIdx]);
  useEffect(() => { noteReadyRef.current = noteReady; }, [noteReady]);
  useEffect(() => { startTimeRef.current = startTime; }, [startTime]);
  useEffect(() => { pauseOffsetRef.current = pauseOffset; }, [pauseOffset]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  const isNoteNearKeyNowRef = (target) => {
    const now = Tone.now();
    const startT = startTimeRef.current;
    const paused = pauseOffsetRef.current;
    const bpmLocal = bpmRef.current;
    const fallSpeedLocal = 80 * (bpmLocal / 120);
    const tNow = (startT == null) ? 0 : (now - startT - paused);

    const startSec = beatsToSeconds(timeStrToBeats(target.time), bpmLocal);
    const duration = durationToSeconds(target.duration, bpmLocal);

    const timeSinceStart = tNow - startSec;
    const height = Math.max(duration * fallSpeedLocal, 8);
    const atKeyY = (canvasHeight - pianoHeight - height);
    const yFalling = timeSinceStart * fallSpeedLocal - height;

    const idx = currentGroupIdxRef.current;
    const groupsLocal = groupsRef.current;
    const currentGroup = groupsLocal[idx] || [];
    const currentGroupStartSec = currentGroup.length ? beatsToSeconds(currentGroup[0].groupBeats, bpmLocal) : 0;
    const delta = Math.max(0, beatsToSeconds(target.groupBeats, bpmLocal) - currentGroupStartSec);

    const m = noteMetaRef.current[target.index] || { currentStopY: (canvasHeight - pianoHeight - height) - delta * fallSpeedLocal, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
    const yClamped = m.pressed
      ? Math.min(Math.max(yFalling, -height), atKeyY)
      : Math.min(Math.max(yFalling, -height), m.currentStopY);

    const distToKey = atKeyY - yClamped;
    const earlyPixels = fallSpeedLocal * EARLY_HIT_WINDOW_SEC;
    return distToKey <= (STOP_TOLERANCE_PX + earlyPixels);
  };

  // ===== Acorde manual (modo práctica) =====
  const queueChordHit = (target) => {
    // sonido + highlight
    samplerRef.current?.triggerAttackRelease(target.note, target.duration);
    setHighlightedKeys(prev => ({ ...prev, [target.note]: handColors[target.hand] }));
    setTimeout(() => {
      setHighlightedKeys(prev => {
        const copy = { ...prev };
        if (copy[target.note] === handColors[target.hand]) delete copy[target.note];
        return copy;
      });
    }, 220);

    // flash (y pressed si autosim)
    const m = noteMetaRef.current[target.index] || { currentStopY: 0, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
    m.flashUntil = Tone.now() + 0.2;
    if (autoSim) {
      m.pressed = true;
      m.pressedAt = Tone.now();
      m.holdUntil = m.pressedAt + HOLD_AT_KEY_SEC;
    }
    noteMetaRef.current[target.index] = m;

    if (autoSim) return;

    // ==== Acumulación de acorde en práctica ====
    const now = Tone.now();
    const idx = currentGroupIdxRef.current;
    const groupsLocal = groupsRef.current;
    const currentGroup = groupsLocal[idx] || [];

    if (chordWindowStartRef.current && (now - chordWindowStartRef.current) > CHORD_WINDOW_SEC && chordHitsRef.current.size < currentGroup.length) {
      chordHitsRef.current.clear();
      chordWindowStartRef.current = null;
    }
    if (!chordWindowStartRef.current) chordWindowStartRef.current = now;

    if (!chordHitsRef.current.has(target.note)) {
      chordHitsRef.current.set(target.note, { time: now, target });
    }

    if (chordHitsRef.current.size >= currentGroup.length) {
      const times = Array.from(chordHitsRef.current.values()).map(v => v.time);
      const spread = Math.max(...times) - Math.min(...times);
      if (spread <= CHORD_WINDOW_SEC) {
        // ✅ Completa el acorde
        for (const n of currentGroup) {
          const meta = noteMetaRef.current[n.index] || { currentStopY: 0, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
          meta.pressed = true;
          meta.pressedAt = Tone.now();
          meta.holdUntil = meta.pressedAt + HOLD_AT_KEY_SEC;
          meta.flashUntil = Tone.now() + 0.2;
          noteMetaRef.current[n.index] = meta;
        }
        chordHitsRef.current.clear();
        chordWindowStartRef.current = null;
        setNoteReady(false);
        setCurrentGroupIdx(i => i + 1);
      } else {
        chordHitsRef.current.clear();
        chordWindowStartRef.current = null;
      }
    }
  };

  // ===== Web MIDI =====
  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setMidiStatus('❌ Web MIDI no disponible en este navegador');
      return;
    }
    let isMounted = true;
    navigator.requestMIDIAccess({ sysex: false }).then((access) => {
      if (!isMounted) return;
      midiAccessRef.current = access;
      for (let input of access.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
      }
      const anyConnected = access.inputs.size > 0;
      setMidiStatus(anyConnected ? '🎵 MIDI conectado' : 'MIDI no conectado');
      access.onstatechange = (event) => {
        if (event.port.type !== 'input') return;
        if (event.port.state === 'connected') {
          setMidiStatus(`🎵 MIDI conectado: ${event.port.name}`);
          const inp = access.inputs.get(event.port.id);
          if (inp) inp.onmidimessage = handleMIDIMessage;
        } else if (event.port.state === 'disconnected') {
          setMidiStatus('⚠️ MIDI desconectado');
        }
      };
    }).catch(() => {
      if (!isMounted) return;
      setMidiStatus('❌ Error al inicializar Web MIDI');
    });
    return () => {
      isMounted = false;
      const access = midiAccessRef.current;
      if (access) {
        for (let input of access.inputs.values()) input.onmidimessage = null;
        access.onstatechange = null;
      }
      midiAccessRef.current = null;
    };
  }, []);

  const midiToNoteName = (midi) => {
    const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const octave = Math.floor(midi / 12) - 1;
    const name = names[midi % 12];
    return `${name}${octave}`;
  };

  const handleMIDIMessage = (message) => {
    const [status, data1, data2] = message.data;
    const command = status & 0xf0;
    const noteNumber = data1;
    const velocity = data2;

    let noteName = midiToNoteName(noteNumber);
    noteName = shiftNoteOctave(noteName, midiOctaveShift);
    noteName = normalizeNote(noteName);

    // Overlay mientras esté presionada
    if (visibleRange.includes(noteName)) {
      overlayPressedNotesRef.current.add(noteName);
      bumpOverlay(); // repinta piano
    }

    if (command === 0x90 && velocity > 0) {
      if (midiActiveNotesRef.current.has(noteName)) return;
      midiActiveNotesRef.current.add(noteName);

      if (phaseRef.current !== 'playing') return;

      const groupsLocal = groupsRef.current;
      const idx = currentGroupIdxRef.current;
      const currentGroup = groupsLocal[idx];
      if (!currentGroup) return;

      const target = currentGroup.find(n => n.note === noteName);
      if (!target) return; // incorrecta: solo overlay

      const okGlobal = noteReadyRef.current || isNoteNearKeyNowRef(target);
      if (!okGlobal) return;

      queueChordHit(target);
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      if (overlayPressedNotesRef.current.has(noteName)) {
        overlayPressedNotesRef.current.delete(noteName);
        bumpOverlay();
      }
      if (midiActiveNotesRef.current.has(noteName)) {
        midiActiveNotesRef.current.delete(noteName);
      }
    }
  };

  // ===== Reconstruir progreso al saltar (flechas) =====
  const rebuildProgressForGroupIndex = (targetIdx) => {
    const groupsLocal = groups;
    const currentGroup = groupsLocal[targetIdx] || [];
    const currentStartSec = currentGroup.length ? beatsToSeconds(currentGroup[0].groupBeats, bpm) : 0;

    chordHitsRef.current.clear();
    chordWindowStartRef.current = null;

    for (let gi = 0; gi < groupsLocal.length; gi++) {
      const g = groupsLocal[gi];
      for (const n of g) {
        const noteStartSec = beatsToSeconds(n.groupBeats, bpm);
        const duration = durationToSeconds(n.duration, bpm);
        const height = Math.max(duration * fallSpeed, 8);
        const delta = Math.max(0, noteStartSec - currentStartSec);
        const desiredStopY = (canvasHeight - pianoHeight - height) - delta * fallSpeed;

        const meta = noteMetaRef.current[n.index] || { currentStopY: desiredStopY, pressed: false, flashUntil: 0, pressedAt: 0, holdUntil: 0 };
        meta.currentStopY = desiredStopY;
        meta.pressed = gi < targetIdx;     // anteriores como tocadas
        meta.pressedAt = 0;
        meta.holdUntil = 0;
        meta.flashUntil = 0;
        noteMetaRef.current[n.index] = meta;
      }
    }

    lastAutoAdvancedGroupRef.current = -1;
    setNoteReady(false);
  };

  // Flechas ← / →
  useEffect(() => {
    const handleArrowKeys = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      if (!(phase === 'playing' || phase === 'paused')) return;

      const sign = e.key === 'ArrowRight' ? 1 : -1;
      const curBeat = groups[currentGroupIdx]?.[0]?.groupBeats ?? 0;
      const targetBeat = Math.max(0, curBeat + sign * 1);

      let j = currentGroupIdx;
      while (j + 1 < groups.length && groups[j + 1][0].groupBeats <= targetBeat) j++;
      while (j > 0 && groups[j][0].groupBeats > targetBeat) j--;

      rebuildProgressForGroupIndex(j);
      setCurrentGroupIdx(j);
    };

    window.addEventListener('keydown', handleArrowKeys);
    return () => window.removeEventListener('keydown', handleArrowKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, currentGroupIdx, phase, bpm, fallSpeed]);

  // ===== Animación capa de notas =====
  useEffect(() => {
    if (!isPlaying) return;
    const canvas = rollCanvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const loop = () => {
      const now = Tone.now();
      const dt = lastNowRef.current == null ? 0 : (now - lastNowRef.current);
      lastNowRef.current = now;
      drawRoll(ctx, dt);
      raf = requestAnimationFrame(loop);
    };
    lastNowRef.current = Tone.now();
    loop();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, bpm, currentGroupIdx, noteReady, groups, pauseOffset, startTime, autoSim, fallSpeed, HOLD_AT_KEY_SEC]);

  // Cambios de BPM / HOLD → reajusta stops
  useEffect(() => {
    try { Tone.Transport.bpm.value = bpm; } catch {}
    if (phase === 'playing' || phase === 'paused') {
      rebuildProgressForGroupIndex(currentGroupIdx);
      lastNowRef.current = Tone.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  useEffect(() => {
    if (phase === 'playing' || phase === 'paused') {
      rebuildProgressForGroupIndex(currentGroupIdx);
      lastNowRef.current = Tone.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HOLD_AT_KEY_SEC]);

  // ===== Controles =====
  const startPlayback = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = bpm;
    setPhase('playing');
    setCurrentGroupIdx(0);
    setNoteReady(false);
    setHighlightedKeys({});
    overlayPressedNotesRef.current = new Set();
    setOverlayVersion(v => v + 1);
    midiActiveNotesRef.current = new Set();
    noteMetaRef.current = {};
    lineMetaRef.current = {};
    lastNowRef.current = null;
    chordHitsRef.current.clear();
    chordWindowStartRef.current = null;
    lastAutoAdvancedGroupRef.current = -1; // ← reset

    setPauseOffset(0);
    setStartTime(Tone.now());
  };

  const pausePlayback = () => {
    if (phase !== 'playing') return;
    pauseStartRef.current = Tone.now();
    setPhase('paused');
  };

  const resumePlayback = async () => {
    if (phase !== 'paused') return;
    await Tone.start();
    const pausedFor = Tone.now() - (pauseStartRef.current ?? Tone.now());
    setPauseOffset(prev => prev + pausedFor);
    lastNowRef.current = Tone.now();
    setPhase('playing');
  };

  const resetWhilePaused = () => {
    if (phase !== 'paused') return;
    setCurrentGroupIdx(0);
    rebuildProgressForGroupIndex(0);
    setNoteReady(false);
    setHighlightedKeys({});
    overlayPressedNotesRef.current = new Set();
    setOverlayVersion(v => v + 1);
    midiActiveNotesRef.current = new Set();
    noteMetaRef.current = {};
    lineMetaRef.current = {};
    lastNowRef.current = null;
    chordHitsRef.current.clear();
    chordWindowStartRef.current = null;
    lastAutoAdvancedGroupRef.current = -1; // ← reset

    setPauseOffset(0);
    setStartTime(Tone.now());
  };

  const onPrimary = () => {
    if (phase === 'idle' || phase === 'finished') startPlayback();
    else if (phase === 'playing') pausePlayback();
    else if (phase === 'paused') resumePlayback();
  };

  const onSecondary = () => {
    if (phase === 'paused') {
      resetWhilePaused();
    } else {
      setAutoSim(v => {
        lastAutoAdvancedGroupRef.current = -1; // ← reset al togglear
        return !v;
      });
    }
  };

  const primaryLabel = ({
    idle: 'Iniciar',
    playing: 'Pausar',
    paused: 'Continuar',
    finished: 'Iniciar de nuevo',
  })[phase];

  const secondaryLabel =
    phase === 'paused'
      ? 'Reiniciar (en pausa)'
      : (autoSim ? 'Parar simulación' : 'Activar simulación');

  // ===== Pantalla completa =====
  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">🎹 Synthesia (2 canvas): notas + teclado optimizado</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          type="number"
          label="BPM"
          value={bpm}
          onChange={(e) => setBpm(Math.max(20, Math.min(300, Number(e.target.value) || 0)))}
          inputProps={{ min: 20, max: 300, step: 1 }}
          size="small"
        />
        <TextField
          type="number"
          label="Octava MIDI"
          value={midiOctaveShift}
          onChange={(e) => setMidiOctaveShift(Math.max(-4, Math.min(4, Number(e.target.value) || 0)))}
          inputProps={{ min: -4, max: 4, step: 1 }}
          size="small"
        />
        <TextField
          type="number"
          label="Sensibilidad acorde (ms)"
          value={chordWindowMs}
          onChange={(e) => setChordWindowMs(Math.max(0, Math.min(500, Number(e.target.value) || 0)))}
          inputProps={{ min: 0, max: 500, step: 5 }}
          size="small"
        />
        <TextField
          type="number"
          label="Hold en línea (ms)"
          value={holdMs}
          onChange={(e) => setHoldMs(Math.max(0, Math.min(1000, Number(e.target.value) || 0)))}
          inputProps={{ min: 0, max: 1000, step: 10 }}
          size="small"
        />

        <Button variant="contained" onClick={onPrimary}>
          {primaryLabel}
        </Button>

        <Button
          variant="outlined"
          color={phase === 'paused' ? 'warning' : (autoSim ? 'error' : 'success')}
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 1, color: midiStatus.startsWith('🎵') ? 'lightgreen' : (midiStatus.startsWith('⚠️') ? 'orange' : 'gray') }}>
        {midiStatus} {midiOctaveShift ? `(shift: ${midiOctaveShift} oct.)` : ''} · Modo: {autoSim ? 'Simulación' : 'Práctica'}
      </Typography>

      <Box
        ref={containerRef}
        mt={1}
        sx={{ position: 'relative', width: '100%', maxWidth: `${canvasWidth}px` }}
      >
        {/* Capa 1: NOTAS + REJILLA */}
        <canvas
          ref={rollCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: '1px solid #999', backgroundColor: '#111', width: '100%', height: 'auto', display: 'block' }}
        />

        {/* Capa 2: TECLADO (encima) */}
        <canvas
          ref={pianoCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ position: 'absolute', inset: 0, width: '100%', height: 'auto', pointerEvents: 'none' }}
        />

        <Button
          size="small"
          variant="outlined"
          onClick={toggleFullscreen}
          sx={{ position: 'absolute', top: 8, right: 8, opacity: 0.9, zIndex: 5 }}
        >
          Pantalla completa
        </Button>
      </Box>

      <Typography sx={{ mt: 1 }} variant="body2" color={
        phase === 'playing' ? (noteReady ? 'success.main' : 'warning.main')
          : phase === 'paused' ? 'info.main'
            : phase === 'finished' ? 'secondary.main'
              : 'text.secondary'
      }>
        {phase === 'playing'
          ? (autoSim
            ? '▶ Simulación activa: se toca solo (con hold y caída detrás del piano). Usa ←/→ para moverte.'
            : (noteReady ? '👉 Toca TODAS las notas del grupo casi a la vez (con tu teclado MIDI).' : '⏳ Espera a que el grupo toque el teclado…'))
          : phase === 'paused'
            ? '⏸️ Pausado. Reinicia (en pausa) o continúa. También ←/→ para moverte.'
            : phase === 'finished'
              ? '✅ Finalizado. Pulsa “Iniciar de nuevo”.'
              : 'Listo para iniciar.'}
      </Typography>
    </Box>
  );
};

export default SynthesiaRoll;
