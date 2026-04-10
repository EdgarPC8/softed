import { useEffect, useRef } from "react";
import * as Tone from "tone";

/**
 * Metrónomo según tiempo en ms y BPM (pista o modo virtual).
 */
export function useKaraokePlayback({ timeMs, bpm, metronomeEnabled, playing }) {
  const clickRef = useRef(null);
  const lastBeatRef = useRef(-1);
  const prevTimeMsRef = useRef(0);
  const toneStartedRef = useRef(false);

  const ensureClick = async () => {
    if (!toneStartedRef.current) {
      await Tone.start();
      toneStartedRef.current = true;
    }
    if (!clickRef.current) {
      clickRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 },
      }).toDestination();
      clickRef.current.volume.value = -28;
    }
  };

  useEffect(() => {
    if (timeMs < prevTimeMsRef.current - 40) {
      lastBeatRef.current = -1;
    }
    prevTimeMsRef.current = timeMs;
  }, [timeMs]);

  useEffect(() => {
    if (!bpm || bpm < 30 || bpm > 300 || !metronomeEnabled || !playing) {
      lastBeatRef.current = -1;
      return undefined;
    }
    const beatDur = 60 / bpm;
    const tSec = (timeMs || 0) / 1000;
    const beatNum = Math.floor(tSec / beatDur + 1e-6);
    if (beatNum !== lastBeatRef.current && beatNum >= 0) {
      lastBeatRef.current = beatNum;
      (async () => {
        await ensureClick();
        clickRef.current?.triggerAttackRelease("C2", 0.05, Tone.now(), 0.35);
      })();
    }
    return undefined;
  }, [timeMs, bpm, metronomeEnabled, playing]);

  useEffect(() => {
    return () => {
      try {
        clickRef.current?.dispose?.();
      } catch {
        /* noop */
      }
      clickRef.current = null;
    };
  }, []);
}
