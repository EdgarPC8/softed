import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Refresh from '@mui/icons-material/Refresh';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { useAuth } from '../../../../context/AuthContext';
import { getPianoSongs, getPianoSongById } from '../../../../api/musica/pianoRequest';
import SynthesiaRoll from '../../../piano/midi';

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

/** Vista Pro de práctica: misma canción de la BD, solo cambia el rollo (WebGL). */
export default function ModeProPractice({ onBack }) {
  const { toast } = useAuth();
  const [songsFromDb, setSongsFromDb] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedBpm, setSelectedBpm] = useState(120);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [songsDialogOpen, setSongsDialogOpen] = useState(false);

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
        toast({ info: { description: `Modo Pro · practicando: ${payload.title}` } });
      } catch (err) {
        toast({ info: { description: err?.response?.data?.message || 'Error al cargar canción.' } });
      }
    },
    [toast]
  );

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          p: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {onBack && (
              <Button startIcon={<ArrowBack />} size="small" onClick={onBack} variant="outlined">
                Volver
              </Button>
            )}
            <Typography variant="h6">Piano Pro · Práctica</Typography>
            {selectedTitle && (
              <Typography variant="body2" color="text.secondary">
                Canción: <strong>{selectedTitle}</strong> · BPM: {selectedBpm}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Refresh />}
              onClick={loadSongsFromDb}
              disabled={loadingSongs}
              size="small"
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button
              startIcon={<PlayArrow />}
              onClick={() => setSongsDialogOpen(true)}
              size="small"
              variant="contained"
            >
              Elegir canción
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
          {selectedNotes.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                textAlign: 'center',
                px: 4,
              }}
            >
              <Typography variant="body2">
                Pulsa «Elegir canción» para cargar una partitura guardada en la BD y practicarla con teclado o MIDI.
              </Typography>
            </Box>
          ) : (
            <SynthesiaRoll
              mode="practice"
              notes={selectedNotes}
              bpm={selectedBpm}
              onBack={onBack}
            />
          )}
        </Box>
      </Box>

      <Dialog
        open={songsDialogOpen}
        onClose={() => setSongsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Canciones guardadas en la BD</DialogTitle>
        <DialogContent dividers>
          {loadingSongs ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell align="right">BPM</TableCell>
                    <TableCell align="right">Notas</TableCell>
                    <TableCell align="center">Usar</TableCell>
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
                        <TableCell sx={{ maxWidth: 220 }} title={row.title}>
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
                            onClick={() => {
                              handleLoadSong(row.id);
                              setSongsDialogOpen(false);
                            }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSongsDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

