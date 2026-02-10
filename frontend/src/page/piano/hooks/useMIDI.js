import { useEffect, useRef, useState } from 'react';
import { midiToNoteName, normalizeNote, shiftNoteOctave } from '../utils/noteUtils';

export function useMIDI(visibleRange, midiOctaveShift, onNoteOn, onNoteOff) {
  const [status, setStatus] = useState('MIDI no conectado');
  const midiAccessRef = useRef(null);
  const overlayNotesRef = useRef(new Set());

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setStatus('❌ Web MIDI no disponible');
      return;
    }
    let isMounted = true;
    navigator
      .requestMIDIAccess({ sysex: false })
      .then((access) => {
        if (!isMounted) return;
        midiAccessRef.current = access;
        const handler = (msg) => {
          const [statusByte, data1, data2] = msg.data;
          const cmd = statusByte & 0xf0;
          const noteNumber = data1;
          const velocity = data2;

          let noteName = midiToNoteName(noteNumber);
          noteName = shiftNoteOctave(noteName, midiOctaveShift);
          noteName = normalizeNote(noteName);

          if (visibleRange && visibleRange.includes(noteName)) {
            if (cmd === 0x90 && velocity > 0) {
              overlayNotesRef.current.add(noteName);
              onNoteOn?.(noteName);
            } else if (cmd === 0x80 || (cmd === 0x90 && velocity === 0)) {
              overlayNotesRef.current.delete(noteName);
              onNoteOff?.(noteName);
            }
          }
        };
        for (const input of access.inputs.values()) {
          input.onmidimessage = handler;
        }
        setStatus(access.inputs.size > 0 ? '🎵 MIDI conectado' : 'MIDI no conectado');
        access.onstatechange = (e) => {
          if (e.port.type !== 'input') return;
          if (e.port.state === 'connected') {
            setStatus(`🎵 MIDI: ${e.port.name}`);
            const inp = access.inputs.get(e.port.id);
            if (inp) inp.onmidimessage = handler;
          } else if (e.port.state === 'disconnected') {
            setStatus('⚠️ MIDI desconectado');
          }
        };
      })
      .catch(() => {
        if (isMounted) setStatus('❌ Error al conectar MIDI');
      });
    return () => {
      isMounted = false;
      const access = midiAccessRef.current;
      if (access) {
        for (const input of access.inputs.values()) input.onmidimessage = null;
        access.onstatechange = null;
      }
    };
  }, [midiOctaveShift, visibleRange, onNoteOn, onNoteOff]);

  return { status, overlayNotesRef };
}
