import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En GitHub Pages la app vive en /semana07-practica2-react-hook/. En desarrollo se sirve en la raíz.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/semana07-practica2-react-hook/' : '/',
}))