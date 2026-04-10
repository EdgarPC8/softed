import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSnackbar } from "notistack";
import { getChordSongById, updateChordSong } from "../../../api/musica/chordSongRequest.js";
import {
  defaultHarmonyPlan,
  HARMONY_ROLE_LABELS,
  mergeHarmonyPlanIntoLyricBlocks,
  parseHarmonyPlanFromLyricBlocks,
} from "../../../utils/harmonyPlan.js";
import { isHarmonyMetronomeRunning, startHarmonyMetronome, stopHarmonyMetronome } from "../../../utils/harmonyMetronome.js";
import { createSectionPreviewSession, disposePreviewSampler } from "../../../utils/sectionChordPreview.js";
import HarmonySectionCard from "./HarmonySectionCard.jsx";

function newHarmonySectionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return `hp-${crypto.randomUUID().slice(0, 8)}`;
  return `hp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function unwrapLyricBlocks(v) {
  if (v == null || v === "") return null;
  if (typeof v === "object") return v;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  }
  return null;
}

export default function ChordSongStructurePage() {
  const { id } = useParams();
  const songId = Number(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bpm, setBpm] = useState("");
  const [beatsPerLine, setBeatsPerLine] = useState("4");
  const [songKey, setSongKey] = useState("");
  const [sections, setSections] = useState(() => defaultHarmonyPlan().sections);
  const [previewingIndex, setPreviewingIndex] = useState(null);
  const [previewActiveSlot, setPreviewActiveSlot] = useState(null);
  const [previewPaused, setPreviewPaused] = useState(false);
  const previewSessionRef = useRef(null);
  /** Metrónomo continuo (Tone.Transport); Play alinea los acordes al mismo pulso si está activo. */
  const [metronomeOn, setMetronomeOn] = useState(false);

  const endPreviewUi = useCallback(() => {
    previewSessionRef.current = null;
    setPreviewingIndex(null);
    setPreviewActiveSlot(null);
    setPreviewPaused(false);
  }, []);

  const stopPreview = useCallback(() => {
    previewSessionRef.current?.stop();
  }, []);

  const pausePreview = useCallback(() => {
    previewSessionRef.current?.pause();
    setPreviewPaused(true);
  }, []);

  const resumePreview = useCallback(() => {
    previewSessionRef.current?.resume();
    setPreviewPaused(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getChordSongById(songId);
      const s = res.data;
      setSong(s);
      setBpm(s.bpm != null ? String(s.bpm) : "");
      setBeatsPerLine(s.beatsPerLine != null ? String(s.beatsPerLine) : "4");
      setSongKey(s.originalKey != null ? String(s.originalKey) : "");
      const lb = unwrapLyricBlocks(s.lyricBlocks);
      const plan = parseHarmonyPlanFromLyricBlocks(lb);
      setSections(plan.sections);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("No se pudo cargar la canción.", { variant: "error" });
      setSong(null);
    } finally {
      setLoading(false);
    }
  }, [songId, enqueueSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    return () => {
      previewSessionRef.current?.stop();
      stopHarmonyMetronome();
      disposePreviewSampler();
    };
  }, []);

  useEffect(() => {
    if (!metronomeOn) {
      stopHarmonyMetronome();
      return;
    }
    const bpmNum = Number(bpm);
    const bar = Math.max(1, Math.min(32, Number(beatsPerLine) || 4));
    if (!bpmNum || bpmNum < 30 || bpmNum > 320) {
      stopHarmonyMetronome();
      return;
    }
    void startHarmonyMetronome(bpmNum, bar);
  }, [metronomeOn, bpm, beatsPerLine]);

  const handlePlaySection = async (index, fromChordSlot = 0) => {
    const bpmNum = Number(bpm);
    if (!bpmNum || bpmNum < 30 || bpmNum > 320) {
      enqueueSnackbar("Indica un BPM entre 30 y 320 arriba para escuchar la parte.", { variant: "warning" });
      return;
    }
    previewSessionRef.current?.stop();
    previewSessionRef.current = null;
    setPreviewingIndex(index);
    setPreviewPaused(false);
    setPreviewActiveSlot(null);
    try {
      const beatsPerBar = Math.max(1, Math.min(32, Number(beatsPerLine) || 4));
      const syncToTransport = metronomeOn && isHarmonyMetronomeRunning();
      const session = await createSectionPreviewSession({
        bpm: bpmNum,
        chordsLine: sections[index]?.chordsLine ?? "",
        beatsPerBar,
        chordBeats: sections[index]?.chordBeats,
        syncToTransport,
        startFromChordIndex: fromChordSlot,
        onTick: ({ activeChordSlot }) => {
          setPreviewActiveSlot(activeChordSlot);
        },
        onEnd: endPreviewUi,
      });
      if (!session) {
        enqueueSnackbar("No hay nada que reproducir en esa parte o desde ese acorde.", { variant: "warning" });
        endPreviewUi();
        return;
      }
      previewSessionRef.current = session;
    } catch (e) {
      console.error(e);
      enqueueSnackbar("No se pudo reproducir la vista previa.", { variant: "warning" });
      endPreviewUi();
    }
  };

  const title = song?.title || "Canción";

  const addSection = () => {
    setSections((prev) => {
      const n = prev.length + 1;
      return [
        ...prev,
        {
          id: newHarmonySectionId(),
          label: `Sección ${n}`,
          role: "verse",
          key: "",
          chordsLine: "",
          chordBeats: [],
          lyrics: "",
          chordSyllableAnchors: [],
          chordAnchorPlacement: [],
        },
      ];
    });
  };

  const duplicateSection = (index) => {
    setSections((prev) => {
      const s = prev[index];
      if (!s) return prev;
      const base = (s.label && String(s.label).trim()) || `Parte ${index + 1}`;
      /** Copia explícita de armonía + anclas + ubicación (misma lógica que la original; luego puedes cambiar solo la letra). */
      const copy = {
        id: newHarmonySectionId(),
        label: `${base} (copia)`,
        role: typeof s.role === "string" && s.role in HARMONY_ROLE_LABELS ? s.role : "verse",
        key: s.key != null ? String(s.key) : "",
        chordsLine: typeof s.chordsLine === "string" ? s.chordsLine : "",
        chordBeats: Array.isArray(s.chordBeats) ? [...s.chordBeats] : [],
        lyrics: typeof s.lyrics === "string" ? s.lyrics : "",
        chordSyllableAnchors: Array.isArray(s.chordSyllableAnchors) ? [...s.chordSyllableAnchors] : [],
        chordAnchorPlacement: Array.isArray(s.chordAnchorPlacement) ? [...s.chordAnchorPlacement] : [],
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const removeSection = (index) => {
    setSections((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const updateSection = (index, patch) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const handleSave = async () => {
    if (!song) return;
    setSaving(true);
    try {
      let lb = unwrapLyricBlocks(song.lyricBlocks) || { version: 2, blocks: [] };
      if (!Array.isArray(lb.blocks) || lb.blocks.length === 0) {
        lb = {
          ...lb,
          blocks: [
            {
              id: "b1",
              label: "Canción",
              type: "verse",
              lines: [{ text: "", chords: [] }],
            },
          ],
        };
      }
      const harmonyPlan = { version: 1, sections };
      const merged = mergeHarmonyPlanIntoLyricBlocks(lb, harmonyPlan);
      const bpmNum = bpm.trim() ? Number(bpm) : null;
      const bpl = Math.max(1, Math.min(32, Number(beatsPerLine) || 4));
      await updateChordSong(songId, {
        title: song.title || "Sin título",
        artist: song.artist ?? null,
        originalKey: songKey.trim() || null,
        bpm: bpmNum,
        beatsPerLine: bpl,
        lyricBlocks: merged,
        karaokeSync: song.karaokeSync ?? null,
      });
      const res = await getChordSongById(songId);
      setSong(res.data);
      enqueueSnackbar("Ritmo y secciones guardados.", { variant: "success" });
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Error al guardar.", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const roleEntries = useMemo(() => Object.entries(HARMONY_ROLE_LABELS), []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Cargando…</Typography>
      </Container>
    );
  }

  if (!song) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>No se encontró la canción.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/canciones")}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, pb: 10 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25 }}>
        Ritmo y armonía
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5, lineHeight: 1.4 }}>
        Tonalidad + acordes diatónicos (teoría con{" "}
        <Box component="span" sx={{ fontStyle: "italic" }}>
          Tonal.js
        </Box>
        ). Pulsa la paleta para añadir acordes; arrastra solo los que ya están en la pista para reordenar. Los que no
        pertenecen a la escala se resaltan.
      </Typography>

      <Paper elevation={0} variant="outlined" sx={{ p: 1.25, mb: 1.5 }}>
        <Stack spacing={1}>
          <Stack direction="row" flexWrap="wrap" spacing={1} alignItems="center" useFlexGap sx={{ columnGap: 1, rowGap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, width: { xs: "100%", sm: "auto" } }}>
              Tempo
            </Typography>
            <TextField
              label="BPM"
              type="number"
              size="small"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              inputProps={{ min: 30, max: 320 }}
              sx={{ width: 88 }}
            />
            <TextField
              label="Pulsos / compás"
              type="number"
              size="small"
              value={beatsPerLine}
              onChange={(e) => setBeatsPerLine(e.target.value)}
              inputProps={{ min: 1, max: 32 }}
              sx={{ width: 118 }}
            />
            <TextField
              label="Tonalidad canción"
              size="small"
              value={songKey}
              onChange={(e) => setSongKey(e.target.value)}
              placeholder="Sol, Lam…"
              sx={{ flex: "1 1 160px", minWidth: 140 }}
            />
            <FormControlLabel
              control={
                <Switch checked={metronomeOn} onChange={(e) => setMetronomeOn(e.target.checked)} size="small" />
              }
              label="Metrónomo"
              sx={{ ml: { xs: 0, sm: 0.5 }, userSelect: "none" }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.45 }}>
            Metrónomo: sonido tipo tic-tac (golpe grave en el 1 del compás, clic agudo en los demás pulsos). Suena
            continuo al BPM; con ▶ los acordes entran en el siguiente pulso. Sin metrónomo, ▶ solo reproduce la parte.
            Pausa, parar y guardar están en la barra inferior fija al hacer scroll.
          </Typography>
        </Stack>
      </Paper>

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Partes
        </Typography>
        <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={addSection} variant="outlined">
          Añadir parte
        </Button>
      </Stack>

      <Box sx={{ mb: 2 }}>
        {sections.map((sec, index) => (
          <HarmonySectionCard
            key={sec.id}
            section={sec}
            index={index}
            roleEntries={roleEntries}
            songKey={songKey}
            beatsPerBar={Math.max(1, Math.min(32, Number(beatsPerLine) || 4))}
            isPreviewing={previewingIndex === index}
            activePreviewSlot={previewingIndex === index ? previewActiveSlot : null}
            previewPaused={previewingIndex === index ? previewPaused : false}
            onUpdate={(patch) => updateSection(index, patch)}
            onRemove={() => removeSection(index)}
            onDuplicate={() => duplicateSection(index)}
            onPreviewPart={(slot) => void handlePlaySection(index, slot)}
            sectionsCount={sections.length}
          />
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, mb: 1 }}>
        {title}
      </Typography>

      <Paper
        component="footer"
        elevation={12}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (t) => t.zIndex.drawer - 1,
          borderRadius: 0,
          borderTop: 1,
          borderColor: "divider",
          py: 1.25,
          px: { xs: 1.5, sm: 2 },
          bgcolor: (t) => alpha(t.palette.background.paper, 0.97),
          backdropFilter: "blur(12px)",
          boxShadow: (t) => `0 -4px 24px ${alpha(t.palette.common.black, 0.12)}`,
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 1 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            flexWrap="wrap"
            useFlexGap
          >
            <Stack direction="row" flexWrap="wrap" spacing={1} alignItems="center" useFlexGap sx={{ flex: "1 1 auto" }}>
              {previewingIndex !== null && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "success.main" }}>
                    ▶ Parte {previewingIndex + 1}
                    {previewPaused ? " · pausa" : ""}
                  </Typography>
                  <Button size="small" variant="outlined" color="success" onClick={previewPaused ? resumePreview : pausePreview}>
                    {previewPaused ? "Continuar" : "Pausa"}
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={stopPreview}>
                    Parar
                  </Button>
                </>
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" flexWrap="wrap" useFlexGap>
              <Button variant="contained" onClick={() => void handleSave()} disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </Button>
              <Button size="small" variant="outlined" onClick={() => navigate("/canciones")}>
                Listado
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Paper>
    </Container>
  );
}
