import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { chordSymbolToTriadNoteNames } from "../../../utils/chordSymbolNotes.js";
import { getActiveChordEventInWindow } from "../../../utils/chordChordTimeline.js";
import {
  PIANO_FLUID_BASE_URL,
  PIANO_FLUID_SAMPLER_URLS,
} from "../../piano/constants.js";

/**
 * Piano guía con el mismo sampler FluidR3 que Piano Pro (`usePianoSampler`).
 */
export function usePianoChordGuide({ timeMs, playing, chordTimeline, enabled }) {
  const samplerRef = useRef(null);
  const lastPlayedIdRef = useRef(null);
  const prevTimeMsRef = useRef(0);
  const toneStartedRef = useRef(false);
  const [activeChordEvent, setActiveChordEvent] = useState(null);

  useEffect(() => {
    if (enabled) lastPlayedIdRef.current = null;
  }, [enabled]);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: PIANO_FLUID_SAMPLER_URLS,
      release: 1.2,
      baseUrl: PIANO_FLUID_BASE_URL,
    }).toDestination();
    samplerRef.current = sampler;
    return () => {
      samplerRef.current = null;
      try {
        sampler.dispose();
      } catch {
        /* noop */
      }
    };
  }, []);

  const ensureReady = async () => {
    if (!toneStartedRef.current) {
      await Tone.start();
      toneStartedRef.current = true;
    }
    await Tone.loaded();
  };

  useEffect(() => {
    if (timeMs < prevTimeMsRef.current - 40) {
      lastPlayedIdRef.current = null;
    }
    prevTimeMsRef.current = timeMs;
  }, [timeMs]);

  useEffect(() => {
    if (!enabled || !chordTimeline?.length) {
      lastPlayedIdRef.current = null;
      setActiveChordEvent(null);
      return;
    }

    const ev = getActiveChordEventInWindow(chordTimeline, timeMs);
    setActiveChordEvent((prev) => {
      if (!ev) return prev?.id ? null : prev;
      if (prev?.id === ev.id) return prev;
      return ev;
    });

    if (playing && ev && ev.id !== lastPlayedIdRef.current) {
      lastPlayedIdRef.current = ev.id;
      const notes = chordSymbolToTriadNoteNames(ev.symbol);
      if (notes.length && samplerRef.current) {
        (async () => {
          await ensureReady();
          const s = samplerRef.current;
          if (!s) return;
          const t = Tone.now();
          /** Duración alineada al timeline (BPM + tiempo hasta el siguiente acorde). */
          const sec = Math.max(
            0.08,
            Math.min(16, (ev.durationMs ?? 600) / 1000)
          );
          const dur = `${sec}s`;
          s.triggerAttackRelease(notes, dur, t, 0.82);
        })();
      }
    }
  }, [timeMs, playing, enabled, chordTimeline]);

  return { activeChordEvent };
}
