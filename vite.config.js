import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on your local network so phones on the same Wi-Fi can open it
    port: 3000,
    strictPort: true,
    allowedHosts: true, // accept tunnel hostnames such as ngrok or cloudflared (dev only)
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
})