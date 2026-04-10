import React, { useEffect, useRef, useMemo } from 'react';
import * as Tone from 'tone';
import { VISIBLE_RANGE, HAND_COLORS } from '../../../piano/constants';
import {
  timeStrToBeats,
  durationToBeats,
  normalizeNote,
} from '../../../piano/utils/noteUtils';

const KEY_STRIP_WIDTH = 44;
const MIN_BARS = 4;
const BEATS_PER_BAR = 4;
const PX_PER_BEAT = 24;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  void main() {
    vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
    clip.y = -clip.y;
    gl_Position = vec4(clip, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

function hexToRgba(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return [1, 1, 1, 1];
  return [
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255,
    parseInt(m[3], 16) / 255,
    1,
  ];
}

/** Posición del playhead en pulsos leyendo Tone (sin depender de props que cambian cada frame). */
function getTransportPlayheadBeats() {
  try {
    const st = Tone.Transport.state;
    if (st === 'stopped') return null;
    if (st === 'started' || st === 'paused') {
      const pos = Tone.Transport.position;
      const posStr = typeof pos === 'string' ? pos : String(pos);
      const beats = timeStrToBeats(posStr);
      return Number.isNaN(beats) ? null : beats;
    }
  } catch {
    /* tone no listo */
  }
  return null;
}

/** Convierte un rect [x, y, w, h] en 6 vértices (2 triángulos) para WebGL. */
function quadToVertices(x, y, w, h, out, offset) {
  const x2 = x + w;
  const y2 = y + h;
  out[offset + 0] = x;
  out[offset + 1] = y;
  out[offset + 2] = x2;
  out[offset + 3] = y;
  out[offset + 4] = x;
  out[offset + 5] = y2;
  out[offset + 6] = x;
  out[offset + 7] = y2;
  out[offset + 8] = x2;
  out[offset + 9] = y;
  out[offset + 10] = x2;
  out[offset + 11] = y2;
}

/**
 * WebGLPianoRoll — props estables (memo): no pasar playhead desde React.
 * `isPlaying` activa el bucle requestAnimationFrame; el playhead se lee de Tone.Transport.
 */
function WebGLPianoRoll({
  notes = [],
  bpm: _bpm = 120,
  isPlaying = false,
  width = 1000,
  height = 420,
  chordsByBar = [],
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderRef = useRef(() => {});
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const noteToRow = useMemo(() => {
    const m = {};
    [...VISIBLE_RANGE].reverse().forEach((note, i) => {
      m[note] = i;
    });
    return m;
  }, []);

  const { totalBeats, rollWidth, rowCount, rowHeight, noteRects } = useMemo(() => {
    let maxEnd = MIN_BARS * BEATS_PER_BAR;
    notes.forEach((n) => {
      const start = timeStrToBeats(n.time);
      const dur = durationToBeats(n.duration);
      if (!Number.isNaN(start)) maxEnd = Math.max(maxEnd, start + dur);
    });
    const totalBeats = Math.max(maxEnd, MIN_BARS * BEATS_PER_BAR);
    const rw = Math.max(width - KEY_STRIP_WIDTH, totalBeats * PX_PER_BEAT);
    const rc = VISIBLE_RANGE.length;
    const rh = height / rc;

    const rects = [];
    notes.forEach((n, index) => {
      const noteName = normalizeNote(n.note);
      const row = noteToRow[noteName];
      if (row === undefined) return;
      const startBeats = timeStrToBeats(n.time);
      if (Number.isNaN(startBeats)) return;
      const durBeats = durationToBeats(n.duration);
      const x = KEY_STRIP_WIDTH + startBeats * PX_PER_BEAT;
      const noteWidth = Math.max(durBeats * PX_PER_BEAT, 4);
      const y = row * rh + 1;
      const noteHeight = rh - 2;
      rects.push({
        index,
        x,
        y,
        w: noteWidth,
        h: noteHeight,
        startBeats,
        durBeats,
        hand: n.hand === 'L' ? 'L' : 'R',
      });
    });

    return {
      totalBeats,
      rollWidth: rw,
      rowCount: rc,
      rowHeight: rh,
      noteRects: rects,
    };
  }, [notes, width, noteToRow, height]);

  const fullWidth = KEY_STRIP_WIDTH + rollWidth;
  const numBars = Math.max(1, Math.ceil((totalBeats || 0) / BEATS_PER_BAR));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl2', { antialias: false }) ||
      canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader:', gl.getShaderInfoLog(vs));
      return;
    }
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader:', gl.getShaderInfoLog(fs));
      return;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program:', gl.getProgramInfoLog(program));
      return;
    }

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const colorLoc = gl.getUniformLocation(program, 'u_color');

    const buffer = gl.createBuffer();

    function drawQuads(vertices, color) {
      if (vertices.length === 0) return;
      gl.uniform4fv(colorLoc, color);
      const buf = vertices instanceof Float32Array ? vertices : new Float32Array(vertices);
      gl.bufferData(gl.ARRAY_BUFFER, buf, gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, buf.length / 2);
    }

    const numBarsGrid = Math.ceil(totalBeats / BEATS_PER_BAR);
    const gridVertCount = (numBarsGrid + 1) * 12;
    const gridVerts = new Float32Array(gridVertCount);
    const tmpQuad = new Array(12);
    for (let bar = 0; bar <= numBarsGrid; bar++) {
      const x = KEY_STRIP_WIDTH + bar * BEATS_PER_BAR * PX_PER_BEAT;
      const lineW = bar % 4 === 0 ? 1.5 : 1;
      quadToVertices(x, 0, lineW, height, tmpQuad, 0);
      const o = bar * 12;
      for (let i = 0; i < 12; i++) gridVerts[o + i] = tmpQuad[i];
    }

    const hGridVertCount = (rowCount + 1) * 12;
    const hGridVerts = new Float32Array(hGridVertCount);
    for (let r = 0; r <= rowCount; r++) {
      const y = r * rowHeight;
      quadToVertices(KEY_STRIP_WIDTH, y, fullWidth - KEY_STRIP_WIDTH, 1, tmpQuad, 0);
      const o = r * 12;
      for (let i = 0; i < 12; i++) hGridVerts[o + i] = tmpQuad[i];
    }

    let lastPlayheadX = null;
    let lastDpr = 0;

    function render() {
      const playheadBeats = getTransportPlayheadBeats();

      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(fullWidth * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h || lastDpr !== dpr) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${fullWidth}px`;
        canvas.style.height = `${height}px`;
        gl.viewport(0, 0, w, h);
        lastDpr = dpr;
      }

      gl.clearColor(0.07, 0.07, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(resolutionLoc, fullWidth, height);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      for (let i = 0; i < rowCount; i++) {
        const y = i * rowHeight;
        const noteName = VISIBLE_RANGE[rowCount - 1 - i];
        const isBlack = noteName.includes('#');
        const r = isBlack ? 0x2d / 255 : 0x1a / 255;
        const g = isBlack ? 0x2d / 255 : 0x1a / 255;
        const b = isBlack ? 0x2d / 255 : 0x1a / 255;
        quadToVertices(0, y, KEY_STRIP_WIDTH, rowHeight + 1, tmpQuad, 0);
        drawQuads(tmpQuad, [r, g, b, 1]);
      }

      if (gridVerts.length > 0) {
        gl.uniform4fv(colorLoc, [0.27, 0.27, 0.27, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, gridVerts, gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, gridVerts.length / 2);
      }

      if (hGridVerts.length > 0) {
        gl.uniform4fv(colorLoc, [0.165, 0.165, 0.165, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, hGridVerts, gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, hGridVerts.length / 2);
      }

      const viewLeft = container ? container.scrollLeft : 0;
      const viewRight = container ? container.scrollLeft + container.clientWidth : fullWidth;
      const marginPx = 32;
      const colorL = hexToRgba(HAND_COLORS.L);
      const colorR = hexToRgba(HAND_COLORS.R);
      const batchLInner = [];
      const batchRInner = [];
      const batchLGlow = [];
      const batchRGlow = [];
      noteRects.forEach((rect) => {
        if (rect.x + rect.w < viewLeft - marginPx || rect.x > viewRight + marginPx) return;
        const isActive =
          playheadBeats != null &&
          playheadBeats >= rect.startBeats &&
          playheadBeats <= rect.startBeats + rect.durBeats;
        quadToVertices(rect.x, rect.y, rect.w, rect.h, tmpQuad, 0);
        if (rect.hand === 'L') for (let i = 0; i < 12; i++) batchLInner.push(tmpQuad[i]);
        else for (let i = 0; i < 12; i++) batchRInner.push(tmpQuad[i]);

        if (isActive) {
          const glowX = rect.x - 1;
          const glowY = rect.y - 1;
          const glowW = rect.w + 2;
          const glowH = rect.h + 2;
          quadToVertices(glowX, glowY, glowW, glowH, tmpQuad, 0);
          if (rect.hand === 'L') for (let i = 0; i < 12; i++) batchLGlow.push(tmpQuad[i]);
          else for (let i = 0; i < 12; i++) batchRGlow.push(tmpQuad[i]);
        }
      });
      if (batchLGlow.length > 0) {
        gl.uniform4fv(colorLoc, colorL);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(batchLGlow), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, batchLGlow.length / 2);
      }
      if (batchRGlow.length > 0) {
        gl.uniform4fv(colorLoc, colorR);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(batchRGlow), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, batchRGlow.length / 2);
      }
      if (batchLInner.length > 0) {
        gl.uniform4fv(colorLoc, colorL);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(batchLInner), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, batchLInner.length / 2);
      }
      if (batchRInner.length > 0) {
        gl.uniform4fv(colorLoc, colorR);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(batchRInner), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, batchRInner.length / 2);
      }

      if (playheadBeats != null && playheadBeats >= 0) {
        const targetX = KEY_STRIP_WIDTH + playheadBeats * PX_PER_BEAT;
        if (lastPlayheadX == null) {
          lastPlayheadX = targetX;
        } else {
          const alpha = 0.35;
          lastPlayheadX = lastPlayheadX + (targetX - lastPlayheadX) * alpha;
        }
        const drawX = lastPlayheadX;
        if (drawX >= viewLeft && drawX <= viewRight) {
          quadToVertices(drawX, 0, 2, height, tmpQuad, 0);
          gl.uniform4fv(colorLoc, [0, 1, 0.533, 1]);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tmpQuad), gl.DYNAMIC_DRAW);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      } else {
        lastPlayheadX = null;
      }
    }

    renderRef.current = render;
    render();

    const onScroll = () => {
      renderRef.current();
    };
    if (container) container.addEventListener('scroll', onScroll);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            renderRef.current();
          })
        : null;
    if (resizeObserver && container) resizeObserver.observe(container);

    return () => {
      if (container) container.removeEventListener('scroll', onScroll);
      resizeObserver?.disconnect();
      renderRef.current = () => {};
    };
  }, [totalBeats, rollWidth, rowCount, rowHeight, noteRects, fullWidth, height]);

  useEffect(() => {
    let animationId = 0;
    const tick = () => {
      renderRef.current();
      if (isPlayingRef.current) {
        animationId = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) {
      tick();
    }
    return () => {
      cancelAnimationFrame(animationId);
      renderRef.current();
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} style={{ overflow: 'auto', maxWidth: '100%' }}>
      <div
        style={{
          position: 'relative',
          width: fullWidth,
          height,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            background: '#111',
            borderRadius: 4,
          }}
        />

        {Array.isArray(chordsByBar) && chordsByBar.some((c) => c && c.trim()) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 20,
              pointerEvents: 'none',
              fontSize: 10,
              color: '#ddd',
            }}
          >
            {Array.from({ length: numBars }).map((_, barIdx) => {
              const label = chordsByBar[barIdx];
              if (!label) return null;
              const x = KEY_STRIP_WIDTH + barIdx * BEATS_PER_BAR * PX_PER_BEAT + 4;
              return (
                <div
                  key={barIdx}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: 2,
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 3px #000',
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(WebGLPianoRoll, (a, b) =>
  a.notes === b.notes &&
  a.bpm === b.bpm &&
  a.isPlaying === b.isPlaying &&
  a.width === b.width &&
  a.height === b.height &&
  a.chordsByBar === b.chordsByBar
);
