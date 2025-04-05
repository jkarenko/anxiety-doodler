import { defineConfig } from 'vite';

export default defineConfig({
  base: '/anxiety-doodler/',
  // Default build output directory
  build: {
    outDir: 'dist',
  },
  // Optimizations for TypeScript
  optimizeDeps: {
    include: [],
  },
  // Server configuration for development
  server: {
    port: 3000,
    open: true,
  },
});