import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
      '/products': { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
      '/owners': { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
      '/orders': { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
      '/images': { target: 'http://localhost:3000', changeOrigin: true },
    }
  }
})
