import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

const BASE_URL = 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/';

export function usePianoSampler() {
  const samplerRef = useRef(null);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: { C4: 'C4.mp3', E4: 'E4.mp3', G4: 'G4.mp3', C5: 'C5.mp3' },
      release: 1.2,
      baseUrl: BASE_URL,
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
