import React, { useState } from 'react';
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import ModeProCreate from './modes/ModeProCreate';
import ModeProPractice from './modes/ModeProPractice';
import ModeProDev from './modes/ModeProDev';
import { usePianoAreaHeight } from '../../../hooks/usePianoAreaHeight';

const MODES = [
  { id: 'crear', label: 'Piano Pro · Crear', desc: 'Editor avanzado con WebGL y acordes por compás', icon: '✏️' },
  { id: 'practica', label: 'Piano Pro · Práctica', desc: 'Practica canciones de la BD con vista Pro', icon: '👆' },
  {
    id: 'desarrollador',
    label: 'Piano Pro · Desarrollador',
    desc: 'Demo pesada (arrayMusic) para probar el canvas WebGL con fluidez',
    icon: '🛠️',
  },
];

export default function PianoProPracticePage() {
  const [mode, setMode] = useState(null);
  const active = mode !== null;
  /** Siempre medir: pantalla de menú y editor deben llenar el hueco bajo el header (sin línea negra). */
  const areaHeight = usePianoAreaHeight(true);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: areaHeight,
        bgcolor: 'background.default',
        ...(active && {
          height: areaHeight,
          maxHeight: areaHeight,
          overflow: 'hidden',
        }),
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        p: active ? 0 : 3,
        overflow: active ? 'hidden' : 'auto',
      }}
    >
      {mode === null ? (
        <Box
          sx={{
            maxWidth: 640,
            mx: 'auto',
            pt: 4,
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            🎹 Piano Pro Practice
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Versión avanzada del piano, pensada para escalar tipo FL Studio / Synthesia.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MODES.map((m) => (
              <Card key={m.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardActionArea onClick={() => setMode(m.id)}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: 32 }}>{m.icon}</Typography>
                    <Box>
                      <Typography variant="h6">{m.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {m.desc}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {mode === 'crear' && <ModeProCreate onBack={() => setMode(null)} />}
          {mode === 'practica' && <ModeProPractice onBack={() => setMode(null)} />}
          {mode === 'desarrollador' && <ModeProDev onBack={() => setMode(null)} />}
        </Box>
      )}
    </Box>
  );
}
