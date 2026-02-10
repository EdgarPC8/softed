import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Collapse,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import UploadFile from '@mui/icons-material/UploadFile';
import Download from '@mui/icons-material/Download';
import Save from '@mui/icons-material/Save';
import ContentPaste from '@mui/icons-material/ContentPaste';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import LibraryMusic from '@mui/icons-material/LibraryMusic';
import Refresh from '@mui/icons-material/Refresh';
import { usePianoSampler } from '../hooks/usePianoSampler';
import { useMIDI } from '../hooks/useMIDI';
import { usePianoPlayback } from '../hooks/usePianoPlayback';
import PianoRollFL from '../components/PianoRollFL';
import { CANVAS_WIDTH, VISIBLE_RANGE } from '../constants';
import {
  normalizeNote,
  shiftNoteOctave,
  secondsToMBT,
} from '../utils/noteUtils';
import { useAuth } from '../../../context/AuthContext';
import {
  getPianoSongs,
  getPianoSongById,
  createPianoSong,
  updatePianoSong,
  deletePianoSong,
} from '../../../api/pianoRequest';

const PC_KEYS = {
  a: 'C4', s: 'D4', d: 'E4', f: 'F4', g: 'G4', h: 'A4', j: 'B4',
  k: 'C5', l: 'D5', ';': 'E5',
  w: 'C#4', e: 'D#4', t: 'F#4', y: 'G#4', u: 'A#4', o: 'C#5', p: 'D#5',
};

const DEFAULT_DURATION = '8n';

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
  return { title, bpm, notes };
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return String(dateStr);
  }
}

export default function ModeCreateSong({ onBack }) {
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState(120);
  const [notes, setNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [midiOctaveShift, setMidiOctaveShift] = useState(0);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [songsFromDb, setSongsFromDb] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  /** 'editor' = canvas + panel | 'songsList' = pantalla para elegir canción de la BD */
  const [viewMode, setViewMode] = useState('editor');

  const overlayNotesRef = useRef(new Set());
  const recordStartRef = useRef(null);
  const { toast } = useAuth();
  const { playNote, samplerRef } = usePianoSampler();
  const { isPlaying, playheadBeats, play, stop } = usePianoPlayback(
    notes,
    bpm,
    samplerRef
  );

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
        });
        setTitle(payload.title);
        setBpm(payload.bpm);
        setNotes(payload.notes);
        setSelectedSongId(id);
        setViewMode('editor');
        toast({ info: { description: 'Canción cargada. Puedes editarla y reproducir.' } });
      } catch (err) {
        toast({ info: { description: err?.response?.data?.message || 'Error al cargar.' } });
      }
    },
    [toast]
  );

  const handleDeleteSong = useCallback(
    (id) => {
      toast({
        promise: deletePianoSong(id),
        successMessage: 'Canción eliminada.',
        errorMessage: 'Error al eliminar.',
        onSuccess: () => {
          loadSongsFromDb();
          if (selectedSongId === id) {
            setSelectedSongId(null);
            setTitle('');
            setBpm(120);
            setNotes([]);
          }
        },
      });
    },
    [toast, selectedSongId, loadSongsFromDb]
  );

  const handleNoteOn = useCallback(
    (noteName) => {
      const norm = normalizeNote(noteName);
      overlayNotesRef.current.add(norm);
      playNote(norm, 0.5);
      if (isRecording && recordStartRef.current !== null) {
        const elapsedSec = (Date.now() - recordStartRef.current) / 1000;
        const time = secondsToMBT(elapsedSec, bpm);
        setNotes((prev) => [...prev, { note: norm, time, duration: DEFAULT_DURATION, hand: 'R' }]);
      }
    },
    [playNote, isRecording, bpm]
  );

  const handleNoteOff = useCallback((noteName) => {
    overlayNotesRef.current.delete(normalizeNote(noteName));
  }, []);

  useMIDI(VISIBLE_RANGE, midiOctaveShift, handleNoteOn, handleNoteOff);

  const triggerNote = (noteName) => {
    playNote(noteName, 0.5);
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
          overlayNotesRef.current.add(normalizeNote(shifted));
          triggerNote(normalizeNote(shifted));
        }
      }
    };
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const noteName = PC_KEYS[key];
      if (noteName && VISIBLE_RANGE.includes(noteName)) {
        overlayNotesRef.current.delete(normalizeNote(shiftNoteOctave(noteName, midiOctaveShift)));
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

  const handleImportFile = (e) => {
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
          toast({ info: { description: 'El JSON debe ser un objeto con title, bpm y notes.' } });
          return;
        }
        const { title: t, bpm: b, notes: n } = normalizeSongPayload(data);
        setTitle(t);
        setBpm(b);
        setNotes(n);
        setSelectedSongId(null);
        toast({ info: { description: `Canción importada: ${n.length} notas.` } });
      } catch (err) {
        const msg =
          err instanceof SyntaxError
            ? 'JSON inválido (revisa el archivo).'
            : (err?.message || 'Error al importar.');
        toast({ info: { description: msg } });
      }
    };
    reader.onerror = () => toast({ info: { description: 'Error al leer el archivo.' } });
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handlePasteImport = () => {
    try {
      const text = pasteText.replace(/^\uFEFF/, '').trim();
      if (!text) {
        toast({ info: { description: 'Pega el contenido JSON.' } });
        return;
      }
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') {
        toast({ info: { description: 'El JSON debe ser un objeto con title, bpm y notes.' } });
        return;
      }
      const { title: t, bpm: b, notes: n } = normalizeSongPayload(data);
      setTitle(t);
      setBpm(b);
      setNotes(n);
      setSelectedSongId(null);
      setPasteText('');
      setPasteOpen(false);
      toast({ info: { description: `Canción importada: ${n.length} notas.` } });
    } catch (err) {
      const msg =
        err instanceof SyntaxError ? 'JSON inválido.' : (err?.message || 'Error al importar.');
      toast({ info: { description: msg } });
    }
  };

  const handleExportJson = () => {
    const payload = { title: title || 'Sin título', bpm, notes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'cancion').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ info: { description: 'Archivo JSON descargado.' } });
  };

  const handleSaveToDb = () => {
    const payload = normalizeSongPayload({ title, bpm, notes });
    if (payload.notes.length === 0) {
      toast({ info: { description: 'Añade notas antes de guardar.' } });
      return;
    }
    const promise = selectedSongId
      ? updatePianoSong(selectedSongId, payload)
      : createPianoSong(payload);
    toast({
      promise,
      successMessage: selectedSongId ? 'Canción actualizada.' : 'Canción guardada.',
      errorMessage: 'Error al guardar.',
      onSuccess: (res) => {
        if (!selectedSongId && res?.data?.id) setSelectedSongId(res.data.id);
        loadSongsFromDb();
      },
    });
  };

  const handlePlay = useCallback(async () => {
    try {
      await play();
    } catch (e) {
      const msg = e?.message || 'No se pudo reproducir.';
      toast({ info: { description: msg } });
    }
  }, [play, toast]);

  // Pantalla: elegir canción de la BD (tabla)
  if (viewMode === 'songsList') {
    return (
      <Box sx={{ p: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Canciones guardadas en la BD</Typography>
          <Button startIcon={<ArrowBack />} onClick={() => setViewMode('editor')} variant="outlined" size="small">
            Volver al editor
          </Button>
        </Box>
        <Button startIcon={<Refresh />} onClick={loadSongsFromDb} disabled={loadingSongs} sx={{ mb: 1, alignSelf: 'flex-start' }}>
          Actualizar lista
        </Button>
        {loadingSongs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ flex: 1, minHeight: 200 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell align="right">BPM</TableCell>
                  <TableCell align="right">Notas</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {songsFromDb.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No hay canciones guardadas. Guarda una desde el editor.
                    </TableCell>
                  </TableRow>
                ) : (
                  songsFromDb.map((row) => (
                    <TableRow key={row.id} hover selected={selectedSongId === row.id}>
                      <TableCell sx={{ maxWidth: 200 }} title={row.title}>
                        {row.title || '—'}
                      </TableCell>
                      <TableCell align="right">{row.bpm ?? '—'}</TableCell>
                      <TableCell align="right">{Array.isArray(row.notes) ? row.notes.length : 0}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(row.updatedAt || row.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Cargar en el editor y editar">
                          <IconButton color="primary" size="small" onClick={() => loadSongIntoEditor(row.id)}>
                            <PlayArrow />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" size="small" onClick={() => handleDeleteSong(row.id)}>
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  // Pantalla principal: editor (canvas + panel)
  return (
    <Box sx={{ display: 'flex', gap: 1, width: '100%', height: '100%', minHeight: 0, pl: 6 }}>
      {/* Panel izquierdo */}
      <Box sx={{ width: 172, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {onBack && (
          <Button size="small" startIcon={<ArrowBack />} onClick={onBack} sx={{ minWidth: 0, justifyContent: 'flex-start' }}>
            Volver
          </Button>
        )}
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Crear / Editar
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
          onChange={(e) => setBpm(Math.max(1, Math.min(999, Number(e.target.value) || 120)))}
          inputProps={{ min: 1, max: 999 }}
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
        />
        <TextField
          type="number"
          label="Oct. MIDI"
          value={midiOctaveShift}
          onChange={(e) => setMidiOctaveShift(Math.max(-4, Math.min(4, Number(e.target.value) || 0)))}
          inputProps={{ min: -4, max: 4 }}
          size="small"
          fullWidth
          sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
        />
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {!isRecording ? (
            <Button size="small" color="error" startIcon={<FiberManualRecord />} onClick={startRecording} variant="outlined" sx={{ py: 0.5 }}>
              Grabar
            </Button>
          ) : (
            <Button size="small" startIcon={<Stop />} onClick={stopRecording} variant="contained" color="error" sx={{ py: 0.5 }}>
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
          Notas: {notes.length}
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

        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Importar / Exportar
        </Typography>
        <Button size="small" startIcon={<UploadFile />} onClick={() => document.getElementById('piano-import-file').click()} fullWidth variant="outlined" sx={{ py: 0.5 }}>
          Cargar JSON
        </Button>
        <input id="piano-import-file" type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleImportFile} />
        <Button size="small" startIcon={<ContentPaste />} onClick={() => setPasteOpen((o) => !o)} fullWidth variant="outlined" sx={{ py: 0.5 }}>
          Pegar
        </Button>
        <Collapse in={pasteOpen}>
          <TextField
            multiline
            minRows={2}
            placeholder='{"title":"...","bpm":120,"notes":[]}'
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
        <Button size="small" startIcon={<Download />} onClick={handleExportJson} fullWidth variant="outlined" sx={{ py: 0.5 }}>
          Exportar
        </Button>
        <Button size="small" startIcon={<Save />} onClick={handleSaveToDb} fullWidth variant="contained" sx={{ py: 0.5 }}>
          {selectedSongId ? 'Guardar cambios' : 'Guardar en BD'}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          Teclas: A S D F G H J K L ; · W E T Y U O P
        </Typography>
      </Box>

      {/* Área rollo + Play/Stop */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Tooltip title="Reproducir">
            <span style={{ display: 'inline-flex' }}>
              <IconButton color="primary" onClick={handlePlay} disabled={notes.length === 0 || isPlaying} size="small">
                <PlayArrow />
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
            Arrastra notas · Borde der. duración · Clic der. o Delete eliminar
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minHeight: 360, overflow: 'auto' }}>
          <PianoRollFL
            notes={notes}
            onNotesChange={setNotes}
            bpm={bpm}
            width={CANVAS_WIDTH + 280}
            height={420}
            pxPerBeat={22}
            showGrid
            editable
            playheadBeats={playheadBeats}
          />
        </Box>
      </Box>
    </Box>
  );
}
