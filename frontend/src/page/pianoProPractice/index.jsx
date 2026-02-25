import React, { useState } from 'react';
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import ModeProCreate from './modes/ModeProCreate';
import ModeProPractice from './modes/ModeProPractice';

const MODES = [
  { id: 'crear', label: 'Piano Pro · Crear', desc: 'Editor avanzado con WebGL y acordes por compás', icon: '✏️' },
  { id: 'practica', label: 'Piano Pro · Práctica', desc: 'Practica canciones de la BD con vista Pro', icon: '👆' },
];

export default function PianoProPracticePage() {
  const [mode, setMode] = useState(null);

  return (
    <Box
      sx={{
        p: 3,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {mode === null ? (
        <Box
          sx={{
            maxWidth: 640,
            mx: 'auto',
            pt: 4,
            flex: 1,
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
        <>
          {mode === 'crear' && <ModeProCreate onBack={() => setMode(null)} />}
          {mode === 'practica' && <ModeProPractice onBack={() => setMode(null)} />}
        </>
      )}
    </Box>
  );
}

