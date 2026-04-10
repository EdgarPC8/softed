/* eslint-disable react/prop-types -- props internas de página canciones */
import { Fragment, useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Paper,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import UndoIcon from "@mui/icons-material/Undo";
import { alpha } from "@mui/material/styles";
import { Key } from "tonal";
import {
  chordDegreeInKey,
  chordsArrayToLine,
  equalSplitBeats,
  effectiveSyllableAt,
  normalizeChordBeatsArray,
  cascadeForwardAfterSyllableEdit,
  cascadeForwardFromHighestEarlier,
  clampAndMonotonicChordAnchors,
  parseChordLineToArray,
  reconcileChordBeats,
  reconcileChordSyllableAnchors,
  resolveKeyContext,
  suggestNextSyllableForAppend,
} from "../../../utils/harmonyKeyUtils.js";
import {
  CHORD_PLACEMENT_LABELS,
  normalizeChordPlacement,
  parseChordPlacementArray,
  reconcileChordAnchorPlacement,
} from "../../../utils/chordAnchorPlacement.js";
import {
  lyricsToPreviewSegmentLines,
  lyricsToSyllableCount,
  lyricsToSyllableTokens,
} from "../../../utils/lyricsSyllables.js";
import LyricPreviewLine from "./LyricPreviewLine.jsx";

function uniqueStrings(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr || []) {
    const s = String(x).trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function extraDominantChords(ctx) {
  if (!ctx.valid) return [];
  if (ctx.mode === "major") {
    const k = Key.majorKey(ctx.tonic);
    return uniqueStrings([...(k.secondaryDominants || []), ...(k.substituteDominants || [])]);
  }
  const k = Key.minorKey(ctx.tonic);
  const n = k.natural;
  return uniqueStrings([...(n.secondaryDominants || []), ...(n.substituteDominants || [])]);
}

function moveChordToIndex(progression, beatArr, anchorArr, placementArr, fromI, insertAt) {
  if (fromI < 0 || fromI >= progression.length) {
    return { next: progression, beats: beatArr, anchors: anchorArr, placement: placementArr };
  }
  const next = progression.slice();
  const b = beatArr.slice();
  const a = Array.isArray(anchorArr) ? anchorArr.slice() : [];
  while (a.length < progression.length) a.push(0);
  const p = Array.isArray(placementArr) ? placementArr.map(normalizeChordPlacement).slice() : [];
  while (p.length < progression.length) p.push("on");
  const [sym] = next.splice(fromI, 1);
  const [beats] = b.splice(fromI, 1);
  const [anc] = a.splice(fromI, 1);
  const [pl] = p.splice(fromI, 1);
  let target = insertAt;
  if (fromI < insertAt) target -= 1;
  target = Math.max(0, Math.min(target, next.length));
  next.splice(target, 0, sym);
  b.splice(target, 0, beats);
  a.splice(target, 0, anc);
  p.splice(target, 0, pl);
  return { next, beats: b, anchors: a, placement: p };
}

export default function HarmonySectionCard({
  section: sec,
  index,
  roleEntries,
  songKey,
  beatsPerBar,
  onUpdate,
  onRemove,
  onDuplicate,
  onPreviewPart,
  sectionsCount,
  isPreviewing = false,
  activePreviewSlot = null,
  previewPaused = false,
}) {
  const bar = Math.max(1, Math.min(32, Number(beatsPerBar) || 4));
  const refKeyRaw = (sec.key && sec.key.trim()) || (songKey && songKey.trim()) || "";
  const ctx = useMemo(() => resolveKeyContext(refKeyRaw), [refKeyRaw]);
  const extras = useMemo(() => extraDominantChords(ctx), [ctx]);

  const progression = useMemo(() => parseChordLineToArray(sec.chordsLine), [sec.chordsLine]);

  const beatArr = useMemo(
    () => normalizeChordBeatsArray(progression.length, sec.chordBeats, bar),
    [progression, sec.chordBeats, bar],
  );

  const syllableTokens = useMemo(() => lyricsToSyllableTokens(sec.lyrics ?? ""), [sec.lyrics]);
  const totalSyllables = syllableTokens.length;

  const previewSegmentLines = useMemo(() => lyricsToPreviewSegmentLines(sec.lyrics ?? ""), [sec.lyrics]);

  const anchorArr = useMemo(() => {
    const raw = Array.isArray(sec.chordSyllableAnchors) ? sec.chordSyllableAnchors : [];
    const out = [];
    for (let i = 0; i < progression.length; i++) {
      out.push(Math.max(0, Math.floor(Number(raw[i])) || 0));
    }
    return out;
  }, [progression.length, sec.chordSyllableAnchors]);

  const placementArr = useMemo(() => {
    const raw = Array.isArray(sec.chordAnchorPlacement) ? sec.chordAnchorPlacement : [];
    const out = [];
    for (let i = 0; i < progression.length; i++) {
      out.push(normalizeChordPlacement(raw[i]));
    }
    return out;
  }, [progression.length, sec.chordAnchorPlacement]);

  const { onMap, beforeMap, afterMap } = useMemo(() => {
    const onM = new Map();
    const beforeM = new Map();
    const afterM = new Map();
    const n = syllableTokens.length;
    const push = (map, sylIdx, sym, slot) => {
      if (!map.has(sylIdx)) map.set(sylIdx, []);
      map.get(sylIdx).push({ sym, slot });
    };
    if (n <= 0) return { onMap: onM, beforeMap: beforeM, afterMap: afterM };
    for (let i = 0; i < progression.length; i++) {
      const sym = progression[i];
      if (!sym) continue;
      let a = anchorArr[i] ?? 0;
      if (a < 1 || a > n) a = Math.min(i + 1, n);
      const pl = placementArr[i] ?? "on";
      if (pl === "before") push(beforeM, a, sym, i);
      else if (pl === "after") push(afterM, a, sym, i);
      else push(onM, a, sym, i);
    }
    return { onMap: onM, beforeMap: beforeM, afterMap: afterM };
  }, [progression, anchorArr, placementArr, syllableTokens]);

  const activeSyllable1Based = useMemo(() => {
    if (!isPreviewing || activePreviewSlot == null || activePreviewSlot < 0) return null;
    if (totalSyllables <= 0) return null;
    const s = effectiveSyllableAt(anchorArr, activePreviewSlot, totalSyllables);
    return s >= 1 ? s : null;
  }, [isPreviewing, activePreviewSlot, anchorArr, totalSyllables]);

  const activeLyricLineIndex = useMemo(() => {
    if (activeSyllable1Based == null) return null;
    const tok = syllableTokens.find((t) => t.index === activeSyllable1Based);
    return tok != null ? tok.lineIndex : null;
  }, [activeSyllable1Based, syllableTokens]);

  const liveChordSymbol =
    isPreviewing && activePreviewSlot != null && progression[activePreviewSlot]
      ? progression[activePreviewSlot]
      : null;

  const [removedStack, setRemovedStack] = useState([]);

  const commitProgression = useCallback(
    (nextSyms, nextBeats, nextAnchors, nextPlacement) => {
      const pl = Array.isArray(nextPlacement)
        ? nextSyms.map((_, i) => normalizeChordPlacement(nextPlacement[i]))
        : nextSyms.map(() => "on");
      onUpdate({
        chordsLine: chordsArrayToLine(nextSyms),
        chordBeats: nextBeats,
        chordSyllableAnchors: nextAnchors,
        chordAnchorPlacement: pl,
      });
    },
    [onUpdate],
  );

  const appendChord = useCallback(
    (sym) => {
      const t = String(sym).trim();
      if (!t) return;
      const next = [...progression, t];
      const ref = beatArr.length ? beatArr[beatArr.length - 1] : bar;
      const b = [...beatArr, Math.max(1, Math.min(32, ref))];
      const ts = lyricsToSyllableCount(sec.lyrics);
      const defA = ts <= 0 ? 0 : suggestNextSyllableForAppend(anchorArr, progression.length, ts);
      const a = [...anchorArr, defA];
      const aFinal =
        ts > 0 && next.length >= 2 ? cascadeForwardFromHighestEarlier(a, next.length, ts) : a;
      const p = [...placementArr, "on"];
      commitProgression(next, b, aFinal, p);
    },
    [progression, beatArr, bar, anchorArr, placementArr, sec.lyrics, commitProgression],
  );

  const removeAt = useCallback(
    (i) => {
      const sym = progression[i];
      const pulses = beatArr[i] ?? 1;
      if (sym) {
        setRemovedStack((prev) =>
          [{ sym, beats: pulses, placement: normalizeChordPlacement(placementArr[i]) }, ...prev].slice(0, 12),
        );
      }
      const next = progression.filter((_, j) => j !== i);
      const b = beatArr.filter((_, j) => j !== i);
      const anch = anchorArr.filter((_, j) => j !== i);
      const pl = placementArr.filter((_, j) => j !== i);
      commitProgression(next, b, anch, pl);
    },
    [progression, beatArr, anchorArr, placementArr, commitProgression],
  );

  const restoreRemoved = useCallback(
    (stackIndex) => {
      const item = removedStack[stackIndex];
      if (!item) return;
      const next = [...progression, item.sym];
      const ref = beatArr.length ? beatArr[beatArr.length - 1] : bar;
      const restored = Math.max(1, Math.min(32, Number(item.beats) || ref));
      const b = [...beatArr, restored];
      const ts = lyricsToSyllableCount(sec.lyrics);
      const defA = ts <= 0 ? 0 : suggestNextSyllableForAppend(anchorArr, progression.length, ts);
      const a = [...anchorArr, defA];
      const aFinal =
        ts > 0 && next.length >= 2 ? cascadeForwardFromHighestEarlier(a, next.length, ts) : a;
      const plRest = item.placement != null ? normalizeChordPlacement(item.placement) : "on";
      const p = [...placementArr, plRest];
      commitProgression(next, b, aFinal, p);
      setRemovedStack((prev) => prev.filter((_, i) => i !== stackIndex));
    },
    [removedStack, progression, beatArr, anchorArr, placementArr, sec.lyrics, bar, commitProgression],
  );

  const changeBeatAt = useCallback(
    (i, delta) => {
      const b = beatArr.slice();
      b[i] = Math.max(1, Math.min(32, (b[i] || 1) + delta));
      onUpdate({ chordBeats: b });
    },
    [beatArr, onUpdate],
  );

  const repartirCompas = useCallback(() => {
    if (progression.length === 0) return;
    onUpdate({ chordBeats: equalSplitBeats(progression.length, bar) });
  }, [progression.length, bar, onUpdate]);

  const onLyricsChange = useCallback(
    (text) => {
      const ts = lyricsToSyllableCount(text);
      const raw = Array.isArray(sec.chordSyllableAnchors) ? [...sec.chordSyllableAnchors] : [];
      while (raw.length < progression.length) {
        if (ts <= 0) raw.push(0);
        else raw.push(suggestNextSyllableForAppend(raw, raw.length, ts));
      }
      raw.length = progression.length;
      const nextAnchors =
        ts <= 0 ? raw.map(() => 0) : clampAndMonotonicChordAnchors(raw, progression.length, ts);
      let pl = parseChordPlacementArray(sec.chordAnchorPlacement);
      while (pl.length < progression.length) pl.push("on");
      pl = pl.slice(0, progression.length);
      onUpdate({
        lyrics: text.slice(0, 8000),
        chordSyllableAnchors: nextAnchors,
        chordAnchorPlacement: pl,
      });
    },
    [sec.chordSyllableAnchors, sec.chordAnchorPlacement, progression.length, onUpdate],
  );

  const onChordsLineChange = useCallback(
    (newLine) => {
      const nextTok = parseChordLineToArray(newLine);
      const nextBeats = reconcileChordBeats(progression, nextTok, sec.chordBeats, bar);
      const ts = lyricsToSyllableCount(sec.lyrics);
      const nextAnchors = reconcileChordSyllableAnchors(
        progression,
        nextTok,
        sec.chordSyllableAnchors,
        ts,
      );
      const nextPlacement = reconcileChordAnchorPlacement(progression, nextTok, sec.chordAnchorPlacement);
      onUpdate({
        chordsLine: newLine,
        chordBeats: nextBeats,
        chordSyllableAnchors: nextAnchors,
        chordAnchorPlacement: nextPlacement,
      });
    },
    [progression, sec.chordBeats, sec.chordSyllableAnchors, sec.chordAnchorPlacement, sec.lyrics, bar, onUpdate],
  );

  const onSlotDragStart = (e, symbol, fromIndex) => {
    e.dataTransfer.setData("reorder-index", String(fromIndex));
    e.dataTransfer.setData("text/plain", symbol);
    e.dataTransfer.effectAllowed = "move";
  };

  const onInsertDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const hasReorder = [...e.dataTransfer.types].includes("reorder-index");
    e.dataTransfer.dropEffect = hasReorder ? "move" : "none";
  };

  const onInsertDrop = useCallback(
    (e, insertAt) => {
      e.preventDefault();
      e.stopPropagation();
      const from = e.dataTransfer.getData("reorder-index");
      if (from === "") return;
      const fromI = Number(from);
      if (Number.isNaN(fromI)) return;
      const { next, beats, anchors, placement } = moveChordToIndex(
        progression,
        beatArr,
        anchorArr,
        placementArr,
        fromI,
        insertAt,
      );
      commitProgression(next, beats, anchors, placement);
    },
    [progression, beatArr, anchorArr, placementArr, commitProgression],
  );

  const onChipDropReorder = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const from = e.dataTransfer.getData("reorder-index");
    if (from === "") return;
    const fromI = Number(from);
    if (Number.isNaN(fromI) || fromI === targetIndex) return;
    const insertAt = fromI < targetIndex ? targetIndex - 1 : targetIndex;
    const { next, beats, anchors, placement } = moveChordToIndex(
      progression,
      beatArr,
      anchorArr,
      placementArr,
      fromI,
      insertAt,
    );
    commitProgression(next, beats, anchors, placement);
  };

  const roleLabel = roleEntries.find(([v]) => v === sec.role)?.[1] || sec.role;

  const totalPulse = beatArr.reduce((a, b) => a + b, 0) || 0;

  const insertZoneSx = {
    width: 10,
    flexShrink: 0,
    alignSelf: "stretch",
    minHeight: 72,
    borderRadius: 0.5,
    bgcolor: "action.selected",
    opacity: 0.35,
    transition: "opacity 0.15s",
    "&:hover": { opacity: 0.85 },
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: isPreviewing ? "primary.main" : "divider",
        borderRadius: 1,
        boxShadow: isPreviewing ? (t) => `0 0 0 2px ${t.palette.primary.main}33` : "none",
        "&:before": { display: "none" },
        mb: 0.75,
      }}
      defaultExpanded={index === 0}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ width: "100%", pr: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 0 }}>
            {sec.label || `Parte ${index + 1}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {roleLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            · {progression.length} ac. · {totalPulse || 0} pulsos
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, px: 1.5, pb: 1.5 }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} flexWrap="wrap" useFlexGap>
            <TextField
              label="Nombre"
              size="small"
              value={sec.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              sx={{ flex: "1 1 140px", minWidth: 120 }}
            />
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo" value={sec.role} onChange={(e) => onUpdate({ role: e.target.value })}>
                {roleEntries.map(([value, lab]) => (
                  <MenuItem key={value} value={value}>
                    {lab}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tonalidad parte"
              size="small"
              value={sec.key}
              onChange={(e) => onUpdate({ key: e.target.value })}
              placeholder={songKey ? `Vacío → ${songKey}` : "Ej. Sol, Lam"}
              sx={{ width: { xs: "100%", sm: 140 } }}
            />
            <Tooltip title="Escuchar desde el primer acorde">
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  disabled={isPreviewing && !previewPaused}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewPart(0);
                  }}
                  aria-label="Escuchar desde el inicio"
                >
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            {typeof onDuplicate === "function" && (
              <Tooltip title="Duplicar parte: copia cifra, pulsos, letra, número de sílaba por acorde y ubicación (flechas). Si luego cambias la letra, los anclas se reclampean y ordenan solas.">
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                  aria-label="Duplicar parte"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              size="small"
              color="error"
              disabled={sectionsCount <= 1}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label="Quitar parte"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 0.35 }}>
              Línea de tiempo (1 compás = {bar} pulsos)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
              Cada bloque = acorde; ancho = pulsos. Un acorde nuevo copia los pulsos del anterior (o del compás si es el
              primero). Borde azul = inicio de compás. Ranuras grises = reordenar (arrastra un acorde ya en la pista).
              Ámbar = fuera de la escala. La paleta solo se pulsa para añadir al final.
            </Typography>

            <Box
              sx={{
                width: "100%",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                overflow: "hidden",
                minHeight: progression.length === 0 ? 56 : "auto",
              }}
            >
              {progression.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", p: 1.5 }}>
                  Pulsa un acorde en la paleta o escribe en el campo de texto inferior…
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {Array.from({ length: progression.length + 1 }, (_, insertAt) => (
                    <Fragment key={`ins-${insertAt}`}>
                      <Box
                        role="separator"
                        aria-label={`Insertar acorde en posición ${insertAt}`}
                        onDragOver={onInsertDragOver}
                        onDrop={(e) => onInsertDrop(e, insertAt)}
                        sx={insertZoneSx}
                      />
                      {insertAt < progression.length && (() => {
                        const sym = progression[insertAt];
                        const pulses = beatArr[insertAt] ?? 1;
                        const deg = chordDegreeInKey(refKeyRaw, sym);
                        const startBeat = beatArr.slice(0, insertAt).reduce((a, b) => a + b, 0);
                        const isBarStart = startBeat % bar === 0;
                        const slotIsActive = isPreviewing && activePreviewSlot === insertAt;
                        return (
                          <Box
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => onChipDropReorder(e, insertAt)}
                            sx={{
                              flex: `${pulses} 1 0`,
                              minWidth: 52,
                              position: "relative",
                              borderLeft: isBarStart ? 3 : 1,
                              borderRight: 1,
                              borderTop: 1,
                              borderBottom: 1,
                              borderStyle: "solid",
                              borderColor: slotIsActive
                                ? "success.main"
                                : isBarStart
                                  ? "primary.main"
                                  : "divider",
                              bgcolor: slotIsActive
                                ? (t) => alpha(t.palette.success.main, previewPaused ? 0.14 : 0.26)
                                : deg === "chromatic"
                                  ? "warning.light"
                                  : "action.hover",
                              py: 0.75,
                              px: 0.5,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: 0.35,
                              boxShadow: slotIsActive
                                ? (t) => {
                                    const g = t.palette.success.main;
                                    return `0 0 0 3px ${g}, 0 0 24px ${alpha(g, previewPaused ? 0.4 : 0.75)}`;
                                  }
                                : "none",
                              transition: "box-shadow 0.12s ease, background-color 0.12s ease",
                              zIndex: slotIsActive ? 2 : "auto",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                pointerEvents: "none",
                                opacity: 0.25,
                              }}
                            >
                              {Array.from({ length: Math.max(0, pulses - 1) }, (_, k) => (
                                <Box
                                  key={k}
                                  sx={{
                                    position: "absolute",
                                    left: `${((k + 1) / pulses) * 100}%`,
                                    top: 0,
                                    bottom: 0,
                                    width: "1px",
                                    bgcolor: "text.secondary",
                                    transform: "translateX(-50%)",
                                  }}
                                />
                              ))}
                            </Box>
                            <Chip
                              size="small"
                              label={sym}
                              draggable
                              onDragStart={(e) => onSlotDragStart(e, sym, insertAt)}
                              onDelete={() => removeAt(insertAt)}
                              color={
                                slotIsActive ? "success" : deg === "chromatic" ? "warning" : "default"
                              }
                              variant={slotIsActive ? "filled" : deg === "chromatic" ? "outlined" : "filled"}
                              sx={{
                                fontWeight: 800,
                                maxWidth: "100%",
                                cursor: "grab",
                                ...(slotIsActive
                                  ? {
                                      boxShadow: (t) => `0 0 12px ${alpha(t.palette.success.main, 0.55)}`,
                                    }
                                  : {}),
                              }}
                            />
                            <Stack direction="row" alignItems="center" spacing={0.15}>
                              <IconButton size="small" aria-label="Menos pulsos" onClick={() => changeBeatAt(insertAt, -1)}>
                                <RemoveIcon fontSize="inherit" />
                              </IconButton>
                              <Typography variant="caption" sx={{ minWidth: 16, textAlign: "center", fontWeight: 700 }}>
                                {pulses}
                              </Typography>
                              <IconButton size="small" aria-label="Más pulsos" onClick={() => changeBeatAt(insertAt, 1)}>
                                <AddIcon fontSize="inherit" />
                              </IconButton>
                            </Stack>
                            <Tooltip title="Escuchar desde este acorde">
                              <IconButton
                                size="small"
                                aria-label="Desde este acorde"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPreviewPart(insertAt);
                                }}
                                sx={{ mt: 0.25 }}
                              >
                                <PlayCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {totalSyllables <= 0 ? (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: "center", px: 0.5 }}>
                                Letra → sílaba
                              </Typography>
                            ) : (
                              <Stack spacing={0.35} sx={{ width: "100%", mt: 0.25, alignItems: "stretch" }}>
                                <Tooltip title="Elige la sílaba de la letra (número + texto) de referencia para este acorde">
                                  <FormControl size="small" sx={{ minWidth: 132, maxWidth: "100%" }}>
                                    <InputLabel>Sílaba</InputLabel>
                                    <Select
                                      label="Sílaba"
                                      value={(() => {
                                        let v = anchorArr[insertAt] ?? 0;
                                        if (v < 1 || v > totalSyllables) {
                                          v = Math.min(insertAt + 1, totalSyllables);
                                        }
                                        return v;
                                      })()}
                                      renderValue={(v) => {
                                        const n = Number(v);
                                        const tok = syllableTokens.find((x) => x.index === n);
                                        if (!tok) return String(v);
                                        return (
                                          <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
                                            {n} · {tok.text}
                                          </Typography>
                                        );
                                      }}
                                      onChange={(e) => {
                                        const v = Number(e.target.value);
                                        const a = anchorArr.slice();
                                        while (a.length < progression.length) a.push(0);
                                        a[insertAt] = v;
                                        const nextAnchors = cascadeForwardAfterSyllableEdit(
                                          a,
                                          insertAt,
                                          progression.length,
                                          totalSyllables,
                                        );
                                        onUpdate({ chordSyllableAnchors: nextAnchors });
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                                    >
                                      {syllableTokens.map((tok) => (
                                        <MenuItem key={tok.index} value={tok.index} sx={{ maxWidth: 360 }}>
                                          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ width: "100%", minWidth: 0 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, fontWeight: 700 }}>
                                              {tok.index}.
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
                                              {tok.text}
                                            </Typography>
                                          </Stack>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Tooltip>
                                <FormControl component="fieldset" variant="standard" sx={{ width: "100%", m: 0 }}>
                                  <Typography
                                    component="legend"
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 0.15, fontSize: "0.7rem" }}
                                  >
                                    Ubicación (flecha)
                                  </Typography>
                                  <RadioGroup
                                    row
                                    aria-label="Ubicación del acorde respecto a la sílaba"
                                    name={`chord-placement-${sec.id}-${insertAt}`}
                                    value={normalizeChordPlacement(placementArr[insertAt])}
                                    onChange={(e) => {
                                      const v = normalizeChordPlacement(e.target.value);
                                      const p = placementArr.slice();
                                      while (p.length < progression.length) p.push("on");
                                      p[insertAt] = v;
                                      onUpdate({ chordAnchorPlacement: p });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      flexWrap: "nowrap",
                                      justifyContent: "space-between",
                                      columnGap: 0.25,
                                      ml: 0,
                                    }}
                                  >
                                    <Tooltip title={CHORD_PLACEMENT_LABELS.before}>
                                      <FormControlLabel
                                        value="before"
                                        labelPlacement="bottom"
                                        control={<Radio size="small" sx={{ py: 0, px: 0 }} />}
                                        label={<KeyboardArrowLeft sx={{ fontSize: 22, display: "block", mt: -0.25 }} />}
                                        sx={{ mr: 0, ml: 0, alignItems: "center", flexDirection: "column", gap: 0 }}
                                      />
                                    </Tooltip>
                                    <Tooltip title={CHORD_PLACEMENT_LABELS.on}>
                                      <FormControlLabel
                                        value="on"
                                        labelPlacement="bottom"
                                        control={<Radio size="small" sx={{ py: 0, px: 0 }} />}
                                        label={<KeyboardArrowUp sx={{ fontSize: 22, display: "block", mt: -0.25 }} />}
                                        sx={{ mr: 0, ml: 0, alignItems: "center", flexDirection: "column", gap: 0 }}
                                      />
                                    </Tooltip>
                                    <Tooltip title={CHORD_PLACEMENT_LABELS.after}>
                                      <FormControlLabel
                                        value="after"
                                        labelPlacement="bottom"
                                        control={<Radio size="small" sx={{ py: 0, px: 0 }} />}
                                        label={<KeyboardArrowRight sx={{ fontSize: 22, display: "block", mt: -0.25 }} />}
                                        sx={{ mr: 0, ml: 0, alignItems: "center", flexDirection: "column", gap: 0 }}
                                      />
                                    </Tooltip>
                                  </RadioGroup>
                                </FormControl>
                              </Stack>
                            )}
                          </Box>
                        );
                      })()}
                    </Fragment>
                  ))}
                </Box>
              )}
            </Box>

            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.5} sx={{ mt: 0.75 }}>
              <Button size="small" variant="outlined" onClick={repartirCompas} disabled={progression.length === 0}>
                Repartir {bar} pulsos (opcional)
              </Button>
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="stretch" sx={{ width: "100%" }}>
            <TextField
              label="Letra de esta parte"
              size="small"
              multiline
              minRows={4}
              value={sec.lyrics ?? ""}
              onChange={(e) => onLyricsChange(e.target.value)}
              placeholder={"Ej.\nHoy camino solo\npor la ciudad"}
              helperText={
                totalSyllables > 0
                  ? `${totalSyllables} sílabas (aprox.). Cada acorde nuevo usa la sílaba siguiente al máximo ya usado; si cambias una sílaba, las que iban «atrás» se recolocan hacia adelante.`
                  : "Opcional: con letra escrita podrás indicar en qué sílaba entra cada acorde."
              }
              sx={{ flex: "1 1 0", minWidth: 0 }}
            />
            <Paper
              variant="outlined"
              sx={{
                flex: "1 1 0",
                minWidth: 0,
                p: 1.25,
                bgcolor: (t) => (t.palette.mode === "dark" ? "grey.900" : "grey.50"),
                maxHeight: 280,
                overflow: "auto",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 1 }}>
                Vista letra + acordes
              </Typography>
              {totalSyllables === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                  Escribe la letra a la izquierda: aquí verás cada sílaba con el acorde encima según lo elijas en la pista.
                </Typography>
              ) : (
                previewSegmentLines.map((segments, li) => {
                  const lineIsActive =
                    isPreviewing &&
                    activeLyricLineIndex != null &&
                    activeLyricLineIndex === li &&
                    activeSyllable1Based != null;
                  return (
                    <Box
                      key={li}
                      component="div"
                      sx={{
                        mb: segments.length === 0 ? 0.5 : 1,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        borderRadius: 1,
                        px: 0.5,
                        mx: -0.5,
                        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
                        ...(lineIsActive
                          ? {
                              bgcolor: (t) =>
                                alpha(t.palette.success.main, previewPaused ? 0.08 : 0.14),
                              boxShadow: (t) =>
                                `0 0 0 2px ${alpha(t.palette.success.main, previewPaused ? 0.28 : 0.45)}, 0 0 28px ${alpha(t.palette.success.main, previewPaused ? 0.12 : 0.22)}`,
                            }
                          : {}),
                      }}
                    >
                      {segments.length === 0 ? (
                        <Box sx={{ minHeight: 8 }} />
                      ) : (
                        <LyricPreviewLine
                          segments={segments}
                          lineIndex={li}
                          onMap={onMap}
                          beforeMap={beforeMap}
                          afterMap={afterMap}
                          isPreviewing={isPreviewing}
                          previewPaused={previewPaused}
                          activePreviewSlot={activePreviewSlot}
                          activeSyllable1Based={activeSyllable1Based}
                          liveChordSymbol={liveChordSymbol}
                        />
                      )}
                    </Box>
                  );
                })
              )}
            </Paper>
          </Stack>

          {removedStack.length > 0 && (
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <UndoIcon sx={{ fontSize: 16 }} />
                Quitados — pulsa para volver a poner (con sus pulsos)
              </Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5}>
                {removedStack.map((item, rIdx) => (
                  <Chip
                    key={`rm-${rIdx}-${item.sym}-${item.beats}`}
                    size="small"
                    label={`${item.sym} (${item.beats}p)`}
                    onClick={() => restoreRemoved(rIdx)}
                    variant="outlined"
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 0.35 }}>
              Paleta (escala en {refKeyRaw ? `"${refKeyRaw}"` : "—"})
            </Typography>
            {!ctx.valid ? (
              <Typography variant="caption" color="text.secondary">
                Indica tonalidad general o de esta parte (ej. <strong>Sol</strong>, <strong>Lam</strong>, <strong>Sib</strong>) para
                ver tríadas diatónicas como en teoría musical: no todos los acordes encajan en una tonalidad.
              </Typography>
            ) : (
              <>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  {ctx.label} · pulsa para añadir al final; arrastra solo acordes que ya están en la pista para reordenar
                </Typography>
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5} sx={{ mb: 0.75 }}>
                  {ctx.triads.map((sym) => (
                    <Chip
                      key={sym}
                      size="small"
                      label={sym}
                      variant="outlined"
                      onClick={() => appendChord(sym)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Stack>
                {extras.length > 0 && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      Dominantes secundarias / sustitutos (muy usados en pop)
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5}>
                      {extras.map((sym) => (
                        <Chip
                          key={sym}
                          size="small"
                          label={sym}
                          variant="outlined"
                          color="secondary"
                          onClick={() => appendChord(sym)}
                          sx={{ cursor: "pointer" }}
                        />
                      ))}
                    </Stack>
                  </>
                )}
              </>
            )}
          </Box>

          <TextField
            label="Pegar o editar como texto"
            size="small"
            fullWidth
            value={sec.chordsLine}
            onChange={(e) => onChordsLineChange(e.target.value)}
            placeholder="Ej. G  Em  C  D"
            helperText="Donde el símbolo no cambia, se mantienen los pulsos. Texto nuevo hereda el pulso del acorde de la izquierda (o compás si es el primero). Opcional: «Repartir N pulsos»."
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
