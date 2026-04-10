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

  /**
   * play(options):
   * - startBar: compás desde el que comienza la reproducción (0 = inicio)
   * - loopBars: si > 0, activa loop entre [startBar, startBar + loopBars)
   */
  const play = useCallback(async (options = {}) => {
    const { startBar = 0, loopBars = null } = options || {};

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
    // Si hay loop, no programamos stop automático; se detiene con Stop.
    if (!loopBars || loopBars <= 0) {
      Tone.Transport.schedule(() => {
        stop();
      }, endTimeStr);
    }

    // Configurar loop si se pide
    const startBarSafe = Math.max(0, Math.floor(startBar));
    const loopBarsSafe = loopBars && loopBars > 0 ? Math.floor(loopBars) : null;
    const loopStartStr = beatToMBT(startBarSafe * 4);
    if (loopBarsSafe && loopBarsSafe > 0) {
      const loopEndStr = beatToMBT((startBarSafe + loopBarsSafe) * 4);
      Tone.Transport.setLoopPoints(loopStartStr, loopEndStr);
      Tone.Transport.loop = true;
    } else {
      Tone.Transport.loop = false;
    }

    setPlayheadBeats(0);
    setIsPlaying(true);
    // Iniciar en el compás solicitado
    if (startBarSafe > 0) {
      Tone.Transport.start(undefined, loopStartStr);
    } else {
      Tone.Transport.start();
    }
  }, [notes, bpm, samplerRef, stop]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    Tone.Transport.pause();
    setIsPlaying(false);
  }, [isPlaying]);

  // Actualización suave del playhead para vistas 2D (PianoRollFL) sin saturar React.
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const pos = Tone.Transport.position;
      const posStr = typeof pos === 'string' ? pos : String(pos);
      const beats = timeStrToBeats(posStr);
      if (!Number.isNaN(beats)) {
        setPlayheadBeats(beats);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  return { isPlaying, playheadBeats, play, pause, stop };
}
