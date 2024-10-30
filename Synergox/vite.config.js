import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      'Content-Security-Policy': `
        default-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.dev;
        style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev;
        img-src 'self' data: https://*.clerk.accounts.dev https://*.clerk.dev;
        connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev localhost:* ws://localhost:*;
        frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev;
        font-src 'self' data:;
      `.replace(/\s+/g, ' ').trim()
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
