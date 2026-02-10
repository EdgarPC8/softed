import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// ─────────────────────────────────────────────────────────────────
//  CAMBIA SOLO ESTO para elegir la app (basename, tema, menú, todo):
//  'softed'  |  'eddeli'  |  'alumni'
// ─────────────────────────────────────────────────────────────────
const ACTIVE_APP = 'softed'

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
    outDir: '../../eddeli', // 👈 sale de softed y entra a eddeli
  }
})
