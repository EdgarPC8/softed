import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// ─────────────────────────────────────────────────────────────────
//  Raíz: softed/frontend. Backend módulos: softed/backend (softedapi:3004).
//  CAMBIA SOLO ESTO para elegir la app (basename, tema, menú, todo):
//  'softed'  |  'eddeli'  |  'alumni'  |  'turnos'  |  'enfermeria'  |  'musica'
// ─────────────────────────────────────────────────────────────────
const ACTIVE_APP = 'eddeli'

export default defineConfig({
  plugins: [react()],

  base: `/${ACTIVE_APP}/`,

  define: {
    // Inyecta la misma app en el front para appConfig (basename, tema, nav)
    'import.meta.env.VITE_ACTIVE_APP': JSON.stringify(ACTIVE_APP),
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },

  build: {
    // Sale de softed/frontend y va a la carpeta según ACTIVE_APP (eddeli | alumni | softed)
    outDir: `../../${ACTIVE_APP}`,
  },
})
