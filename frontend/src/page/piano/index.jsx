import React, { useState } from 'react';
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { ModeFree, ModeSimulation, ModePractice, ModeCreateSong } from './modes';

const MODES = [
  { id: 'libre', label: 'Libre', desc: 'Toca lo que quieras sin partitura', icon: '🎹' },
  { id: 'simulacion', label: 'Simulación', desc: 'La canción se toca sola', icon: '▶️' },
  { id: 'practica', label: 'Práctica', desc: 'Espera que toques para avanzar', icon: '👆' },
  { id: 'crear', label: 'Crear canción', desc: 'Graba, importa/exporta JSON y guarda en BD', icon: '✏️' },
];

export default function PianoPage() {
  const [mode, setMode] = useState(null);

  return (
    <Box sx={{ p: 3, minHeight: '100%' }}>
      {mode === null ? (
        /* Home: selección de modos */
        <Box sx={{ maxWidth: 600, mx: 'auto', pt: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            🎹 Piano
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Elige un modo para comenzar
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MODES.map((m) => (
              <Card key={m.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardActionArea onClick={() => setMode(m.id)}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: 32 }}>{m.icon}</Typography>
                    <Box>
                      <Typography variant="h6">{m.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{m.desc}</Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        /* Modo seleccionado: cada modo tiene su layout (controles izquierda, canvas centro) */
        <>
          {mode === 'libre' && <ModeFree onBack={() => setMode(null)} />}
          {mode === 'simulacion' && <ModeSimulation onBack={() => setMode(null)} />}
          {mode === 'practica' && <ModePractice onBack={() => setMode(null)} />}
          {mode === 'crear' && <ModeCreateSong onBack={() => setMode(null)} />}
        </>
      )}
    </Box>
  );
}
