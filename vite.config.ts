import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: true }
})
