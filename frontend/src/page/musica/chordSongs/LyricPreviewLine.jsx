/* eslint-disable react/prop-types -- vista interna canciones */
import { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/** @typedef {{ sym: string, slot: number }} ChordSlotRef */

function LyricBaselineSpacer() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "block",
        fontSize: "0.875rem",
        lineHeight: 1.35,
        fontWeight: 500,
        color: "transparent",
        userSelect: "none",
        whiteSpace: "pre",
        overflow: "hidden",
      }}
    >
      {"\u00a0"}
    </Box>
  );
}

function chordLabel(entries) {
  if (!entries?.length) return "";
  return entries.map((e) => e.sym).join(" · ");
}

function slotSetActive(entries, activePreviewSlot) {
  return entries?.some((e) => e.slot === activePreviewSlot) ?? false;
}

function ChordOverText({
  entries,
  isPreviewing,
  activePreviewSlot,
  liveChordSymbol,
  fallbackTransparent,
}) {
  const chordStr = chordLabel(entries);
  const active = isPreviewing && slotSetActive(entries, activePreviewSlot);
  const top = active && liveChordSymbol ? liveChordSymbol : chordStr;
  const show = Boolean(top);
  return (
    <Typography
      variant="caption"
      component="span"
      sx={{
        display: "block",
        fontWeight: 900,
        fontSize: active ? "0.8rem" : undefined,
        color: show ? (active ? "success.main" : "primary.main") : fallbackTransparent ? "transparent" : "transparent",
        minHeight: 18,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
        textShadow: active ? (t) => `0 0 10px ${alpha(t.palette.success.main, 0.9)}` : "none",
      }}
    >
      {top || "\u00a0"}
    </Typography>
  );
}

/**
 * Una línea de letra con acordes (encima / antes / después de sílaba).
 * @param {object} props
 */
export default function LyricPreviewLine({
  segments,
  lineIndex,
  onMap,
  beforeMap,
  afterMap,
  isPreviewing,
  previewPaused,
  activePreviewSlot,
  activeSyllable1Based,
  liveChordSymbol,
}) {
  const nodes = [];
  const consumedAfter = new Set();
  let lastSylIdx = null;

  const pushBefore = (syllableIndex, keyPrefix) => {
    const list = beforeMap.get(syllableIndex);
    if (!list?.length) return;
    nodes.push(
      <Box
        key={keyPrefix}
        component="span"
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          verticalAlign: "bottom",
          alignItems: "center",
          mx: 0.125,
        }}
      >
        <ChordOverText
          entries={list}
          isPreviewing={isPreviewing}
          activePreviewSlot={activePreviewSlot}
          liveChordSymbol={liveChordSymbol}
          fallbackTransparent
        />
        <LyricBaselineSpacer />
      </Box>,
    );
  };

  const pushAfterStrip = (syllableIndex, keyPrefix) => {
    if (consumedAfter.has(syllableIndex)) return;
    const list = afterMap.get(syllableIndex);
    if (!list?.length) return;
    consumedAfter.add(syllableIndex);
    const active = isPreviewing && slotSetActive(list, activePreviewSlot);
    nodes.push(
      <Box
        key={keyPrefix}
        component="span"
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          verticalAlign: "bottom",
          alignItems: "center",
          mx: 0.15,
          borderRadius: 0.75,
          px: active ? 0.2 : 0,
          boxShadow: active
            ? (t) => `0 0 14px ${alpha(t.palette.success.main, previewPaused ? 0.35 : 0.6)}`
            : "none",
        }}
      >
        <ChordOverText
          entries={list}
          isPreviewing={isPreviewing}
          activePreviewSlot={activePreviewSlot}
          liveChordSymbol={liveChordSymbol}
          fallbackTransparent
        />
        <LyricBaselineSpacer />
      </Box>,
    );
  };

  for (let j = 0; j < segments.length; j++) {
    const seg = segments[j];
    const next = segments[j + 1];

    if (seg.type === "space") {
      if (lastSylIdx != null && !consumedAfter.has(lastSylIdx) && afterMap.get(lastSylIdx)?.length) {
        const list = afterMap.get(lastSylIdx);
        consumedAfter.add(lastSylIdx);
        const active = isPreviewing && slotSetActive(list, activePreviewSlot);
        nodes.push(
          <Box
            key={`${lineIndex}-spc-${j}`}
            component="span"
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              verticalAlign: "bottom",
              alignItems: "center",
              borderRadius: 0.75,
              px: active ? 0.2 : 0,
              boxShadow: active
                ? (t) => `0 0 18px ${alpha(t.palette.success.main, previewPaused ? 0.35 : 0.65)}`
                : "none",
            }}
          >
            <ChordOverText
              entries={list}
              isPreviewing={isPreviewing}
              activePreviewSlot={activePreviewSlot}
              liveChordSymbol={liveChordSymbol}
              fallbackTransparent
            />
            <Box
              component="span"
              sx={{
                whiteSpace: "pre",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: 1.35,
                color: active ? "success.main" : "text.primary",
              }}
            >
              {seg.text}
            </Box>
          </Box>,
        );
      } else {
        nodes.push(
          <Box
            key={`${lineIndex}-g-${j}`}
            component="span"
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              verticalAlign: "bottom",
              alignItems: "stretch",
            }}
          >
            <Box sx={{ minHeight: 18, flexShrink: 0 }} aria-hidden />
            <Box
              component="span"
              sx={{
                whiteSpace: "pre",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: 1.35,
              }}
            >
              {seg.text}
            </Box>
          </Box>,
        );
      }
      continue;
    }

    const idx = seg.index;
    if (lastSylIdx != null && !consumedAfter.has(lastSylIdx) && next?.type === "syllable" && afterMap.get(lastSylIdx)?.length) {
      pushAfterStrip(lastSylIdx, `${lineIndex}-aft-${j}-between`);
    }

    pushBefore(idx, `${lineIndex}-bef-${j}`);

    const onList = onMap.get(idx) || [];
    const chordStr = chordLabel(onList);
    const sylIsActive =
      isPreviewing && activeSyllable1Based != null && idx === activeSyllable1Based && slotSetActive(onList, activePreviewSlot);
    const chordTop = sylIsActive && liveChordSymbol ? liveChordSymbol : chordStr;
    const showChordGreen = Boolean(chordTop);

    nodes.push(
      <Box
        key={`${lineIndex}-y-${idx}-${j}`}
        component="span"
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          verticalAlign: "bottom",
          alignItems: "center",
          borderRadius: 0.75,
          px: sylIsActive ? 0.25 : 0,
          transition: "box-shadow 0.12s ease",
          ...(sylIsActive
            ? {
                boxShadow: (t) => `0 0 16px ${alpha(t.palette.success.main, previewPaused ? 0.35 : 0.65)}`,
              }
            : {}),
        }}
      >
        <Typography
          variant="caption"
          component="span"
          sx={{
            display: "block",
            fontWeight: 900,
            fontSize: sylIsActive ? "0.8rem" : undefined,
            color: showChordGreen ? (sylIsActive ? "success.main" : "primary.main") : "transparent",
            minHeight: 18,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            textShadow: sylIsActive ? (t) => `0 0 10px ${alpha(t.palette.success.main, 0.9)}` : "none",
          }}
        >
          {chordTop || "\u00a0"}
        </Typography>
        <Box
          component="span"
          sx={{
            fontWeight: sylIsActive ? 800 : 500,
            fontSize: "0.875rem",
            lineHeight: 1.35,
            color: sylIsActive ? "success.main" : "text.primary",
            textShadow: sylIsActive ? (t) => `0 0 12px ${alpha(t.palette.success.main, 0.45)}` : "none",
          }}
        >
          {seg.text}
        </Box>
      </Box>,
    );
    lastSylIdx = idx;
  }

  if (lastSylIdx != null && !consumedAfter.has(lastSylIdx) && afterMap.get(lastSylIdx)?.length) {
    pushAfterStrip(lastSylIdx, `${lineIndex}-aft-end`);
  }

  return <Fragment>{nodes}</Fragment>;
}
