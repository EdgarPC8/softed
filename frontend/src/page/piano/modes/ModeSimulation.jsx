import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Refresh from '@mui/icons-material/Refresh';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { useAuth } from '../../../context/AuthContext';
import { getPianoSongs, getPianoSongById } from '../../../api/eddeli/pianoRequest';
import SynthesiaRoll from '../midi';

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

/** Modo Simulación: eliges canción de la BD y se toca sola mientras ves las notas caer */
export default function ModeSimulation({ onBack }) {
  const { toast } = useAuth();
  const [songsFromDb, setSongsFromDb] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedBpm, setSelectedBpm] = useState(120);
  const [selectedNotes, setSelectedNotes] = useState([]);

  const loadSongsFromDb = useCallback(async () => {
    setLoadingSongs(true);
    try {
      const res = await getPianoSongs();
      setSongsFromDb(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setSongsFromDb([]);
      toast({ info: { description: 'Error al cargar canciones.' } });
    } finally {
      setLoadingSongs(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSongsFromDb();
  }, [loadSongsFromDb]);

  const handleLoadSong = useCallback(
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
        setSelectedSongId(id);
        setSelectedTitle(payload.title);
        setSelectedBpm(payload.bpm);
        setSelectedNotes(payload.notes);
        toast({ info: { description: `Simulando: ${payload.title}` } });
      } catch (err) {
        toast({ info: { description: err?.response?.data?.message || 'Error al cargar canción.' } });
      }
    },
    [toast]
  );

  return (
    <Box sx={{ p: 2, width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onBack && (
            <Button startIcon={<ArrowBack />} size="small" onClick={onBack} variant="outlined">
              Volver
            </Button>
          )}
          <Typography variant="h6">Modo simulación</Typography>
          {selectedTitle && (
            <Typography variant="body2" color="text.secondary">
              Canción: <strong>{selectedTitle}</strong> · BPM: {selectedBpm}
            </Typography>
          )}
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={loadSongsFromDb}
          disabled={loadingSongs}
          size="small"
          variant="outlined"
        >
          Actualizar canciones
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
        <Box sx={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Canciones guardadas en la BD
          </Typography>
          {loadingSongs ? (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ flex: 1, minHeight: 0 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell align="right">BPM</TableCell>
                    <TableCell align="right">Notas</TableCell>
                    <TableCell align="center">Simular</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {songsFromDb.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No hay canciones guardadas. Crea una en el modo Editor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    songsFromDb.map((row) => (
                      <TableRow key={row.id} hover selected={selectedSongId === row.id}>
                        <TableCell sx={{ maxWidth: 160 }} title={row.title}>
                          {row.title || '—'}
                        </TableCell>
                        <TableCell align="right">{row.bpm ?? '—'}</TableCell>
                        <TableCell align="right">
                          {Array.isArray(row.notes) ? row.notes.length : 0}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            startIcon={<PlayArrow />}
                            onClick={() => handleLoadSong(row.id)}
                            variant={selectedSongId === row.id ? 'contained' : 'outlined'}
                          >
                            Usar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
          {selectedNotes.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                color: 'text.secondary',
                textAlign: 'center',
                px: 4,
              }}
            >
              <Typography variant="body2">
                Elige una canción de la tabla para verla caer y escucharla en modo simulación.
              </Typography>
            </Box>
          ) : (
            <SynthesiaRoll mode="simulation" notes={selectedNotes} bpm={selectedBpm} onBack={onBack} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
