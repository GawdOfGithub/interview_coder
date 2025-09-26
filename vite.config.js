import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { qrcode } from 'vite-plugin-qrcode'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), qrcode(),],
  server: {
    host: '0.0.0.0', // Allows access from other devices on the same network
    port: 5175,      // Optional: you can change this port if needed
  },
})
