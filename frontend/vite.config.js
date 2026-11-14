import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In local dev, forward /api calls to the Express server.
    // In production, Vercel routes /api itself, so this is not used.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
