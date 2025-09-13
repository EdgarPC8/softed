  // ===== Constantes de compás (asumo 4/4). Ajusta si usas otra métrica:
const BEATS_PER_MEASURE = 4;           // negras por compás
const SIXTEENTHS_PER_BEAT = 4;         // semicorcheas por negra
const SIXTEENTHS_PER_MEASURE = BEATS_PER_MEASURE * SIXTEENTHS_PER_BEAT;

// Mapas simples de duración -> # de semicorcheas (sin puntillos/triolas)
const DUR_TO_16TH = {
  '1n': 16,
  '2n': 8,
  '4n': 4,
  '8n': 2,
  '16n': 1,
};

// --- MBT helpers ---
const mbtTo16ths = (mbt) => {
  const [m, b, s] = mbt.split(':').map(Number);
  return (m * SIXTEENTHS_PER_MEASURE) + (b * SIXTEENTHS_PER_BEAT) + s;
};

const _16thsToMBT = (total16) => {
  const m = Math.floor(total16 / SIXTEENTHS_PER_MEASURE);
  let rest = total16 - m * SIXTEENTHS_PER_MEASURE;
  const b = Math.floor(rest / SIXTEENTHS_PER_BEAT);
  const s = rest - b * SIXTEENTHS_PER_BEAT;
  return `${m}:${b}:${s}`;
};

const shiftMBT = (mbt, { measures=0, beats=0, sixteenths=0 } = {}) => {
  const base = mbtTo16ths(mbt);
  const delta = (measures * SIXTEENTHS_PER_MEASURE) + (beats * SIXTEENTHS_PER_BEAT) + sixteenths;
  return _16thsToMBT(base + delta);
};

// --- Duración de una sección en semicorcheas (aprox), redondeada a compás ---
const sectionLengthIn16ths = (sectionNotes) => {
  if (!sectionNotes.length) return 0;
  let maxEnd16 = 0;
  for (const n of sectionNotes) {
    const start16 = mbtTo16ths(n.time);
    const dur16 = DUR_TO_16TH[n.duration] ?? 0; // si hay puntillos/triolas, añade aquí lógica extra
    const end16 = start16 + dur16;
    if (end16 > maxEnd16) maxEnd16 = end16;
  }
  // redondeo “hacia arriba” al siguiente compás
  const measures = Math.ceil(maxEnd16 / SIXTEENTHS_PER_MEASURE);
  return measures * SIXTEENTHS_PER_MEASURE;
};

const sectionLengthInMeasures = (sectionNotes) => (
  sectionNotes.length ? Math.ceil(sectionLengthIn16ths(sectionNotes) / SIXTEENTHS_PER_MEASURE) : 0
);

// --- Desplazar TODA una sección por X compases/beats/sixteenths ---
const offsetSection = (sectionNotes, offset) => {
  return sectionNotes.map(n => ({
    ...n,
    time: shiftMBT(n.time, offset),
  }));
};

// --- Construir canción pegando secciones en orden ---
// order = [ { name: 'Intro', notes: INTRO }, { name: 'Coro', notes: CHORUS }, ... ]
// Si pasas `forceMeasures`, usamos ese valor en vez de medir automático (útil si quieres
// dejar compases de silencio o si tu sección tiene colas largas).
const buildSongFromSections = (order) => {
  let cursorMeasures = 0; // dónde empieza la siguiente sección, en compases
  const out = [];

  for (const item of order) {
    const lenMeasures = item.forceMeasures ?? sectionLengthInMeasures(item.notes);
    // aplica offset = cursor actual
    const moved = offsetSection(item.notes, { measures: cursorMeasures });
    out.push(...moved);
    // avanza cursor por la longitud de ESTA sección
    cursorMeasures += lenMeasures;
  }
  return out;
};
// === Estrofa (ejemplo, arranca en 0:0:0) ===

// === Coro (otro arreglo distinto, también en 0:0:0) ===


const INTRO =[
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:0:0', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:1:2', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:3:0', duration: '4n',hand:'R' },

  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'Db5', time: '0:4:0', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'Db5', time: '0:5:2', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'Db5', time: '0:7:0', duration: '4n',hand:'R' },

  { note: 'Ab2', time: '0:8:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:9:2', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:11:0', duration: '4n',hand:'R' },

  { note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:12:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:12:0', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:13:2', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:13:2', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:15:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:15:0', duration: '4n',hand:'R' },
]
const VERSE1 =[
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:0:0', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:1:2', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:3:0', duration: '4n',hand:'R' },

  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:4:0', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:5:2', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:7:0', duration: '4n',hand:'R' },

  { note: 'Ab2', time: '0:8:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:9:2', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:11:0', duration: '4n',hand:'R' },

  { note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:12:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:12:0', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:13:2', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:13:2', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:15:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:15:0', duration: '4n',hand:'R' },
]
const VERSE2 =[
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:0:0', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:1:2', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:3:0', duration: '4n',hand:'R' },

  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'Db5', time: '0:4:0', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'Db5', time: '0:5:2', duration: '4n',hand:'R' },

  { note: 'F4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'Db5', time: '0:7:0', duration: '4n',hand:'R' },

  { note: 'Ab2', time: '0:8:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:9:2', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:11:0', duration: '4n',hand:'R' },

  { note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:12:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:12:0', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:13:2', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:13:2', duration: '4n',hand:'R' },

  { note: 'Eb4', time: '0:15:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:15:0', duration: '4n',hand:'R' },
]
const VERSE3 =[
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'F4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:0:0', duration: '4n',hand:'R' },
  { note: 'F4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:1:2', duration: '4n',hand:'R' },
  { note: 'F4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:3:0', duration: '4n',hand:'R' },

  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },{ note: 'Db4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'F4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:4:0', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'F4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:5:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'F4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:7:0', duration: '4n',hand:'R' },


  { note: 'Ab2', time: '0:8:0', duration: '1n',hand:'L' },{ note: 'C4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },
  { note: 'C4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'C4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:11:0', duration: '4n',hand:'R' },


  { note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Bb3', time: '0:12:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:12:0', duration: '4n',hand:'R' },{ note: 'G4', time: '0:12:0', duration: '4n',hand:'R' },
  { note: 'Bb3', time: '0:13:2', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:13:2', duration: '4n',hand:'R' },{ note: 'G4', time: '0:13:2', duration: '4n',hand:'R' },
  { note: 'Bb3', time: '0:15:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:15:0', duration: '4n',hand:'R' },{ note: 'G4', time: '0:15:0', duration: '4n',hand:'R' },
]
const VERSE4 =[
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'C4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:0:0', duration: '4n',hand:'R' },
  { note: 'C4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:1:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:1:2', duration: '4n',hand:'R' },
  { note: 'C4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:3:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:3:0', duration: '4n',hand:'R' },

  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },{ note: 'Db4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'F4', time: '0:4:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:4:0', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:5:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:5:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:7:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:7:0', duration: '4n',hand:'R' },

  { note: 'Ab3', time: '0:8:0', duration: '1n',hand:'L' },{ note: 'C4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },
  { note: 'C4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'C4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'Eb4', time: '0:11:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:11:0', duration: '4n',hand:'R' },

  { note: 'Ab3', time: '0:12:0', duration: '3n',hand:'L' },{ note: 'G4', time: '0:12:0', duration: '3n',hand:'R' },{ note: 'Bb4', time: '0:12:0', duration: '3n',hand:'R' },{ note: 'Eb4', time: '0:12:0', duration: '3n',hand:'R' },
  { note: 'Bb4', time: '0:13:2', duration: '8n',hand:'R' },
  { note: 'Eb4', time: '0:14:0', duration: '8n',hand:'R' },
  { note: 'Eb3', time: '0:14:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:15:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:15:2', duration: '8n',hand:'R' },

]
const VERSE5 = [
  { note: 'Bb2', time: '0:0:0', duration: '8n',hand:'L' },{ note: 'C4', time: '0:0:0', duration: '8n',hand:'R' },{ note: 'Bb4', time: '0:0:0', duration: '8n',hand:'R' },

  { note: 'Db4', time: '0:0:2', duration: '8n',hand:'R' },
  { note: 'F4', time: '0:1:0', duration: '8n',hand:'R' },
  { note: 'Bb3', time: '0:1:2', duration: '8n',hand:'L' },{ note: 'Bb4', time: '0:1:2', duration: '8n',hand:'R' },

  { note: 'C4', time: '0:2:0', duration: '8n',hand:'L' },
  { note: 'Db4', time: '0:2:2', duration: '8n',hand:'L' },
  { note: 'F4', time: '0:3:0', duration: '4n',hand:'L' },
  { note: 'Bb4', time: '0:3:2', duration: '8n',hand:'R' },

  { note: 'Bb3', time: '0:4:0', duration: '8n',hand:'L' },{ note: 'Db5', time: '0:4:0', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:4:2', duration: '8n',hand:'L' }, 
  { note: 'Bb3', time: '0:5:0', duration: '8n',hand:'L' },
  { note: 'C5', time: '0:5:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:6:0', duration: '8n',hand:'L' },
  { note: 'Bb3', time: '0:6:2', duration: '8n',hand:'L' },
  { note: 'Bb4', time: '0:7:0', duration: '4n',hand:'R' },
  { note: 'Bb3', time: '0:7:2', duration: '8n',hand:'L' },

  { note: 'Ab2', time: '0:8:0', duration: '3n',hand:'L' },{ note: 'Ab3', time: '0:8:0', duration: '3n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '4n',hand:'R' },
  { note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'Ab3', time: '0:10:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:11:0', duration: '8n',hand:'R' },
  { note: 'Ab4', time: '0:11:2', duration: '8n',hand:'R' },
  { note: 'Eb2', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Bb3', time: '0:12:0', duration: '2n',hand:'R' },{ note: 'Eb4', time: '0:12:0', duration: '2n',hand:'R' },{ note: 'G4', time: '0:12:0', duration: '2n',hand:'R' },
  { note: 'Bb3', time: '0:13:2', duration: '8n',hand:'R' },{ note: 'Eb4', time: '0:13:2', duration: '8n',hand:'R' },
  { note: 'Eb3', time: '0:14:2', duration: '3n',hand:'L' },
  { note: 'Bb3', time: '0:15:0', duration: '4n',hand:'R' },
  
];

const VERSE6 = [

  // ...
  { note: 'Bb2', time: '0:0:0', duration: '8n',hand:'L' },{ note: 'C4', time: '0:0:0', duration: '8n',hand:'R' },{ note: 'Bb4', time: '0:0:0', duration: '8n',hand:'R' },

  { note: 'Db4', time: '0:0:2', duration: '8n',hand:'R' },
  { note: 'F4', time: '0:1:0', duration: '8n',hand:'R' },
  { note: 'Bb3', time: '0:1:2', duration: '8n',hand:'L' },{ note: 'Bb4', time: '0:1:2', duration: '8n',hand:'R' },

  { note: 'C4', time: '0:2:0', duration: '8n',hand:'L' },
  { note: 'Db4', time: '0:2:2', duration: '8n',hand:'L' },
  { note: 'F4', time: '0:3:0', duration: '4n',hand:'L' },
  { note: 'Bb4', time: '0:3:2', duration: '8n',hand:'R' },

  { note: 'Bb3', time: '0:4:0', duration: '8n',hand:'L' },{ note: 'Db5', time: '0:4:0', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:4:2', duration: '8n',hand:'L' }, 
  { note: 'Bb3', time: '0:5:0', duration: '8n',hand:'L' },
  { note: 'C5', time: '0:5:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:6:0', duration: '8n',hand:'L' },
  { note: 'Bb3', time: '0:6:2', duration: '8n',hand:'L' },
  { note: 'Bb4', time: '0:7:0', duration: '4n',hand:'R' },
  { note: 'Bb3', time: '0:7:2', duration: '8n',hand:'L' },

  { note: 'Ab2', time: '0:8:0', duration: '3n',hand:'L' },{ note: 'Ab3', time: '0:8:0', duration: '3n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '4n',hand:'R' },
  { note: 'Eb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'C5', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'Ab3', time: '0:10:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:11:0', duration: '8n',hand:'R' },
  { note: 'Ab4', time: '0:11:2', duration: '8n',hand:'R' },
  { note: 'Eb2', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Bb3', time: '0:12:0', duration: '2n',hand:'R' },{ note: 'Eb4', time: '0:12:0', duration: '2n',hand:'R' },{ note: 'G4', time: '0:12:0', duration: '2n',hand:'R' },
  { note: 'Eb5', time: '0:14:0', duration: '2n',hand:'R' },
];
const VERSE7 = [
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
  { note: 'C3', time: '0:14:2', duration: '4n',hand:'L' },
  { note: 'F4', time: '0:15:0', duration: '8n',hand:'R' },
  // ...
];
const VERSE8 = [
  { note: 'Db3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'Db4', time: '0:0:0', duration: '8n',hand:'L' },{ note: 'F4', time: '0:0:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:0:0', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:0:2', duration: '4n',hand:'L' },
  { note: 'F4', time: '0:1:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:1:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:2:0', duration: '4n',hand:'L' },
  { note: 'Db4', time: '0:2:2', duration: '4n',hand:'L' },
  { note: 'F4', time: '0:3:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:3:2', duration: '8n',hand:'R' },

  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },{ note: 'Db5', time: '0:4:0', duration: '8n',hand:'R' },
  { note: 'Db4', time: '0:4:2', duration: '8n',hand:'L' },
  { note: 'F4', time: '0:5:0', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:5:2', duration: '8n',hand:'R' },
  { note: 'Db4', time: '0:6:0', duration: '8n',hand:'L' },
  { note: 'F4', time: '0:6:2', duration: '8n',hand:'R' },
  { note: 'Ab4', time: '0:7:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:7:2', duration: '8n',hand:'R' },
  { note: 'Eb2', time: '0:8:0', duration: '4n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:8:0', duration: '4n',hand:'R' },
  { note: 'Eb3', time: '0:8:2', duration: '4n',hand:'L' },  
  { note: 'Eb4', time: '0:9:0', duration: '8n',hand:'R' },  
  { note: 'Ab4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Bb4', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'Eb3', time: '0:10:0', duration: '4n',hand:'L' },  
  { note: 'Eb4', time: '0:10:2', duration: '8n',hand:'R' },  
  { note: 'Ab4', time: '0:11:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:11:2', duration: '8n',hand:'R' },
  { note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' }, { note: 'G4', time: '0:12:0', duration: '4n',hand:'R' },  
  { note: 'Bb4', time: '0:13:2', duration: '8n',hand:'R' },
  { note: 'Eb5', time: '0:14:0', duration: '2n',hand:'R' },



];
const VERSE9 = [
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'Ab5', time: '0:0:0', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:0:2', duration: '8n',hand:'R' },
  { note: 'F4', time: '0:1:0', duration: '2n',hand:'L' },
  { note: 'G5', time: '0:1:2', duration: '4n',hand:'R' },
  { note: 'C5', time: '0:2:2', duration: '8n',hand:'R' },
  { note: 'F4', time: '0:3:0', duration: '4n',hand:'L' },
  { note: 'F5', time: '0:3:2', duration: '4n',hand:'R' },
  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },
  { note: 'Db4', time: '0:4:2', duration: '4n',hand:'L' },
  { note: 'Ab4', time: '0:5:0', duration: '8n',hand:'R' },
  { note: 'Eb5', time: '0:5:2', duration: '4n',hand:'R' },
  { note: 'Ab4', time: '0:6:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:7:0', duration: '4n',hand:'L' },{ note: 'Db5', time: '0:7:0', duration: '8n',hand:'R' },
  { note: 'Eb4', time: '0:7:2', duration: '8n',hand:'R' },
  { note: 'Ab2', time: '0:8:0', duration: '4n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '8n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '8n',hand:'R' },
  { note: 'Ab3', time: '0:8:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:9:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Eb5', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'Ab3', time: '0:10:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:11:0', duration: '8n',hand:'R' },{ note: 'Ab4', time: '0:11:0', duration: '4n',hand:'R' },
  { note: 'Bb4', time: '0:11:2', duration: '8n',hand:'R' },
  { note: 'Eb2', time: '0:12:0', duration: '2n',hand:'L' },{ note: 'Eb3', time: '0:12:0', duration: '2n',hand:'L' },{ note: 'Eb4', time: '0:12:0', duration: '2n',hand:'R' },{ note: 'F4', time: '0:12:0', duration: '2n',hand:'R' },{ note: 'G4', time: '0:12:0', duration: '2n',hand:'R' },
  { note: 'Eb4', time: '0:14:0', duration: '2n',hand:'R' },
  ];
  const VERSE10 = [
  { note: 'F3', time: '0:0:0', duration: '1n',hand:'L' },{ note: 'Ab5', time: '0:0:0', duration: '8n',hand:'R' },
  { note: 'C5', time: '0:0:2', duration: '8n',hand:'R' },
  { note: 'F4', time: '0:1:0', duration: '2n',hand:'L' },
  { note: 'G5', time: '0:1:2', duration: '4n',hand:'R' },
  { note: 'C5', time: '0:2:2', duration: '8n',hand:'R' },
  { note: 'F4', time: '0:3:0', duration: '4n',hand:'L' },
  { note: 'F5', time: '0:3:2', duration: '4n',hand:'R' },
  { note: 'Db3', time: '0:4:0', duration: '1n',hand:'L' },
  { note: 'Db4', time: '0:4:2', duration: '4n',hand:'L' },
  { note: 'Ab4', time: '0:5:0', duration: '8n',hand:'R' },
  { note: 'Eb5', time: '0:5:2', duration: '4n',hand:'R' },
  { note: 'Ab4', time: '0:6:2', duration: '4n',hand:'R' },
  { note: 'Db4', time: '0:7:0', duration: '4n',hand:'L' },{ note: 'Db5', time: '0:7:0', duration: '8n',hand:'R' },
  { note: 'Eb4', time: '0:7:2', duration: '8n',hand:'R' },
  { note: 'Ab2', time: '0:8:0', duration: '4n',hand:'L' },{ note: 'Eb4', time: '0:8:0', duration: '8n',hand:'R' },{ note: 'Ab4', time: '0:8:0', duration: '4n',hand:'R' },{ note: 'C5', time: '0:8:0', duration: '8n',hand:'R' },
  { note: 'Ab3', time: '0:8:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:9:0', duration: '8n',hand:'R' },
  { note: 'Bb4', time: '0:9:2', duration: '4n',hand:'R' },{ note: 'Eb5', time: '0:9:2', duration: '4n',hand:'R' },
  { note: 'Ab3', time: '0:10:2', duration: '4n',hand:'L' },
  { note: 'Eb4', time: '0:11:0', duration: '8n',hand:'R' },{ note: 'Ab4', time: '0:11:0', duration: '4n',hand:'R' },
  { note: 'Bb4', time: '0:11:2', duration: '8n',hand:'R' },
  { note: 'Eb2', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb3', time: '0:12:0', duration: '1n',hand:'L' },{ note: 'Eb4', time: '0:12:0', duration: '1n',hand:'R' },{ note: 'F4', time: '0:12:0', duration: '1n',hand:'R' },{ note: 'G4', time: '0:12:0', duration: '1n',hand:'R' },
  ];
export const notesToPlay = buildSongFromSections([
  // { name: 'Intro',    notes: INTRO    },
  // { name: 'Verso 1',    notes: VERSE1    },
  // { name: 'Verso 2',    notes: VERSE2    },
  // { name: 'Verso 3',    notes: VERSE3   },
  // { name: 'Verso 4',    notes: VERSE4   },
  // { name: 'Verso 5', notes: VERSE5 },
  // { name: 'Verso 6', notes: VERSE6 },
  { name: 'Verso 7', notes: VERSE7 },
  { name: 'Verso 7', notes: VERSE7 },
  { name: 'Verso 7', notes: VERSE7 },
  { name: 'Verso 7', notes: VERSE7 },
  // { name: 'Verso 8', notes: VERSE8 },
  // { name: 'Verso 8', notes: VERSE7 },
  // { name: 'Verso 8', notes: VERSE8 },
  // { name: 'Verso 9', notes: VERSE9 },
  // { name: 'Verso 9', notes: VERSE10 },
]);


