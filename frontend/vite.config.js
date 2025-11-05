import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Acepta conexiones desde cualquier dirección IP
    port: 5173, // O cualquier puerto que desees
    strictPort: true, // Asegura que se use este puerto específico
  },
  base: '/eddeli/', // 👈 esto cambia las rutas para que sean relativas
})

