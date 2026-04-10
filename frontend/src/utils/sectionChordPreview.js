import * as Tone from "tone";
import { getDraw } from "tone";
import { PIANO_FLUID_BASE_URL, PIANO_FLUID_SAMPLER_URLS } from "../page/piano/constants.js";
import { chordSymbolToTriadNoteNames } from "./chordSymbolNotes.js";
import { isHarmonyMetronomeRunning } from "./harmonyMetronome.js";
import { normalizeChordBeatsArray, parseChordSymbolsFromLine } from "./harmonyKeyUtils.js";

export { parseChordSymbolsFromLine };

let pianoPreviewSingleton = null;
let polyPreviewSingleton = null;
let pianoLoadPromise = null;

function getPreviewPoly() {
  if (!polyPreviewSingleton) {
    polyPreviewSingleton = new Tone.PolySynth({
      maxPolyphony: 8,
      options: {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.55 },
      },
    }).toDestination();
    polyPreviewSingleton.volume.value = -6;
  }
  return polyPreviewSingleton;
}

function getPreviewPiano() {
  if (!pianoPreviewSingleton) {
    pianoLoadPromise = new Promise((resolve) => {
      pianoPreviewSingleton = new Tone.Sampler({
        urls: PIANO_FLUID_SAMPLER_URLS,
        release: 1.15,
        baseUrl: PIANO_FLUID_BASE_URL,
        onload: () => resolve(),
      }).toDestination();
      pianoPreviewSingleton.volume.value = -2;
    });
  }
  return pianoPreviewSingleton;
}

export async function ensurePreviewSampler() {
  await Tone.start();
  const inst = getPreviewPiano();
  if (!inst.loaded && pianoLoadPromise) {
    await Promise.race([
      pianoLoadPromise,
      new Promise((r) => setTimeout(r, 9000)),
    ]);
  }
  await Tone.loaded();
  return inst;
}

export function disposePreviewSampler() {
  try {
    pianoPreviewSingleton?.dispose?.();
  } catch {
    /* noop */
  }
  try {
    polyPreviewSingleton?.dispose?.();
  } catch {
    /* noop */
  }
  pianoPreviewSingleton = null;
  polyPreviewSingleton = null;
  pianoLoadPromise = null;
}

function triggerChordNotesAt(notes, startTime, durationSec, velocity) {
  if (!notes.length) return;
  const usePiano = pianoPreviewSingleton?.loaded === true;
  const voice = usePiano ? pianoPreviewSingleton : getPreviewPoly();
  voice.triggerAttackRelease(notes, durationSec, startTime, velocity);
}

export function activeChordSlotAtGlobalBeat(globalBeat, chordStartBeats) {
  if (!chordStartBeats?.length) return null;
  let idx = 0;
  for (let i = 0; i < chordStartBeats.length; i++) {
    if (chordStartBeats[i] <= globalBeat) idx = i;
    else break;
  }
  return idx;
}

/**
 * Sesión de vista previa: resaltado por tick, pausa, reanudar, parar, empezar desde acorde N.
 * @param {{
 *   bpm: number,
 *   chordsLine: string,
 *   beatsPerBar?: number,
 *   chordBeats?: number[],
 *   syncToTransport?: boolean,
 *   startFromChordIndex?: number,
 *   onTick: (p: { globalBeat: number, activeChordSlot: number|null, chordChanged: boolean }) => void,
 *   onEnd: () => void,
 * }} opts
 */
export async function createSectionPreviewSession(opts) {
  const {
    bpm,
    chordsLine,
    beatsPerBar: barIn,
    chordBeats: beatsIn,
    syncToTransport = false,
    startFromChordIndex = 0,
    onTick,
    onEnd,
  } = opts;

  const bpmNum = Number(bpm);
  if (!bpmNum || bpmNum < 30 || bpmNum > 320) {
    return null;
  }

  await Tone.start();
  await ensurePreviewSampler();

  const beatSec = 60 / bpmNum;
  const beatsPerBar = Math.max(1, Math.min(32, Number(barIn) || 4));
  const symbols = parseChordSymbolsFromLine(chordsLine);
  const chordBeats = normalizeChordBeatsArray(symbols.length, beatsIn, beatsPerBar);

  const totalBeats =
    symbols.length > 0 ? chordBeats.reduce((a, b) => a + b, 0) : Math.min(8, beatsPerBar * 2);

  const chordStartBeats = [];
  let cum = 0;
  for (let i = 0; i < symbols.length; i++) {
    chordStartBeats.push(cum);
    cum += chordBeats[i] || 1;
  }

  const slot =
    symbols.length > 0
      ? Math.max(0, Math.min(symbols.length - 1, Math.floor(Number(startFromChordIndex) || 0)))
      : 0;
  const startGlobalBeat = symbols.length > 0 ? chordStartBeats[slot] ?? 0 : 0;

  if (startGlobalBeat >= totalBeats) {
    return null;
  }

  const T = Tone.getTransport();
  const metroAtStart = isHarmonyMetronomeRunning();
  const useMetroSync = syncToTransport && metroAtStart;
  let ownedTransport = false;

  if (!useMetroSync) {
    if (!metroAtStart) {
      T.stop();
      T.cancel();
      ownedTransport = true;
    }
    T.bpm.value = bpmNum;
    if (!metroAtStart) {
      T.start();
    }
  } else {
    T.bpm.value = bpmNum;
  }

  let scheduled = [];
  let lastCompletedBeat = startGlobalBeat - 1;
  let stopped = false;
  let paused = false;
  let ended = false;
  const fireEnd = () => {
    if (ended) return;
    ended = true;
    onEnd();
  };

  function alignTransportTime() {
    if (useMetroSync) {
      const sec = T.seconds;
      const n = Math.floor(sec / beatSec + 1e-9);
      let t0 = n * beatSec;
      if (t0 < sec - 1e-8) t0 += beatSec;
      return t0;
    }
    return Math.max(T.seconds, 0.08);
  }

  function clearScheduled() {
    for (const ev of scheduled) {
      try {
        if (ev.id != null) T.clear(ev.id);
      } catch {
        /* noop */
      }
    }
    scheduled = [];
  }

  function scheduleFrom(fromBeat, tFirst) {
    clearScheduled();
    for (let b = fromBeat; b < totalBeats; b++) {
      const transportTime = tFirst + (b - fromBeat) * beatSec;
      const chordChanged = symbols.length > 0 && chordStartBeats.some((sb) => sb === b);
      const id = T.schedule((time) => {
        if (stopped) return;
        const activeChordSlot = activeChordSlotAtGlobalBeat(b, chordStartBeats);
        getDraw().schedule(() => {
          if (stopped) return;
          onTick({
            globalBeat: b,
            activeChordSlot,
            chordChanged,
          });
        }, time);

        for (let i = 0; i < symbols.length; i++) {
          if (chordStartBeats[i] !== b) continue;
          const durBeats = Math.max(1, chordBeats[i] || 1);
          const durSec = Math.min(16, durBeats * beatSec * 0.96);
          const notes = chordSymbolToTriadNoteNames(symbols[i]);
          triggerChordNotesAt(notes, time, durSec, 0.88);
        }
        lastCompletedBeat = b;
      }, transportTime);
      scheduled.push({ id, tt: transportTime, beat: b });
    }

    const endT = tFirst + (totalBeats - fromBeat) * beatSec;
    const endId = T.schedule((time) => {
      if (stopped) return;
      stopped = true;
      clearScheduled();
      if (ownedTransport) {
        try {
          T.stop();
          T.cancel();
        } catch {
          /* noop */
        }
      }
      getDraw().schedule(() => fireEnd(), time);
    }, endT + 0.02);
    scheduled.push({ id: endId, tt: endT, beat: -1 });
  }

  const tAnchor = alignTransportTime();
  scheduleFrom(startGlobalBeat, tAnchor);

  const initialSlot = activeChordSlotAtGlobalBeat(startGlobalBeat, chordStartBeats);
  onTick({
    globalBeat: startGlobalBeat,
    activeChordSlot: initialSlot,
    chordChanged: true,
  });

  const durationMs = (totalBeats - startGlobalBeat) * beatSec * 1000 + 500;

  return {
    durationMs,
    pause() {
      if (stopped || paused) return;
      paused = true;
      if (ownedTransport) {
        T.pause();
      } else {
        const nowS = T.seconds;
        const toClear = scheduled.filter((ev) => ev.beat >= 0 && ev.tt > nowS + 0.02);
        for (const ev of toClear) {
          try {
            T.clear(ev.id);
          } catch {
            /* noop */
          }
        }
        scheduled = scheduled.filter((ev) => ev.beat < 0 || ev.tt <= nowS + 0.02);
      }
    },
    resume() {
      if (stopped || !paused) return;
      paused = false;
      if (ownedTransport) {
        T.start();
        return;
      }
      const nextBeat = lastCompletedBeat + 1;
      if (nextBeat >= totalBeats) {
        stopped = true;
        clearScheduled();
        fireEnd();
        return;
      }
      const t0 = alignTransportTime();
      scheduleFrom(nextBeat, t0);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      paused = false;
      clearScheduled();
      if (ownedTransport) {
        try {
          T.stop();
          T.cancel();
        } catch {
          /* noop */
        }
      }
      fireEnd();
    },
  };
}
