import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Stop from '@mui/icons-material/Stop';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import UploadFile from '@mui/icons-material/UploadFile';
import Download from '@mui/icons-material/Download';
import Save from '@mui/icons-material/Save';
import ContentPaste from '@mui/icons-material/ContentPaste';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import LibraryMusic from '@mui/icons-material/LibraryMusic';
import Refresh from '@mui/icons-material/Refresh';
import { getExamplePianoSongEditorState } from '../../piano/examplePianoSong';
import { usePianoSampler } from '../../piano/hooks/usePianoSampler';
import { useMIDI } from '../../piano/hooks/useMIDI';
import { usePianoPlayback } from '../../piano/hooks/usePianoPlayback';
import { CANVAS_WIDTH, VISIBLE_RANGE } from '../../piano/constants';
import {
  normalizeNote,
  shiftNoteOctave,
  secondsToMBT,
  timeStrToBeats,
  durationToBeats,
} from '../../piano/utils/noteUtils';
import { useAuth } from '../../../context/AuthContext';
import {
  getPianoSongs,
  getPianoSongById,
  createPianoSong,
  updatePianoSong,
  deletePianoSong,
} from '../../../api/eddeli/pianoRequest';
import WebGLPianoRoll from '../components/WebGLPianoRoll';
import PianoCanvas from '../../piano/components/PianoCanvas';

const PC_KEYS = {
  a: 'C4',
  s: 'D4',
  d: 'E4',
  f: 'F4',
  g: 'G4',
  h: 'A4',
  j: 'B4',
  k: 'C5',
  l: 'D5',
  ';': 'E5',
  w: 'C#4',
  e: 'D#4',
  t: 'F#4',
  y: 'G#4',
  u: 'A#4',
  o: 'C#5',
  p: 'D#5',
};

const DEFAULT_DURATION = '8n';

const KEY_OPTIONS = [
  { id: 'C', label: 'Do mayor (C)' },
  { id: 'G', label: 'Sol mayor (G)' },
  { id: 'D', label: 'Re mayor (D)' },
  { id: 'A', label: 'La mayor (A)' },
  { id: 'E', label: 'Mi mayor (E)' },
  { id: 'F', label: 'Fa mayor (F)' },
  { id: 'Bb', label: 'Si♭ mayor (Bb)' },
  { id: 'Eb', label: 'Mi♭ mayor (Eb)' },
  { id: 'Am', label: 'La menor (Am)' },
  { id: 'Em', label: 'Mi menor (Em)' },
];

function getKeyInfo(keyId) {
  switch (keyId) {
    case 'C':
      return {
        scale: 'C D E F G A B',
        accidentals: 'Sin alteraciones (todas naturales). Las teclas negras se usan como notas de paso: C#, D#, F#, G#, A#.',
      };
    case 'G':
      return {
        scale: 'G A B C D E F#',
        accidentals: 'Una alteración: F#. Las teclas negras principales se ven como F#, C#, G#, D#.',
      };
    case 'D':
      return {
        scale: 'D E F# G A B C#',
        accidentals: 'Dos sostenidos: F#, C#. Las negras suelen escribirse como F#, G#, A#, C#, D#.',
      };
    case 'A':
      return {
        scale: 'A B C# D E F# G#',
        accidentals: 'Tres sostenidos: F#, C#, G#. Las negras se nombran casi siempre con sostenidos.',
      };
    case 'E':
      return {
        scale: 'E F# G# A B C# D#',
        accidentals: 'Cuatro sostenidos: F#, C#, G#, D#.',
      };
    case 'F':
      return {
        scale: 'F G A Bb C D E',
        accidentals: 'Un bemol: Bb. Las teclas negras se nombran más como bemoles (Bb, Eb, Ab...).',
      };
    case 'Bb':
      return {
        scale: 'Bb C D Eb F G A',
        accidentals: 'Dos bemoles: Bb, Eb. Negras principalmente Bb, Eb, Ab.',
      };
    case 'Eb':
      return {
        scale: 'Eb F G Ab Bb C D',
        accidentals: 'Tres bemoles: Bb, Eb, Ab.',
      };
    case 'Am':
      return {
        scale: 'A B C D E F G',
        accidentals: 'Relativa menor de C: sin alteraciones. Negras como notas de paso (C#, D#, F#, G#, A#).',
      };
    case 'Em':
      return {
        scale: 'E F# G A B C D',
        accidentals: 'Relativa menor de G: un sostenido (F#).',
      };
    default:
      return {
        scale: '—',
        accidentals: 'Selecciona una tonalidad para ver la escala y las notas negras.',
      };
  }
}

const CHORD_OPTIONS = [
  { id: 'C', label: 'C (Do mayor)' },
  { id: 'Cm', label: 'Cm (Do menor)' },
  { id: 'D', label: 'D (Re mayor)' },
  { id: 'Dm', label: 'Dm (Re menor)' },
  { id: 'E', label: 'E (Mi mayor)' },
  { id: 'Em', label: 'Em (Mi menor)' },
  { id: 'F', label: 'F (Fa mayor)' },
  { id: 'Fm', label: 'Fm (Fa menor)' },
  { id: 'G', label: 'G (Sol mayor)' },
  { id: 'Gm', label: 'Gm (Sol menor)' },
  { id: 'A', label: 'A (La mayor)' },
  { id: 'Am', label: 'Am (La menor)' },
  { id: 'B', label: 'B (Si mayor)' },
  { id: 'Bm', label: 'Bm (Si menor)' },
  { id: 'C7', label: 'C7 (Do séptima)' },
  { id: 'G7', label: 'G7 (Sol séptima)' },
  { id: 'D7', label: 'D7 (Re séptima)' },
  { id: 'A7', label: 'A7 (La séptima)' },
  { id: 'E7', label: 'E7 (Mi séptima)' },
];

function normalizeChordArrayFromImport(data) {
  if (!data || typeof data !== 'object') return [];
  if (Array.isArray(data.chordsByBar)) {
    return data.chordsByBar.map((x) => (x == null ? '' : String(x)));
  }
  if (typeof data.chords === 'string') {
    try {
      const p = JSON.parse(data.chords);
      return Array.isArray(p) ? p.map((x) => (x == null ? '' : String(x))) : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(data.chords)) {
    return data.chords.map((x) => (x == null ? '' : String(x)));
  }
  return [];
}

function normalizeSongPayload(data) {
  const rawTitle = typeof data?.title === 'string' ? data.title.trim() : '';
  const title = rawTitle || 'Sin título';
  const bpm = Math.max(1, Math.min(999, Number(data?.bpm) || 120));
  const notes = Array.isArray(data?.notes)
    ? data.notes
        .filter((n) => n && typeof n.note === 'string')
        .map((n) => ({
          note: String(n.note).trim(),
          time: typeof n.time === 'string' ? n.time : '0:0:0',
          duration: n.duration || DEFAULT_DURATION,
          hand: n.hand === 'L' ? 'L' : 'R',
        }))
    : [];
  const chordsByBar = Array.isArray(data?.chordsByBar)
    ? data.chordsByBar.map((x) => (x == null ? '' : String(x)))
    : normalizeChordArrayFromImport(data);
  const keySignature =
    typeof data?.keySignature === 'string' && data.keySignature.trim()
      ? data.keySignature.trim()
      : 'C';
  return { title, bpm, notes, chordsByBar, keySignature };
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return String(dateStr);
  }
}

function getInitialEditorState(developerMode) {
  if (developerMode) return getExamplePianoSongEditorState();
  return { title: '', bpm: 120, notes: [], chordsByBar: [], keySignature: 'C' };
}

export default function ModeProCreate({ onBack, developerMode = false }) {
  const init = getInitialEditorState(developerMode);
  const [title, setTitle] = useState(init.title);
  const [bpm, setBpm] = useState(init.bpm);
  const [notes, setNotes] = useState(init.notes);
  const [isRecording, setIsRecording] = useState(false);
  const [midiOctaveShift, setMidiOctaveShift] = useState(0);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [songsFromDb, setSongsFromDb] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [viewMode, setViewMode] = useState('editor');
  const [chordsByBar, setChordsByBar] = useState(init.chordsByBar);
  const [startBar, setStartBar] = useState(0);
  const [loopBars, setLoopBars] = useState(0);
  const [keySignature, setKeySignature] = useState(init.keySignature);
  const [highlightedKeys, setHighlightedKeys] = useState({});
  const [overlayVersion, setOverlayVersion] = useState(0);
  const [rollDims, setRollDims] = useState({
    width: CANVAS_WIDTH + 280,
    height: 420,
  });

  const overlayNotesRef = useRef(new Set());
  const recordStartRef = useRef(null);
  const pianoCanvasRef = useRef(null);
  const rollContainerRef = useRef(null);
  const { toast } = useAuth();
  const { playNote, samplerRef } = usePianoSampler();
  const { isPlaying, play, pause, stop } = usePianoPlayback(
    notes,
    bpm,
    samplerRef
  );

  const totalBeats = useMemo(() => {
    if (!notes.length) return 0;
    let maxEnd = 0;
    notes.forEach((n) => {
      const start = timeStrToBeats(n.time);
      const dur = durationToBeats(n.duration);
      if (!Number.isNaN(start)) {
        maxEnd = Math.max(maxEnd, start + dur);
      }
    });
    return maxEnd;
  }, [notes]);

  const numBars = useMemo(
    () => Math.max(1, Math.ceil((totalBeats || 0) / 4)),
    [totalBeats]
  );

  useEffect(() => {
    setChordsByBar((prev) => {
      const next = [...prev];
      if (next.length < numBars) {
        for (let i = next.length; i < numBars; i += 1) next[i] = '';
      } else if (next.length > numBars) {
        next.length = numBars;
      }
      return next;
    });
  }, [numBars]);

  const loadSongsFromDb = useCallback(async () => {
    setLoadingSongs(true);
    try {
      const res = await getPianoSongs();
      setSongsFromDb(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setSongsFromDb([]);
    } finally {
      setLoadingSongs(false);
    }
  }, []);

  useEffect(() => {
    loadSongsFromDb();
  }, [loadSongsFromDb]);

  useEffect(() => {
    if (viewMode !== 'editor') return;
    const el = rollContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      const w = Math.max(400, Math.floor(cr.width));
      const h = Math.max(160, Math.floor(cr.height));
      setRollDims((prev) =>
        prev.width === w && prev.height === h ? prev : { width: w, height: h }
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewMode]);

  const loadSongIntoEditor = useCallback(
    async (id) => {
      try {
        const res = await getPianoSongById(id);
        const d = res?.data;
        if (!d) return;
        let rawNotes = d.notes;
        if (typeof rawNotes === 'string') {
          try {
            rawNotes = JSON.parse(rawNotes);
          } catch {
            rawNotes = [];
          }
        }
        const payload = normalizeSongPayload({
          title: d.title,
          bpm: d.bpm,
          notes: Array.isArray(rawNotes) ? rawNotes : [],
          chordsByBar:
            typeof d.chords === 'string'
              ? (() => {
                  try {
                    const parsed = JSON.parse(d.chords);
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    return [];
                  }
                })()
              : Array.isArray(d.chords)
              ? d.chords
              : [],
          keySignature: d.keySignature,
        });
        setTitle(payload.title);
        setBpm(payload.bpm);
        setNotes(payload.notes);
        setChordsByBar(payload.chordsByBar || []);
        setKeySignature(payload.keySignature || 'C');
        setSelectedSongId(id);
        setViewMode('editor');
        toast({
          info: { description: 'Canción cargada en PianoPro. Puedes editarla y reproducir.' },
        });
      } catch (err) {
        toast({
          info: {
            description: err?.response?.data?.message || 'Error al cargar.',
          },
        });
      }
    },
    [toast]
  );

  const handleSaveToDb = useCallback(() => {
    const payload = normalizeSongPayload({
      title,
      bpm,
      notes,
      chordsByBar,
      keySignature,
    });
    if (payload.notes.length === 0) {
      toast({
        info: { description: 'Añade notas antes de guardar.' },
      });
      return;
    }
    const apiPayload = {
      title: payload.title,
      bpm: payload.bpm,
      notes: payload.notes,
      chords: JSON.stringify(payload.chordsByBar || []),
      keySignature: payload.keySignature,
    };
    const promise = selectedSongId
      ? updatePianoSong(selectedSongId, apiPayload)
      : createPianoSong(apiPayload);
    toast({
      promise,
      successMessage: selectedSongId ? 'Canción actualizada.' : 'Canción guardada.',
      errorMessage: 'Error al guardar.',
      onSuccess: (res) => {
        if (!selectedSongId && res?.data?.id) setSelectedSongId(res.data.id);
        loadSongsFromDb();
      },
    });
  }, [title, bpm, notes, chordsByBar, keySignature, selectedSongId, toast, loadSongsFromDb]);

  const applyImportedPayload = useCallback((payload) => {
    setTitle(payload.title);
    setBpm(payload.bpm);
    setNotes(payload.notes);
    setChordsByBar(payload.chordsByBar || []);
    setKeySignature(payload.keySignature || 'C');
    setSelectedSongId(null);
  }, []);

  const loadExampleSong = useCallback(() => {
    const p = getExamplePianoSongEditorState();
    applyImportedPayload(p);
    toast({
      info: {
        description:
          'Demo arrayMusic cargada. Úsala para probar el canvas; «Guardar en BD» si quieres persistir.',
      },
    });
  }, [applyImportedPayload, toast]);

  const handleImportFile = useCallback(
    (e) => {
      const file = e?.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          let text = reader.result;
          if (typeof text !== 'string') {
            toast({ info: { description: 'No se pudo leer el archivo.' } });
            return;
          }
          text = text.replace(/^\uFEFF/, '');
          const data = JSON.parse(text);
          if (!data || typeof data !== 'object') {
            toast({
              info: {
                description: 'El JSON debe ser un objeto con title, bpm, notes (y opcional chordsByBar, keySignature).',
              },
            });
            return;
          }
          const payload = normalizeSongPayload(data);
          applyImportedPayload(payload);
          toast({
            info: {
              description: `Importado: ${payload.notes.length} notas, ${payload.chordsByBar.filter(Boolean).length} acordes.`,
            },
          });
        } catch (err) {
          const msg =
            err instanceof SyntaxError
              ? 'JSON inválido (revisa el archivo).'
              : err?.message || 'Error al importar.';
          toast({ info: { description: msg } });
        }
      };
      reader.onerror = () => toast({ info: { description: 'Error al leer el archivo.' } });
      reader.readAsText(file, 'UTF-8');
      e.target.value = '';
    },
    [toast, applyImportedPayload]
  );

  const handlePasteImport = useCallback(() => {
    try {
      const text = pasteText.replace(/^\uFEFF/, '').trim();
      if (!text) {
        toast({ info: { description: 'Pega el contenido JSON.' } });
        return;
      }
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') {
        toast({ info: { description: 'JSON inválido.' } });
        return;
      }
      const payload = normalizeSongPayload(data);
      applyImportedPayload(payload);
      setPasteText('');
      setPasteOpen(false);
      toast({
        info: {
          description: `Importado: ${payload.notes.length} notas.`,
        },
      });
    } catch (err) {
      const msg =
        err instanceof SyntaxError ? 'JSON inválido.' : err?.message || 'Error al importar.';
      toast({ info: { description: msg } });
    }
  }, [pasteText, toast, applyImportedPayload]);

  const handleExportJson = useCallback(() => {
    const payload = {
      title: title || 'Sin título',
      bpm,
      notes,
      chordsByBar,
      keySignature,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'cancion_pro').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ info: { description: 'Archivo JSON descargado.' } });
  }, [title, bpm, notes, chordsByBar, keySignature, toast]);

  const handleNoteOn = useCallback(
    (noteName) => {
      const norm = normalizeNote(noteName);
      overlayNotesRef.current.add(norm);
      setOverlayVersion((v) => v + 1);
      playNote(norm, 0.5);
      if (isRecording && recordStartRef.current !== null) {
        const elapsedSec = (Date.now() - recordStartRef.current) / 1000;
        const time = secondsToMBT(elapsedSec, bpm);
        setNotes((prev) => [
          ...prev,
          { note: norm, time, duration: DEFAULT_DURATION, hand: 'R' },
        ]);
      }
    },
    [playNote, isRecording, bpm]
  );

  const handleNoteOff = useCallback((noteName) => {
    overlayNotesRef.current.delete(normalizeNote(noteName));
    setOverlayVersion((v) => v + 1);
  }, []);

  useMIDI(VISIBLE_RANGE, midiOctaveShift, handleNoteOn, handleNoteOff);

  const triggerNote = (noteName) => {
    playNote(noteName, 0.5);
    // Pequeño destello en la tecla del piano visual
    setHighlightedKeys((prev) => ({ ...prev, [noteName]: '#f39c12' }));
    setTimeout(() => {
      setHighlightedKeys((prev) => {
        const next = { ...prev };
        delete next[noteName];
        return next;
      });
    }, 150);
    if (isRecording && recordStartRef.current !== null) {
      const elapsedSec = (Date.now() - recordStartRef.current) / 1000;
      const time = secondsToMBT(elapsedSec, bpm);
      setNotes((prev) => [
        ...prev,
        { note: normalizeNote(noteName), time, duration: DEFAULT_DURATION, hand: 'R' },
      ]);
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      const noteName = PC_KEYS[key];
      if (noteName && VISIBLE_RANGE.includes(noteName)) {
        const shifted = shiftNoteOctave(noteName, midiOctaveShift);
        if (VISIBLE_RANGE.includes(normalizeNote(shifted))) {
          const n = normalizeNote(shifted);
          overlayNotesRef.current.add(n);
          setOverlayVersion((v) => v + 1);
          triggerNote(n);
        }
      }
    };
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const noteName = PC_KEYS[key];
      if (noteName && VISIBLE_RANGE.includes(noteName)) {
        const shifted = shiftNoteOctave(noteName, midiOctaveShift);
        overlayNotesRef.current.delete(normalizeNote(shifted));
        setOverlayVersion((v) => v + 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [midiOctaveShift, isRecording, bpm]);

  const startRecording = () => {
    recordStartRef.current = Date.now();
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    recordStartRef.current = null;
  };

  const clearNotes = () => {
    setNotes([]);
    setSelectedSongId(null);
  };

  const handlePlay = useCallback(async () => {
    try {
      const start = Math.max(0, Math.floor(startBar || 0));
      const loop = Math.max(0, Math.floor(loopBars || 0));
      await play({
        startBar: start,
        loopBars: loop > 0 ? loop : null,
      });
    } catch (e) {
      const msg = e?.message || 'No se pudo reproducir.';
      toast({ info: { description: msg } });
    }
  }, [play, toast, startBar, loopBars]);

  // Vista: lista de canciones BD (similar al editor clásico, pero Pro)
  if (viewMode === 'songsList') {
    return (
      <Box
        sx={{
          p: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6">Canciones guardadas en la BD (PianoPro)</Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => setViewMode('editor')}
            variant="outlined"
            size="small"
          >
            Volver al editor Pro
          </Button>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={loadSongsFromDb}
          disabled={loadingSongs}
          sx={{ mb: 1, alignSelf: 'flex-start' }}
        >
          Actualizar lista
        </Button>
        {/* Para mantener esto ligero, solo mostramos la tabla básica y cargamos en el editor Pro. */}
        {loadingSongs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Cargando canciones…</Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>Título</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>BPM</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px' }}>Notas</th>
                  <th style={{ textAlign: 'center', padding: '4px 8px' }}>Usar</th>
                </tr>
              </thead>
              <tbody>
                {songsFromDb.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '12px 8px', color: '#888' }}>
                      No hay canciones guardadas. Crea una en el editor clásico o Pro.
                    </td>
                  </tr>
                ) : (
                  songsFromDb.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: selectedSongId === row.id ? 'rgba(155, 81, 224, 0.08)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '4px 8px', maxWidth: 200 }} title={row.title}>
                        {row.title || '—'}
                      </td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{row.bpm ?? '—'}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                        {Array.isArray(row.notes) ? row.notes.length : 0}
                      </td>
                      <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                        <Button
                          size="small"
                          startIcon={<PlayArrow />}
                          onClick={() => loadSongIntoEditor(row.id)}
                          variant={selectedSongId === row.id ? 'contained' : 'outlined'}
                        >
                          Usar en Pro
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        width: '100%',
        height: '100%',
        pl: { xs: 1, sm: 2, md: 6 },
        pr: { xs: 1, sm: 2 },
        pt: 1,
        pb: 1,
        boxSizing: 'border-box',
        overflow: 'hidden',
        alignItems: 'stretch',
      }}
    >
      {/* Panel izquierdo (controles) */}
      <Box
        sx={{
          width: 200,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          overflowY: 'auto',
          minHeight: 0,
          maxHeight: '100%',
          pr: 0.5,
        }}
      >
        {onBack && (
          <Button
            size="small"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ minWidth: 0, justifyContent: 'flex-start' }}
          >
            Volver
          </Button>
        )}
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {developerMode ? 'Piano Pro · Desarrollador' : 'Piano Pro · Crear'}
        </Typography>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
          placeholder="Nombre"
          sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
        />
        <TextField
          type="number"
          label="BPM"
          value={bpm}
          onChange={(e) =>
            setBpm(Math.max(1, Math.min(999, Number(e.target.value) || 120)))
          }
          inputProps={{ min: 1, max: 999 }}
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
        />
        <TextField
          type="number"
          label="Oct. MIDI"
          value={midiOctaveShift}
          onChange={(e) =>
            setMidiOctaveShift(
              Math.max(-4, Math.min(4, Number(e.target.value) || 0))
            )
          }
          inputProps={{ min: -4, max: 4 }}
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
        />
        <TextField
          select
          label="Tonalidad"
          value={keySignature}
          onChange={(e) => setKeySignature(e.target.value)}
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
        >
          {KEY_OPTIONS.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Escala de la tonalidad
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {getKeyInfo(keySignature).scale}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            {getKeyInfo(keySignature).accidentals}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {!isRecording ? (
            <Button
              size="small"
              color="error"
              startIcon={<FiberManualRecord />}
              onClick={startRecording}
              variant="outlined"
              sx={{ py: 0.5 }}
            >
              Grabar
            </Button>
          ) : (
            <Button
              size="small"
              startIcon={<Stop />}
              onClick={stopRecording}
              variant="contained"
              color="error"
              sx={{ py: 0.5 }}
            >
              Parar
            </Button>
          )}
          {notes.length > 0 && (
            <IconButton size="small" onClick={clearNotes} title="Borrar todas">
              <DeleteOutline fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          Notas: {notes.length} · Compases: {numBars}
        </Typography>

        <Button
          size="small"
          startIcon={<LibraryMusic />}
          onClick={() => {
            setViewMode('songsList');
            loadSongsFromDb();
          }}
          fullWidth
          variant="outlined"
          sx={{ py: 0.5 }}
        >
          Ver canciones de la BD
        </Button>
        {developerMode && (
          <>
            <Button
              size="small"
              onClick={loadExampleSong}
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ py: 0.5 }}
            >
              Cargar demo (arrayMusic)
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              Modo desarrollador: partitura de ejemplo para probar el rollo WebGL con muchas notas.
            </Typography>
          </>
        )}

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <TextField
            type="number"
            label="Compás inicio"
            value={startBar}
            onChange={(e) => {
              const v = Math.max(0, Math.min(numBars - 1, Number(e.target.value) || 0));
              setStartBar(v);
            }}
            inputProps={{ min: 0, max: Math.max(0, numBars - 1) }}
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
          />
          <TextField
            type="number"
            label="Bucle (compases)"
            value={loopBars}
            onChange={(e) => {
              const v = Math.max(0, Math.min(numBars, Number(e.target.value) || 0));
              setLoopBars(v);
            }}
            inputProps={{ min: 0, max: numBars }}
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
          />
        </Box>

        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Acordes por compás
          </Typography>
          <Box
            sx={{
              maxHeight: 120,
              overflowY: 'auto',
              mt: 0.5,
              pr: 0.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.25,
            }}
          >
            {Array.from({ length: numBars }).map((_, barIdx) => (
              <Autocomplete
                key={barIdx}
                options={CHORD_OPTIONS}
                size="small"
                fullWidth
                value={
                  CHORD_OPTIONS.find((opt) => opt.id === chordsByBar[barIdx]) || null
                }
                onChange={(_, newValue) => {
                  setChordsByBar((prev) => {
                    const next = [...prev];
                    next[barIdx] = newValue?.id || '';
                    return next;
                  });
                }}
                getOptionLabel={(opt) => (opt?.label ? opt.label : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Compás ${barIdx + 1}`}
                    InputProps={{
                      ...params.InputProps,
                      style: { fontSize: '0.7rem', paddingTop: 2, paddingBottom: 2 },
                    }}
                  />
                )}
              />
            ))}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Importar / Exportar
        </Typography>
        <Button
          size="small"
          startIcon={<UploadFile />}
          onClick={() => document.getElementById('piano-pro-import-file')?.click()}
          fullWidth
          variant="outlined"
          sx={{ py: 0.5 }}
        >
          Cargar JSON
        </Button>
        <input
          id="piano-pro-import-file"
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />
        <Button
          size="small"
          startIcon={<ContentPaste />}
          onClick={() => setPasteOpen((o) => !o)}
          fullWidth
          variant="outlined"
          sx={{ py: 0.5 }}
        >
          Pegar JSON
        </Button>
        <Collapse in={pasteOpen}>
          <TextField
            multiline
            minRows={2}
            placeholder='{"title":"...","bpm":120,"notes":[],"chordsByBar":[],"keySignature":"C"}'
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            size="small"
            fullWidth
            sx={{ mt: 0.5, '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
          />
          <Button size="small" onClick={handlePasteImport} sx={{ mt: 0.5 }}>
            Importar
          </Button>
        </Collapse>
        <Button
          size="small"
          startIcon={<Download />}
          onClick={handleExportJson}
          fullWidth
          variant="outlined"
          sx={{ py: 0.5 }}
        >
          Exportar JSON
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          Tras importar JSON, usa «Guardar en BD» para persistir en el servidor.
        </Typography>
        <Button
          size="small"
          startIcon={<Save />}
          onClick={handleSaveToDb}
          fullWidth
          variant="contained"
          sx={{ py: 0.5, mt: 0.5 }}
        >
          {selectedSongId ? 'Guardar cambios' : 'Guardar en BD'}
        </Button>
      </Box>

      {/* Área WebGL + Play/Stop/Pause */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Tooltip title="Reproducir (desde compás / bucle)">
            <span style={{ display: 'inline-flex' }}>
              <IconButton
                color="primary"
                onClick={handlePlay}
                disabled={notes.length === 0 || isPlaying}
                size="small"
              >
                <PlayArrow />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Pausar">
            <span style={{ display: 'inline-flex' }}>
              <IconButton onClick={pause} disabled={!isPlaying} size="small">
                <Pause />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Parar">
            <span style={{ display: 'inline-flex' }}>
              <IconButton onClick={stop} disabled={!isPlaying} size="small">
                <Stop />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            Rollo WebGL (rejilla, notas, playhead).
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box ref={rollContainerRef} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <WebGLPianoRoll
              notes={notes}
              bpm={bpm}
              isPlaying={isPlaying}
              chordsByBar={chordsByBar}
              width={rollDims.width}
              height={rollDims.height}
            />
          </Box>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: CANVAS_WIDTH,
                minHeight: 140,
              }}
            >
              <PianoCanvas
                pianoCanvasRef={pianoCanvasRef}
                highlightedKeys={highlightedKeys}
                overlayNotes={overlayNotesRef.current}
                currentHandByNote={{}}
                overlayVersion={overlayVersion}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

