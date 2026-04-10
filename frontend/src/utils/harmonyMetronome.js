import * as Tone from "tone";

let repeatEventId = null;
let beatCounter = 0;

/** “TAC”: golpe grave del compás (tiempo fuerte). */
function getTockSynth() {
  if (!getTockSynth._s) {
    getTockSynth._s = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.06 },
    }).toDestination();
    getTockSynth._s.volume.value = -8;
  }
  return getTockSynth._s;
}
getTockSynth._s = null;

/** “tic”: pulsos débiles, agudo y corto (clásico tic-tac). */
function getTickSynth() {
  if (!getTickSynth._s) {
    getTickSynth._s = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.028, sustain: 0, release: 0.015 },
    }).toDestination();
    getTickSynth._s.volume.value = -18;
  }
  return getTickSynth._s;
}
getTickSynth._s = null;

/**
 * Metrónomo continuo en Tone.Transport: TAC en el 1 del compás, tic en el resto (tic-tac-tic-tac…).
 */
export async function startHarmonyMetronome(bpm, beatsPerBar) {
  await Tone.start();
  stopHarmonyMetronome();

  const T = Tone.getTransport();
  const bpmNum = Math.max(30, Math.min(320, Number(bpm) || 120));
  const bar = Math.max(1, Math.min(32, Math.floor(Number(beatsPerBar) || 4)));
  T.bpm.value = bpmNum;

  beatCounter = 0;
  const tock = getTockSynth();
  const tick = getTickSynth();

  repeatEventId = T.scheduleRepeat(
    (time) => {
      const beatInBar = beatCounter % bar;
      if (beatInBar === 0) {
        tock.triggerAttackRelease("G1", 0.11, time, 0.78);
      } else {
        tick.triggerAttackRelease("E6", 0.032, time, 0.4);
      }
      beatCounter += 1;
    },
    "4n",
    0,
  );

  T.start();
}

export function stopHarmonyMetronome() {
  const T = Tone.getTransport();
  if (repeatEventId != null) {
    T.clear(repeatEventId);
    repeatEventId = null;
  }
  T.stop();
  T.cancel();
  beatCounter = 0;
}

export function isHarmonyMetronomeRunning() {
  return Tone.getTransport().state === "started";
}
