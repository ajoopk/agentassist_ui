import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`        -> normal dist/ build for devs
// `SINGLE=1 npm run build` -> one self-contained index.html for the shareable prototype
export default defineConfig({
  plugins: [react(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  base: './',
  build: { outDir: process.env.SINGLE ? 'dist-single' : 'dist' },
})
