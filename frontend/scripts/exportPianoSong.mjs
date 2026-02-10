import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { notesToPlay } from '../src/page/piano/arrayMusic.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../src/page/piano/song.json');
const payload = {
  title: 'Canción completa',
  bpm: 120,
  notes: notesToPlay,
};
writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
console.log('Written:', outPath);
