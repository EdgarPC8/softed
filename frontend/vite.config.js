import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],

  base: '/eddeli/', // 👈 correcto para Apache / subcarpeta

  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },

  build: {
    outDir: '../../eddeli', // 👈 sale de softed y entra a eddeli
  }
})
