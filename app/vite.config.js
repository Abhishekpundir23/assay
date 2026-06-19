import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Builds the production site into ../docs so GitHub Pages can serve it from /docs.
// base must match the project-pages path: https://abhishekpundir23.github.io/assay/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { outDir: '../docs', emptyOutDir: true },
})
