import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindConfig from './config/tailwind.config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './config/postcss.config.js'
  }
})
