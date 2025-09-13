import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';





// const notesToPlay = [
//   { note: 'C5', time: '0:0:0', duration: '4n' },
//   { note: 'F4', time: '0:0:0', duration: '4n' },
//   { note: 'F3', time: '0:0:0', duration: '1n' },

//   { note: 'C5', time: '0:1:2', duration: '4n' },
//   { note: 'F4', time: '0:1:2', duration: '4n' },

//   { note: 'C5', time: '0:3:0', duration: '4n' },
//   { note: 'F4', time: '0:3:0', duration: '4n' },

//   { note: 'Db3', time: '0:4:0', duration: '1n' },
//   { note: 'Db5', time: '0:4:0', duration: '4n' },
//   { note: 'F4', time: '0:4:0', duration: '4n' },

//   { note: 'Db5', time: '0:5:2', duration: '4n' },
//   { note: 'F4', time: '0:5:2', duration: '4n' },

//   { note: 'Db5', time: '0:7:0', duration: '4n' },
//   { note: 'F4', time: '0:7:0', duration: '4n' },

//   { note: 'Ab2', time: '0:8:0', duration: '1n' },
//   { note: 'Eb4', time: '0:8:0', duration: '4n' },
//   { note: 'C5', time: '0:8:0', duration: '4n' },

//   { note: 'Eb4', time: '0:9:2', duration: '4n' },
//   { note: 'C5', time: '0:9:2', duration: '4n' },

//   { note: 'Eb4', time: '0:11:0', duration: '4n' },
//   { note: 'C5', time: '0:11:0', duration: '4n' },

//   { note: 'Db3', time: '0:12:0', duration: '1n' },
//   { note: 'Eb4', time: '0:12:0', duration: '4n' },
//   { note: 'Bb4', time: '0:12:0', duration: '4n' },

//   { note: 'Eb4', time: '0:13:2', duration: '4n' },
//   { note: 'Bb4', time: '0:13:2', duration: '4n' },

//   { note: 'Eb4', time: '0:15:0', duration: '4n' },
//   { note: 'Bb4', time: '0:15:0', duration: '4n' },



// ];

const notesToPlay = [
  //1.- tempo
 { note: 'Ab2', time: '0:0:0', duration: '4n',hand:'L' },{ note: 'Eb4', time: '0:0:0', duration: '8n',hand:'R' },{ note: 'Ab4', time: '0:0:0', duration: '8n',hand:'R' },{ note: 'C5', time: '0:0:0', duration: '8n',hand:'R' },{ note: 'Eb5', time: '0:0:0', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:0:2', duration: '8n',hand:'R' },
  { note: 'Ab3', time: '0:1:0', duration: '2n',hand:'L' },
  { note: 'Ab4', time: '0:1:2', duration: '8n',hand:'R' }, { note: 'Eb5', time: '0:1:2', duration: '8n',hand:'R' },
  { note: 'Eb4', time: '0:2:0', duration: '8n',hand:'R' },
  { note: 'Ab4', time: '0:2:2', duration: '8n',hand:'R' },
  { note: 'Eb5', time: '0:3:0', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:3:2', duration: '8n',hand:'R' },
  // 2.- tempo

  { note: 'Ab3', time: '0:4:0', duration: '1n',hand:'L' }, { note: 'Eb5', time: '0:4:0', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:4:2', duration: '8n',hand:'R' },
  { note: 'Ab4', time: '0:5:0', duration: '8n',hand:'R' },
  { note: 'Eb5', time: '0:5:2', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:6:0', duration: '8n',hand:'R' },
  { note: 'Ab4', time: '0:6:2', duration: '8n',hand:'R' },
  { note: 'Eb4', time: '0:7:0', duration: '8n',hand:'R' },

  // 3.- tempo

  { note: 'F2', time: '0:8:0', duration: '8n',hand:'L' },{ note: 'F4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '4n',hand:'R' },
  { note: 'C3', time: '0:8:2', duration: '2n',hand:'L' },
  { note: 'F4', time: '0:9:0', duration: '8n',hand:'R' },
  { note: 'G4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'Ab4', time: '0:10:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:10:2', duration: '4n',hand:'R' },
  { note: 'C3', time: '0:11:0', duration: '4n',hand:'L' },
  { note: 'F4', time: '0:11:2', duration: '8n',hand:'R' },
  // 4.- tempo

  { note: 'F2', time: '0:12:0', duration: '8n',hand:'L' },
  { note: 'C3', time: '0:12:2', duration: '2n',hand:'L' },
  { note: 'F4', time: '0:13:0', duration: '8n',hand:'R' },
  { note: 'G4', time: '0:13:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:13:2', duration: '4n',hand:'R' },
  { note: 'Ab4', time: '0:14:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:14:2', duration: '4n',hand:'R' },
  { note: 'C3', time: '0:14:2', duration: '4n',hand:'R' },
  { note: 'F4', time: '0:15:0', duration: '8n',hand:'R' },
  // 5.- tempo

];


const PianoRoll = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const [startTime, setStartTime] = useState(null);

  const visibleRange = { min: 36, max: 84 }; // C2 to C6
  const pianoKeys = Array.from({ length: visibleRange.max - visibleRange.min + 1 }, (_, i) => visibleRange.max - i);

  const canvasWidth = 1200;
  const canvasHeight = 600;
  const keyHeight = canvasHeight / pianoKeys.length;
  const pixelsPerSecond = 100;
  const sampler = new Tone.Sampler({
  urls: {
    "C4": "C4.mp3",
    "Db4": "Db4.mp3",
    "Eb4": "Eb4.mp3",
    "F4": "F4.mp3",
    "Gb4": "Gb4.mp3",
    "Ab4": "Ab4.mp3",
    "Bb4": "Bb4.mp3",
    "C5": "C5.mp3",
    "Db5": "Db5.mp3",
    "Eb5": "Eb5.mp3",
    "F5": "F5.mp3",
    "Gb5": "Gb5.mp3",
    
  },
  release: 1,
  baseUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/",
}).toDestination();

const exportToMidi = () => {
  const midi = new Midi();
  const track = midi.addTrack();
  track.name = "Piano Roll Export";

  notesToPlay.forEach(note => {
    const time = Tone.Time(note.time).toSeconds();
    const duration = Tone.Time(note.duration).toSeconds();

    track.addNote({
      name: note.note,
      time,
      duration,
      velocity: 0.8,
    });
  });

  const bytes = midi.toArray();
  const blob = new Blob([bytes], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.mid';
  a.click();
  URL.revokeObjectURL(url);
};


  const drawRoll = (ctx, currentTime) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Fondo gris con líneas horizontales (teclas)
    pianoKeys.forEach((midi, index) => {
      const y = index * keyHeight;
      ctx.fillStyle = midi % 12 === 1 || midi % 12 === 3 || midi % 12 === 6 || midi % 12 === 8 || midi % 12 === 10 ? '#222' : '#333';
      ctx.fillRect(0, y, canvasWidth, keyHeight);
      ctx.strokeStyle = '#444';
      ctx.strokeRect(0, y, canvasWidth, keyHeight);

      if (midi % 12 === 0) {
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(`C${Math.floor(midi / 12) - 1}`, 5, y + keyHeight - 4);
      }
    });

  // Líneas de compás y subdivisiones (basadas en tempo real)
const totalSeconds = 10; // tiempo visible
const measureSeconds = Tone.Time("1m").toSeconds();  // 1 compás = 1m
const beatSeconds = Tone.Time("4n").toSeconds();     // 1 negra

for (let t = 0; t <= totalSeconds; t += beatSeconds) {
  const x = t * pixelsPerSecond;

  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasHeight);

  // Línea gruesa para el inicio del compás
  if (Math.abs(t % measureSeconds) < 0.001) {
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
  }

  ctx.stroke();
}

    // Línea roja de reproducción
    let elapsed = 0;
    if (startTime !== null) {
      const now = Tone.now();
      elapsed = now - startTime;
      const x = elapsed * pixelsPerSecond;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    // Dibujar notas
    notesToPlay.forEach(note => {
      const midi = Tone.Frequency(note.note).toMidi();
      const y = (visibleRange.max - midi) * keyHeight;

      const start = Tone.Time(note.time).toSeconds();
      const duration = Tone.Time(note.duration).toSeconds();
      const x = start * pixelsPerSecond;
      const width = duration * pixelsPerSecond;

      const playX = elapsed * pixelsPerSecond;
      if (playX > x && playX < x + width) {
        ctx.fillStyle = '#00bbaa';
        ctx.fillRect(x, y + 1, playX - x, keyHeight - 2);
        ctx.fillStyle = '#00665f';
        ctx.fillRect(playX, y + 1, (x + width) - playX, keyHeight - 2);
      } else {
        ctx.fillStyle = '#00fcd4';
        ctx.fillRect(x, y + 1, width, keyHeight - 2);
      }

      ctx.fillStyle = 'black';
      ctx.font = '9px Arial';
      ctx.fillText(note.note, x + 2, y + keyHeight - 4);
    });
  };

  useEffect(() => {
    let animationId;
    const ctx = canvasRef.current.getContext('2d');

    const renderLoop = () => {
      const currentTime = Tone.now();
      drawRoll(ctx, currentTime);
      if (isPlaying) animationId = requestAnimationFrame(renderLoop);
    };

    if (isPlaying) {
      renderLoop();
    }

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, startTime]);

  const playScore = async () => {
    await Tone.start();



    const synth = sampler;


    Tone.Transport.cancel(); // limpia eventos anteriores
    Tone.Transport.bpm.value = 126;

    notesToPlay.forEach(note => {
      Tone.Transport.schedule(time => {
        synth.triggerAttackRelease(note.note, note.duration, time);
      }, note.time);
    });

    setStartTime(Tone.now());
    setIsPlaying(true);
    Tone.Transport.start();

    // Detener después de cierto tiempo (calculado)
    const maxTime = Math.max(...notesToPlay.map(n => Tone.Time(n.time).toSeconds())) + 2;
    setTimeout(() => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
    }, maxTime * 1000);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎹 Piano Roll Estilo FL Studio (BPM: 126)
      </Typography>
      <Button variant="contained" onClick={playScore} disabled={isPlaying}>
        Reproducir
      </Button>
      <Button variant="outlined" onClick={exportToMidi} sx={{ ml: 2 }}>
  Exportar como .mid
</Button>

      <Box mt={3}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: '1px solid #666', backgroundColor: '#1a1a1a' }}
        />
      </Box>
    </Box>
  );
};

export default PianoRoll;
