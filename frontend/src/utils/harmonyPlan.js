/**
 * Plan de armonía por secciones (verso, coro, …) guardado en lyricBlocks.harmonyPlan.
 * Incluye letra por parte y anclaje por sílaba por acorde (además de ritmo + cifra).
 */

import { effectiveSyllableAt, parseChordLineToArray, suggestNextSyllableForAppend } from "./harmonyKeyUtils.js";
import { normalizeChordPlacement, parseChordPlacementArray } from "./chordAnchorPlacement.js";
import { lyricsToSyllableCount } from "./lyricsSyllables.js";

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   role: string,
 *   key: string,
 *   chordsLine: string,
 *   chordBeats?: number[],
 *   lyrics?: string,
 *   chordSyllableAnchors?: number[],
 *   chordAnchorPlacement?: string[],
 * }} HarmonySection
 */

const ROLES = [
  "intro",
  "verse",
  "prechorus",
  "chorus",
  "bridge",
  "instrumental",
  "outro",
  "other",
];

export const HARMONY_ROLE_LABELS = {
  intro: "Intro",
  verse: "Verso",
  prechorus: "Precoro",
  chorus: "Coro",
  bridge: "Puente",
  instrumental: "Instrumental",
  outro: "Final",
  other: "Otro",
};

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return `hp-${crypto.randomUUID().slice(0, 8)}`;
  return `hp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** @returns {{ version: number, sections: HarmonySection[] }} */
export function defaultHarmonyPlan() {
  return {
    version: 1,
    sections: [
      {
        id: newId(),
        label: "Parte 1",
        role: "verse",
        key: "",
        chordsLine: "",
        chordBeats: [],
        lyrics: "",
        chordSyllableAnchors: [],
        chordAnchorPlacement: [],
      },
      {
        id: newId(),
        label: "Parte 2",
        role: "verse",
        key: "",
        chordsLine: "",
        chordBeats: [],
        lyrics: "",
        chordSyllableAnchors: [],
        chordAnchorPlacement: [],
      },
    ],
  };
}

/** @param {unknown} raw */
export function parseHarmonyPlanFromLyricBlocks(raw) {
  if (!raw || typeof raw !== "object") return defaultHarmonyPlan();
  const hp = raw.harmonyPlan;
  if (!hp || typeof hp !== "object" || !Array.isArray(hp.sections) || hp.sections.length === 0) {
    return defaultHarmonyPlan();
  }
  const sectionsRaw = hp.sections.map((s, i) => {
    const lyrics = typeof s.lyrics === "string" ? s.lyrics.slice(0, 8000) : "";
    const chordLine = typeof s.chordsLine === "string" ? s.chordsLine : "";
    const chordCount = parseChordLineToArray(chordLine).length;
    const ts = lyricsToSyllableCount(lyrics);
    let anchors = Array.isArray(s.chordSyllableAnchors)
      ? s.chordSyllableAnchors
          .map((x) => Math.max(0, Math.min(512, Math.floor(Number(x)) || 0)))
          .slice(0, 64)
      : [];
    while (anchors.length < chordCount) {
      if (ts <= 0) anchors.push(0);
      else anchors.push(suggestNextSyllableForAppend(anchors, anchors.length, ts));
    }
    anchors = anchors.slice(0, chordCount);
    if (ts > 0) {
      for (let j = 0; j < anchors.length; j++) {
        const v = anchors[j];
        if (v >= 1 && v <= ts) continue;
        if (j === 0) anchors[j] = 1;
        else {
          let maxSo = 0;
          for (let k = 0; k < j; k++) {
            maxSo = Math.max(maxSo, effectiveSyllableAt(anchors, k, ts));
          }
          anchors[j] = Math.min(maxSo + 1, ts);
        }
      }
    } else {
      anchors = anchors.map(() => 0);
    }
    let placement = parseChordPlacementArray(s.chordAnchorPlacement);
    while (placement.length < chordCount) placement.push("on");
    placement = placement.slice(0, chordCount);
    return {
      id: typeof s.id === "string" && s.id ? s.id : newId(),
      label: String(s.label || `Sección ${i + 1}`).slice(0, 120),
      role: ROLES.includes(s.role) ? s.role : "verse",
      key: s.key != null ? String(s.key) : "",
      chordsLine: chordLine,
      chordBeats: Array.isArray(s.chordBeats)
        ? s.chordBeats.map((x) => Math.max(1, Math.min(32, Math.floor(Number(x)) || 1))).slice(0, 64)
        : [],
      lyrics,
      chordSyllableAnchors: anchors,
      chordAnchorPlacement: placement,
    };
  });

  return {
    version: Number(hp.version) || 1,
    sections: sectionsRaw,
  };
}

/**
 * Inserta / actualiza harmonyPlan en el objeto lyricBlocks sin tocar blocks ni chordRhythm.
 * @param {object} lyricBlocks
 * @param {{ version: number, sections: HarmonySection[] }} harmonyPlan
 */
export function mergeHarmonyPlanIntoLyricBlocks(lyricBlocks, harmonyPlan) {
  const base =
    lyricBlocks && typeof lyricBlocks === "object"
      ? JSON.parse(JSON.stringify(lyricBlocks))
      : { version: 2, blocks: [] };
  base.harmonyPlan = {
    version: harmonyPlan.version || 1,
    sections: harmonyPlan.sections.map((s, i) => ({
      id: String(s.id || newId()).slice(0, 64),
      label: String(s.label || `Sección ${i + 1}`).slice(0, 120),
      role: ROLES.includes(s.role) ? s.role : "verse",
      key: String(s.key ?? "").slice(0, 24),
      chordsLine: String(s.chordsLine ?? "").slice(0, 4000),
      chordBeats: Array.isArray(s.chordBeats)
        ? s.chordBeats
            .map((x) => Math.max(1, Math.min(32, Math.floor(Number(x)) || 1)))
            .slice(0, 64)
        : [],
      lyrics: String(s.lyrics ?? "").slice(0, 8000),
      chordSyllableAnchors: Array.isArray(s.chordSyllableAnchors)
        ? s.chordSyllableAnchors
            .map((x) => Math.max(0, Math.min(512, Math.floor(Number(x)) || 0)))
            .slice(0, 64)
        : [],
      chordAnchorPlacement: Array.isArray(s.chordAnchorPlacement)
        ? s.chordAnchorPlacement.slice(0, 64).map((x) => normalizeChordPlacement(x))
        : [],
    })),
  };
  return base;
}
