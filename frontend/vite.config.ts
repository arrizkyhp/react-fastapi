import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/api': { // Or whatever prefix your Flask routes have
        target: 'http://127.0.0.1:5000', // Your Flask backend
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // if your Flask doesn't use /api prefix
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
