import React from 'react';
import ModeProCreate from './ModeProCreate';

/** Misma UI que Crear, pero con demo arrayMusic cargada para probar el canvas WebGL. */
export default function ModeProDev(props) {
  return <ModeProCreate {...props} developerMode />;
}
