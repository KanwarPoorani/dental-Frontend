import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// In dev, /api calls are proxied to Express so no CORS setup is needed locally
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:5000' } } });