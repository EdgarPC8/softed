import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { PIANO_FLUID_BASE_URL, PIANO_FLUID_SAMPLER_URLS } from '../constants.js';

export function usePianoSampler() {
  const samplerRef = useRef(null);

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
      } catch (_) {}
    };
  }, []);

  const playNote = (noteName, duration = 0.5) => {
    samplerRef.current?.triggerAttackRelease(noteName, duration);
  };

  return { samplerRef, playNote };
}
