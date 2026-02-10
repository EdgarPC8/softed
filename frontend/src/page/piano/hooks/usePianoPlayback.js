import { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import {
  normalizeNote,
  timeStrToBeats,
  durationToBeats,
  beatToMBT,
} from '../utils/noteUtils';

/**
 * Reproducción de notas con Tone.Transport.
 * Sigue el mismo patrón que PianoRoll.jsx para asegurar que suene.
 */
export function usePianoPlayback(notes, bpm, samplerRef) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadBeats, setPlayheadBeats] = useState(null);

  const stop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
    setIsPlaying(false);
    setPlayheadBeats(null);
  }, []);

  const play = useCallback(async () => {
    if (!samplerRef?.current) {
      throw new Error('El piano aún no está listo. Haz clic de nuevo en Reproducir.');
    }
    if (!notes?.length) {
      throw new Error('No hay notas para reproducir.');
    }

    await Tone.start();

    Tone.Transport.cancel();
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.position = 0;

    const sampler = samplerRef.current;
    const sorted = [...notes]
      .filter((n) => n?.note != null && !Number.isNaN(timeStrToBeats(n.time)))
      .sort((a, b) => timeStrToBeats(a.time) - timeStrToBeats(b.time));

    if (sorted.length === 0) {
      throw new Error('No hay notas válidas (revisa tiempo en formato compás:beat:semibreve).');
    }

    // Igual que PianoRoll: schedule(callback, note.time) y triggerAttackRelease(note, duration, time)
    const timeStr = (n) => (typeof n.time === 'string' && n.time.includes(':') ? n.time : '0:0:0');
    const durStr = (n) => (n.duration || '4n');
    sorted.forEach((n) => {
      const noteName = normalizeNote(String(n.note));
      const t = timeStr(n);
      const dur = durStr(n);
      Tone.Transport.schedule((when) => {
        try {
          sampler.triggerAttackRelease(noteName, dur, when);
        } catch (err) {
          console.warn('Note', noteName, err);
        }
      }, t);
    });

    const last = sorted[sorted.length - 1];
    const endBeats = timeStrToBeats(last.time) + durationToBeats(last.duration);
    const endTimeStr = beatToMBT(endBeats + 0.5);
    Tone.Transport.schedule(() => {
      stop();
    }, endTimeStr);

    setPlayheadBeats(0);
    setIsPlaying(true);
    Tone.Transport.start();
  }, [notes, bpm, samplerRef, stop]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const sec = Tone.Transport.seconds;
      setPlayheadBeats((sec * bpm) / 60);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  return { isPlaying, playheadBeats, play, stop };
}
