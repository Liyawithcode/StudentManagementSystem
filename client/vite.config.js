import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        proxyTimeout: 10000,
        timeout: 10000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.warn(`[Vite Proxy Error]: ${err.message}`);
            try {
              if (res && !res.headersSent && res.writable) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  message: 'Backend server is unreachable or timed out. Please ensure the backend is running on port 5000.'
                }));
              }
            } catch (_) {
              // Ignore any errors writing the error response
            }
          });
        }
      }
    }
  },
  preview: {}
})
