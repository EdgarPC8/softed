import React, { useCallback, useRef, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { usePianoSampler } from '../hooks/usePianoSampler';
import { useMIDI } from '../hooks/useMIDI';
import PianoCanvas from '../components/PianoCanvas';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PIANO_HEIGHT,
  VISIBLE_RANGE,
} from '../constants';
import { normalizeNote, shiftNoteOctave } from '../utils/noteUtils';

/** Mapeo teclado PC -> nota */
const PC_KEYS = {
  a: 'C4', s: 'D4', d: 'E4', f: 'F4', g: 'G4', h: 'A4', j: 'B4',
  k: 'C5', l: 'D5', ';': 'E5',
  w: 'C#4', e: 'D#4', t: 'F#4', y: 'G#4', u: 'A#4', o: 'C#5', p: 'D#5',
};

export default function ModeFree({ onBack }) {
  const pianoCanvasRef = useRef(null);
  const [highlightedKeys, setHighlightedKeys] = useState({});
  const [midiOctaveShift, setMidiOctaveShift] = useState(0);
  const [overlayVersion, setOverlayVersion] = useState(0);
  const overlayNotesRef = useRef(new Set());

  const { playNote } = usePianoSampler();

  const handleNoteOn = useCallback((noteName) => {
    overlayNotesRef.current.add(noteName);
    setOverlayVersion((v) => v + 1);
    playNote(noteName, 0.5);
  }, [playNote]);

  const handleNoteOff = useCallback((noteName) => {
    overlayNotesRef.current.delete(noteName);
    setOverlayVersion((v) => v + 1);
  }, []);

  useMIDI(VISIBLE_RANGE, midiOctaveShift, handleNoteOn, handleNoteOff);

  const triggerNote = (noteName, flash = true) => {
    playNote(noteName, 0.5);
    if (flash) {
      setHighlightedKeys((prev) => ({ ...prev, [noteName]: '#f39c12' }));
      setTimeout(() => {
        setHighlightedKeys((prev) => {
          const next = { ...prev };
          delete next[noteName];
          return next;
        });
      }, 150);
    }
  };

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      const noteName = PC_KEYS[key];
      if (noteName && VISIBLE_RANGE.includes(noteName)) {
        const shifted = shiftNoteOctave(noteName, midiOctaveShift);
        if (VISIBLE_RANGE.includes(normalizeNote(shifted))) {
          overlayNotesRef.current.add(normalizeNote(shifted));
          setOverlayVersion((v) => v + 1);
          triggerNote(normalizeNote(shifted), false);
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
  }, [midiOctaveShift]);

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%', pl: 8 }}>
      {/* Panel izquierdo: controles */}
      <Box sx={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {onBack && (
          <Button size="small" startIcon={<ArrowBack />} onClick={onBack}>
            Volver
          </Button>
        )}
        <Typography variant="subtitle2" color="text.secondary">Modo Libre</Typography>
        <TextField
          type="number"
          label="Octava MIDI"
          value={midiOctaveShift}
          onChange={(e) =>
            setMidiOctaveShift(Math.max(-4, Math.min(4, Number(e.target.value) || 0)))
          }
          inputProps={{ min: -4, max: 4 }}
          size="small"
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          PC: A S D F G H J K L ; (blancas) · W E T Y U O P (negras)
        </Typography>
      </Box>
      {/* Canvas centrado */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: CANVAS_WIDTH,
            minHeight: CANVAS_HEIGHT,
            backgroundColor: '#111',
            border: '1px solid #999',
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
  );
}
